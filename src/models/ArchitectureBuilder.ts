/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { TextureFactory, PBRTextureSet } from '../textures/TextureFactory.ts';

export interface BrazierFlame {
  flameGroup: THREE.Group;
  flameCones: THREE.Mesh[];
  ptLight: THREE.PointLight | null;
  phase: number;
}

export interface FountainDroplet {
  mesh: THREE.Mesh;
  cx: number;
  cz: number;
  angle: number;
  t: number;
}

export class ArchitectureBuilder {
  public static braziers: BrazierFlame[] = [];
  public static fountainDrops: FountainDroplet[] = [];

  // Shared PBR Materials
  public static mats: {
    travertine: THREE.MeshStandardMaterial;
    travertineBlock: THREE.MeshStandardMaterial;
    marble: THREE.MeshStandardMaterial;
    flutedMarble: THREE.MeshStandardMaterial;
    graniteGrey: THREE.MeshStandardMaterial;
    graniteRed: THREE.MeshStandardMaterial;
    cobblestone: THREE.MeshStandardMaterial;
    piazzaCobble: THREE.MeshStandardMaterial;
    arenaSand: THREE.MeshStandardMaterial;
    terracotta: THREE.MeshStandardMaterial;
    romanBrick: THREE.MeshStandardMaterial;
    wood: THREE.MeshStandardMaterial;
    bronze: THREE.MeshStandardMaterial;
    darkBronze: THREE.MeshStandardMaterial;
    statueBronze: THREE.MeshStandardMaterial;
    velariumLinen: THREE.MeshStandardMaterial;
    spqrBanner: THREE.MeshStandardMaterial;
    crimsonCloth: THREE.MeshStandardMaterial;
    awningRed: THREE.MeshStandardMaterial;
    awningGreen: THREE.MeshStandardMaterial;
    pantheonFrieze: THREE.MeshStandardMaterial;
    severusFrieze: THREE.MeshStandardMaterial;
    cypressFoliage: THREE.MeshStandardMaterial;
    pineFoliage: THREE.MeshStandardMaterial;
    bark: THREE.MeshStandardMaterial;
    water: THREE.MeshStandardMaterial;
    groundEarth: THREE.MeshStandardMaterial;
    grassLawn: THREE.MeshStandardMaterial;
  };

  public static initMaterials() {
    if (this.mats) return;

    const travTex = TextureFactory.createTravertine(4, 2);
    const travFineTex = TextureFactory.createTravertine(1, 1);
    const marbleTex = TextureFactory.createMarble(2, 2, false);
    const flutedColTex = TextureFactory.createMarble(1, 2, true);
    const graniteGreyTex = TextureFactory.createGranite(false);
    const graniteRedTex = TextureFactory.createGranite(true);
    const cobbleTex = TextureFactory.createCobblestone(5, 16);
    const piazzaCobbleTex = TextureFactory.createCobblestone(10, 10);
    const sandTex = TextureFactory.createArenaSand();
    const roofTex = TextureFactory.createTerracotta(4, 3);
    const brickTex = TextureFactory.createRomanBrick(10, 6);
    const woodTex = TextureFactory.createWood(2, 4);
    const spqrTex = TextureFactory.createSPQRBanner();
    const awningRedTex = TextureFactory.createAwningFabric('#8c1c1c', '#ece0c2');
    const awningGreenTex = TextureFactory.createAwningFabric('#2b5e43', '#ece0c2');
    const pantheonFriezeTex = TextureFactory.createInscribedFrieze('M·AGRIPPA·L·F·COS·TERTIVM·FECIT');
    const severusFriezeTex = TextureFactory.createInscribedFrieze('SENATVS · POPVLVSQVE · ROMANVS');

    const makeMat = (tex: PBRTextureSet, bumpScale: number, rough: number, metal: number) =>
      new THREE.MeshStandardMaterial({
        map: tex.map,
        bumpMap: tex.bumpMap,
        bumpScale,
        roughness: rough,
        metalness: metal
      });

    this.mats = {
      travertine: makeMat(travTex, 0.14, 0.78, 0.04),
      travertineBlock: makeMat(travFineTex, 0.12, 0.76, 0.04),
      marble: makeMat(marbleTex, 0.06, 0.44, 0.06),
      flutedMarble: makeMat(flutedColTex, 0.16, 0.42, 0.06),
      graniteGrey: makeMat(graniteGreyTex, 0.09, 0.42, 0.08),
      graniteRed: makeMat(graniteRedTex, 0.09, 0.38, 0.1),
      cobblestone: makeMat(cobbleTex, 0.25, 0.54, 0.12),
      piazzaCobble: makeMat(piazzaCobbleTex, 0.24, 0.48, 0.14),
      arenaSand: makeMat(sandTex, 0.22, 0.88, 0.02),
      terracotta: makeMat(roofTex, 0.18, 0.68, 0.04),
      romanBrick: makeMat(brickTex, 0.15, 0.78, 0.03),
      wood: makeMat(woodTex, 0.16, 0.75, 0.05),
      bronze: new THREE.MeshStandardMaterial({ color: 0xc69b3a, roughness: 0.32, metalness: 0.84 }),
      darkBronze: new THREE.MeshStandardMaterial({ color: 0x3d3326, roughness: 0.45, metalness: 0.78 }),
      statueBronze: new THREE.MeshStandardMaterial({ color: 0x565c4e, roughness: 0.42, metalness: 0.72 }),
      velariumLinen: new THREE.MeshStandardMaterial({ color: 0xdfd0b2, roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide }),
      spqrBanner: new THREE.MeshStandardMaterial({ map: spqrTex, roughness: 0.65, metalness: 0.1, side: THREE.DoubleSide }),
      crimsonCloth: new THREE.MeshStandardMaterial({ color: 0x8a1818, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide }),
      awningRed: new THREE.MeshStandardMaterial({ map: awningRedTex, roughness: 0.7, side: THREE.DoubleSide }),
      awningGreen: new THREE.MeshStandardMaterial({ map: awningGreenTex, roughness: 0.7, side: THREE.DoubleSide }),
      pantheonFrieze: makeMat(pantheonFriezeTex, 0.15, 0.55, 0.05),
      severusFrieze: makeMat(severusFriezeTex, 0.15, 0.5, 0.05),
      cypressFoliage: new THREE.MeshStandardMaterial({ color: 0x22381b, roughness: 0.88, metalness: 0.02 }),
      pineFoliage: new THREE.MeshStandardMaterial({ color: 0x2e4a22, roughness: 0.84, metalness: 0.02 }),
      bark: new THREE.MeshStandardMaterial({ color: 0x483424, roughness: 0.92 }),
      water: new THREE.MeshStandardMaterial({ color: 0x2c6e7a, roughness: 0.16, metalness: 0.35, transparent: true, opacity: 0.88 }),
      groundEarth: new THREE.MeshStandardMaterial({ color: 0xc8b38c, roughness: 0.94, metalness: 0.02 }),
      grassLawn: new THREE.MeshStandardMaterial({ color: 0x44582b, roughness: 0.92, metalness: 0.02 })
    };
  }

  // Helper: Detailed Corinthian Column
  public static createCorinthianColumn(radius: number, height: number, shaftMat?: THREE.MeshStandardMaterial): THREE.Group {
    const mats = this.mats;
    const group = new THREE.Group();

    // Plinth & Torus base
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.7, height * 0.055, radius * 2.7), mats.marble);
    plinth.position.y = height * 0.0275;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    group.add(plinth);

    const torus = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.22, radius * 1.32, height * 0.045, 16), mats.marble);
    torus.position.y = height * 0.075;
    group.add(torus);

    // Fluted shaft with classical entasis
    const shaftH = height * 0.79;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius, shaftH, 20), shaftMat || mats.flutedMarble);
    shaft.position.y = height * 0.095 + shaftH * 0.5;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);

    // Corinthian Capital: Acanthus Bell & Abacus
    const capBell = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.28, radius * 0.9, height * 0.095, 16), mats.marble);
    capBell.position.y = height * 0.93;
    capBell.castShadow = true;
    group.add(capBell);

    const abacus = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.65, height * 0.038, radius * 2.65), mats.marble);
    abacus.position.y = height * 0.981;
    abacus.castShadow = true;
    group.add(abacus);

    return group;
  }

  // Helper: Classical Pediment
  public static createPediment(
    width: number,
    height: number,
    depth: number,
    outerMat?: THREE.MeshStandardMaterial,
    roofMat?: THREE.MeshStandardMaterial
  ): THREE.Group {
    const mats = this.mats;
    const group = new THREE.Group();

    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(0, height);
    shape.closePath();

    const extrudeSettings = { depth, bevelEnabled: false };
    const tympGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    tympGeo.translate(0, 0, -depth / 2);
    const tymp = new THREE.Mesh(tympGeo, outerMat || mats.marble);
    tymp.castShadow = true;
    tymp.receiveShadow = true;
    group.add(tymp);

    const slopeLen = Math.hypot(width / 2 + 0.8, height + 0.3);
    const angle = Math.atan2(height, width / 2);

    [-1, 1].forEach((side) => {
      const slope = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.55, depth + 1.0), roofMat || mats.terracotta);
      slope.position.set((side * width) / 4, height / 2 + 0.25, 0);
      slope.rotation.z = side * -angle;
      slope.castShadow = true;
      slope.receiveShadow = true;
      group.add(slope);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.42, 0.7), outerMat || mats.marble);
      trim.position.set((side * width) / 4, height / 2 + 0.1, depth / 2 + 0.25);
      trim.rotation.z = side * -angle;
      group.add(trim);
    });

    return group;
  }

  // Helper: Bronze Fire Brazier with Dynamic Point Light & Animated Flame Cones
  public static createBrazier(scene: THREE.Scene, x: number, y: number, z: number, hasLight = true): void {
    const mats = this.mats;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Tripod ring & legs
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 8, 20), mats.darkBronze);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;
    group.add(ring);

    for (let i = 0; i < 3; i++) {
      const ang = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.75, 8), mats.darkBronze);
      leg.position.set(Math.cos(ang) * 0.72, 0.86, Math.sin(ang) * 0.72);
      leg.rotation.z = Math.cos(ang) * 0.16;
      leg.rotation.x = -Math.sin(ang) * 0.16;
      leg.castShadow = true;
      group.add(leg);
    }

    // Bronze bowl & glowing charcoal
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 0.55, 0.52, 20), mats.darkBronze);
    bowl.position.y = 1.68;
    bowl.castShadow = true;
    group.add(bowl);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.08, 10, 24), mats.bronze);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.92;
    group.add(rim);

    const emberMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
    const embers = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 0.9, 0.14, 16), emberMat);
    embers.position.y = 1.88;
    group.add(embers);

    // Layered Flame Cones
    const flameGroup = new THREE.Group();
    flameGroup.position.y = 1.95;

    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xff6a00,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffe875,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const flameCones: THREE.Mesh[] = [];
    for (let c = 0; c < 4; c++) {
      const h = 1.35 + (c % 2) * 0.45;
      const r = 0.48 - c * 0.07;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 10), c < 2 ? outerFlameMat : innerFlameMat);
      const offA = c * 1.57;
      cone.position.set(Math.cos(offA) * 0.14, h * 0.42, Math.sin(offA) * 0.14);
      flameGroup.add(cone);
      flameCones.push(cone);
    }
    group.add(flameGroup);

    let ptLight: THREE.PointLight | null = null;
    if (hasLight) {
      ptLight = new THREE.PointLight(0xff7a18, 1.4, 28, 1.8);
      ptLight.position.set(0, 2.7, 0);
      group.add(ptLight);
    }

    scene.add(group);
    this.braziers.push({
      flameGroup,
      flameCones,
      ptLight,
      phase: Math.random() * 100
    });
  }

  // Helper: Roman Temple
  public static createTemple(scene: THREE.Scene, opts: {
    x: number; z: number; rotY?: number;
    width?: number; depth?: number; podiumH?: number;
    colH?: number; colsFront?: number; colsSide?: number;
    hasBrazier?: boolean;
  }): void {
    const mats = this.mats;
    const {
      x, z, rotY = 0,
      width = 18, depth = 28, podiumH = 3.6,
      colH = 10.5, colsFront = 6, colsSide = 8,
      hasBrazier = true
    } = opts;

    const temple = new THREE.Group();
    temple.position.set(x, 0, z);
    temple.rotation.y = rotY;

    // 1. High Stepped Marble Podium
    const podium = new THREE.Mesh(new THREE.BoxGeometry(width, podiumH, depth), mats.travertineBlock);
    podium.position.y = podiumH / 2;
    podium.castShadow = true;
    podium.receiveShadow = true;
    temple.add(podium);

    const topSlab = new THREE.Mesh(new THREE.BoxGeometry(width + 0.8, 0.45, depth + 0.8), mats.marble);
    topSlab.position.y = podiumH + 0.22;
    topSlab.receiveShadow = true;
    temple.add(topSlab);

    // Front Monumental Staircase
    const steps = 8;
    const stairDepth = 5.2;
    for (let s = 0; s < steps; s++) {
      const sh = (podiumH / steps) * (s + 1);
      const sd = stairDepth * (1 - s / steps);
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(width * 0.76, podiumH / steps + 0.05, sd), mats.marble);
      stepMesh.position.set(0, sh - (podiumH / steps) / 2, depth / 2 + sd / 2);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      temple.add(stepMesh);
    }

    [-1, 1].forEach((side) => {
      const cheek = new THREE.Mesh(new THREE.BoxGeometry(1.3, podiumH, stairDepth), mats.travertineBlock);
      cheek.position.set(side * (width * 0.42), podiumH / 2, depth / 2 + stairDepth / 2);
      cheek.castShadow = true;
      cheek.receiveShadow = true;
      temple.add(cheek);
    });

    // 2. Corinthian Columns
    const colY = podiumH + 0.44;
    const colR = 0.56;
    const marginX = width / 2 - 1.25;
    const marginZ = depth / 2 - 1.25;

    for (let ix = 0; ix < colsFront; ix++) {
      const cx = -marginX + (ix / (colsFront - 1)) * (marginX * 2);
      const cFront = this.createCorinthianColumn(colR, colH, mats.flutedMarble);
      cFront.position.set(cx, colY, marginZ);
      temple.add(cFront);

      if (ix === 0 || ix === colsFront - 1 || ix === 1 || ix === colsFront - 2) {
        const cPorch = this.createCorinthianColumn(colR, colH, mats.flutedMarble);
        cPorch.position.set(cx, colY, marginZ - depth / (colsSide - 1));
        temple.add(cPorch);
      }

      const cBack = this.createCorinthianColumn(colR, colH, mats.flutedMarble);
      cBack.position.set(cx, colY, -marginZ);
      temple.add(cBack);
    }

    for (let iz = 1; iz < colsSide - 1; iz++) {
      const cz = -marginZ + (iz / (colsSide - 1)) * (marginZ * 2);
      const cLeft = this.createCorinthianColumn(colR, colH, mats.flutedMarble);
      cLeft.position.set(-marginX, colY, cz);
      temple.add(cLeft);

      const cRight = this.createCorinthianColumn(colR, colH, mats.flutedMarble);
      cRight.position.set(marginX, colY, cz);
      temple.add(cRight);
    }

    // 3. Inner Cella Chamber & Bronze Doors
    const cellaW = width * 0.62;
    const cellaD = depth * 0.54;
    const cella = new THREE.Mesh(new THREE.BoxGeometry(cellaW, colH, cellaD), mats.travertine);
    cella.position.set(0, colY + colH / 2, -depth * 0.12);
    cella.castShadow = true;
    cella.receiveShadow = true;
    temple.add(cella);

    const door = new THREE.Mesh(new THREE.BoxGeometry(cellaW * 0.38, colH * 0.68, 0.35), mats.darkBronze);
    door.position.set(0, colY + colH * 0.34, -depth * 0.12 + cellaD / 2 + 0.05);
    temple.add(door);

    // 4. Entablature & Pediment
    const entY = colY + colH;
    const entablature = new THREE.Mesh(new THREE.BoxGeometry(width + 0.4, 1.85, depth + 0.4), mats.marble);
    entablature.position.y = entY + 0.92;
    entablature.castShadow = true;
    temple.add(entablature);

    const cornice = new THREE.Mesh(new THREE.BoxGeometry(width + 1.2, 0.48, depth + 1.2), mats.marble);
    cornice.position.y = entY + 2.05;
    cornice.castShadow = true;
    temple.add(cornice);

    const ped = this.createPediment(width + 1.0, 3.8, depth + 0.6, mats.marble, mats.terracotta);
    ped.position.y = entY + 2.28;
    temple.add(ped);

    const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.45, 1.4, 8), mats.bronze);
    finial.position.set(0, entY + 6.5, depth / 2);
    temple.add(finial);

    scene.add(temple);

    if (hasBrazier) {
      const worldPos = new THREE.Vector3(0, 0, depth / 2 + stairDepth + 2.2);
      worldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
      this.createBrazier(scene, x + worldPos.x, 0, z + worldPos.z, true);
    }
  }

  // Helper: Roman Market Stall with Canopy Awning, Counters, Baskets & Amphorae
  public static createMarketStall(scene: THREE.Scene, x: number, z: number, rotY: number, isGreen = false): void {
    const mats = this.mats;
    const stall = new THREE.Group();
    stall.position.set(x, 0.35, z);
    stall.rotation.y = rotY;

    // 4 Timber corner posts
    const postH = 2.7;
    const stallW = 3.8;
    const stallD = 2.4;
    [-stallW / 2 + 0.1, stallW / 2 - 0.1].forEach((px) => {
      [-stallD / 2 + 0.1, stallD / 2 - 0.1].forEach((pz) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, postH, 6), mats.wood);
        post.position.set(px, postH / 2, pz);
        post.castShadow = true;
        stall.add(post);
      });
    });

    // Wooden Counter Table
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(stallW, 0.12, stallD * 0.65), mats.wood);
    tableTop.position.set(0, 0.95, -0.1);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    stall.add(tableTop);

    // Striped Fabric Awning Canopy (Sloped)
    const awning = new THREE.Mesh(new THREE.BoxGeometry(stallW + 0.4, 0.06, stallD + 0.5), isGreen ? mats.awningGreen : mats.awningRed);
    awning.position.set(0, postH + 0.1, 0);
    awning.rotation.x = 0.12;
    awning.castShadow = true;
    stall.add(awning);

    // Ceramic Amphorae & Wooden Crates on Table
    [-1.2, -0.6, 0.4, 1.1].forEach((cx, idx) => {
      if (idx % 2 === 0) {
        // Amphora
        const amp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, 0.45, 8), mats.terracotta);
        amp.position.set(cx, 1.25, -0.1);
        amp.castShadow = true;
        stall.add(amp);
      } else {
        // Crate of goods
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.48), mats.wood);
        crate.position.set(cx, 1.15, -0.1);
        crate.castShadow = true;
        stall.add(crate);
      }
    });

    scene.add(stall);
  }

  // Landmark: The Colosseum / Flavian Amphitheatre
  public static buildColosseum(scene: THREE.Scene, posX = 135, posZ = 0): void {
    const mats = this.mats;
    const colGroup = new THREE.Group();
    colGroup.position.set(posX, 0, posZ);

    const N = 48;
    const outerA = 55;
    const outerB = 45;
    const wallThick = 3.2;

    // Raised Plaza Ring (robust elliptical cylinder)
    const plazaGeo = new THREE.CylinderGeometry(outerA + 6.5, outerA + 6.5, 0.55, 48);
    plazaGeo.scale(1, 1, (outerB + 6.5) / (outerA + 6.5));
    const plazaMesh = new THREE.Mesh(plazaGeo, mats.travertine);
    plazaMesh.position.y = 0.275;
    plazaMesh.receiveShadow = true;
    colGroup.add(plazaMesh);

    // Arena Floor
    const arenaA = 31.5;
    const arenaB = 22.0;
    const arenaGeo = new THREE.CylinderGeometry(1, 1, 0.5, 64);
    arenaGeo.scale(arenaA, 1, arenaB);
    const arenaMesh = new THREE.Mesh(arenaGeo, mats.arenaSand);
    arenaMesh.position.y = 0.28;
    arenaMesh.receiveShadow = true;
    colGroup.add(arenaMesh);

    // Tiers
    const tierSpecs = [
      { y0: 0.5, h: 9.5, pierH: 6.6 },
      { y0: 10.0, h: 9.2, pierH: 6.4 },
      { y0: 19.2, h: 8.8, pierH: 6.0 }
    ];

    for (let i = 0; i < N; i++) {
      const th1 = (i / N) * Math.PI * 2;
      const th2 = ((i + 1) / N) * Math.PI * 2;
      const thMid = (th1 + th2) * 0.5;

      const x1 = Math.cos(th1) * outerA, z1 = Math.sin(th1) * outerB;
      const x2 = Math.cos(th2) * outerA, z2 = Math.sin(th2) * outerB;
      const xm = Math.cos(thMid) * outerA, zm = Math.sin(thMid) * outerB;

      const segSpan = Math.hypot(x2 - x1, z2 - z1);
      const tangentAngle = Math.atan2(-(z2 - z1), x2 - x1);
      const isGate = (i === 24 || i === 0);

      tierSpecs.forEach((tier, tIdx) => {
        const pierW = tIdx === 0 && isGate ? segSpan * 0.24 : segSpan * 0.34;
        const pier = new THREE.Mesh(new THREE.BoxGeometry(pierW, tier.pierH, wallThick), mats.travertine);
        pier.position.set(x1, tier.y0 + tier.pierH / 2, z1);
        pier.rotation.y = tangentAngle;
        pier.castShadow = true;
        pier.receiveShadow = true;
        colGroup.add(pier);

        // Engaged Half-Column
        const normX = Math.cos(th1), normZ = Math.sin(th1);
        const engCol = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, tier.h - 0.8, 10), mats.marble);
        engCol.position.set(x1 + normX * (wallThick * 0.52), tier.y0 + (tier.h - 0.8) / 2, z1 + normZ * (wallThick * 0.52));
        engCol.castShadow = true;
        colGroup.add(engCol);

        // Arch Spandrel & Haunches
        const spandrelH = tier.h - tier.pierH;
        const spandrel = new THREE.Mesh(new THREE.BoxGeometry(segSpan * 1.03, spandrelH * 0.65, wallThick), mats.travertine);
        spandrel.position.set(xm, tier.y0 + tier.h - spandrelH * 0.325, zm);
        spandrel.rotation.y = tangentAngle;
        spandrel.castShadow = true;
        spandrel.receiveShadow = true;
        colGroup.add(spandrel);

        const cornice = new THREE.Mesh(new THREE.BoxGeometry(segSpan * 1.05, 0.75, wallThick + 0.85), mats.marble);
        cornice.position.set(xm, tier.y0 + tier.h - 0.15, zm);
        cornice.rotation.y = tangentAngle;
        cornice.castShadow = true;
        colGroup.add(cornice);
      });

      // 4th Attic Story
      const atticY = 28.0;
      const atticH = 8.0;
      const atticWall = new THREE.Mesh(new THREE.BoxGeometry(segSpan * 1.03, atticH, wallThick * 0.88), mats.travertine);
      atticWall.position.set(xm, atticY + atticH / 2, zm);
      atticWall.rotation.y = tangentAngle;
      atticWall.castShadow = true;
      atticWall.receiveShadow = true;
      colGroup.add(atticWall);

      // Bronze Clipeus Shield or Window
      const outNormX = Math.cos(thMid), outNormZ = Math.sin(thMid);
      if (i % 2 === 0) {
        const shield = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.25, 16), mats.bronze);
        shield.position.set(xm + outNormX * (wallThick * 0.46), atticY + atticH * 0.52, zm + outNormZ * (wallThick * 0.46));
        shield.rotation.y = tangentAngle;
        shield.rotation.x = Math.PI / 2;
        colGroup.add(shield);
      }

      // Velarium Mast
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 6.2, 8), mats.darkBronze);
      mast.position.set(x1 + Math.cos(th1) * 1.1, atticY + atticH + 1.8, z1 + Math.sin(th1) * 1.1);
      colGroup.add(mast);

      // Linen Velarium Sail Canopy Segment
      const velInnerA = 27.5, velInnerB = 18.5;
      const velOuterA = outerA - 1.2, velOuterB = outerB - 1.2;
      const shrink = 0.12;
      const th1s = th1 + (th2 - th1) * shrink;
      const th2s = th2 - (th2 - th1) * shrink;

      const sx1 = Math.cos(th1s) * velOuterA, sz1 = Math.sin(th1s) * velOuterB;
      const sx2 = Math.cos(th2s) * velOuterA, sz2 = Math.sin(th2s) * velOuterB;
      const six1 = Math.cos(th1s) * velInnerA, siz1 = Math.sin(th1s) * velInnerB;
      const six2 = Math.cos(th2s) * velInnerA, siz2 = Math.sin(th2s) * velInnerB;

      const vyOuter = 36.8, vyInner = 33.6;
      const sailGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        sx1, vyOuter, sz1,
        sx2, vyOuter, sz2,
        six2, vyInner, siz2,
        sx1, vyOuter, sz1,
        six2, vyInner, siz2,
        six1, vyInner, siz1
      ]);
      sailGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      sailGeo.computeVertexNormals();
      const sailMesh = new THREE.Mesh(sailGeo, mats.velariumLinen);
      sailMesh.castShadow = true;
      colGroup.add(sailMesh);

      // Cavea Tiered Seating
      if (!isGate) {
        for (let s = 0; s < 9; s++) {
          const frac = s / 9;
          const rA = arenaA + 2.4 + frac * (outerA - arenaA - 7.5);
          const rB = arenaB + 2.4 + frac * (outerB - arenaB - 7.5);
          const stepY = 4.6 + frac * 17.5;

          const sx1c = Math.cos(th1) * rA, sz1c = Math.sin(th1) * rB;
          const sx2c = Math.cos(th2) * rA, sz2c = Math.sin(th2) * rB;
          const sxm = (sx1c + sx2c) * 0.5, szm = (sz1c + sz2c) * 0.5;
          const sSpan = Math.hypot(sx2c - sx1c, sz2c - sz1c);
          const sAng = Math.atan2(-(sz2c - sz1c), sx2c - sx1c);

          const seatRow = new THREE.Mesh(new THREE.BoxGeometry(sSpan * 1.03, 1.85, 2.3), s % 3 === 0 ? mats.marble : mats.travertine);
          seatRow.position.set(sxm, stepY, szm);
          seatRow.rotation.y = sAng;
          seatRow.receiveShadow = true;
          colGroup.add(seatRow);
        }
      }
    }

    // Imperial Pulvinar Box
    [-1, 1].forEach((dir) => {
      const pulv = new THREE.Group();
      pulv.position.set(0, 0, dir * (arenaB - 0.5));
      pulv.rotation.y = dir === -1 ? 0 : Math.PI;

      const pBase = new THREE.Mesh(new THREE.BoxGeometry(13.5, 5.2, 6.5), mats.travertineBlock);
      pBase.position.set(0, 2.6, -1.8);
      pBase.castShadow = true;
      pulv.add(pBase);

      [-4.8, -1.65, 1.65, 4.8].forEach((cx) => {
        const col = this.createCorinthianColumn(0.54, 7.6, mats.flutedMarble);
        col.position.set(cx, 5.2, 0.8);
        pulv.add(col);
      });

      [-3.2, 0, 3.2].forEach((dx) => {
        const drape = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.35), mats.crimsonCloth);
        drape.position.set(dx, 11.4, 0.8);
        pulv.add(drape);
      });

      const pEnt = new THREE.Mesh(new THREE.BoxGeometry(12.8, 1.3, 6.4), mats.marble);
      pEnt.position.set(0, 13.4, -1.6);
      pEnt.castShadow = true;
      pulv.add(pEnt);

      const pPed = this.createPediment(13.2, 2.9, 6.4, mats.marble, mats.marble);
      pPed.position.set(0, 14.05, -1.6);
      pulv.add(pPed);

      colGroup.add(pulv);
    });

    scene.add(colGroup);
  }

  // Landmark: Pantheon & Piazza della Rotonda
  public static buildPantheon(scene: THREE.Scene, posX = -115, posZ = -65): void {
    const mats = this.mats;
    const panGroup = new THREE.Group();
    panGroup.position.set(posX, 0, posZ);
    panGroup.rotation.y = Math.PI / 2;

    const rotundaR = 27.5;
    const rotundaH = 26.5;
    const drumSegs = 40;
    const wallThick = 3.6;

    // Drum Wall
    for (let i = 0; i < drumSegs; i++) {
      if (i === 9 || i === 10) continue; // Entrance portal
      const a1 = (i / drumSegs) * Math.PI * 2;
      const a2 = ((i + 1) / drumSegs) * Math.PI * 2;
      const am = (a1 + a2) * 0.5;
      const segW = 2 * rotundaR * Math.sin(Math.PI / drumSegs) * 1.06;

      const drumSeg = new THREE.Mesh(new THREE.BoxGeometry(segW, rotundaH, wallThick), mats.romanBrick);
      drumSeg.position.set(Math.cos(am) * rotundaR, rotundaH / 2, Math.sin(am) * rotundaR);
      drumSeg.rotation.y = -am + Math.PI / 2;
      drumSeg.castShadow = true;
      drumSeg.receiveShadow = true;
      panGroup.add(drumSeg);
    }

    // Cornice Rings
    [10.5, 19.2, rotundaH].forEach((ry) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rotundaR + wallThick * 0.45, 0.55, 10, 48), mats.travertine);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = ry;
      panGroup.add(ring);
    });

    // Dome with Open Central Oculus (thetaStart creates 5.8m radius oculus)
    const domeGeo = new THREE.SphereGeometry(rotundaR - 0.4, 48, 24, 0, Math.PI * 2, 0.21, Math.PI / 2 - 0.21);
    const domeMesh = new THREE.Mesh(domeGeo, mats.travertine);
    domeMesh.position.y = rotundaH - 6.5;
    domeMesh.castShadow = true;
    domeMesh.receiveShadow = true;
    panGroup.add(domeMesh);

    const oculusRim = new THREE.Mesh(new THREE.TorusGeometry(5.8, 0.48, 12, 40), mats.bronze);
    oculusRim.rotation.x = Math.PI / 2;
    oculusRim.position.y = rotundaH + (rotundaR - 0.4) * Math.cos(0.21) - 6.5;
    panGroup.add(oculusRim);

    // Intermediate Vestibule & Octastyle Portico
    const vestW = 33.0, vestH = 21.5, vestD = 11.0;
    const vestZ = rotundaR + vestD * 0.32;

    const vTop = new THREE.Mesh(new THREE.BoxGeometry(vestW, 6.5, vestD), mats.romanBrick);
    vTop.position.set(0, vestH - 3.25, vestZ);
    vTop.castShadow = true;
    panGroup.add(vTop);

    // Bronze Doors
    [-2.4, 2.4].forEach((dx) => {
      const bDoor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 11.5, 0.45), mats.darkBronze);
      bDoor.position.set(dx, 6.8, vestZ + 1.5);
      bDoor.rotation.y = dx < 0 ? 0.28 : -0.28;
      panGroup.add(bDoor);
    });

    // 16 Egyptian Granite Columns Portico
    const porchW = 33.5, porchD = 14.5;
    const porchZ = vestZ + vestD / 2 + porchD / 2 - 0.5;
    const podH = 1.65, colH = 13.2, colR = 0.72;
    const spanX = porchW - 3.2;

    for (let ix = 0; ix < 8; ix++) {
      const cx = -spanX / 2 + (ix / 7) * spanX;
      const colFront = this.createCorinthianColumn(colR, colH, mats.graniteGrey);
      colFront.position.set(cx, podH, porchZ + porchD / 2 - 1.1);
      panGroup.add(colFront);

      if (ix === 0 || ix === 2 || ix === 5 || ix === 7) {
        const colMid = this.createCorinthianColumn(colR, colH, mats.graniteRed);
        colMid.position.set(cx, podH, porchZ);
        panGroup.add(colMid);

        const colRear = this.createCorinthianColumn(colR, colH, mats.graniteRed);
        colRear.position.set(cx, podH, porchZ - porchD / 2 + 1.4);
        panGroup.add(colRear);
      }
    }

    // Inscribed Agrippa Frieze & Pediment
    const entY = podH + colH;
    const friezeBlock = new THREE.Mesh(new THREE.BoxGeometry(porchW + 0.5, 1.45, porchD + 0.5), mats.pantheonFrieze);
    friezeBlock.position.set(0, entY + 1.75, porchZ);
    friezeBlock.castShadow = true;
    panGroup.add(friezeBlock);

    const porchPed = this.createPediment(porchW + 1.4, 5.2, porchD + 0.8, mats.travertine, mats.terracotta);
    porchPed.position.set(0, entY + 2.5, porchZ);
    panGroup.add(porchPed);

    scene.add(panGroup);

    // Piazza della Rotonda Cobblestone Floor
    const piazzaMesh = new THREE.Mesh(new THREE.BoxGeometry(58, 0.34, 56), mats.piazzaCobble);
    piazzaMesh.position.set(-70, 0.17, -65);
    piazzaMesh.receiveShadow = true;
    scene.add(piazzaMesh);

    // Marble Fountain & Egyptian Obelisk
    const fntX = -68, fntZ = -65;
    const fntGroup = new THREE.Group();
    fntGroup.position.set(fntX, 0.32, fntZ);

    for (let s = 0; s < 3; s++) {
      const r = 8.2 - s * 0.85;
      const step = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.15, 0.28, 32), mats.marble);
      step.position.y = s * 0.28 + 0.14;
      step.receiveShadow = true;
      fntGroup.add(step);
    }

    const basinOuter = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 4.8, 1.45, 32), mats.marble);
    basinOuter.position.y = 1.55;
    fntGroup.add(basinOuter);

    const waterDisk = new THREE.Mesh(new THREE.CylinderGeometry(5.3, 5.3, 0.1, 32), mats.water);
    waterDisk.position.y = 2.15;
    fntGroup.add(waterDisk);

    const obShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 1.02, 14.5, 4), mats.graniteRed);
    obShaft.rotation.y = Math.PI / 4;
    obShaft.position.y = 14.65;
    obShaft.castShadow = true;
    fntGroup.add(obShaft);

    scene.add(fntGroup);

    // Animated Fountain Droplets
    for (let d = 0; d < 75; d++) {
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.75 })
      );
      const jetAng = (d % 4) * (Math.PI / 2) + Math.PI / 4;
      scene.add(drop);
      this.fountainDrops.push({
        mesh: drop,
        cx: fntX,
        cz: fntZ,
        angle: jetAng + (Math.random() - 0.5) * 0.25,
        t: Math.random()
      });
    }

    // 8 Braziers surrounding the Fountain
    const bCoords = [
      [-57, -58], [-57, -72],
      [-64, -53], [-64, -77],
      [-78, -55], [-78, -75],
      [-82, -61], [-82, -69]
    ];
    bCoords.forEach(([bx, bz]) => {
      this.createBrazier(scene, bx, 0.34, bz, true);
    });

    // Market Stalls in Piazza della Rotonda
    this.createMarketStall(scene, -55, -53, Math.PI / 2, false);
    this.createMarketStall(scene, -55, -75, Math.PI / 2, true);
  }

  // Landmark: Via Sacra, Triumphal Arches, Statues & Forum Basilicas
  public static buildViaSacraAndForum(scene: THREE.Scene): void {
    const mats = this.mats;

    // Main Via Sacra Paved Basalt Avenue
    const roadLen = 156;
    const roadW = 13.5;
    const viaSacra = new THREE.Mesh(new THREE.BoxGeometry(roadLen, 0.36, roadW), mats.cobblestone);
    viaSacra.position.set(10, 0.18, 0);
    viaSacra.receiveShadow = true;
    scene.add(viaSacra);

    // Curbs & Rails
    [-1, 1].forEach((side) => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(roadLen, 0.55, 1.1), mats.travertineBlock);
      curb.position.set(10, 0.275, side * (roadW / 2 + 0.55));
      curb.receiveShadow = true;
      scene.add(curb);
    });

    // Forum Temples
    this.createTemple(scene, {
      x: -36, z: -23, rotY: 0,
      width: 19, depth: 28, podiumH: 3.8,
      colH: 11.2, colsFront: 6, colsSide: 8,
      hasBrazier: true
    }); // Temple of Saturn

    this.createTemple(scene, {
      x: 12, z: -24, rotY: 0,
      width: 17, depth: 25, podiumH: 3.4,
      colH: 10.2, colsFront: 6, colsSide: 7,
      hasBrazier: true
    }); // Temple of Vespasian

    this.createTemple(scene, {
      x: -22, z: 26, rotY: Math.PI,
      width: 18, depth: 27, podiumH: 3.6,
      colH: 10.6, colsFront: 6, colsSide: 8,
      hasBrazier: true
    }); // Temple of Castor

    // Arch of Septimius Severus (3-bay monumental marble triumphal arch)
    this.buildTriumphalArch(scene, -22, 12.5, 0, true);
    // Arch of Titus
    this.buildTriumphalArch(scene, 38, 0, Math.PI / 2, false);

    // Basilica Julia Arcaded Colonnade
    const basGroup = new THREE.Group();
    basGroup.position.set(-54, 0, 26);
    const basW = 36, basD = 16;
    const basCore = new THREE.Mesh(new THREE.BoxGeometry(basW - 3, 12.5, basD - 3), mats.travertine);
    basCore.position.y = 8.4;
    basCore.castShadow = true;
    basCore.receiveShadow = true;
    basGroup.add(basCore);

    for (let bx = -basW / 2 + 2; bx <= basW / 2 - 2; bx += 4) {
      const pCol = this.createCorinthianColumn(0.42, 6.2, mats.flutedMarble);
      pCol.position.set(bx, 2.2, -basD / 2 + 0.8);
      basGroup.add(pCol);
    }
    scene.add(basGroup);

    // Market Stalls along Forum
    this.createMarketStall(scene, -12, -7.5, 0, false);
    this.createMarketStall(scene, 2, -7.5, 0, true);
    this.createMarketStall(scene, -16, 7.5, Math.PI, false);

    // Bronze Statues on marble pedestals along Via Sacra
    [[-35, -8.5, 0.3], [-28, -8.5, 0.2], [-22, 8.5, -0.35], [8, -8.5, 0.15], [28, -8.5, 0.0]].forEach(([sx, sz, rot]) => {
      this.createStatue(scene, sx, sz, rot);
    });
  }

  // Helper: Classical Bronze Statue
  public static createStatue(scene: THREE.Scene, x: number, z: number, rotY = 0): void {
    const mats = this.mats;
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.2), mats.marble);
    base.position.y = 0.25;
    group.add(base);

    const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.4, 1.7), mats.marble);
    shaft.position.y = 1.7;
    group.add(shaft);

    // Bronze Figure
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.34, 1.25, 10), mats.statueBronze);
    torso.position.y = 4.8;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), mats.statueBronze);
    head.position.y = 5.7;
    head.castShadow = true;
    group.add(head);

    // Raised Orator Arm
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.95, 8), mats.statueBronze);
    arm.position.set(0.5, 5.2, 0.25);
    arm.rotation.set(-0.6, 0, -0.55);
    group.add(arm);

    scene.add(group);
  }

  // Helper: Triumphal Arch
  public static buildTriumphalArch(scene: THREE.Scene, x: number, z: number, rotY: number, isTriple = true): void {
    const mats = this.mats;
    const arch = new THREE.Group();
    arch.position.set(x, 0, z);
    arch.rotation.y = rotY;

    const W = isTriple ? 21.0 : 15.0;
    const D = 6.2;
    const pierX = isTriple ? [-8.4, -3.4, 3.4, 8.4] : [-5.2, 5.2];
    const pierW = isTriple ? [3.2, 2.4, 2.4, 3.2] : [4.2, 4.2];

    pierX.forEach((px, idx) => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(pierW[idx], 10.6, D), mats.marble);
      pier.position.set(px, 5.3, 0);
      pier.castShadow = true;
      arch.add(pier);
    });

    // Inscribed Attic
    const attic = new THREE.Mesh(new THREE.BoxGeometry(W, 4.4, D), mats.severusFrieze);
    attic.position.y = 14.0;
    attic.castShadow = true;
    arch.add(attic);

    // Gilded Bronze Quadriga Chariot
    const chariot = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 1.5, 12), mats.bronze);
    chariot.position.set(0, 17.8, -0.6);
    arch.add(chariot);

    [-1.8, -0.6, 0.6, 1.8].forEach((hx) => {
      const horse = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 1.65), mats.bronze);
      horse.position.set(hx, 18.0, 0.95);
      arch.add(horse);
    });

    scene.add(arch);
  }

  // Landmark: Aqua Claudia & Tiber River
  public static buildAqueductAndRiver(scene: THREE.Scene): void {
    const mats = this.mats;

    // Aqua Claudia Double-Tiered Aqueduct
    const bays = 22;
    const startX = -95, startZ = 48, endX = 85, endZ = 92;
    const dx = (endX - startX) / bays, dz = (endZ - startZ) / bays;
    const spanLen = Math.hypot(dx, dz);
    const angle = Math.atan2(-(endZ - startZ), endX - startX);

    for (let i = 0; i <= bays; i++) {
      const px = startX + dx * i, pz = startZ + dz * i;
      const lowPier = new THREE.Mesh(new THREE.BoxGeometry(2.6, 13.0, 3.8), mats.travertine);
      lowPier.position.set(px, 6.5, pz);
      lowPier.rotation.y = angle;
      lowPier.castShadow = true;
      scene.add(lowPier);

      const highPier = new THREE.Mesh(new THREE.BoxGeometry(2.1, 8.5, 3.2), mats.travertine);
      highPier.position.set(px, 18.2, pz);
      highPier.rotation.y = angle;
      highPier.castShadow = true;
      scene.add(highPier);

      if (i < bays) {
        const mx = px + dx * 0.5, mz = pz + dz * 0.5;
        const lowArch = new THREE.Mesh(new THREE.BoxGeometry(spanLen, 2.8, 3.6), mats.travertine);
        lowArch.position.set(mx, 12.6, mz);
        lowArch.rotation.y = angle;
        scene.add(lowArch);

        const highArch = new THREE.Mesh(new THREE.BoxGeometry(spanLen, 2.4, 3.2), mats.travertine);
        highArch.position.set(mx, 21.8, mz);
        highArch.rotation.y = angle;
        scene.add(highArch);
      }
    }

    // Curving Tiber River
    const riverShape = new THREE.Shape();
    riverShape.moveTo(-195, -145);
    riverShape.quadraticCurveTo(-135, -60, -125, -15);
    riverShape.quadraticCurveTo(-115, 35, -165, 135);
    riverShape.lineTo(-195, 135);
    riverShape.quadraticCurveTo(-142, 35, -152, -15);
    riverShape.quadraticCurveTo(-162, -60, -225, -145);
    riverShape.closePath();

    const riverGeo = new THREE.ShapeGeometry(riverShape, 32);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMesh = new THREE.Mesh(riverGeo, mats.water);
    riverMesh.position.y = 0.08;
    scene.add(riverMesh);

    // Stone Arch Bridge
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(36, 1.8, 7.5), mats.cobblestone);
    bridge.position.set(-138, 2.8, -8);
    bridge.castShadow = true;
    scene.add(bridge);

    // Mediterranean Cypresses & Umbrella Pines
    [[-44, -12], [-30, -11.5], [-24, -12.5], [-16, -12], [2, -13], [22, -11.5], [-12, 14], [12, 13]].forEach(([tx, tz]) => {
      this.createCypressTree(scene, tx, tz);
    });

    [[-8, 17], [6, 19], [-18, -36], [32, -18], [55, 22]].forEach(([px, pz]) => {
      this.createUmbrellaPine(scene, px, pz);
    });
  }

  public static createCypressTree(scene: THREE.Scene, x: number, z: number): void {
    const mats = this.mats;
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 3.2, 8), mats.bark);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    tree.add(trunk);

    const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.75, 11.5, 10), mats.cypressFoliage);
    c1.position.y = 7.8;
    c1.castShadow = true;
    tree.add(c1);

    const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.35, 9.5, 10), mats.cypressFoliage);
    c2.position.y = 11.2;
    c2.castShadow = true;
    tree.add(c2);

    scene.add(tree);
  }

  public static createUmbrellaPine(scene: THREE.Scene, x: number, z: number): void {
    const mats = this.mats;
    const pine = new THREE.Group();
    pine.position.set(x, 0, z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.68, 13.5, 10), mats.bark);
    trunk.position.y = 6.75;
    trunk.castShadow = true;
    pine.add(trunk);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.6, 12, 10), mats.pineFoliage);
    dome.scale.set(1, 0.36, 1);
    dome.position.y = 15.6;
    dome.castShadow = true;
    pine.add(dome);

    scene.add(pine);
  }

  public static updateEnvironment(dt: number, elapsed: number, brazierIntensity: number): void {
    // 1. Animate Fire Braziers
    for (let i = 0; i < this.braziers.length; i++) {
      const b = this.braziers[i];
      const t = elapsed * 7.5 + b.phase;
      const flicker = 0.85 + 0.22 * Math.sin(t) + 0.12 * Math.cos(t * 2.3);
      b.flameGroup.scale.set(0.92 + 0.12 * Math.sin(t * 1.4), flicker, 0.92 + 0.12 * Math.cos(t * 1.6));
      b.flameGroup.rotation.y = elapsed * 1.2 + b.phase;
      if (b.ptLight) {
        b.ptLight.intensity = brazierIntensity * flicker;
      }
    }

    // 2. Animate Fountain Water Jets
    for (let i = 0; i < this.fountainDrops.length; i++) {
      const fd = this.fountainDrops[i];
      fd.t = (fd.t + dt * 0.85) % 1.0;
      const arcR = 1.3 + fd.t * 3.1;
      const arcY = 3.8 + Math.sin(fd.t * Math.PI) * 1.6 - fd.t * 1.4;
      fd.mesh.position.set(fd.cx + Math.cos(fd.angle) * arcR, arcY, fd.cz + Math.sin(fd.angle) * arcR);
    }
  }
}
