"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { responsiveStore } from "./responsive-context";

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

  /* Pre-allocated spatial hash (reused every frame — zero GC) */
  const hashRef = useRef({
    grid: new Map<number, number[]>(),
    checked: new Uint8Array(256 * 256),
    checkedVersion: new Uint32Array(256 * 256),
    version: 1,
    /* Bucket pool: reusable arrays to avoid per-frame allocation */
    bucketPool: [] as number[][],
    bucketPoolIdx: 0,
    resetPool() { this.bucketPoolIdx = 0; },
    acquireBucket(): number[] {
      if (this.bucketPoolIdx < this.bucketPool.length) {
        const b = this.bucketPool[this.bucketPoolIdx++];
        b.length = 0;
        return b;
      }
      const b: number[] = [];
      this.bucketPool.push(b);
      this.bucketPoolIdx++;
      return b;
    },
  });

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
  const cellSize = connectDistance * 1.5;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const amp = responsiveStore.preset.amplitude;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3] * delta * 60 * amp;
      arr[i3 + 1] += velocities[i3 + 1] * delta * 60 * amp;
      arr[i3 + 2] += velocities[i3 + 2] * delta * 60 * amp;

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

      /* Reuse pre-allocated spatial hash — zero GC per frame */
      const { grid, checked, checkedVersion, version } = hashRef.current;
      hashRef.current.resetPool();
      grid.clear();
      const invCell = 1 / cellSize;
      const halfSpread = spread / 2;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = arr[i3];
        const y = arr[i3 + 1];
        const z = arr[i3 + 2];
        if (x < -halfSpread || x > halfSpread || y < -halfSpread || y > halfSpread || z < -halfSpread || z > halfSpread) continue;

        const cellX = Math.floor(x * invCell);
        const cellY = Math.floor(y * invCell);
        const cellZ = Math.floor(z * invCell);
        const hash = (cellX * 73856093) ^ (cellY * 19349663) ^ (cellZ * 83492791);
        const bucket = grid.get(hash);
        if (bucket) {
          bucket.push(i);
        } else {
          const newBucket = hashRef.current.acquireBucket();
          newBucket.push(i);
          grid.set(hash, newBucket);
        }
      }

      for (let i = 0; i < count && lineIdx < maxLines; i++) {
        const i3 = i * 3;
        const x = arr[i3];
        const y = arr[i3 + 1];
        const z = arr[i3 + 2];
        if (x < -halfSpread || x > halfSpread || y < -halfSpread || y > halfSpread || z < -halfSpread || z > halfSpread) continue;

        const cellX = Math.floor(x * invCell);
        const cellY = Math.floor(y * invCell);
        const cellZ = Math.floor(z * invCell);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
              const h = ((cellX + dx) * 73856093) ^ ((cellY + dy) * 19349663) ^ ((cellZ + dz) * 83492791);
              const bucket = grid.get(h);
              if (!bucket) continue;

              for (let k = 0; k < bucket.length; k++) {
                const j = bucket[k];
                if (j <= i) continue;

                /* Flat-key dedup using versioned array (no Set allocation) */
                const key = i * count + j;
                const bucketIdx = key & 0xFFFF;
                if (checkedVersion[bucketIdx] === version && checked[bucketIdx]) continue;
                checkedVersion[bucketIdx] = version;
                checked[bucketIdx] = 1;

                const j3 = j * 3;
                const ddx = arr[i3] - arr[j3];
                const ddy = arr[i3 + 1] - arr[j3 + 1];
                const ddz = arr[i3 + 2] - arr[j3 + 2];
                const distSq = ddx * ddx + ddy * ddy + ddz * ddz;

                if (distSq < connectDistSq && lineIdx < maxLines) {
                  const li = lineIdx * 6;
                  lArr[li] = arr[i3];
                  lArr[li + 1] = arr[i3 + 1];
                  lArr[li + 2] = arr[i3 + 2];
                  lArr[li + 3] = arr[j3];
                  lArr[li + 4] = arr[j3 + 1];
                  lArr[li + 5] = arr[j3 + 2];

                  const alpha = (1 - Math.sqrt(distSq) / connectDistance) * amp;
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
          }
        }
      }

      if (lineIdx < prevLineCount.current) {
        const start = lineIdx * 6;
        const end = prevLineCount.current * 6;
        for (let ci = start; ci < end; ci++) {
          lArr[ci] = 0;
          cArr[ci] = 0;
        }
      }
      prevLineCount.current = lineIdx;

      lineAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
    }

    meshRef.current.rotation.y += delta * 0.02 * amp;
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
