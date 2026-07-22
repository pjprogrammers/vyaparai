"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function OCRScene() {
  return (
    <group position={[0, -8, 0]}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 5, 5]} intensity={0.6} color="#facc15" />
      <pointLight position={[0, 2, 3]} intensity={2} color="#facc15" distance={10} />
      <spotLight position={[0, 6, 0]} intensity={3} angle={0.3} color="#facc15" penumbra={0.8} />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
        <InvoiceDocument />
      </Float>

      <LaserScanner />
      <FloatingCharacters />

      <group position={[0, -3, 0]}>
        <OutputDisplay />
      </group>
    </group>
  );
}

function InvoiceDocument() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.3) * 0.1;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.7}
          emissive="#facc15"
          emissiveIntensity={0.05}
        />
      </mesh>

      {[0.8, 0.4, 0, -0.4, -0.8].map((y, i) => (
        <mesh key={i} position={[-0.5, y, 0.01]}>
          <planeGeometry args={[1.5, 0.06]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={0.5}
            transparent
            opacity={0.4 + i * 0.05}
          />
        </mesh>
      ))}

      {[0.6, 0.1, -0.3].map((y, i) => (
        <mesh key={`table-${i}`} position={[0.3, y, 0.01]}>
          <planeGeometry args={[1.2, 0.03]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      <mesh position={[0.6, -1.2, 0.01]}>
        <planeGeometry args={[1.0, 0.25]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

function LaserScanner() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 1.5) * 1.5;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={[0, 0, 0.1]}>
        <planeGeometry args={[3, 0.02]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {[0.1, -0.1].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <planeGeometry args={[3, 1.5]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={0.5}
            transparent
            opacity={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingCharacters() {
  const chars = useMemo(() => {
    const text = "INVOICE GST TAX ITEM TOTAL";
    return text.split("").map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 3,
      z: (Math.random() - 0.5) * 2 + 0.5,
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <group>
      {chars.map((c, i) => (
        <FloatingChar key={i} {...c} />
      ))}
    </group>
  );
}

function FloatingChar({
  x,
  y,
  z,
  speed,
  phase,
}: {
  char: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = y + Math.sin(t * speed + phase) * 0.2;
      (ref.current.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(t * speed + phase) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <boxGeometry args={[0.08, 0.08, 0.01]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={1}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function OutputDisplay() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = -0.3;
    }
  });

  const bars = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: -0.8 + i * 0.32,
        height: 0.3 + Math.random() * 0.8,
        delay: i * 0.15,
      })),
    [],
  );

  return (
    <group ref={ref}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#facc15"
          emissiveIntensity={0.03}
        />
      </mesh>

      {bars.map((bar, i) => (
        <OutputBar key={i} {...bar} />
      ))}
    </group>
  );
}

function OutputBar({
  x,
  height,
  delay,
}: {
  x: number;
  height: number;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const scale = Math.min(1, Math.max(0, (t - delay) * 2));
      ref.current.scale.y = scale;
    }
  });

  return (
    <mesh ref={ref} position={[x, height / 2 - 0.5, 0.01]}>
      <boxGeometry args={[0.2, height, 0.02]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
