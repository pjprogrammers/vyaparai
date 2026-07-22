"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

export function DashboardScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#facc15" />
      <pointLight position={[0, 3, 4]} intensity={1.5} color="#facc15" distance={12} />
      <FloatingCubes />
      <WireframeSpheres />
      <DashboardPanel />
      <Particles count={150} />
      <MouseParallax />
      <Environment preset="night" />
    </Canvas>
  );
}

function FloatingCubes() {
  const cubes = useMemo(
    () => [
      { pos: [-3, 0, 0] as [number, number, number], speed: 0.3 },
      { pos: [0, 1, -1] as [number, number, number], speed: 0.5 },
      { pos: [3, -1, 0] as [number, number, number], speed: 0.4 },
    ],
    [],
  );
  return (
    <>
      {cubes.map((cube, i) => (
        <FloatingCube key={i} position={cube.pos} speed={cube.speed} />
      ))}
    </>
  );
}

function FloatingCube({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * speed;
      ref.current.rotation.y = t * speed * 0.5;
      ref.current.position.y = position[1] + Math.sin(t * speed) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} emissive="#facc15" emissiveIntensity={0.2} transparent opacity={0.6} />
    </mesh>
  );
}

function WireframeSpheres() {
  return (
    <>
      <WireframeSphere position={[-2, 1, -1]} speed={0.1} />
      <WireframeSphere position={[2, 1, -1]} speed={0.15} />
    </>
  );
}

function WireframeSphere({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.3} transparent opacity={0.15} wireframe />
    </mesh>
  );
}

function DashboardPanel() {
  return (
    <group position={[0, 0, -2]}>
      <mesh>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.3} />
      </mesh>
      {[0.3, 0.6, 0.9].map((h, i) => (
        <mesh key={i} position={[-0.8 + i * 0.8, h / 2 - 0.5, 0.01]}>
          <boxGeometry args={[0.3, h, 0.02]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.02} color="#facc15" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function MouseParallax() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.3, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.2, 0.05);
  });
  return null;
}
