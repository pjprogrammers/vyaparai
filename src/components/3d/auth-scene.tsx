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

function AuthGeometry() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
    ref.current.position.y = Math.sin(t * 0.4) * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={[0, 0, -2]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.95}
          wireframe
          emissive="#6366f1"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function FloatingDots() {
  const ref = useRef<THREE.Points>(null!);
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 12;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 8;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 6 - 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#a5b4fc"
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
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.018, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.018, 0.05);
  });
  return null;
}

export function AuthScene3D({ className = "" }: { className?: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <MouseTracker ref={groupRef} />
        <group ref={groupRef}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} />
        <pointLight position={[-3, 3, 3]} intensity={0.4} color="#6366f1" />

        <AuthGeometry />
        <FloatingDots />

        </group>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.5} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.3} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
