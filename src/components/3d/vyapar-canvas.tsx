"use client";

import { Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { CameraRig } from "./camera-rig";
import { ParticleField } from "./particle-engine";
import { HeroScene } from "./scenes/hero-scene";
import { OCRScene } from "./scenes/ocr-scene";
import { InventoryScene } from "./scenes/inventory-scene";
import { AnalyticsScene } from "./scenes/analytics-scene";
import { AIBrainScene } from "./scenes/ai-brain-scene";
import { AutomationScene } from "./scenes/automation-scene";
import { CTAScene } from "./scenes/cta-scene";

interface VyaparCanvasProps {
  scrollProgress: number;
}

export function VyaparCanvas({ scrollProgress }: VyaparCanvasProps) {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <CameraRig scrollProgress={scrollProgress} />

          <fog attach="fog" args={["#0a0a0a", 8, 25]} />

          <HeroScene />
          <OCRScene />
          <InventoryScene />
          <AnalyticsScene />
          <AIBrainScene />
          <AutomationScene />
          <CTAScene />

          <ParticleField
            count={150}
            color="#facc15"
            size={0.02}
            spread={20}
            speed={0.2}
            opacity={0.4}
            connectDistance={2}
          />

          <ambientLight intensity={0.05} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
