"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";
import { sharedDummy } from "../scene-cache";

export function InventoryScene() {
  return (
    <group position={[6, -14, 0]}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#facc15" />
      <pointLight position={[0, 3, 4]} intensity={2} color="#f59e0b" distance={12} />

      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
        <WarehouseStructure />
      </Float>

      <ConveyorBelt />
      <InventoryBars />
      <FloatingBoxes />
    </group>
  );
}

/* Shared geometry + material for shelves (15 meshes share these) */
const shelfGeo = new THREE.BoxGeometry(0.8, 0.03, 0.6);
const shelfMat = new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.6, roughness: 0.3 });
const floorMat = new THREE.MeshStandardMaterial({ color: "#141414", metalness: 0.8, roughness: 0.2 });

function WarehouseStructure() {
  return (
    <group>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMat}>
        <planeGeometry args={[6, 4]} />
      </mesh>

      {[-2, -1, 0, 1, 2].map((x) => (
        <ShelfRow key={x} x={x} />
      ))}
    </group>
  );
}

function ShelfRow({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      {[0, 0.6, 1.2].map((y) => (
        <mesh key={y} position={[0, y - 0.5, 0]} geometry={shelfGeo} material={shelfMat} />
      ))}
    </group>
  );
}

const beltMat = new THREE.MeshStandardMaterial({ color: "#1a1a1a", emissive: "#facc15", emissiveIntensity: 0.05 });
const boxMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.3, transparent: true, opacity: 0.5 });

function ConveyorBelt() {
  const ref = useRef<THREE.Group>(null!);
  const visible = useSceneVisible(2);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        child.position.x = ((t * 0.5 + i * 0.8) % 4) - 2;
      }
    });
  });

  return (
    <group ref={ref} position={[0, -1, 1.5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={beltMat}>
        <planeGeometry args={[5, 0.3]} />
      </mesh>

      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[i * 0.8 - 1.2, 0.15, 0]} material={boxMat}>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
        </mesh>
      ))}
    </group>
  );
}

/* InstancedMesh for 8 inventory bars — 8 draw calls → 1 */
function InventoryBars() {
  const bars = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        x: -1.5 + i * 0.42,
        maxHeight: 0.5 + Math.random() * 1.5,
        speed: 0.5 + Math.random() * 1,
      })),
    [],
  );

  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(2);

  const barMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#facc15",
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.5,
  }), []);

  useFrame((state) => {
    if (!visible || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    bars.forEach((bar, i) => {
      const s = Math.sin(t * bar.speed + i * 0.5) * 0.3 + 0.7;
      sharedDummy.position.set(bar.x, bar.maxHeight / 2, 0);
      sharedDummy.scale.set(0.3, bar.maxHeight * s, 0.1);
      sharedDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, sharedDummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, -0.5, -1.5]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, bars.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={barMat} attach="material" />
      </instancedMesh>
    </group>
  );
}

/* InstancedMesh for 12 floating boxes — 12 draw calls → 1 */
function FloatingBoxes() {
  const boxes = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 3,
        z: (Math.random() - 0.5) * 3,
        scale: 0.15 + Math.random() * 0.2,
        speed: 0.3 + Math.random() * 0.8,
      })),
    [],
  );

  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(2);

  const boxMat2 = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    metalness: 0.7,
    roughness: 0.3,
    emissive: "#facc15",
    emissiveIntensity: 0.15,
  }), []);

  useFrame((state) => {
    if (!visible || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    boxes.forEach((box, i) => {
      sharedDummy.position.set(box.x, box.y + Math.sin(t * box.speed + i) * 0.3, box.z);
      sharedDummy.rotation.set(0, t * box.speed * 0.3, 0);
      sharedDummy.scale.setScalar(box.scale);
      sharedDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, sharedDummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, boxes.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={boxMat2} attach="material" />
    </instancedMesh>
  );
}
