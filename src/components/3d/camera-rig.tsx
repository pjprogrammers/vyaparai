"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { responsiveStore } from "./responsive-context";

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

/** Frame-rate independent damping: returns factor for use with lerp(). */
function dampFactor(current: number, target: number, smoothing: number, dt: number): number {
  return 1 - Math.pow(1 - smoothing, dt * 60);
}

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
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const tempVec = useRef(new THREE.Vector3());
  const idleTime = useRef(0);
  const lastFov = useRef(-1);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useFrame((state, delta) => {
    idleTime.current += delta;

    const { scene } = state;
    const preset = responsiveStore.preset;

    /* Only update projection matrix when FOV actually changes */
    const targetFov = preset.fov;
    if ("fov" in camera && camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
      lastFov.current = targetFov;
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
      THREE.MathUtils.lerp(fromPos[2], toPos[2], ease) + preset.zOffset,
    );

    targetLookAt.current.set(
      THREE.MathUtils.lerp(fromLookAt[0], toLookAt[0], ease),
      THREE.MathUtils.lerp(fromLookAt[1], toLookAt[1], ease),
      THREE.MathUtils.lerp(fromLookAt[2], toLookAt[2], ease),
    );

    const amp = preset.amplitude;
    const idleX = Math.sin(idleTime.current * 0.3) * 0.05 * amp;
    const idleY = Math.cos(idleTime.current * 0.2) * 0.03 * amp;

    /* Smooth mouse input — exponential damping at 8Hz cutoff */
    const mi = mouseInfluence * amp;
    const mouseTargetX = pointer.x * mi;
    const mouseTargetY = pointer.y * mi * 0.5;
    const mouseSmooth = dampFactor(0, 1, 0.08, delta);
    smoothMouse.current.x += (mouseTargetX - smoothMouse.current.x) * mouseSmooth;
    smoothMouse.current.y += (mouseTargetY - smoothMouse.current.y) * mouseSmooth;

    tempVec.current.set(
      targetPos.current.x + idleX + smoothMouse.current.x,
      targetPos.current.y + idleY + smoothMouse.current.y,
      targetPos.current.z,
    );

    /* Frame-rate independent camera damping */
    const camSmooth = dampFactor(0, 1, 0.12, delta);
    camera.position.lerp(tempVec.current, camSmooth);

    const lookSmooth = dampFactor(0, 1, 0.12, delta);
    currentLookAt.current.lerp(targetLookAt.current, lookSmooth);
    camera.lookAt(currentLookAt.current);

    const camZ = camera.position.z;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = Math.max(1, camZ + preset.fogNearOffset);
      scene.fog.far = camZ + preset.fogFarOffset;
    }
  });

  return null;
}
