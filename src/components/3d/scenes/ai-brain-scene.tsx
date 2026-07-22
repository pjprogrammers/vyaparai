"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";
import { sharedDummy } from "../scene-cache";
import { getTransmissionSamples } from "../responsive-context";

export function AIBrainScene() {
  return (
    <group position={[0, -30, 0]}>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#facc15" distance={15} />
      <pointLight position={[3, 2, 3]} intensity={1.5} color="#f59e0b" distance={10} />

      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <AICore />
      </Float>

      <NeuralNetwork />
      <EnergyField />
    </group>
  );
}

const innerMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 3, transparent: true, opacity: 0.8, wireframe: true });
const midMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 1.5, transparent: true, opacity: 0.3, wireframe: true });
const outerMat = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.8, transparent: true, opacity: 0.15, wireframe: true });
const innerGeo = new THREE.IcosahedronGeometry(0.6, 3);
const midGeo = new THREE.DodecahedronGeometry(1.0, 0);
const outerGeo = new THREE.IcosahedronGeometry(1.5, 1);

function AICore() {
  const innerRef = useRef<THREE.Mesh>(null!);
  const midRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const visible = useSceneVisible(4);
  const samples = useMemo(() => getTransmissionSamples(), []);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.4;
      innerRef.current.rotation.y = t * 0.3;
    }
    if (midRef.current) {
      midRef.current.rotation.x = -t * 0.2;
      midRef.current.rotation.z = t * 0.15;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={innerRef} geometry={innerGeo} material={innerMat} />
      <mesh ref={midRef} geometry={midGeo} material={midMat} />
      <mesh ref={outerRef} geometry={outerGeo} material={outerMat} />

      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={samples}
          thickness={0.3}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.15}
          iridescence={1}
          iridescenceIOR={1}
          clearcoat={1}
          attenuationDistance={0.3}
          attenuationColor="#facc15"
          color="#ffffff"
          transmission={1}
          roughness={0}
          ior={1.5}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={5} color="#facc15" distance={8} decay={2} />
    </group>
  );
}

/* InstancedMesh for 24 neural nodes — 24 draw calls → 1 */
function NeuralNetwork() {
  const nodes = useMemo(() => {
    const result: { pos: [number, number, number]; connections: number[] }[] = [];
    const count = 24;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.5;

      result.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        connections: [],
      });
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = result[i].pos[0] - result[j].pos[0];
        const dy = result[i].pos[1] - result[j].pos[1];
        const dz = result[i].pos[2] - result[j].pos[2];
        if (dx * dx + dy * dy + dz * dz < 4) {
          result[i].connections.push(j);
        }
      }
    }

    return result;
  }, []);

  return (
    <group>
      <NeuralNodesInstanced nodes={nodes} />
      <NeuralConnections nodes={nodes} />
    </group>
  );
}

function NeuralNodesInstanced({
  nodes,
}: {
  nodes: { pos: [number, number, number]; connections: number[] }[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const visible = useSceneVisible(4);

  const nodeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#facc15",
    emissiveIntensity: 2,
  }), []);

  useFrame((state) => {
    if (!visible || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < nodes.length; i++) {
      const s = Math.sin(t * 2 + i * 0.5) * 0.3 + 0.7;
      sharedDummy.position.set(nodes[i].pos[0], nodes[i].pos[1], nodes[i].pos[2]);
      sharedDummy.scale.setScalar(s);
      sharedDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, sharedDummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <primitive object={nodeMat} attach="material" />
    </instancedMesh>
  );
}

const connMat = new THREE.LineBasicMaterial({ color: "#facc15", transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false });

function NeuralConnections({
  nodes,
}: {
  nodes: { pos: [number, number, number]; connections: number[] }[];
}) {
  const geometry = useMemo(() => {
    const maxEdges = nodes.reduce((acc, n) => acc + n.connections.length, 0);
    const positions = new Float32Array(maxEdges * 6);
    let idx = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (const j of nodes[i].connections) {
        positions[idx++] = nodes[i].pos[0];
        positions[idx++] = nodes[i].pos[1];
        positions[idx++] = nodes[i].pos[2];
        positions[idx++] = nodes[j].pos[0];
        positions[idx++] = nodes[j].pos[1];
        positions[idx++] = nodes[j].pos[2];
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(0, idx), 3));
    return geo;
  }, [nodes]);

  return (
    <lineSegments geometry={geometry} material={connMat} />
  );
}

function EnergyField() {
  const ref = useRef<THREE.Points>(null!);
  const visible = useSceneVisible(4);

  const geometry = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.05;
    ref.current.rotation.x = t * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#facc15"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
