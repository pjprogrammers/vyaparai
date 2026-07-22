"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  scrollProgress: number;
  mouseInfluence?: number;
}

const SECTION_POSITIONS: [number, number, number][] = [
  [0, 0, 8],
  [0, -2, 6],
  [3, -1, 5],
  [-3, -2, 7],
  [0, -3, 5],
  [2, -1, 6],
  [-2, 0, 7],
  [0, 0, 8],
];

const SECTION_LOOKATS: [number, number, number][] = [
  [0, 0, 0],
  [0, -1, 0],
  [2, 0, 0],
  [-2, -1, 0],
  [0, -2, 0],
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 0],
];

const totalSections = SECTION_POSITIONS.length - 1;

const currentSectionRef = { current: 0 };

export function useCurrentSection() {
  return currentSectionRef;
}

export function useSceneVisible(sceneSection: number, threshold = 2) {
  const diff = Math.abs(currentSectionRef.current - sceneSection);
  return diff <= threshold;
}

export function CameraRig({ scrollProgress, mouseInfluence = 0.3 }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const tempVec = useRef(new THREE.Vector3());
  const idleTime = useRef(0);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;
  const aspectRef = useRef(1);

  useFrame((state, delta) => {
    idleTime.current += delta;

    const { gl, scene } = state;
    const w = gl.domElement.clientWidth;
    const h = gl.domElement.clientHeight;
    const ar = w / h;
    aspectRef.current = ar;

    const isPortrait = ar < 0.85;
    const isUltrawide = ar > 2;

    let responsiveFOV = 45;
    let responsiveZOffset = 0;

    if (isPortrait) {
      responsiveFOV = 45 + (0.85 - ar) * 40;
      responsiveZOffset = (0.85 - ar) * 10;
    } else if (isUltrawide) {
      responsiveFOV = 45 - Math.min((ar - 2) * 5, 10);
      responsiveZOffset = -Math.min((ar - 2) * 1.5, 3);
    }

    if ("fov" in camera) {
      camera.fov = responsiveFOV;
      camera.updateProjectionMatrix();
    }

    const sp = scrollRef.current * totalSections;
    const si = Math.min(Math.floor(sp), totalSections - 1);
    currentSectionRef.current = si;
    const t = sp - si;

    const fromPos = SECTION_POSITIONS[si];
    const toPos = SECTION_POSITIONS[Math.min(si + 1, totalSections)];
    const fromLookAt = SECTION_LOOKATS[si];
    const toLookAt = SECTION_LOOKATS[Math.min(si + 1, totalSections)];

    const ease = t * t * (3 - 2 * t);

    targetPos.current.set(
      THREE.MathUtils.lerp(fromPos[0], toPos[0], ease),
      THREE.MathUtils.lerp(fromPos[1], toPos[1], ease),
      THREE.MathUtils.lerp(fromPos[2], toPos[2], ease) + responsiveZOffset,
    );

    targetLookAt.current.set(
      THREE.MathUtils.lerp(fromLookAt[0], toLookAt[0], ease),
      THREE.MathUtils.lerp(fromLookAt[1], toLookAt[1], ease),
      THREE.MathUtils.lerp(fromLookAt[2], toLookAt[2], ease),
    );

    const idleX = Math.sin(idleTime.current * 0.3) * 0.05;
    const idleY = Math.cos(idleTime.current * 0.2) * 0.03;

    const mouseOffsetX = pointer.x * mouseInfluence;
    const mouseOffsetY = pointer.y * mouseInfluence * 0.5;

    tempVec.current.set(
      targetPos.current.x + idleX + mouseOffsetX,
      targetPos.current.y + idleY + mouseOffsetY,
      targetPos.current.z,
    );
    camera.position.lerp(tempVec.current, delta * 2);

    currentLookAt.current.lerp(targetLookAt.current, delta * 2);
    camera.lookAt(currentLookAt.current);

    const camZ = camera.position.z;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = Math.max(1, camZ - 7);
      scene.fog.far = camZ + 17;
    }
  });

  return null;
}
