"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function MouseTracker({ ref }: { ref: React.RefObject<THREE.Group> }) {
  const { viewport } = useThree();
  useFrame((state) => {
    if (!ref.current) return;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.02, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.02, 0.05);
  });
  return null;
}

function GlassSphere({
  position,
  scale = 1,
  speed = 0.4,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
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

function WireframeShape({
  position,
  scale = 1,
  shape = "octahedron",
  speed = 0.3,
}: {
  position: [number, number, number];
  scale?: number;
  shape?: "octahedron" | "icosahedron" | "dodecahedron";
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.3;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "icosahedron":
        return new THREE.IcosahedronGeometry(1, 0);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1, 0);
      default:
        return new THREE.OctahedronGeometry(1, 0);
    }
  }, [shape]);

  return (
    <mesh ref={ref} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color="#818cf8"
        transparent
        opacity={0.12}
        wireframe
        emissive="#6366f1"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function FloatingTorus({
  position,
  scale = 1,
  speed = 0.25,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.y = t * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * 0.3) * 0.15;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#a5b4fc"
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.9}
          emissive="#6366f1"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function GlowRing({
  radius = 3,
  tube = 0.015,
  color = "#6366f1",
}: {
  radius?: number;
  tube?: number;
  color?: string;
}) {
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
        opacity={0.06}
        emissive={color}
        emissiveIntensity={2}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

function Particles({ count = 150 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 30;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 20;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.rotation.x = state.clock.elapsedTime * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#818cf8"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export type MarketingSceneTheme =
  | "default"
  | "invoice"
  | "inventory"
  | "customer"
  | "insights"
  | "solution"
  | "blog"
  | "about"
  | "contact";

const themes: Record<
  MarketingSceneTheme,
  {
    glass: Array<{ position: [number, number, number]; scale: number; speed: number }>;
    wireframes: Array<{
      position: [number, number, number];
      scale: number;
      shape: "octahedron" | "icosahedron" | "dodecahedron";
    }>;
    torus: Array<{ position: [number, number, number]; scale: number }>;
    rings: Array<{ radius: number; color: string }>;
    particles: number;
  }
> = {
  default: {
    glass: [
      { position: [-2.5, 0.5, -2], scale: 0.7, speed: 0.4 },
      { position: [3, -0.5, -3], scale: 0.45, speed: 0.55 },
    ],
    wireframes: [
      { position: [2, 1.5, -4], scale: 0.6, shape: "octahedron" },
      { position: [-3, -1.5, -5], scale: 0.35, shape: "icosahedron" },
    ],
    torus: [{ position: [0, 0, -6], scale: 0.5 }],
    rings: [
      { radius: 4, color: "#6366f1" },
      { radius: 5.5, color: "#818cf8" },
    ],
    particles: 150,
  },
  invoice: {
    glass: [
      { position: [-2, 1, -2], scale: 0.6, speed: 0.35 },
      { position: [2.5, -1, -3], scale: 0.4, speed: 0.5 },
    ],
    wireframes: [
      { position: [3, 0.5, -4], scale: 0.5, shape: "dodecahedron" },
      { position: [-1.5, -2, -5], scale: 0.3, shape: "octahedron" },
    ],
    torus: [{ position: [1, 2, -6], scale: 0.4 }],
    rings: [{ radius: 4.5, color: "#6366f1" }],
    particles: 120,
  },
  inventory: {
    glass: [
      { position: [-3, 0, -2], scale: 0.55, speed: 0.45 },
      { position: [2, 1, -3], scale: 0.35, speed: 0.6 },
    ],
    wireframes: [
      { position: [1, -1.5, -4], scale: 0.55, shape: "icosahedron" },
      { position: [-2, 2, -5], scale: 0.4, shape: "dodecahedron" },
      { position: [3, -0.5, -6], scale: 0.3, shape: "octahedron" },
    ],
    torus: [],
    rings: [{ radius: 5, color: "#818cf8" }],
    particles: 130,
  },
  customer: {
    glass: [
      { position: [-1.5, 0.5, -2], scale: 0.65, speed: 0.4 },
      { position: [3, 0, -3.5], scale: 0.35, speed: 0.5 },
    ],
    wireframes: [
      { position: [1, 2, -4], scale: 0.45, shape: "octahedron" },
      { position: [-2.5, -1, -5], scale: 0.35, shape: "icosahedron" },
    ],
    torus: [{ position: [0, -2, -6], scale: 0.45 }],
    rings: [
      { radius: 3.5, color: "#6366f1" },
      { radius: 5, color: "#818cf8" },
    ],
    particles: 140,
  },
  insights: {
    glass: [
      { position: [-2, 1.5, -2], scale: 0.5, speed: 0.3 },
      { position: [2.5, -0.5, -3], scale: 0.4, speed: 0.45 },
    ],
    wireframes: [
      { position: [0, 0, -4], scale: 0.6, shape: "dodecahedron" },
      { position: [-3, -2, -5], scale: 0.3, shape: "octahedron" },
    ],
    torus: [{ position: [2, 2, -6], scale: 0.35 }],
    rings: [{ radius: 4, color: "#6366f1" }],
    particles: 160,
  },
  solution: {
    glass: [
      { position: [-2.5, 0, -2], scale: 0.6, speed: 0.4 },
      { position: [2, 1, -3], scale: 0.4, speed: 0.5 },
    ],
    wireframes: [
      { position: [1, -1.5, -4], scale: 0.5, shape: "icosahedron" },
      { position: [-1, 2, -5], scale: 0.35, shape: "dodecahedron" },
    ],
    torus: [{ position: [0, 0, -6], scale: 0.4 }],
    rings: [
      { radius: 4.5, color: "#6366f1" },
      { radius: 6, color: "#818cf8" },
    ],
    particles: 130,
  },
  blog: {
    glass: [
      { position: [-2, 0.5, -2.5], scale: 0.5, speed: 0.35 },
    ],
    wireframes: [
      { position: [2, 1, -4], scale: 0.45, shape: "octahedron" },
      { position: [-1, -2, -5], scale: 0.3, shape: "icosahedron" },
    ],
    torus: [{ position: [1, -1, -6], scale: 0.35 }],
    rings: [{ radius: 5, color: "#818cf8" }],
    particles: 100,
  },
  about: {
    glass: [
      { position: [-2, 1, -2], scale: 0.6, speed: 0.4 },
      { position: [2.5, -0.5, -3], scale: 0.4, speed: 0.5 },
    ],
    wireframes: [
      { position: [0, 2, -4], scale: 0.5, shape: "dodecahedron" },
      { position: [-3, -1, -5], scale: 0.35, shape: "octahedron" },
    ],
    torus: [{ position: [1, 0, -6], scale: 0.4 }],
    rings: [
      { radius: 4, color: "#6366f1" },
      { radius: 5.5, color: "#818cf8" },
    ],
    particles: 140,
  },
  contact: {
    glass: [
      { position: [-1.5, 0.5, -2], scale: 0.55, speed: 0.4 },
      { position: [3, 0, -3], scale: 0.35, speed: 0.5 },
    ],
    wireframes: [
      { position: [1, 1.5, -4], scale: 0.4, shape: "icosahedron" },
      { position: [-2, -1.5, -5], scale: 0.3, shape: "octahedron" },
    ],
    torus: [],
    rings: [{ radius: 4.5, color: "#6366f1" }],
    particles: 110,
  },
};

function SceneContent({ theme }: { theme: MarketingSceneTheme }) {
  const groupRef = useRef<THREE.Group>(null!);
  const t = themes[theme];

  return (
    <>
      <MouseTracker ref={groupRef} />
      <group ref={groupRef}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />
        <pointLight position={[-10, -10, 5]} intensity={0.3} color="#6366f1" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#818cf8"
        />

        {t.glass.map((g, i) => (
          <GlassSphere key={`g${i}`} {...g} />
        ))}
        {t.wireframes.map((w, i) => (
          <WireframeShape key={`w${i}`} {...w} />
        ))}
        {t.torus.map((tor, i) => (
          <FloatingTorus key={`t${i}`} {...tor} />
        ))}
        {t.rings.map((r, i) => (
          <GlowRing key={`r${i}`} {...r} />
        ))}

        <Particles count={t.particles} />
      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

export function MarketingScene3D({
  className = "",
  theme = "default",
}: {
  className?: string;
  theme?: MarketingSceneTheme;
}) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneContent theme={theme} />
      </Canvas>
    </div>
  );
}
