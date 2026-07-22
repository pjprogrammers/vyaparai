"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";
import { sharedDummy } from "../scene-cache";

export function AnalyticsScene() {
  return (
    <group position={[-5, -22, 0]}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 4]} intensity={0.6} color="#facc15" />
      <pointLight position={[0, 3, 3]} intensity={2} color="#facc15" distance={12} />
      <spotLight position={[2, 5, 3]} intensity={2} angle={0.35} color="#f59e0b" penumbra={0.8} />
      <Float speed={0.7} rotationIntensity={0.05} floatIntensity={0.4}>
        <DashboardPanel />
      </Float>
      <BarChart3D />
      <PieChart3D />
      <LineChart3D />
    </group>
  );
}

const panelBg = new THREE.MeshStandardMaterial({ color: "#0a0a0a", metalness: 0.5, roughness: 0.5, emissive: "#facc15", emissiveIntensity: 0.02 });
const panelOverlay = new THREE.MeshStandardMaterial({ color: "#141414", transparent: true, opacity: 0.5 });
const headerMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.8, transparent: true, opacity: 0.6 });
const subtitleMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.3, transparent: true, opacity: 0.3 });
const sidebarMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 0.3, transparent: true, opacity: 0.25 });
const barChartBg = new THREE.MeshStandardMaterial({ color: "#0a0a0a", transparent: true, opacity: 0.3 });

function DashboardPanel() {
  const ref = useRef<THREE.Group>(null!);
  const visible = useSceneVisible(3);
  useFrame((state) => {
    if (!visible || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.15) * 0.03;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0, -0.05]} material={panelBg}><planeGeometry args={[5, 3.5]} /></mesh>
      <mesh position={[0, 0, -0.03]} material={panelOverlay}><planeGeometry args={[5, 3.5]} /></mesh>
      <mesh position={[-1.8, 1.3, -0.01]} material={headerMat}><planeGeometry args={[1.5, 0.08]} /></mesh>
      <mesh position={[-0.8, 1.3, -0.01]} material={subtitleMat}><planeGeometry args={[0.8, 0.06]} /></mesh>
      {[0.3, 0.6, 0.9, 1.2].map((y, i) => (
        <mesh key={i} position={[-2, y - 0.3, -0.01]} material={sidebarMat}><planeGeometry args={[0.5, 0.04]} /></mesh>
      ))}
    </group>
  );
}

function BarChart3D() {
  const bars = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    x: -1.8 + i * 0.5, maxHeight: 0.3 + Math.random() * 1.2, speed: 0.5 + Math.random() * 1,
  })), []);
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(3);
  const barMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.6, transparent: true, opacity: 0.5 }), []);
  useFrame((state) => {
    if (!visible || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    bars.forEach((bar, i) => {
      const s = 0.3 + ((Math.sin(t * bar.speed + i * 0.4) + 1) / 2) * 0.7;
      sharedDummy.position.set(bar.x, bar.maxHeight / 2, 0);
      sharedDummy.scale.set(0.3, bar.maxHeight * s, 0.08);
      sharedDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, sharedDummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[1.5, -0.8, 0.5]} rotation={[0.2, -0.3, 0]}>
      <mesh position={[0, -0.05, -0.05]} material={barChartBg}><planeGeometry args={[4.5, 2]} /></mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, bars.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={barMat} attach="material" />
      </instancedMesh>
    </group>
  );
}

function PieChart3D() {
  const ref = useRef<THREE.Group>(null!);
  const visible = useSceneVisible(3);
  const segments = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    startAngle: (i / 6) * Math.PI * 2, endAngle: ((i + 1) / 6) * Math.PI * 2,
    color: i % 2 === 0 ? "#facc15" : "#f59e0b", opacity: 0.4 + i * 0.05,
  })), []);
  useFrame((state) => {
    if (!visible || !ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.2;
  });
  return (
    <group ref={ref} position={[-2, -1.2, 0.8]} rotation={[0.4, 0.2, 0]}>
      {segments.map((seg, i) => (
        <mesh key={i} rotation={[0, 0, seg.startAngle]}>
          <ringGeometry args={[0.4 + i * 0.12, 0.5 + i * 0.12, 16, 1, seg.startAngle, seg.endAngle - seg.startAngle]} />
          <meshStandardMaterial color={seg.color} emissive={seg.color} emissiveIntensity={0.5} transparent opacity={seg.opacity} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function LineChart3D() {
  const dotsRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(3);
  const dotMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 1.5, transparent: true, opacity: 0.7 }), []);
  useFrame((state) => {
    if (!visible || !dotsRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < 20; i++) {
      const x = (i / 19) * 3 - 1.5;
      const y = Math.sin(t * 0.5 + i * 0.5) * 0.4 + Math.cos(t * 0.3 + i * 0.3) * 0.2;
      sharedDummy.position.set(x, y, 0);
      sharedDummy.updateMatrix();
      dotsRef.current.setMatrixAt(i, sharedDummy.matrix);
    }
    dotsRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[0, 1.2, 0.5]}>
      <instancedMesh ref={dotsRef} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <primitive object={dotMat} attach="material" />
      </instancedMesh>
    </group>
  );
}
