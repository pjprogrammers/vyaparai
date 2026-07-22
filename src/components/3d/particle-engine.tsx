"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
  opacity?: number;
  connectDistance?: number;
}

export function ParticleField({
  count = 200,
  color = "#facc15",
  size = 0.03,
  spread = 15,
  speed = 0.3,
  opacity = 0.8,
  connectDistance = 2.5,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const prevLineCount = useRef(0);

  const { positions, velocities, linePositions, lineColors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const maxLines = Math.min(count * 20, count * count);
    const lPos = new Float32Array(maxLines * 6);
    const lCol = new Float32Array(maxLines * 6);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * spread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread;
      vel[i3] = (Math.random() - 0.5) * speed * 0.01;
      vel[i3 + 1] = (Math.random() - 0.5) * speed * 0.01;
      vel[i3 + 2] = (Math.random() - 0.5) * speed * 0.01;
    }

    return { positions: pos, velocities: vel, linePositions: lPos, lineColors: lCol };
  }, [count, spread, speed]);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    return geo;
  }, [linePositions, lineColors]);

  const connectDistSq = connectDistance * connectDistance;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3] * delta * 60;
      arr[i3 + 1] += velocities[i3 + 1] * delta * 60;
      arr[i3 + 2] += velocities[i3 + 2] * delta * 60;

      if (Math.abs(arr[i3]) > spread / 2) velocities[i3] *= -1;
      if (Math.abs(arr[i3 + 1]) > spread / 2) velocities[i3 + 1] *= -1;
      if (Math.abs(arr[i3 + 2]) > spread / 2) velocities[i3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;

    if (linesRef.current) {
      const lineAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = linesRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const lArr = lineAttr.array as Float32Array;
      const cArr = colAttr.array as Float32Array;
      let lineIdx = 0;
      const maxLines = lArr.length / 6;

      for (let i = 0; i < count && lineIdx < maxLines; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
          const j3 = j * 3;
          const dx = arr[i3] - arr[j3];
          const dy = arr[i3 + 1] - arr[j3 + 1];
          const dz = arr[i3 + 2] - arr[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectDistSq) {
            const li = lineIdx * 6;
            lArr[li] = arr[i3];
            lArr[li + 1] = arr[i3 + 1];
            lArr[li + 2] = arr[i3 + 2];
            lArr[li + 3] = arr[j3];
            lArr[li + 4] = arr[j3 + 1];
            lArr[li + 5] = arr[j3 + 2];

            const alpha = 1 - Math.sqrt(distSq) / connectDistance;
            cArr[li] = alpha * 0.98;
            cArr[li + 1] = alpha * 0.8;
            cArr[li + 2] = alpha * 0.08;
            cArr[li + 3] = alpha * 0.98;
            cArr[li + 4] = alpha * 0.8;
            cArr[li + 5] = alpha * 0.08;
            lineIdx++;
          }
        }
      }

      if (lineIdx < prevLineCount.current) {
        const start = lineIdx * 6;
        const end = prevLineCount.current * 6;
        for (let i = start; i < end; i++) {
          lArr[i] = 0;
          cArr[i] = 0;
        }
      }
      prevLineCount.current = lineIdx;

      lineAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
    }

    meshRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group>
      <points ref={meshRef} geometry={particleGeometry}>
        <pointsMaterial
          size={size}
          color={color}
          transparent
          opacity={opacity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
