"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";
import { getTransmissionSamples } from "../responsive-context";

export function CTAScene() {
  return (
    <group position={[0, -50, 0]}>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 3]} intensity={4} color="#facc15" distance={15} />
      <spotLight position={[0, 5, 0]} intensity={3} angle={0.6} color="#facc15" penumbra={1} />

      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <ConvergingParticles />
      </Float>

      <LogoFormation />
      <EnergyRings />
    </group>
  );
}

/* Shared converging particles material */
const convParticleMat = new THREE.PointsMaterial({
  size: 0.035, color: "#facc15", transparent: true, opacity: 0.7,
  sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
});

function ConvergingParticles() {
  const ref = useRef<THREE.Points>(null!);
  const visible = useSceneVisible(7);

  const { geometry, velocities } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3] = -positions[i * 3] * 0.002;
      vel[i * 3 + 1] = -positions[i * 3 + 1] * 0.002;
      vel[i * 3 + 2] = -positions[i * 3 + 2] * 0.002;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities: vel };
  }, []);

  useFrame(() => {
    if (!visible || !ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0, len = arr.length / 3; i < len; i++) {
      const i3 = i * 3;
      if (arr[i3] * arr[i3] + arr[i3 + 1] * arr[i3 + 1] + arr[i3 + 2] * arr[i3 + 2] < 0.25) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 4;
        arr[i3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i3 + 2] = r * Math.cos(phi);
      }
      arr[i3] += velocities[i3];
      arr[i3 + 1] += velocities[i3 + 1];
      arr[i3 + 2] += velocities[i3 + 2];
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry} material={convParticleMat} />
  );
}

/* Module-level shared materials for LogoFormation */
const logoRingYellow = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 2, transparent: true, opacity: 0.7 });
const logoRingAmber = new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 1.5, transparent: true, opacity: 0.4 });
const logoRingGold = new THREE.MeshStandardMaterial({ color: "#eab308", emissive: "#eab308", emissiveIntensity: 1.5, transparent: true, opacity: 0.4 });

function LogoFormation() {
  const ref = useRef<THREE.Group>(null!);
  const visible = useSceneVisible(7);
  const samples = useMemo(() => getTransmissionSamples(), []);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh material={logoRingYellow}>
        <torusGeometry args={[1.2, 0.05, 8, 32]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={logoRingAmber}>
        <torusGeometry args={[1.2, 0.03, 8, 32]} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} material={logoRingGold}>
        <torusGeometry args={[1.2, 0.03, 8, 32]} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshTransmissionMaterial
          backside samples={samples} thickness={0.2} chromaticAberration={0.15}
          anisotropy={0.2} distortion={0.1} distortionScale={0.2} temporalDistortion={0.1}
          iridescence={1} clearcoat={1} attenuationDistance={0.5}
          attenuationColor="#facc15" color="#ffffff" transmission={1} roughness={0} ior={1.5}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={5} color="#facc15" distance={5} decay={2} />
    </group>
  );
}

/* Module-level shared material for EnergyRings */
const energyRingMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 1, transparent: true, opacity: 0.3 });

function EnergyRings() {
  const rings = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      radius: 1.8 + i * 0.4, speed: 0.3 + i * 0.05, rotationSpeed: 0.2 + i * 0.03,
    })),
    [],
  );

  return (
    <>
      {rings.map((ring, i) => (
        <EnergyRing key={i} {...ring} index={i} />
      ))}
    </>
  );
}

function EnergyRing({ radius, speed, rotationSpeed, index }: {
  radius: number; speed: number; rotationSpeed: number; index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const visible = useSceneVisible(7);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(t * rotationSpeed + index) * 0.5;
    ref.current.rotation.y = t * speed;
  });

  return (
    <mesh ref={ref} material={energyRingMat}>
      <torusGeometry args={[radius, 0.005, 8, 32]} />
    </mesh>
  );
}
