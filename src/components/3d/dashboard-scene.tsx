"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function FloatingCube({ position, color, speed = 0.5, scale = 1 }: { position: [number, number, number]; color: string; speed?: number; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function WireframeSphere({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#a5b4fc"
        transparent
        opacity={0.08}
        wireframe
        emissive="#6366f1"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function DashboardPanel({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.3) * 0.1;
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial
          color="#1e293b"
          transparent
          opacity={0.3}
          roughness={0.2}
        />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.8 + i * 0.8, -0.5, 0.02]}>
          <boxGeometry args={[0.6, 0.3, 0.01]} />
          <meshStandardMaterial
            color="#6366f1"
            transparent
            opacity={0.3}
            emissive="#6366f1"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 25;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 15;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
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

function MouseTracker({ ref }: { ref: React.RefObject<THREE.Group> }) {
  const { viewport } = useThree();
  useFrame((state) => {
    if (!ref.current) return;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.012, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.012, 0.05);
  });
  return null;
}

export function DashboardScene3D({ className = "" }: { className?: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <MouseTracker ref={groupRef} />
        <group ref={groupRef}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-5, -5, 5]} intensity={0.2} color="#6366f1" />

        <FloatingCube position={[-4, 2, -3]} color="#6366f1" speed={0.3} scale={0.6} />
        <FloatingCube position={[4, -1, -4]} color="#818cf8" speed={0.4} scale={0.4} />
        <FloatingCube position={[2, 3, -5]} color="#a5b4fc" speed={0.35} scale={0.3} />

        <WireframeSphere position={[3, 2, -6]} scale={0.8} />
        <WireframeSphere position={[-3, -2, -7]} scale={0.5} />

        <DashboardPanel position={[0, 0, -4]} rotation={[0, 0, 0]} />

        <Particles />

        </group>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.4} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.3} darkness={0.4} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
