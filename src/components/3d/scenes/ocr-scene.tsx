"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";
import { sharedDummy } from "../scene-cache";

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

const docMat = new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.3, roughness: 0.7, emissive: "#facc15", emissiveIntensity: 0.05 });
const lineMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.5, transparent: true, opacity: 0.4 });
const tableMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 0.3, transparent: true, opacity: 0.3 });
const summaryMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.8, transparent: true, opacity: 0.15 });

function InvoiceDocument() {
  const ref = useRef<THREE.Group>(null!);
  const visible = useSceneVisible(1);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.1;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} material={docMat}>
        <planeGeometry args={[2.5, 3.5]} />
      </mesh>

      {[0.8, 0.4, 0, -0.4, -0.8].map((y, i) => (
        <mesh key={i} position={[-0.5, y, 0.01]} material={lineMat}>
          <planeGeometry args={[1.5, 0.06]} />
        </mesh>
      ))}

      {[0.6, 0.1, -0.3].map((y, i) => (
        <mesh key={`table-${i}`} position={[0.3, y, 0.01]} material={tableMat}>
          <planeGeometry args={[1.2, 0.03]} />
        </mesh>
      ))}

      <mesh position={[0.6, -1.2, 0.01]} material={summaryMat}>
        <planeGeometry args={[1.0, 0.25]} />
      </mesh>
    </group>
  );
}

const laserMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 3, transparent: true, opacity: 0.8 });

function LaserScanner() {
  const ref = useRef<THREE.Mesh>(null!);
  const visible = useSceneVisible(1);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 1.5;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.1]} material={laserMat}>
      <planeGeometry args={[3, 0.02]} />
    </mesh>
  );
}

/* InstancedMesh for floating characters — 26 individual meshes → 1 */
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

  return <FloatingCharsInstanced chars={chars} />;
}

function FloatingCharsInstanced({
  chars,
}: {
  chars: { char: string; x: number; y: number; z: number; speed: number; phase: number }[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(1);

  const charMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#facc15",
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.4,
  }), []);

  useFrame((state) => {
    if (!visible || !meshRef.current) return;
    const t = state.clock.elapsedTime;

    chars.forEach((c, i) => {
      sharedDummy.position.set(
        c.x,
        c.y + Math.sin(t * c.speed + c.phase) * 0.2,
        c.z,
      );
      sharedDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, sharedDummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, chars.length]}>
      <boxGeometry args={[0.08, 0.08, 0.01]} />
      <primitive object={charMat} attach="material" />
    </instancedMesh>
  );
}

/* InstancedMesh for 6 output bars — 6 draw calls → 1 */
function OutputDisplay() {
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
    <group rotation={[-0.3, 0, 0]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#facc15" emissiveIntensity={0.03} />
      </mesh>

      <OutputBarsInstanced bars={bars} />
    </group>
  );
}

function OutputBarsInstanced({
  bars,
}: {
  bars: { x: number; height: number; delay: number }[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(1);

  const barMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#facc15",
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.6,
  }), []);

  useFrame((state) => {
    if (!visible || !meshRef.current) return;
    const t = state.clock.elapsedTime;

    bars.forEach((bar, i) => {
      const scaleY = Math.min(1, Math.max(0, (t - bar.delay) * 2));
      sharedDummy.position.set(bar.x, bar.height / 2 - 0.5, 0.01);
      sharedDummy.scale.set(0.2, bar.height * scaleY, 0.02);
      sharedDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, sharedDummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, bars.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={barMat} attach="material" />
    </instancedMesh>
  );
}
