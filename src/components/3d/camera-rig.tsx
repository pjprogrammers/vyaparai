"use client";

import { useRef, useMemo } from "react";
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

export function CameraRig({ scrollProgress, mouseInfluence = 0.3 }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const idleTime = useRef(0);

  const totalSections = SECTION_POSITIONS.length - 1;
  const sectionProgress = scrollProgress * totalSections;
  const sectionIndex = Math.min(Math.floor(sectionProgress), totalSections - 1);
  const t = sectionProgress - sectionIndex;

  useFrame((_, delta) => {
    idleTime.current += delta;

    const fromPos = SECTION_POSITIONS[sectionIndex];
    const toPos = SECTION_POSITIONS[Math.min(sectionIndex + 1, totalSections)];
    const fromLookAt = SECTION_LOOKATS[sectionIndex];
    const toLookAt = SECTION_LOOKATS[Math.min(sectionIndex + 1, totalSections)];

    const ease = t * t * (3 - 2 * t);

    targetPos.current.set(
      THREE.MathUtils.lerp(fromPos[0], toPos[0], ease),
      THREE.MathUtils.lerp(fromPos[1], toPos[1], ease),
      THREE.MathUtils.lerp(fromPos[2], toPos[2], ease),
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

    camera.position.lerp(
      new THREE.Vector3(
        targetPos.current.x + idleX + mouseOffsetX,
        targetPos.current.y + idleY + mouseOffsetY,
        targetPos.current.z,
      ),
      delta * 2,
    );

    currentLookAt.current.lerp(targetLookAt.current, delta * 2);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
