"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function FloatingShape({
  position,
  color,
  speed = 0.5,
  shape,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
  shape: "box" | "sphere" | "torus" | "octahedron" | "cone" | "cylinder";
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const initialY = position[1];

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = initialY + Math.sin(t) * 0.5;
    ref.current.rotation.x += 0.002 * speed;
    ref.current.rotation.y += 0.003 * speed;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "box":
        return new THREE.BoxGeometry(1, 1, 1);
      case "sphere":
        return new THREE.SphereGeometry(0.6, 32, 32);
      case "torus":
        return new THREE.TorusGeometry(0.5, 0.2, 16, 32);
      case "octahedron":
        return new THREE.OctahedronGeometry(0.6);
      case "cone":
        return new THREE.ConeGeometry(0.5, 1, 32);
      case "cylinder":
        return new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
    }
  }, [shape]);

  return (
    <Float speed={speed * 2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={position} geometry={geometry} scale={scale}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (seededRandom(i + 1) - 0.5) * 25;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#818cf8"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function Scene3D({
  className = "",
  shapes,
  particles = true,
  intensity = 0.4,
}: {
  className?: string;
  shapes?: Array<{
    position: [number, number, number];
    color: string;
    speed: number;
    shape: "box" | "sphere" | "torus" | "octahedron" | "cone" | "cylinder";
    scale?: number;
  }>;
  particles?: boolean;
  intensity?: number;
}) {
  const defaultShapes = shapes ?? [
    { position: [-4, 2, -3], color: "#818cf8", speed: 0.4, shape: "box" as const, scale: 0.8 },
    { position: [4, -1, -4], color: "#6366f1", speed: 0.3, shape: "torus" as const, scale: 1 },
    { position: [2, 3, -5], color: "#a5b4fc", speed: 0.5, shape: "octahedron" as const, scale: 0.6 },
    { position: [-3, -2, -6], color: "#c7d2fe", speed: 0.35, shape: "sphere" as const, scale: 0.7 },
    { position: [5, 1, -4], color: "#6366f1", speed: 0.45, shape: "cone" as const, scale: 0.5 },
    { position: [-2, -3, -5], color: "#818cf8", speed: 0.25, shape: "cylinder" as const, scale: 0.6 },
  ];

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={intensity} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-5, -5, 5]} intensity={0.2} color="#818cf8" />

        {defaultShapes.map((s, i) => (
          <FloatingShape key={i} {...s} />
        ))}
        {particles && <Particles />}

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.4} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.3} darkness={0.4} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
