"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

export function HeroScene() {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#facc15" />
      <pointLight position={[-3, 2, 4]} intensity={1.5} color="#facc15" distance={15} />
      <pointLight position={[3, -2, 3]} intensity={0.8} color="#f59e0b" distance={12} />
      <spotLight position={[0, 8, 0]} intensity={2} angle={0.4} penumbra={0.8} color="#facc15" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <NeuralCore />
      </Float>

      <FloatingRings />
      <DataStreams />

      <Environment preset="night" />
    </group>
  );
}

function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.3;
      innerRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          emissive="#facc15"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={0.5}
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.4}
          chromaticAberration={0.15}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#facc15"
          color="#ffffff"
          transmission={1}
          roughness={0}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}

function FloatingRings() {
  const rings = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        radius: 2.5 + i * 0.6,
        speed: 0.2 + i * 0.05,
        rotationSpeed: 0.1 + i * 0.03,
        color: i % 2 === 0 ? "#facc15" : "#f59e0b",
      })),
    [],
  );

  return (
    <>
      {rings.map((ring, i) => (
        <FloatingRing key={i} {...ring} index={i} />
      ))}
    </>
  );
}

function FloatingRing({
  radius,
  speed,
  rotationSpeed,
  color,
  index,
}: {
  radius: number;
  speed: number;
  rotationSpeed: number;
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = Math.sin(t * rotationSpeed + index) * 0.5;
      ref.current.rotation.y = t * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function DataStreams() {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.5 + Math.random() * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo, speeds };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < arr.length / 3; i++) {
      arr[i * 3 + 1] += geometry.speeds[i] * 0.02;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry.geo}>
      <pointsMaterial
        size={0.04}
        color="#facc15"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
