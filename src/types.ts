/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export type TimeOfDay = 'golden' | 'noon' | 'sunset' | 'night';

export type MovementMode = 'walk' | 'fly';

export interface LightingPreset {
  name: string;
  exposure: number;
  sunPos: THREE.Vector3;
  sunColor: THREE.Color;
  sunIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  fillIntensity: number;
  skyTop: THREE.Color;
  skyMid: THREE.Color;
  skyBot: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  starIntensity: number;
  brazierIntensity: number;
}

export interface FastTravelPoint {
  id: number;
  key: string;
  name: string;
  zone: string;
  subtitle: string;
  desc: string;
  pos: THREE.Vector3;
  lookAt: THREE.Vector3;
  preset: TimeOfDay | null;
  flyMode: boolean;
}

export interface LandmarkZone {
  x: number;
  z: number;
  radius: number;
  zone: string;
  name: string;
  desc: string;
}

export type CitizenClass =
  | 'citizen_male'
  | 'citizen_female'
  | 'senator'
  | 'legionary'
  | 'centurion'
  | 'merchant'
  | 'laborer';

export interface CitizenInfo {
  id: string;
  name: string;
  role: string;
  socialClass: string;
  historicalNote: string;
  quote: string;
}

export interface CrowdMember {
  id: string;
  info: CitizenInfo;
  group: THREE.Group;
  citizenClass: CitizenClass;
  // Articulated joints for animation
  joints: {
    hips: THREE.Group;
    spine: THREE.Group;
    chest: THREE.Group;
    head: THREE.Group;
    leftUpperArm: THREE.Group;
    leftForearm: THREE.Group;
    leftHand: THREE.Group;
    rightUpperArm: THREE.Group;
    rightForearm: THREE.Group;
    rightHand: THREE.Group;
    leftThigh: THREE.Group;
    leftCalf: THREE.Group;
    leftFoot: THREE.Group;
    rightThigh: THREE.Group;
    rightCalf: THREE.Group;
    rightFoot: THREE.Group;
  };
  // Path & Behavior state
  behavior: 'walk' | 'patrol' | 'converse' | 'merchant' | 'idle';
  pathPoints: THREE.Vector3[];
  currentPointIndex: number;
  speed: number;
  animPhase: number;
  gestureTimer: number;
  lookAtPlayerWeight: number;
  initialFacing: number;
}
