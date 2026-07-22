"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function InventoryScene() {
  return (
    <group position={[6, -14, 0]}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#facc15" />
      <pointLight position={[0, 3, 4]} intensity={2} color="#f59e0b" distance={12} />
      <spotLight position={[-3, 6, 2]} intensity={2.5} angle={0.4} color="#facc15" penumbra={0.7} />

      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
        <WarehouseStructure />
      </Float>

      <ConveyorBelt />
      <InventoryBars />
      <FloatingBoxes />
    </group>
  );
}

function WarehouseStructure() {
  return (
    <group>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial
          color="#141414"
          metalness={0.8}
          roughness={0.2}
        />
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
        <mesh key={y} position={[0, y - 0.5, 0]}>
          <boxGeometry args={[0.8, 0.03, 0.6]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function ConveyorBelt() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.x = ((t * 0.5 + i * 0.8) % 4) - 2;
        }
      });
    }
  });

  return (
    <group ref={ref} position={[0, -1, 1.5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 0.3]} />
        <meshStandardMaterial
          color="#1a1a1a"
          emissive="#facc15"
          emissiveIntensity={0.05}
        />
      </mesh>

      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[i * 0.8 - 1.2, 0.15, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

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

  return (
    <group position={[0, -0.5, -1.5]} rotation={[0, 0, 0]}>
      {bars.map((bar, i) => (
        <InventoryBar key={i} {...bar} index={i} />
      ))}
    </group>
  );
}

function InventoryBar({
  x,
  maxHeight,
  speed,
  index,
}: {
  x: number;
  maxHeight: number;
  speed: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const pulse = Math.sin(t * speed + index * 0.5) * 0.3 + 0.7;
      ref.current.scale.y = pulse;
    }
  });

  return (
    <mesh ref={ref} position={[x, maxHeight / 2, 0]}>
      <boxGeometry args={[0.3, maxHeight, 0.1]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={0.6}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

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

  return (
    <>
      {boxes.map((box, i) => (
        <FloatingBox key={i} {...box} index={i} />
      ))}
    </>
  );
}

function FloatingBox({
  x,
  y,
  z,
  scale,
  speed,
  index,
}: {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = y + Math.sin(t * speed + index) * 0.3;
      ref.current.rotation.y = t * speed * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={[x, y, z]} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.7}
        roughness={0.3}
        emissive="#facc15"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}
