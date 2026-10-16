/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CrowdMember } from '../types.ts';
import { CharacterBuilder } from './CharacterBuilder.ts';

export class CrowdSystem {
  private members: CrowdMember[] = [];
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initCrowd();
  }

  public getMembers(): CrowdMember[] {
    return this.members;
  }

  private initCrowd() {
    // 1. VIA SACRA & FORUM ROMANUM POPULATION
    this.addCitizen({
      citizenClass: 'senator',
      info: {
        id: 'senator_marcus',
        name: 'Marcus Flavius',
        role: 'Senator of Rome',
        socialClass: 'Patrician Order',
        historicalNote: 'Wearing the formal Toga Praetexta with broad purple border (latus clavus) and senatorial red boots (calcei).',
        quote: '"The Senate deliberates, but Rome’s glory is etched forever in Carrara marble."'
      },
      behavior: 'walk',
      path: [
        new THREE.Vector3(-45, 0.35, -2.5),
        new THREE.Vector3(-15, 0.35, -2.5),
        new THREE.Vector3(25, 0.35, -2.5),
        new THREE.Vector3(55, 0.35, -2.5),
        new THREE.Vector3(25, 0.35, -2.5),
        new THREE.Vector3(-15, 0.35, -2.5)
      ],
      speed: 1.1,
      seed: 101
    });

    this.addCitizen({
      citizenClass: 'legionary',
      info: {
        id: 'guard_titus',
        name: 'Titus Cassius',
        role: 'Legionary of Legio VI Ferrata',
        socialClass: 'Imperial Military',
        historicalNote: 'Equipped with Lorica Segmentata iron armor, Imperial Gallic helmet, curved rectangular Scutum, and heavy Pilum spear.',
        quote: '"Vigilo pro Roma. By the Emperor’s order, all is secure along the Via Sacra."'
      },
      behavior: 'patrol',
      path: [
        new THREE.Vector3(-22, 0.35, 8.5),
        new THREE.Vector3(-22, 0.35, 14.5),
        new THREE.Vector3(-14, 0.35, 14.5),
        new THREE.Vector3(-14, 0.35, 8.5)
      ],
      speed: 1.3,
      seed: 202
    });

    this.addCitizen({
      citizenClass: 'centurion',
      info: {
        id: 'centurion_lucius',
        name: 'Lucius Valerius',
        role: 'Centurion of Cohors I',
        socialClass: 'Imperial Military Officer',
        historicalNote: 'Distinguished by a transverse crimson crest on his galea, bronze scale armor, and the vine staff (vitis) of command.',
        quote: '"Discipline is the spine of the legion. Keep order along the sacred way!"'
      },
      behavior: 'patrol',
      path: [
        new THREE.Vector3(15, 0.35, 3.2),
        new THREE.Vector3(45, 0.35, 3.2),
        new THREE.Vector3(72, 0.35, 3.2),
        new THREE.Vector3(45, 0.35, 3.2)
      ],
      speed: 1.25,
      seed: 303
    });

    this.addCitizen({
      citizenClass: 'citizen_female',
      info: {
        id: 'matrona_claudia',
        name: 'Claudia Tertia',
        role: 'Roman Matrona',
        socialClass: 'Patrician Household',
        historicalNote: 'Adorned in a pleated gold stola gown with a draped palla mantle and an intricate Flavian coiled coiffure with gold diadem.',
        quote: '"The morning sacrifice at the Temple of Castor brought auspicious omens."'
      },
      behavior: 'walk',
      path: [
        new THREE.Vector3(52, 0.35, 1.8),
        new THREE.Vector3(12, 0.35, 1.8),
        new THREE.Vector3(-35, 0.35, 1.8),
        new THREE.Vector3(12, 0.35, 1.8)
      ],
      speed: 1.15,
      seed: 404
    });

    this.addCitizen({
      citizenClass: 'laborer',
      info: {
        id: 'porter_sextus',
        name: 'Sextus the Porter',
        role: 'Forum Goods Carrier',
        socialClass: 'Plebeian Working Class',
        historicalNote: 'Moving trade cargo and timber crates from the Tiber river docks up to the basilicas of the Forum.',
        quote: '"Make way! Olive oil from Baetica and Spanish wine heading for the market stalls."'
      },
      behavior: 'walk',
      path: [
        new THREE.Vector3(-55, 0.35, -4.0),
        new THREE.Vector3(-25, 0.35, -4.0),
        new THREE.Vector3(18, 0.35, -4.0),
        new THREE.Vector3(-25, 0.35, -4.0)
      ],
      speed: 1.45,
      seed: 505
    });

    // Conversing Pair in the Forum near Temple of Saturn
    this.addCitizen({
      citizenClass: 'senator',
      info: {
        id: 'senator_aulus',
        name: 'Aulus Postumius',
        role: 'Magistrate & Orator',
        socialClass: 'Senatorial Aristocracy',
        historicalNote: 'Debating legal proceedings and grain allocations outside the Aerarium treasury of the Temple of Saturn.',
        quote: '"The grain fleet from Alexandria has arrived at Ostia. Rome shall feast this winter."'
      },
      behavior: 'converse',
      path: [new THREE.Vector3(-31, 0.35, -16)],
      speed: 0,
      seed: 606,
      facing: 0.8
    });

    this.addCitizen({
      citizenClass: 'citizen_male',
      info: {
        id: 'citizen_servius',
        name: 'Servius Sulpicius',
        role: 'Equite & Landowner',
        socialClass: 'Equestrian Order',
        historicalNote: 'Wearing a fine woolen toga draped in the traditional sinus fold over a tunica.',
        quote: '"Indeed, Aulus. And Emperor Trajan’s public works have expanded the Forum beyond our fathers’ dreams."'
      },
      behavior: 'converse',
      path: [new THREE.Vector3(-29.5, 0.35, -15)],
      speed: 0,
      seed: 707,
      facing: -2.3
    });

    // 2. PIAZZA DELLA ROTONDA & PANTHEON POPULATION
    this.addCitizen({
      citizenClass: 'merchant',
      info: {
        id: 'merchant_marcus',
        name: 'Decimus of Campania',
        role: 'Wine & Oil Merchant',
        socialClass: 'Merchant Class (Mercator)',
        historicalNote: 'Selling fine Falernian wine and Campania olive oil at his market stall in Piazza della Rotonda.',
        quote: '"Hail, traveler! Taste the finest Falernian vintage—shipped directly from the sun-drenched hills of Campania!"'
      },
      behavior: 'merchant',
      path: [new THREE.Vector3(-54, 0.35, -53)],
      speed: 0,
      seed: 808,
      facing: 1.57
    });

    this.addCitizen({
      citizenClass: 'citizen_female',
      info: {
        id: 'citizen_julia',
        name: 'Julia Livia',
        role: 'Citizen of the Flaminian Quarter',
        socialClass: 'Plebeian Citizen',
        historicalNote: 'Drawn to the refreshing waters of the obelisk fountain in the shadow of Agrippa’s grand Pantheon.',
        quote: '"The water from Aqua Virgo tastes sweeter than mountain rain. Truly the gods favor this city."'
      },
      behavior: 'walk',
      path: [
        new THREE.Vector3(-78, 0.35, -58),
        new THREE.Vector3(-62, 0.35, -58),
        new THREE.Vector3(-62, 0.35, -72),
        new THREE.Vector3(-78, 0.35, -72)
      ],
      speed: 1.2,
      seed: 909
    });

    this.addCitizen({
      citizenClass: 'legionary',
      info: {
        id: 'guard_hadrian_gate',
        name: 'Gaius Petronius',
        role: 'Praetorian Guard Sentry',
        socialClass: 'Imperial Guard',
        historicalNote: 'Guarding the monolithic granite portico of the Pantheon inscribed with the consulship of Marcus Agrippa.',
        quote: '"Step with reverence. Within these bronze doors lies the dome of all the gods."'
      },
      behavior: 'patrol',
      path: [
        new THREE.Vector3(-83, 1.65, -60),
        new THREE.Vector3(-83, 1.65, -70),
        new THREE.Vector3(-83, 1.65, -60)
      ],
      speed: 0.95,
      seed: 1010
    });

    // 3. COLOSSEUM ARENA & PLAZA POPULATION
    this.addCitizen({
      citizenClass: 'centurion',
      info: {
        id: 'centurion_faustus',
        name: 'Faustus Macro',
        role: 'Amphitheatre Tribune Overseer',
        socialClass: 'Flavian Amphitheatre Staff',
        historicalNote: 'Directing the Praetorian guards and ensuring the safety of the Emperor’s marble Pulvinar box.',
        quote: '"Fifty thousand Roman citizens beneath the linen Velarium—and not a seat to spare!"'
      },
      behavior: 'patrol',
      path: [
        new THREE.Vector3(75, 0.52, -8),
        new THREE.Vector3(105, 0.52, -8),
        new THREE.Vector3(105, 0.52, 8),
        new THREE.Vector3(75, 0.52, 8)
      ],
      speed: 1.35,
      seed: 1111
    });

    this.addCitizen({
      citizenClass: 'citizen_male',
      info: {
        id: 'citizen_publius',
        name: 'Publius Ovidius',
        role: 'Arena Spectator',
        socialClass: 'Plebeian Citizen',
        historicalNote: 'Heading through the travertine arches toward the cavea seating for the gladiatorial games.',
        quote: '"Did you see the sand raked this morning? Today we witness the champions of Thrace and Capua!"'
      },
      behavior: 'walk',
      path: [
        new THREE.Vector3(65, 0.52, -2.0),
        new THREE.Vector3(125, 0.52, -2.0),
        new THREE.Vector3(145, 0.52, 5.0),
        new THREE.Vector3(125, 0.52, -2.0)
      ],
      speed: 1.3,
      seed: 1212
    });

    this.addCitizen({
      citizenClass: 'laborer',
      info: {
        id: 'laborer_brutus',
        name: 'Brutus the Arena Stoker',
        role: 'Hypogeum Machinist',
        socialClass: 'Guild of Public Works',
        historicalNote: 'Managing the windlass hoists and sand rakes on the arena floor.',
        quote: '"The wooden elevators beneath the trapdoors are primed. The spectacles will run flawlessly."'
      },
      behavior: 'walk',
      path: [
        new THREE.Vector3(125, 0.52, 10.0),
        new THREE.Vector3(155, 0.52, -8.0),
        new THREE.Vector3(125, 0.52, 10.0)
      ],
      speed: 1.2,
      seed: 1313
    });
  }

  private addCitizen(opts: {
    citizenClass: any;
    info: any;
    behavior: 'walk' | 'patrol' | 'converse' | 'merchant' | 'idle';
    path: THREE.Vector3[];
    speed: number;
    seed: number;
    facing?: number;
  }) {
    const member = CharacterBuilder.createCharacter(opts.citizenClass, opts.info, opts.seed);
    member.behavior = opts.behavior;
    member.pathPoints = opts.path;
    member.speed = opts.speed;

    if (opts.path.length > 0) {
      member.group.position.copy(opts.path[0]);
    }
    if (opts.facing !== undefined) {
      member.group.rotation.y = opts.facing;
      member.initialFacing = opts.facing;
    }

    this.scene.add(member.group);
    this.members.push(member);
  }

  /**
   * Main per-frame animation and crowd AI update
   */
  public update(dt: number, elapsedTime: number, playerPos: THREE.Vector3) {
    const tempDir = new THREE.Vector3();

    for (let i = 0; i < this.members.length; i++) {
      const m = this.members[i];
      const joints = m.joints;

      // Distance to player for head look-at reaction
      const distToPlayer = m.group.position.distanceTo(playerPos);
      const isNearPlayer = distToPlayer < 7.0 && distToPlayer > 0.8;

      if (isNearPlayer) {
        m.lookAtPlayerWeight = THREE.MathUtils.lerp(m.lookAtPlayerWeight, 1.0, dt * 4.0);
      } else {
        m.lookAtPlayerWeight = THREE.MathUtils.lerp(m.lookAtPlayerWeight, 0.0, dt * 2.5);
      }

      // --- MOVEMENT & PATH NAVIGATION ---
      let isMoving = false;

      if ((m.behavior === 'walk' || m.behavior === 'patrol') && m.pathPoints.length > 1) {
        const targetPt = m.pathPoints[m.currentPointIndex];
        tempDir.subVectors(targetPt, m.group.position);
        tempDir.y = 0;
        const dist = tempDir.length();

        if (dist > 0.45) {
          isMoving = true;
          tempDir.normalize();

          // Move toward target
          m.group.position.addScaledVector(tempDir, m.speed * dt);

          // Smoothly rotate towards movement heading
          const targetHeading = Math.atan2(tempDir.x, tempDir.z);
          let diffAngle = targetHeading - m.group.rotation.y;
          while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
          while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
          m.group.rotation.y += diffAngle * Math.min(1.0, dt * 6.0);
        } else {
          // Reached waypoint, advance to next
          m.currentPointIndex = (m.currentPointIndex + 1) % m.pathPoints.length;
        }
      }

      // --- KINEMATIC SKELETAL JOINT ANIMATION ---
      if (isMoving) {
        // Natural Walk Cycle
        m.animPhase += dt * m.speed * 4.4;
        const phase = m.animPhase;

        // Hip vertical bounce & pelvic tilt
        joints.hips.position.y = 0.94 + Math.abs(Math.sin(phase * 2)) * 0.04;
        joints.hips.rotation.y = Math.sin(phase) * 0.09;
        joints.hips.rotation.z = Math.cos(phase) * 0.035;

        // Legs: Hip flexion/extension + knee bending
        const leftHipAngle = Math.sin(phase) * 0.52;
        joints.leftThigh.rotation.x = leftHipAngle;
        joints.leftCalf.rotation.x = Math.max(0, -Math.sin(phase) * 0.72);
        joints.leftFoot.rotation.x = -leftHipAngle * 0.35;

        const rightHipAngle = -Math.sin(phase) * 0.52;
        joints.rightThigh.rotation.x = rightHipAngle;
        joints.rightCalf.rotation.x = Math.max(0, Math.sin(phase) * 0.72);
        joints.rightFoot.rotation.x = -rightHipAngle * 0.35;

        // Torso counter-twist
        joints.spine.rotation.y = -Math.sin(phase) * 0.06;
        joints.chest.rotation.y = -Math.sin(phase) * 0.06;

        // Arms counter-swing (with consideration of carried weapons/props)
        if (m.citizenClass === 'legionary') {
          // Left arm holds Scutum shield steady; right arm holds Pilum javelin
          joints.leftUpperArm.rotation.x = 0.15 + Math.sin(phase) * 0.08;
          joints.leftForearm.rotation.x = -0.55;
          joints.rightUpperArm.rotation.x = -0.15 - Math.sin(phase) * 0.12;
          joints.rightForearm.rotation.x = -0.4;
        } else if (m.citizenClass === 'centurion') {
          // Right arm holds vine staff; left arm rests by side
          joints.rightUpperArm.rotation.x = -0.25 + Math.sin(phase) * 0.1;
          joints.rightForearm.rotation.x = -0.45;
          joints.leftUpperArm.rotation.x = Math.sin(phase) * 0.35;
        } else if (m.citizenClass === 'laborer') {
          // Right arm balances crate/amphora on shoulder; left arm swings
          joints.rightUpperArm.rotation.x = -1.5;
          joints.rightForearm.rotation.x = -1.2;
          joints.leftUpperArm.rotation.x = Math.sin(phase) * 0.4;
        } else if (m.citizenClass === 'merchant') {
          // Left arm cradles amphora; right arm swings naturally
          joints.leftUpperArm.rotation.x = -0.45;
          joints.leftForearm.rotation.x = -0.9;
          joints.rightUpperArm.rotation.x = -Math.sin(phase) * 0.4;
        } else {
          // Standard natural arm swing
          joints.leftUpperArm.rotation.x = -Math.sin(phase) * 0.42;
          joints.leftForearm.rotation.x = -Math.abs(Math.sin(phase)) * 0.25;
          joints.rightUpperArm.rotation.x = Math.sin(phase) * 0.42;
          joints.rightForearm.rotation.x = -Math.abs(Math.cos(phase)) * 0.25;
        }
      } else {
        // Idle Animation: Breathing, subtle weight shift, conversational gesturing
        const idleTime = elapsedTime + i * 1.7;

        // Natural thoracic breathing
        const breath = Math.sin(idleTime * 2.2) * 0.035;
        joints.chest.scale.set(1.0 + breath, 1.0 + breath * 0.7, 1.0 + breath);
        joints.hips.position.y = 0.94 + Math.sin(idleTime * 1.1) * 0.015;

        // Weight shift
        joints.hips.rotation.z = Math.sin(idleTime * 0.75) * 0.04;
        joints.leftThigh.rotation.x = THREE.MathUtils.lerp(joints.leftThigh.rotation.x, 0.05, dt * 4);
        joints.leftCalf.rotation.x = THREE.MathUtils.lerp(joints.leftCalf.rotation.x, 0.0, dt * 4);
        joints.rightThigh.rotation.x = THREE.MathUtils.lerp(joints.rightThigh.rotation.x, -0.05, dt * 4);
        joints.rightCalf.rotation.x = THREE.MathUtils.lerp(joints.rightCalf.rotation.x, 0.0, dt * 4);

        if (m.behavior === 'converse') {
          // Conversational gestures (hand talking, head nod)
          m.gestureTimer -= dt;
          if (m.gestureTimer <= 0) {
            m.gestureTimer = 2.5 + Math.random() * 3.5;
          }

          const gestureAmt = Math.sin(idleTime * 3.5);
          joints.rightUpperArm.rotation.x = -0.55 + gestureAmt * 0.25;
          joints.rightForearm.rotation.x = -0.95 + gestureAmt * 0.35;
          joints.rightHand.rotation.z = gestureAmt * 0.3;
          joints.leftUpperArm.rotation.x = -0.15;
          joints.leftForearm.rotation.x = -0.3;

          joints.head.rotation.x = Math.sin(idleTime * 2.5) * 0.08; // Head nods
        } else if (m.behavior === 'merchant') {
          // Merchant beckoning gesture
          const beckon = Math.sin(idleTime * 2.8);
          joints.rightUpperArm.rotation.x = -0.7 + beckon * 0.2;
          joints.rightForearm.rotation.x = -0.8 + beckon * 0.25;
          joints.leftUpperArm.rotation.x = -0.4;
          joints.leftForearm.rotation.x = -0.85;
        } else {
          // Calm idle arms
          joints.leftUpperArm.rotation.x = THREE.MathUtils.lerp(joints.leftUpperArm.rotation.x, 0.05, dt * 3);
          joints.leftForearm.rotation.x = THREE.MathUtils.lerp(joints.leftForearm.rotation.x, -0.1, dt * 3);
          joints.rightUpperArm.rotation.x = THREE.MathUtils.lerp(joints.rightUpperArm.rotation.x, 0.05, dt * 3);
          joints.rightForearm.rotation.x = THREE.MathUtils.lerp(joints.rightForearm.rotation.x, -0.1, dt * 3);
        }
      }

      // --- REACTIVE HEAD LOOK-AT BEHAVIOR ---
      if (m.lookAtPlayerWeight > 0.01) {
        // Calculate angle to player
        tempDir.subVectors(playerPos, m.group.position);
        const playerYaw = Math.atan2(tempDir.x, tempDir.z);
        let relYaw = playerYaw - m.group.rotation.y;
        while (relYaw > Math.PI) relYaw -= Math.PI * 2;
        while (relYaw < -Math.PI) relYaw += Math.PI * 2;

        // Clamp head turn to natural neck range (±70 degrees)
        const clampedYaw = THREE.MathUtils.clamp(relYaw, -1.2, 1.2);
        const pitchAngle = THREE.MathUtils.clamp((playerPos.y - (m.group.position.y + 1.5)) * 0.25, -0.4, 0.4);

        joints.head.rotation.y = THREE.MathUtils.lerp(
          joints.head.rotation.y,
          clampedYaw,
          m.lookAtPlayerWeight * Math.min(1.0, dt * 5.0)
        );
        joints.head.rotation.x = THREE.MathUtils.lerp(
          joints.head.rotation.x,
          pitchAngle,
          m.lookAtPlayerWeight * Math.min(1.0, dt * 5.0)
        );
      } else if (!isMoving && m.behavior !== 'converse') {
        // Subtle ambient head look around
        joints.head.rotation.y = Math.sin(elapsedTime * 0.6 + i) * 0.18;
        joints.head.rotation.x = Math.sin(elapsedTime * 0.4 + i) * 0.06;
      }
    }
  }
}
