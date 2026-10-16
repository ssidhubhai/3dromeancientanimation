/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CitizenClass, CitizenInfo, CrowdMember } from '../types.ts';
import { TextureFactory } from '../textures/TextureFactory.ts';

// Shared materials for human characters to minimize draw calls and shader recompilation
interface CharacterMaterials {
  skinTones: THREE.MeshStandardMaterial[];
  hairColors: THREE.MeshStandardMaterial[];
  tunicaWhite: THREE.MeshStandardMaterial;
  tunicaCrimson: THREE.MeshStandardMaterial;
  tunicaOchre: THREE.MeshStandardMaterial;
  tunicaBlue: THREE.MeshStandardMaterial;
  togaWhite: THREE.MeshStandardMaterial;
  togaPurpleBorder: THREE.MeshStandardMaterial;
  stolaGold: THREE.MeshStandardMaterial;
  stolaEmerald: THREE.MeshStandardMaterial;
  leatherBrown: THREE.MeshStandardMaterial;
  leatherRed: THREE.MeshStandardMaterial;
  armorSteel: THREE.MeshStandardMaterial;
  armorBronze: THREE.MeshStandardMaterial;
  parchment: THREE.MeshStandardMaterial;
  terracottaVase: THREE.MeshStandardMaterial;
  scutumShieldMat: THREE.MeshStandardMaterial;
}

export class CharacterBuilder {
  private static materials: CharacterMaterials | null = null;

  public static initMaterials() {
    if (this.materials) return;

    const scutumTex = TextureFactory.createScutumShield();

    this.materials = {
      skinTones: [
        new THREE.MeshStandardMaterial({ color: 0xe0ad87, roughness: 0.65, metalness: 0.02 }), // Mediterranean olive
        new THREE.MeshStandardMaterial({ color: 0xd29971, roughness: 0.65, metalness: 0.02 }), // Sun-tanned bronze
        new THREE.MeshStandardMaterial({ color: 0xedd0b9, roughness: 0.68, metalness: 0.02 }), // Fair patrician
        new THREE.MeshStandardMaterial({ color: 0xba815b, roughness: 0.65, metalness: 0.02 }), // Deep warm bronze
      ],
      hairColors: [
        new THREE.MeshStandardMaterial({ color: 0x221811, roughness: 0.85 }), // Dark brown/black
        new THREE.MeshStandardMaterial({ color: 0x422f20, roughness: 0.85 }), // Chestnut
        new THREE.MeshStandardMaterial({ color: 0x7c6954, roughness: 0.85 }), // Grey/senatorial
        new THREE.MeshStandardMaterial({ color: 0x2b211a, roughness: 0.85 }), // Black curls
      ],
      tunicaWhite: new THREE.MeshStandardMaterial({ color: 0xede6d8, roughness: 0.82 }),
      tunicaCrimson: new THREE.MeshStandardMaterial({ color: 0x8a2020, roughness: 0.8 }),
      tunicaOchre: new THREE.MeshStandardMaterial({ color: 0xb58245, roughness: 0.8 }),
      tunicaBlue: new THREE.MeshStandardMaterial({ color: 0x3d5d7a, roughness: 0.8 }),
      togaWhite: new THREE.MeshStandardMaterial({ color: 0xf5efe4, roughness: 0.78, side: THREE.DoubleSide }),
      togaPurpleBorder: new THREE.MeshStandardMaterial({ color: 0x6e1b3b, roughness: 0.75, side: THREE.DoubleSide }),
      stolaGold: new THREE.MeshStandardMaterial({ color: 0xd9b76a, roughness: 0.75 }),
      stolaEmerald: new THREE.MeshStandardMaterial({ color: 0x356350, roughness: 0.75 }),
      leatherBrown: new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.7, metalness: 0.1 }),
      leatherRed: new THREE.MeshStandardMaterial({ color: 0x7a221b, roughness: 0.7, metalness: 0.1 }),
      armorSteel: new THREE.MeshStandardMaterial({ color: 0x8a9299, roughness: 0.32, metalness: 0.85 }),
      armorBronze: new THREE.MeshStandardMaterial({ color: 0xc49b42, roughness: 0.35, metalness: 0.82 }),
      parchment: new THREE.MeshStandardMaterial({ color: 0xe6dab8, roughness: 0.9 }),
      terracottaVase: new THREE.MeshStandardMaterial({ color: 0xb05a38, roughness: 0.82 }),
      scutumShieldMat: new THREE.MeshStandardMaterial({
        map: scutumTex,
        roughness: 0.45,
        metalness: 0.25,
        side: THREE.DoubleSide
      })
    };
  }

  /**
   * Builds a complete, anatomically proportioned Roman human character
   * with articulated joint hierarchy and historical attire.
   */
  public static createCharacter(
    citizenClass: CitizenClass,
    info: CitizenInfo,
    seed = 0
  ): CrowdMember {
    this.initMaterials();
    const mats = this.materials!;

    const skinMat = mats.skinTones[Math.abs(seed) % mats.skinTones.length];
    const hairMat = mats.hairColors[Math.abs(seed + 1) % mats.hairColors.length];

    const root = new THREE.Group();
    root.name = `Citizen_${info.id}`;

    // Joint groups for skeletal kinematics
    const hips = new THREE.Group();
    hips.position.y = 0.94; // Hip pivot height
    root.add(hips);

    const spine = new THREE.Group();
    spine.position.y = 0.14;
    hips.add(spine);

    const chest = new THREE.Group();
    chest.position.y = 0.22;
    spine.add(chest);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.38;
    chest.add(headGroup);

    // Left Arm Hierarchy
    const leftUpperArm = new THREE.Group();
    leftUpperArm.position.set(-0.25, 0.24, 0);
    chest.add(leftUpperArm);

    const leftForearm = new THREE.Group();
    leftForearm.position.set(0, -0.3, 0);
    leftUpperArm.add(leftForearm);

    const leftHand = new THREE.Group();
    leftHand.position.set(0, -0.28, 0);
    leftForearm.add(leftHand);

    // Right Arm Hierarchy
    const rightUpperArm = new THREE.Group();
    rightUpperArm.position.set(0.25, 0.24, 0);
    chest.add(rightUpperArm);

    const rightForearm = new THREE.Group();
    rightForearm.position.set(0, -0.3, 0);
    rightUpperArm.add(rightForearm);

    const rightHand = new THREE.Group();
    rightHand.position.set(0, -0.28, 0);
    rightForearm.add(rightHand);

    // Left Leg Hierarchy
    const leftThigh = new THREE.Group();
    leftThigh.position.set(-0.13, -0.04, 0);
    hips.add(leftThigh);

    const leftCalf = new THREE.Group();
    leftCalf.position.set(0, -0.42, 0);
    leftThigh.add(leftCalf);

    const leftFoot = new THREE.Group();
    leftFoot.position.set(0, -0.42, 0);
    leftCalf.add(leftFoot);

    // Right Leg Hierarchy
    const rightThigh = new THREE.Group();
    rightThigh.position.set(0.13, -0.04, 0);
    hips.add(rightThigh);

    const rightCalf = new THREE.Group();
    rightCalf.position.set(0, -0.42, 0);
    rightThigh.add(rightCalf);

    const rightFoot = new THREE.Group();
    rightFoot.position.set(0, -0.42, 0);
    rightCalf.add(rightFoot);

    // --- ANATOMICAL GEOMETRY BUILDERS ---

    // 1. Pelvis / Hips geometry
    const pelvis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.15, 0.18, 10),
      skinMat
    );
    pelvis.position.y = 0.06;
    hips.add(pelvis);

    // 2. Torso: lower spine & chest
    const lowerTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.17, 0.2, 10),
      skinMat
    );
    lowerTorso.position.y = 0.1;
    spine.add(lowerTorso);

    const upperChest = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.28, 0.24),
      skinMat
    );
    upperChest.position.y = 0.14;
    upperChest.castShadow = true;
    chest.add(upperChest);

    // Pectorals / shoulder contour
    const clavicle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.44, 8),
      skinMat
    );
    clavicle.rotation.z = Math.PI / 2;
    clavicle.position.y = 0.24;
    chest.add(clavicle);

    // 3. Head & Facial Anatomy
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.09, 0.14, 8),
      skinMat
    );
    neck.position.y = 0.06;
    headGroup.add(neck);

    const cranium = new THREE.Mesh(
      new THREE.SphereGeometry(0.135, 12, 10),
      skinMat
    );
    cranium.position.set(0, 0.18, 0);
    cranium.scale.set(1.0, 1.15, 1.05);
    cranium.castShadow = true;
    headGroup.add(cranium);

    // Nose & Brow
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.032, 0.085, 4),
      skinMat
    );
    nose.position.set(0, 0.17, 0.14);
    nose.rotation.x = Math.PI / 2;
    headGroup.add(nose);

    // Jaw / Chin
    const jaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.09, 0.12),
      skinMat
    );
    jaw.position.set(0, 0.11, 0.05);
    headGroup.add(jaw);

    // 4. Arms Geometry (Biceps, Forearms, Hands)
    [leftUpperArm, rightUpperArm].forEach((uArm) => {
      const bicep = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.058, 0.28, 8),
        skinMat
      );
      bicep.position.y = -0.14;
      bicep.castShadow = true;
      uArm.add(bicep);
    });

    [leftForearm, rightForearm].forEach((fArm) => {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.056, 0.048, 0.26, 8),
        skinMat
      );
      arm.position.y = -0.13;
      arm.castShadow = true;
      fArm.add(arm);
    });

    [leftHand, rightHand].forEach((hGroup) => {
      const palm = new THREE.Mesh(
        new THREE.BoxGeometry(0.075, 0.09, 0.035),
        skinMat
      );
      palm.position.y = -0.045;
      hGroup.add(palm);

      // Curled natural fingers
      const fingers = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.06, 0.025),
        skinMat
      );
      fingers.position.set(0, -0.09, 0.005);
      hGroup.add(fingers);
    });

    // 5. Legs & Caligae Sandals Geometry
    [leftThigh, rightThigh].forEach((tGroup) => {
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.075, 0.4, 8),
        skinMat
      );
      thigh.position.y = -0.2;
      thigh.castShadow = true;
      tGroup.add(thigh);
    });

    [leftCalf, rightCalf].forEach((cGroup) => {
      const calf = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.06, 0.38, 8),
        skinMat
      );
      calf.position.y = -0.19;
      calf.castShadow = true;
      cGroup.add(calf);
    });

    [leftFoot, rightFoot].forEach((fGroup) => {
      // Leather Caligae Sole & Straps
      const sole = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.035, 0.22),
        mats.leatherBrown
      );
      sole.position.set(0, -0.02, 0.05);
      sole.castShadow = true;
      fGroup.add(sole);

      // Ankle leather strapping
      const straps = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.068, 0.08, 8),
        mats.leatherBrown
      );
      straps.position.y = 0.03;
      fGroup.add(straps);
    });

    // --- CLASS-SPECIFIC CLOTHING, ARMOR & ACCESSORIES ---

    switch (citizenClass) {
      case 'senator': {
        // Patrician Haircut: short senatorial crop
        const hair = new THREE.Mesh(
          new THREE.SphereGeometry(0.142, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55),
          mats.hairColors[2] // Greyish/mature
        );
        hair.position.set(0, 0.19, -0.01);
        headGroup.add(hair);

        // Senatorial Tunic with latus clavus (wide purple stripe)
        const tunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.3, 0.72, 12),
          mats.tunicaWhite
        );
        tunic.position.y = 0.08;
        spine.add(tunic);

        // Senatorial Toga Praetexta with rich purple border
        // Draped over left shoulder and across body
        const togaSinus = new THREE.Mesh(
          new THREE.TorusGeometry(0.26, 0.085, 8, 16),
          mats.togaPurpleBorder
        );
        togaSinus.position.set(-0.06, 0.18, 0.08);
        togaSinus.rotation.set(0.65, 0.3, 0.8);
        chest.add(togaSinus);

        const togaMantle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.36, 1.05, 12, 1, true),
          mats.togaWhite
        );
        togaMantle.position.y = -0.15;
        togaMantle.rotation.y = 0.3;
        hips.add(togaMantle);

        // Left hand holds a parchment scroll (volumen)
        const scroll = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8),
          mats.parchment
        );
        scroll.position.set(0, -0.04, 0.03);
        scroll.rotation.x = Math.PI / 2;
        leftHand.add(scroll);

        // Red senatorial calcei boots
        [leftFoot, rightFoot].forEach(f => {
          const boot = new THREE.Mesh(
            new THREE.BoxGeometry(0.095, 0.07, 0.22),
            mats.leatherRed
          );
          boot.position.set(0, 0.0, 0.05);
          f.add(boot);
        });
        break;
      }

      case 'legionary': {
        // Imperial Gallic Helmet (Galea) with neck guard, brow reinforcement & cheekpieces
        const helmetBowl = new THREE.Mesh(
          new THREE.SphereGeometry(0.146, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6),
          mats.armorSteel
        );
        helmetBowl.position.set(0, 0.19, -0.01);
        headGroup.add(helmetBowl);

        // Rear flared neck guard
        const neckGuard = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.19, 0.05, 8, 1, false, Math.PI, Math.PI),
          mats.armorSteel
        );
        neckGuard.position.set(0, 0.12, -0.08);
        neckGuard.rotation.x = 0.35;
        headGroup.add(neckGuard);

        // Cheek guards (paragnathides)
        [-1, 1].forEach(side => {
          const cheekPiece = new THREE.Mesh(
            new THREE.BoxGeometry(0.025, 0.09, 0.06),
            mats.armorBronze
          );
          cheekPiece.position.set(side * 0.125, 0.13, 0.04);
          headGroup.add(cheekPiece);
        });

        // Lorica Segmentata (Overlapping Iron Curvature Plates)
        const cuirass = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.23, 0.36, 12),
          mats.armorSteel
        );
        cuirass.position.y = 0.15;
        chest.add(cuirass);

        // Shoulder guard curved laminates
        [-1, 1].forEach(side => {
          const shoulderPlates = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.12, 0.18, 8, 1, false, 0, Math.PI),
            mats.armorSteel
          );
          shoulderPlates.position.set(side * 0.25, 0.26, 0);
          shoulderPlates.rotation.z = side * 0.35;
          chest.add(shoulderPlates);
        });

        // Military Tunic (Crimson red visible underneath)
        const redTunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.29, 0.42, 10),
          mats.tunicaCrimson
        );
        redTunic.position.y = -0.12;
        hips.add(redTunic);

        // Leather Pteruges groin and shoulder strips
        const pteruges = new THREE.Mesh(
          new THREE.CylinderGeometry(0.23, 0.26, 0.2, 10),
          mats.leatherBrown
        );
        pteruges.position.y = -0.05;
        hips.add(pteruges);

        // Military belt (Cingulum Militare) with bronze studs
        const belt = new THREE.Mesh(
          new THREE.TorusGeometry(0.22, 0.025, 6, 16),
          mats.armorBronze
        );
        belt.position.y = 0.04;
        belt.rotation.x = Math.PI / 2;
        hips.add(belt);

        // Left arm carries Curved Rectangular Scutum Shield
        const scutum = new THREE.Mesh(
          new THREE.CylinderGeometry(0.48, 0.48, 0.88, 12, 1, true, -Math.PI * 0.3, Math.PI * 0.6),
          mats.scutumShieldMat
        );
        scutum.position.set(-0.24, -0.05, 0.12);
        scutum.rotation.set(0.1, Math.PI / 2, 0);
        scutum.castShadow = true;
        leftForearm.add(scutum);

        // Central Bronze Shield Boss (Umbo)
        const umbo = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 10, 8),
          mats.armorBronze
        );
        umbo.position.set(-0.42, -0.05, 0.12);
        leftForearm.add(umbo);

        // Right hand holds heavy Pilum (javelin)
        const pilumShaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 2.1, 6),
          mats.leatherBrown
        );
        pilumShaft.position.set(0.05, 0.4, 0.1);
        rightHand.add(pilumShaft);

        const pilumHead = new THREE.Mesh(
          new THREE.ConeGeometry(0.025, 0.35, 4),
          mats.armorSteel
        );
        pilumHead.position.set(0.05, 1.5, 0.1);
        rightHand.add(pilumHead);
        break;
      }

      case 'centurion': {
        // Centurion Gallic Helmet with Transverse Crimson Horsehair Crest
        const cHelmet = new THREE.Mesh(
          new THREE.SphereGeometry(0.148, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6),
          mats.armorBronze
        );
        cHelmet.position.set(0, 0.19, -0.01);
        headGroup.add(cHelmet);

        // Transverse Crest (side-to-side crest of a Roman Centurion!)
        const crest = new THREE.Mesh(
          new THREE.BoxGeometry(0.44, 0.16, 0.045),
          mats.tunicaCrimson
        );
        crest.position.set(0, 0.38, 0);
        headGroup.add(crest);

        // Lorica Squamata (scale armor) breastplate
        const scaleCuirass = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.24, 0.38, 12),
          mats.armorBronze
        );
        scaleCuirass.position.y = 0.15;
        chest.add(scaleCuirass);

        // Crimson Military Cloak (Sagum) draped over shoulders
        const sagum = new THREE.Mesh(
          new THREE.BoxGeometry(0.46, 0.75, 0.06),
          mats.tunicaCrimson
        );
        sagum.position.set(0, 0.0, -0.16);
        sagum.castShadow = true;
        chest.add(sagum);

        // Vine Staff of Office (Vitis) in right hand
        const vitis = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.025, 0.95, 6),
          mats.leatherBrown
        );
        vitis.position.set(0.04, -0.15, 0.08);
        vitis.rotation.x = 0.2;
        rightHand.add(vitis);

        const centTunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.31, 0.44, 10),
          mats.tunicaCrimson
        );
        centTunic.position.y = -0.12;
        hips.add(centTunic);
        break;
      }

      case 'citizen_female': {
        // Elaborate Roman coiled chignon / Flavian hairstyle
        const hairDome = new THREE.Mesh(
          new THREE.SphereGeometry(0.144, 12, 10),
          hairMat
        );
        hairDome.position.set(0, 0.2, -0.04);
        hairDome.scale.set(1.0, 1.1, 1.25);
        headGroup.add(hairDome);

        // Gold Hairpin / Diadem
        const diadem = new THREE.Mesh(
          new THREE.TorusGeometry(0.12, 0.018, 6, 16, Math.PI),
          mats.armorBronze
        );
        diadem.position.set(0, 0.22, 0.04);
        diadem.rotation.x = 0.4;
        headGroup.add(diadem);

        // Stola Gown & Palla (Draped mantle)
        const stolaMat = seed % 2 === 0 ? mats.stolaGold : mats.stolaEmerald;

        const stolaBodice = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.21, 0.32, 10),
          stolaMat
        );
        stolaBodice.position.y = 0.12;
        chest.add(stolaBodice);

        const stolaSkirt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.35, 1.15, 12),
          stolaMat
        );
        stolaSkirt.position.y = -0.22;
        stolaSkirt.castShadow = true;
        hips.add(stolaSkirt);

        // Draped Palla mantle wrapped over shoulder
        const palla = new THREE.Mesh(
          new THREE.TorusGeometry(0.25, 0.07, 8, 16),
          mats.tunicaWhite
        );
        palla.position.set(-0.04, 0.18, 0.06);
        palla.rotation.set(0.5, 0.2, 0.6);
        chest.add(palla);
        break;
      }

      case 'merchant': {
        // Tanned Mediterranean hair curls
        const curls = new THREE.Mesh(
          new THREE.SphereGeometry(0.144, 10, 8),
          hairMat
        );
        curls.position.set(0, 0.2, -0.02);
        headGroup.add(curls);

        // Beltered Ochre/Brown Tunic
        const mTunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.28, 0.65, 10),
          seed % 2 === 0 ? mats.tunicaOchre : mats.tunicaBlue
        );
        mTunic.position.y = 0.02;
        spine.add(mTunic);

        // Leather money pouch hanging at belt
        const pouch = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 8, 8),
          mats.leatherBrown
        );
        pouch.position.set(0.18, 0.02, 0.08);
        hips.add(pouch);

        // Ceramic Wine / Olive Oil Amphora in left arm
        const amphora = new THREE.Group();
        amphora.position.set(0.04, -0.06, 0.16);

        const aBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.06, 0.42, 10),
          mats.terracottaVase
        );
        amphora.add(aBody);

        const aNeck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.05, 0.14, 8),
          mats.terracottaVase
        );
        aNeck.position.y = 0.25;
        amphora.add(aNeck);

        [-1, 1].forEach(hSide => {
          const aHandle = new THREE.Mesh(
            new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI),
            mats.terracottaVase
          );
          aHandle.position.set(hSide * 0.09, 0.18, 0);
          aHandle.rotation.y = Math.PI / 2;
          amphora.add(aHandle);
        });

        leftHand.add(amphora);
        break;
      }

      case 'laborer': {
        // Sweatband headband around forehead
        const sweatband = new THREE.Mesh(
          new THREE.TorusGeometry(0.135, 0.022, 6, 16),
          mats.leatherBrown
        );
        sweatband.position.set(0, 0.18, 0);
        sweatband.rotation.x = 0.1;
        headGroup.add(sweatband);

        // Earthy rough tunic with rolled sleeves
        const lTunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.23, 0.29, 0.64, 10),
          mats.tunicaOchre
        );
        lTunic.position.y = 0.02;
        spine.add(lTunic);

        // Heavy Terracotta Amphora or crate on right shoulder
        const crate = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.32, 0.38),
          mats.leatherBrown
        );
        crate.position.set(0.24, 0.42, 0.05);
        crate.castShadow = true;
        chest.add(crate);
        break;
      }

      case 'citizen_male':
      default: {
        // Classic Roman curly crop
        const curls = new THREE.Mesh(
          new THREE.SphereGeometry(0.142, 10, 8),
          hairMat
        );
        curls.position.set(0, 0.2, -0.01);
        headGroup.add(curls);

        // White Wool Tunic
        const tunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.28, 0.68, 10),
          mats.tunicaWhite
        );
        tunic.position.y = 0.04;
        spine.add(tunic);

        // Classic White Wool Toga Drapery
        const togaSinus = new THREE.Mesh(
          new THREE.TorusGeometry(0.26, 0.08, 8, 16),
          mats.togaWhite
        );
        togaSinus.position.set(-0.05, 0.16, 0.08);
        togaSinus.rotation.set(0.65, 0.3, 0.8);
        chest.add(togaSinus);

        const togaFold = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.34, 0.95, 12, 1, true),
          mats.togaWhite
        );
        togaFold.position.y = -0.16;
        hips.add(togaFold);
        break;
      }
    }

    // Apply subtle variation in citizen height (0.94x - 1.06x)
    const heightScale = 0.94 + (Math.abs(seed) % 13) * 0.01;
    root.scale.set(heightScale, heightScale, heightScale);

    return {
      id: info.id,
      info,
      group: root,
      citizenClass,
      joints: {
        hips,
        spine,
        chest,
        head: headGroup,
        leftUpperArm,
        leftForearm,
        leftHand,
        rightUpperArm,
        rightForearm,
        rightHand,
        leftThigh,
        leftCalf,
        leftFoot,
        rightThigh,
        rightCalf,
        rightFoot
      },
      behavior: 'walk',
      pathPoints: [],
      currentPointIndex: 0,
      speed: 1.2 + (Math.abs(seed) % 5) * 0.15,
      animPhase: Math.random() * Math.PI * 2,
      gestureTimer: Math.random() * 4,
      lookAtPlayerWeight: 0,
      initialFacing: 0
    };
  }
}
