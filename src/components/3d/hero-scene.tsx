"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function GlassSphere({ position, scale = 1, speed = 0.5 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.z = t * 0.1;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.4}
          chromaticAberration={0.15}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#6366f1"
          color="#c7d2fe"
          transmission={0.95}
          roughness={0}
          ior={1.5}
        />
      </mesh>
    </Float>
  );
}

function WireframeOctahedron({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.3;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#818cf8"
        transparent
        opacity={0.15}
        wireframe
        emissive="#6366f1"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function TorusKnot({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.y = t * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * 0.3) * 0.15;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
      <meshStandardMaterial
        color="#a5b4fc"
        transparent
        opacity={0.12}
        roughness={0.1}
        metalness={0.9}
        emissive="#6366f1"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 30;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 20;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 15 - 5;
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = seededRandom(i + 100) * 0.04 + 0.01;
    }
    return s;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#818cf8"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlowRing({ radius = 3, tube = 0.02, color = "#6366f1" }: { radius?: number; tube?: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.05;
    ref.current.rotation.z = state.clock.elapsedTime * 0.03;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 32, 128]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.08}
        emissive={color}
        emissiveIntensity={2}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

function MouseTracker({ ref }: { ref: React.RefObject<THREE.Group> }) {
  const { viewport } = useThree();
  useFrame((state) => {
    if (!ref.current) return;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.015, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.015, 0.05);
  });
  return null;
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <>
      <MouseTracker ref={groupRef} />
      <group ref={groupRef}>      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} />
      <pointLight position={[-10, -10, 5]} intensity={0.3} color="#6366f1" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#818cf8" />

      <GlassSphere position={[-2.5, 0.5, -2]} scale={0.8} speed={0.4} />
      <GlassSphere position={[3, -0.5, -3]} scale={0.5} speed={0.6} />
      <WireframeOctahedron position={[2, 1.5, -4]} scale={0.7} />
      <WireframeOctahedron position={[-3, -1.5, -5]} scale={0.4} />
      <TorusKnot position={[0, 0, -6]} scale={0.6} />

      <GlowRing radius={4} tube={0.015} color="#6366f1" />
      <GlowRing radius={5.5} tube={0.01} color="#818cf8" />

      <ParticleField />

      <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={20} blur={2} far={4} />

      <Environment preset="night" />

      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

export function HeroScene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
