"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";

function useAspectScale() {
  const s = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1;
  if (s < 0.6) return 0.55;
  if (s < 0.85) return 0.7;
  if (s > 2) return 1.3;
  return 1;
}

export function HeroScene() {
  const sceneScale = useAspectScale();

  return (
    <group scale={[sceneScale, sceneScale, sceneScale]}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#facc15" />
      <pointLight position={[-3, 2, 4]} intensity={1.5} color="#facc15" distance={15} />
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
  const visible = useSceneVisible(0);

  useFrame((state) => {
    if (!visible) return;
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
          samples={4}
          thickness={0.3}
          chromaticAberration={0.1}
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
  const ar = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1;
  const baseRadius = ar < 0.6 ? 1.6 : ar < 0.85 ? 2 : 2.5;

  const rings = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        radius: baseRadius + i * 0.6,
        speed: 0.2 + i * 0.05,
        rotationSpeed: 0.1 + i * 0.03,
        color: i % 2 === 0 ? "#facc15" : "#f59e0b",
      })),
    [baseRadius],
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
  const visible = useSceneVisible(0);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(t * rotationSpeed + index) * 0.5;
    ref.current.rotation.y = t * speed;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 8, 32]} />
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
  const visible = useSceneVisible(0);

  const ar = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1;
  const spread = ar < 0.6 ? 2.5 : ar < 0.85 ? 3.5 : 5;

  const { geo, speeds } = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * spread;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      spd[i] = 0.5 + Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo: geometry, speeds: spd };
  }, [spread]);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0, len = arr.length / 3; i < len; i++) {
      arr[i * 3 + 1] += speeds[i] * 0.02;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
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
