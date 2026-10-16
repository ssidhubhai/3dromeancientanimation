/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FastTravelPoint, LandmarkZone, LightingPreset, MovementMode, TimeOfDay, CrowdMember } from '../types.ts';
import { ArchitectureBuilder } from '../models/ArchitectureBuilder.ts';
import { CrowdSystem } from '../models/CrowdSystem.ts';
import { RomanSoundscape } from '../audio/RomanSoundscape.ts';

export class RomeSimulation {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public soundscape: RomanSoundscape;
  public crowdSystem: CrowdSystem | null = null;

  private container: HTMLElement;

  // Sky & Lighting
  private skyDome: THREE.Mesh | null = null;
  private skyUniforms: Record<string, { value: any }> = {};
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private fillLight: THREE.DirectionalLight;
  private dustSystem: THREE.Points | null = null;

  private currentExposure = 1.05;
  private currentBrazierIntensity = 1.15;
  private targetLighting: LightingPreset;
  private activeTimeOfDay: TimeOfDay = 'golden';

  // Controls & Camera State
  private movementMode: MovementMode = 'walk';
  private yaw = -Math.PI / 2;
  private pitch = 0.04;
  private velocityY = 0;
  private isGrounded = true;
  private readonly eyeHeight = 2.5;
  private headBobTimer = 0;

  private keys: Record<string, boolean> = {};
  private isDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;

  // Teleport Tween
  private isTeleporting = false;
  private tpProgress = 0;
  private tpStartPos = new THREE.Vector3();
  private tpEndPos = new THREE.Vector3();
  private tpStartYaw = 0;
  private tpEndYaw = 0;
  private tpStartPitch = 0;
  private tpEndPitch = 0;

  // Animation Loop & Metrics
  private clock = new THREE.Clock();
  private frameCount = 0;
  private fpsTimer = 0;
  private currentFps = 60;
  private isRunning = false;
  private reqAnimId: number | null = null;

  // Callbacks for UI updates
  public onFpsUpdate?: (fps: number) => void;
  public onCoordsUpdate?: (coords: { x: number; z: number }) => void;
  public onLandmarkUpdate?: (zone: string, title: string, desc: string) => void;
  public onCitizenNearby?: (citizen: CrowdMember | null) => void;

  public static readonly FAST_TRAVEL_POINTS: FastTravelPoint[] = [
    {
      id: 0,
      key: '1',
      name: 'Via Sacra & Forum Romanum',
      zone: 'REGIO IV • VIA SACRA',
      subtitle: 'Iconic Colosseum Vista',
      desc: 'Looking East down the polygonal basalt Via Sacra framed by the Corinthian portico of the Temple of Saturn, bronze statues, umbrella pines, and the Arch of Septimius Severus toward the Colosseum.',
      pos: new THREE.Vector3(-48, 3.1, -0.8),
      lookAt: new THREE.Vector3(135, 14.5, 0),
      preset: 'golden',
      flyMode: false
    },
    {
      id: 1,
      key: '2',
      name: 'Amphitheatrum Flavium (Colosseum Plaza)',
      zone: 'REGIO III • ISIS ET SERAPIS',
      subtitle: '4-Story Travertine Facade',
      desc: 'Completed in 80 AD under Titus, this 4-story elliptical amphitheatre features 240 arched bays framed by Doric, Ionic, and Corinthian half-columns and 48 bronze velarium masts.',
      pos: new THREE.Vector3(64, 3.2, -16),
      lookAt: new THREE.Vector3(135, 18, 0),
      preset: null,
      flyMode: false
    },
    {
      id: 2,
      key: '3',
      name: 'Inside Colosseum Arena Floor',
      zone: 'AMPHITHEATRVM • HARENA',
      subtitle: 'Pulvinar Box & Velarium',
      desc: 'Standing directly on the raked golden sand facing the Emperor’s marble Pulvinar box, crimson SPQR podium banners, tiered marble cavea seating, and the 48-sail linen velarium canopy.',
      pos: new THREE.Vector3(145, 2.5, 12.5),
      lookAt: new THREE.Vector3(131, 10.5, -22),
      preset: 'noon',
      flyMode: false
    },
    {
      id: 3,
      key: '4',
      name: 'Pantheon & Piazza della Rotonda',
      zone: 'REGIO IX • CIRCVS FLAMINIVS',
      subtitle: 'Obelisk Fountain & Braziers',
      desc: 'Hadrian’s rebuilt temple featuring an octastyle Egyptian granite portico inscribed M·AGRIPPA, a 43.3m dome with open oculus, an Egyptian obelisk fountain, and 8 flickering fire braziers.',
      pos: new THREE.Vector3(-52, 2.8, -58),
      lookAt: new THREE.Vector3(-92, 11.5, -65),
      preset: 'sunset',
      flyMode: false
    },
    {
      id: 4,
      key: '5',
      name: 'Aqua Claudia Overlook',
      zone: 'REGIO I • AQUA CLAUDIA',
      subtitle: 'Imperial Springwater Aqueduct',
      desc: 'Towering double-tiered stone aqueduct arches carrying fresh spring water 69 kilometers from the Aniene valley into the public fountains, thermal baths, and imperial palaces.',
      pos: new THREE.Vector3(-24, 24.5, 82),
      lookAt: new THREE.Vector3(35, 10, -10),
      preset: null,
      flyMode: true
    },
    {
      id: 5,
      key: '6',
      name: 'Forma Urbis Romae (Bird’s-Eye Aerial)',
      zone: 'IMPERIVM ROMANVM • CXVII AD',
      subtitle: 'Full 117 AD City Reconstruction',
      desc: 'Panoramic architectural overview spanning the curving Tiber River and stone bridges, the Pantheon Rotunda, the Roman Forum and Aqua Claudia, and the Flavian Amphitheatre.',
      pos: new THREE.Vector3(-18, 148, 168),
      lookAt: new THREE.Vector3(2, 0, -8),
      preset: 'golden',
      flyMode: true
    }
  ];

  public static readonly LIGHTING_PRESETS: Record<TimeOfDay, LightingPreset> = {
    golden: {
      name: 'Golden Hour',
      exposure: 1.05,
      sunPos: new THREE.Vector3(235, 52, -8),
      sunColor: new THREE.Color(0xffaa55),
      sunIntensity: 1.9,
      hemiSky: new THREE.Color(0xffe3b3),
      hemiGround: new THREE.Color(0x6e533b),
      hemiIntensity: 0.65,
      fillIntensity: 0.32,
      skyTop: new THREE.Color(0x527da6),
      skyMid: new THREE.Color(0xeab87d),
      skyBot: new THREE.Color(0xffc978),
      fogColor: new THREE.Color(0xe6ba85),
      fogDensity: 0.0021,
      starIntensity: 0.0,
      brazierIntensity: 1.15
    },
    noon: {
      name: 'High Noon',
      exposure: 0.85,
      sunPos: new THREE.Vector3(65, 240, 55),
      sunColor: new THREE.Color(0xfff7e8),
      sunIntensity: 1.15,
      hemiSky: new THREE.Color(0xd6ebff),
      hemiGround: new THREE.Color(0x7c705e),
      hemiIntensity: 0.58,
      fillIntensity: 0.35,
      skyTop: new THREE.Color(0x2b6cb0),
      skyMid: new THREE.Color(0x4a90e2),
      skyBot: new THREE.Color(0x9ec7f0),
      fogColor: new THREE.Color(0xb8d5f2),
      fogDensity: 0.0012,
      starIntensity: 0.0,
      brazierIntensity: 0.35
    },
    sunset: {
      name: 'Sunset / Dusk',
      exposure: 1.0,
      sunPos: new THREE.Vector3(-220, 32, -85),
      sunColor: new THREE.Color(0xff7733),
      sunIntensity: 1.35,
      hemiSky: new THREE.Color(0x9a6b8c),
      hemiGround: new THREE.Color(0x3d2926),
      hemiIntensity: 0.52,
      fillIntensity: 0.25,
      skyTop: new THREE.Color(0x1e2749),
      skyMid: new THREE.Color(0x8c4f6e),
      skyBot: new THREE.Color(0xe87338),
      fogColor: new THREE.Color(0x6e4255),
      fogDensity: 0.0024,
      starIntensity: 0.25,
      brazierIntensity: 2.35
    },
    night: {
      name: 'Torchlit Night',
      exposure: 1.1,
      sunPos: new THREE.Vector3(-120, 160, 90),
      sunColor: new THREE.Color(0x6688cc),
      sunIntensity: 0.52,
      hemiSky: new THREE.Color(0x28385e),
      hemiGround: new THREE.Color(0x161210),
      hemiIntensity: 0.36,
      fillIntensity: 0.16,
      skyTop: new THREE.Color(0x050814),
      skyMid: new THREE.Color(0x0f1933),
      skyBot: new THREE.Color(0x1d2947),
      fogColor: new THREE.Color(0x0d1324),
      fogDensity: 0.0025,
      starIntensity: 1.0,
      brazierIntensity: 3.1
    }
  };

  private static readonly LANDMARK_ZONES: LandmarkZone[] = [
    {
      x: 135, z: 0, radius: 46,
      zone: 'AMPHITHEATRVM FLAVIVM',
      name: 'The Colosseum — Arena & Pulvinar',
      desc: 'Constructed 70–80 AD under Vespasian and Titus. Holds 50,000 spectators beneath a 48-mast linen velarium canopy, featuring the Emperor’s marble Pulvinar box and subterranean hypogeum.'
    },
    {
      x: -95, z: -65, radius: 48,
      zone: 'REGIO IX • CAMPUS MARTIUS',
      name: 'The Pantheon & Piazza della Rotonda',
      desc: 'Crowned by the world’s largest unreinforced concrete dome (43.3m diameter) with an open central oculus, fronted by 16 monolithic Egyptian granite columns and an Egyptian obelisk fountain.'
    },
    {
      x: -22, z: 12, radius: 22,
      zone: 'REGIO VIII • FORUM ROMANUM',
      name: 'Arch of Septimius Severus',
      desc: 'Triumphal three-bay white Proconnesian marble arch spanning the Via Sacra, adorned with composite columns, victory relief panels, and a gilded bronze four-horse quadriga chariot.'
    },
    {
      x: -36, z: -23, radius: 24,
      zone: 'REGIO VIII • CLIVUS CAPITOLINUS',
      name: 'Temple of Saturn (Aerarium)',
      desc: 'Venerable Corinthian temple at the foot of the Capitoline Hill housing the state treasury (Aerarium) of the Roman Empire and the cult statue of Saturn.'
    },
    {
      x: -10, z: 75, radius: 38,
      zone: 'REGIO I • AQUA CLAUDIA',
      name: 'Aqua Claudia Imperial Aqueduct',
      desc: 'Monumental double-arched travertine aqueduct supplying Rome’s fountains, baths, and villas with continuous mountain spring water.'
    },
    {
      x: -140, z: 5, radius: 36,
      zone: 'FLUMEN TIBERIS',
      name: 'Tiber River & Pons Aemilius',
      desc: 'The historic river of Rome spanned by stone barrel-vaulted bridges connecting the Forum Boarium to Transtiberim.'
    }
  ];

  constructor(container: HTMLElement) {
    this.container = container;

    // Clean any prior canvas left from React StrictMode mounts
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 1. Scene, Camera & Renderer
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xe6b88a, 0.0022);

    const width = Math.max(window.innerWidth, 320);
    const height = Math.max(window.innerHeight, 240);

    this.camera = new THREE.PerspectiveCamera(58, width / height, 0.4, 950);

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.currentExposure;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 2. Procedural Studio Reflection Environment Map
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      const roomEnv = new RoomEnvironment();
      const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
      this.scene.environment = envTarget.texture;
      roomEnv.dispose();
      pmremGenerator.dispose();
    } catch {
      // Fallback if PMREM not available
    }

    // 3. Audio Engine
    this.soundscape = new RomanSoundscape();

    // 4. Directional Sun/Moon, Hemisphere & Fill Lights
    this.targetLighting = RomeSimulation.LIGHTING_PRESETS.golden;

    this.sunLight = new THREE.DirectionalLight(0xffb86c, 1.85);
    this.sunLight.position.set(220, 58, -12);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 20;
    this.sunLight.shadow.camera.far = 480;
    const d = 195;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0xffe6c2, 0x6e5a46, 0.65);
    this.scene.add(this.hemiLight);

    this.fillLight = new THREE.DirectionalLight(0x9ab8d9, 0.32);
    this.fillLight.position.set(-140, 95, 90);
    this.scene.add(this.fillLight);

    // 5. Sky Dome Shader
    this.setupSkyDome();

    // 6. Ground & Architectural Monuments
    ArchitectureBuilder.initMaterials();
    this.setupGround();
    ArchitectureBuilder.buildColosseum(this.scene);
    ArchitectureBuilder.buildViaSacraAndForum(this.scene);
    ArchitectureBuilder.buildPantheon(this.scene);
    ArchitectureBuilder.buildAqueductAndRiver(this.scene);

    // 7. Citizens & Crowd AI System
    this.crowdSystem = new CrowdSystem(this.scene);

    // 8. Atmospheric Dust Motes
    this.setupDustMotes();

    // 9. Input & Starting Position
    this.setupInput();
    this.teleportTo(0, true);

    // Window Resize
    window.addEventListener('resize', this.onResize);
  }

  private setupSkyDome() {
    const skyGeo = new THREE.SphereGeometry(460, 40, 24);
    this.skyUniforms = {
      topColor: { value: new THREE.Color(0x5b82a6) },
      midColor: { value: new THREE.Color(0xe8ba82) },
      bottomColor: { value: new THREE.Color(0xffca7a) },
      sunDir: { value: new THREE.Vector3(0.88, 0.22, -0.1) },
      sunColor: { value: new THREE.Color(0xffe4a0) },
      starIntensity: { value: 0.0 }
    };

    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        uniform vec3 sunDir;
        uniform vec3 sunColor;
        uniform float starIntensity;
        varying vec3 vWorldPosition;

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + .1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = clamp(dir.y, 0.0, 1.0);
          vec3 col = mix(bottomColor, midColor, smoothstep(0.0, 0.25, h));
          col = mix(col, topColor, smoothstep(0.22, 0.85, h));

          float sunAmt = max(dot(dir, normalize(sunDir)), 0.0);
          col += sunColor * pow(sunAmt, 10.0) * 0.42;
          col += sunColor * smoothstep(0.996, 0.9998, sunAmt) * 1.15;

          if (starIntensity > 0.01 && dir.y > 0.05) {
            float s = hash(floor(dir * 260.0));
            if (s > 0.993) {
              float twinkle = smoothstep(0.993, 1.0, s) * starIntensity * smoothstep(0.05, 0.3, dir.y);
              col += vec3(0.85, 0.9, 1.0) * twinkle * 1.6;
            }
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    this.skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyDome);
  }

  private setupGround() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), ArchitectureBuilder.mats.groundEarth);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.0;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private setupDustMotes() {
    const count = 1400;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 340;
      pos[i * 3 + 1] = 0.8 + Math.random() * 38;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 260;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffe49e,
      size: 0.32,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.dustSystem = new THREE.Points(geo, mat);
    this.scene.add(this.dustSystem);
  }

  // Named event handlers for reliable cleanup
  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    this.soundscape.resume();

    if (e.code === 'KeyF') this.toggleMovementMode();
    if (e.code === 'Digit1') this.teleportTo(0);
    if (e.code === 'Digit2') this.teleportTo(1);
    if (e.code === 'Digit3') this.teleportTo(2);
    if (e.code === 'Digit4') this.teleportTo(3);
    if (e.code === 'Digit5') this.teleportTo(4);
    if (e.code === 'Digit6') this.teleportTo(5);

    if (e.code === 'Space' && this.movementMode === 'walk' && this.isGrounded) {
      this.velocityY = 9.2;
      this.isGrounded = false;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;
    this.isTeleporting = false;
    this.soundscape.resume();
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.prevMouseX;
    const dy = e.clientY - this.prevMouseY;
    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;

    this.yaw -= dx * 0.0032;
    this.pitch = THREE.MathUtils.clamp(this.pitch - dy * 0.0032, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
      this.isTeleporting = false;
      this.soundscape.resume();
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!this.isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - this.prevMouseX;
    const dy = e.touches[0].clientY - this.prevMouseY;
    this.prevMouseX = e.touches[0].clientX;
    this.prevMouseY = e.touches[0].clientY;

    this.yaw -= dx * 0.004;
    this.pitch = THREE.MathUtils.clamp(this.pitch - dy * 0.004, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);
  };

  private onTouchEnd = () => {
    this.isDragging = false;
  };

  private setupInput() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.container.addEventListener('touchend', this.onTouchEnd);
  }

  public getGroundElevation(x: number, z: number): number {
    if (x > -145 && x < -78 && z > -92 && z < -38) return 1.65;
    if (Math.hypot(x - (-68), z - (-65)) < 8.4) return 1.1;
    const dxCol = (x - 135) / 56;
    const dzCol = z / 46;
    if (dxCol * dxCol + dzCol * dzCol <= 1.15) return 0.52;
    if (x > -156 && x < -120 && z > -12 && z < -4) return 3.6;
    return 0.35;
  }

  public setLightingPreset(key: TimeOfDay) {
    if (!RomeSimulation.LIGHTING_PRESETS[key]) return;
    this.activeTimeOfDay = key;
    this.targetLighting = RomeSimulation.LIGHTING_PRESETS[key];
    this.soundscape.updateTimeOfDay(key);
  }

  public getActiveTimeOfDay(): TimeOfDay {
    return this.activeTimeOfDay;
  }

  public toggleMovementMode(): MovementMode {
    this.movementMode = this.movementMode === 'walk' ? 'fly' : 'walk';
    this.velocityY = 0;
    return this.movementMode;
  }

  public getMovementMode(): MovementMode {
    return this.movementMode;
  }

  public teleportTo(id: number, instant = false) {
    const pt = RomeSimulation.FAST_TRAVEL_POINTS[id];
    if (!pt) return;

    if (pt.preset) {
      this.setLightingPreset(pt.preset);
    }
    this.movementMode = pt.flyMode ? 'fly' : 'walk';

    const dir = pt.lookAt.clone().sub(pt.pos).normalize();
    const targetPitch = Math.asin(THREE.MathUtils.clamp(dir.y, -0.98, 0.98));
    const targetYaw = Math.atan2(-dir.x, -dir.z);

    if (instant) {
      this.camera.position.copy(pt.pos);
      this.yaw = targetYaw;
      this.pitch = targetPitch;
      this.isTeleporting = false;
    } else {
      this.tpStartPos.copy(this.camera.position);
      this.tpEndPos.copy(pt.pos);
      this.tpStartYaw = this.yaw;
      this.tpStartPitch = this.pitch;

      let diffYaw = targetYaw - this.tpStartYaw;
      while (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
      while (diffYaw < -Math.PI) diffYaw += Math.PI * 2;
      this.tpEndYaw = this.tpStartYaw + diffYaw;
      this.tpEndPitch = targetPitch;

      this.tpProgress = 0;
      this.isTeleporting = true;
    }

    if (this.onLandmarkUpdate) {
      this.onLandmarkUpdate(pt.zone, pt.name, pt.desc);
    }
  }

  public teleportToCoords(x: number, z: number) {
    this.isTeleporting = false;
    this.camera.position.x = x;
    this.camera.position.z = z;
    if (this.movementMode === 'walk') {
      this.camera.position.y = this.getGroundElevation(x, z) + this.eyeHeight;
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  private animate = () => {
    if (!this.isRunning) return;
    this.reqAnimId = requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. FPS Tracker
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.currentFps = Math.round(this.frameCount / this.fpsTimer);
      if (this.onFpsUpdate) this.onFpsUpdate(this.currentFps);
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    // 2. Smooth Lighting & Sky Dome Preset Lerping
    const lerpRate = Math.min(1, dt * 3.2);
    this.currentExposure = THREE.MathUtils.lerp(this.currentExposure, this.targetLighting.exposure, lerpRate);
    this.renderer.toneMappingExposure = this.currentExposure;

    this.sunLight.position.lerp(this.targetLighting.sunPos, lerpRate);
    this.sunLight.color.lerp(this.targetLighting.sunColor, lerpRate);
    this.sunLight.intensity = THREE.MathUtils.lerp(this.sunLight.intensity, this.targetLighting.sunIntensity, lerpRate);

    this.hemiLight.color.lerp(this.targetLighting.hemiSky, lerpRate);
    this.hemiLight.groundColor.lerp(this.targetLighting.hemiGround, lerpRate);
    this.hemiLight.intensity = THREE.MathUtils.lerp(this.hemiLight.intensity, this.targetLighting.hemiIntensity, lerpRate);
    this.fillLight.intensity = THREE.MathUtils.lerp(this.fillLight.intensity, this.targetLighting.fillIntensity, lerpRate);

    if (this.skyUniforms.topColor) {
      this.skyUniforms.topColor.value.lerp(this.targetLighting.skyTop, lerpRate);
      this.skyUniforms.midColor.value.lerp(this.targetLighting.skyMid, lerpRate);
      this.skyUniforms.bottomColor.value.lerp(this.targetLighting.skyBot, lerpRate);
      this.skyUniforms.sunDir.value.copy(this.sunLight.position).normalize();
      this.skyUniforms.sunColor.value.copy(this.sunLight.color);
      this.skyUniforms.starIntensity.value = THREE.MathUtils.lerp(
        this.skyUniforms.starIntensity.value,
        this.targetLighting.starIntensity,
        lerpRate
      );
    }

    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.lerp(this.targetLighting.fogColor, lerpRate);
      this.scene.fog.density = THREE.MathUtils.lerp(this.scene.fog.density, this.targetLighting.fogDensity, lerpRate);
    }

    this.currentBrazierIntensity = THREE.MathUtils.lerp(
      this.currentBrazierIntensity,
      this.targetLighting.brazierIntensity,
      lerpRate
    );

    // 3. Environmental Dynamics (Braziers & Fountains)
    ArchitectureBuilder.updateEnvironment(dt, elapsed, this.currentBrazierIntensity);

    // 4. Update Living Roman Crowd AI & Kinematics
    if (this.crowdSystem) {
      this.crowdSystem.update(dt, elapsed, this.camera.position);
    }

    // 5. Drift Dust Motes
    if (this.dustSystem) {
      this.dustSystem.rotation.y = elapsed * 0.012;
      this.dustSystem.position.y = Math.sin(elapsed * 0.4) * 0.45;
    }

    // 6. Camera Movement & Physics
    if (this.isTeleporting) {
      this.tpProgress = Math.min(1, this.tpProgress + dt * 1.55);
      const ease = 1 - Math.pow(1 - this.tpProgress, 3);
      this.camera.position.lerpVectors(this.tpStartPos, this.tpEndPos, ease);
      this.yaw = THREE.MathUtils.lerp(this.tpStartYaw, this.tpEndYaw, ease);
      this.pitch = THREE.MathUtils.lerp(this.tpStartPitch, this.tpEndPitch, ease);
      if (this.tpProgress >= 1) {
        this.isTeleporting = false;
      }
    } else {
      const isSprint = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
      const speed = isSprint ? (this.movementMode === 'fly' ? 48.0 : 20.0) : (this.movementMode === 'fly' ? 24.0 : 10.5);

      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
      const moveVec = new THREE.Vector3();

      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveVec.add(forward);
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveVec.sub(forward);
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveVec.add(right);
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveVec.sub(right);

      const isMoving = moveVec.lengthSq() > 0;
      if (isMoving) {
        moveVec.normalize().multiplyScalar(speed * dt);
        this.camera.position.add(moveVec);

        if (this.movementMode === 'walk' && this.isGrounded) {
          this.soundscape.playFootstep(isSprint);
          this.headBobTimer += dt * (isSprint ? 14 : 9.5);
        }
      }

      if (this.movementMode === 'fly') {
        if (this.keys['KeyE'] || this.keys['Space']) this.camera.position.y += speed * 0.75 * dt;
        if (this.keys['KeyQ'] || this.keys['ControlLeft']) {
          this.camera.position.y = Math.max(1.8, this.camera.position.y - speed * 0.75 * dt);
        }
      } else {
        const groundY = this.getGroundElevation(this.camera.position.x, this.camera.position.z) + this.eyeHeight;
        this.velocityY -= 24.0 * dt;
        this.camera.position.y += this.velocityY * dt;

        if (this.camera.position.y <= groundY) {
          this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, groundY, Math.min(1, dt * 14));
          this.velocityY = 0;
          this.isGrounded = true;
        }

        if (isMoving && this.isGrounded) {
          this.camera.position.y += Math.sin(this.headBobTimer) * (isSprint ? 0.05 : 0.03);
        }
      }

      this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -210, 210);
      this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -140, 175);
    }

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = this.pitch;
    euler.y = this.yaw;
    this.camera.quaternion.setFromEuler(euler);

    if (this.skyDome) {
      this.skyDome.position.copy(this.camera.position);
    }

    this.checkLandmarkProximity();
    this.checkCitizenProximity();

    if (this.onCoordsUpdate) {
      this.onCoordsUpdate({
        x: Math.round(this.camera.position.x),
        z: Math.round(this.camera.position.z)
      });
    }

    this.renderer.render(this.scene, this.camera);
  };

  private checkLandmarkProximity() {
    if (this.isTeleporting) return;
    const px = this.camera.position.x;
    const pz = this.camera.position.z;

    for (let i = 0; i < RomeSimulation.LANDMARK_ZONES.length; i++) {
      const lm = RomeSimulation.LANDMARK_ZONES[i];
      if (Math.hypot(px - lm.x, pz - lm.z) < lm.radius) {
        if (this.onLandmarkUpdate) {
          this.onLandmarkUpdate(lm.zone, lm.name, lm.desc);
        }
        return;
      }
    }
  }

  private checkCitizenProximity() {
    if (!this.crowdSystem || !this.onCitizenNearby) return;

    let closest: CrowdMember | null = null;
    let minDist = 4.2;

    const members = this.crowdSystem.getMembers();
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const d = this.camera.position.distanceTo(m.group.position);
      if (d < minDist) {
        minDist = d;
        closest = m;
      }
    }

    this.onCitizenNearby(closest);
  }

  private onResize = () => {
    const width = Math.max(window.innerWidth, 320);
    const height = Math.max(window.innerHeight, 240);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public dispose() {
    this.isRunning = false;
    if (this.reqAnimId !== null) {
      cancelAnimationFrame(this.reqAnimId);
      this.reqAnimId = null;
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.container.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchend', this.onTouchEnd);

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }

    this.soundscape.dispose();
    this.renderer.dispose();
  }
}
