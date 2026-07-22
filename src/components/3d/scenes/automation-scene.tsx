"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useSceneVisible } from "../camera-rig";

export function AutomationScene() {
  return (
    <group position={[5, -38, 0]}>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 2, 4]} intensity={2.5} color="#facc15" distance={12} />
      <spotLight position={[0, 5, 0]} intensity={2} angle={0.5} color="#facc15" penumbra={0.8} />

      <AutomationPipeline />
      <FlowParticles />
      <NodeGraph />
    </group>
  );
}

const PIPELINE_NODES = [
  { pos: [-3, 1, 0] as [number, number, number], label: "Invoice" },
  { pos: [-1.5, 0, 0] as [number, number, number], label: "OCR" },
  { pos: [0, 1, 0] as [number, number, number], label: "Inventory" },
  { pos: [1.5, 0, 0] as [number, number, number], label: "GST" },
  { pos: [3, 1, 0] as [number, number, number], label: "Reports" },
];

function AutomationPipeline() {
  return (
    <group>
      {PIPELINE_NODES.map((node, i) => (
        <PipelineNode key={i} {...node} index={i} />
      ))}

      {PIPELINE_NODES.slice(0, -1).map((node, i) => (
        <ConnectionLine
          key={i}
          from={node.pos}
          to={PIPELINE_NODES[i + 1].pos}
          index={i}
        />
      ))}
    </group>
  );
}

function PipelineNode({
  pos,
  index,
}: {
  pos: [number, number, number];
  label: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const visible = useSceneVisible(5);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.scale.setScalar(Math.sin(t * 2 + index * 0.8) * 0.15 + 1);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity =
        (Math.sin(t * 1.5 + index * 0.6) * 0.3 + 0.7) * 0.2;
    }
  });

  return (
    <group position={pos}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
          emissive="#facc15"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh ref={glowRef} scale={1.5}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={2}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

function ConnectionLine({
  from,
  to,
  index,
}: {
  from: [number, number, number];
  to: [number, number, number];
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const visible = useSceneVisible(5);

  const midPoint = useMemo(() => {
    return [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.2,
      (from[2] + to[2]) / 2,
    ] as [number, number, number];
  }, [from, to]);

  const length = useMemo(() => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    return Math.sqrt(dx * dx + dy * dy);
  }, [from, to]);

  const angle = useMemo(() => {
    return Math.atan2(to[1] - from[1], to[0] - from[0]);
  }, [from, to]);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    (ref.current.material as THREE.MeshStandardMaterial).opacity =
      (Math.sin(state.clock.elapsedTime * 3 + index * 1.2) * 0.3 + 0.7) * 0.6;
  });

  return (
    <mesh
      ref={ref}
      position={midPoint}
      rotation={[0, 0, angle]}
    >
      <planeGeometry args={[length, 0.02]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FlowParticles() {
  const ref = useRef<THREE.Points>(null!);
  const visible = useSceneVisible(5);

  const { geo, speeds } = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      spd[i] = 0.5 + Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo: geometry, speeds: spd };
  }, []);

  useFrame(() => {
    if (!visible || !ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0, len = arr.length / 3; i < len; i++) {
      arr[i * 3] += speeds[i] * 0.015;
      if (arr[i * 3] > 4) arr[i * 3] = -4;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.03}
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

function NodeGraph() {
  const nodes = useMemo(() => {
    const result: { pos: [number, number, number]; speed: number }[] = [];
    for (let i = 0; i < 30; i++) {
      result.push({
        pos: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 2,
        ],
        speed: 0.3 + Math.random() * 1,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {nodes.map((node, i) => (
        <GraphDot key={i} position={node.pos} speed={node.speed} index={i} />
      ))}
    </group>
  );
}

function GraphDot({
  position,
  speed,
  index,
}: {
  position: [number, number, number];
  speed: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const visible = useSceneVisible(5);

  useFrame((state) => {
    if (!visible || !ref.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * speed + index) * 0.3 + 0.7;
    ref.current.scale.setScalar(pulse);
    (ref.current.material as THREE.MeshStandardMaterial).opacity = pulse * 0.4;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={1.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}
