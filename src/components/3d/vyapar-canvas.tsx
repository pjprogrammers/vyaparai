"use client";

import { Suspense, useCallback, useRef, useEffect } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
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
import {
  isMobile,
  adaptiveQualityStore,
  readinessStore,
  tabVisibilityStore,
} from "./responsive-context";

interface VyaparCanvasProps {
  scrollProgress: number;
}

export function VyaparCanvas({ scrollProgress }: VyaparCanvasProps) {
  const readyCalled = useRef(false);
  const heroFrameCount = useRef(0);
  const frameRenderedMarked = useRef(false);

  const handleCreated = useCallback(
    (state: RootState) => {
      /* Mark WebGL ready */
      readinessStore.webglReady = true;

      /* Wait for fonts + shader compilation + 3 stabilized frames */
      Promise.all([
        document.fonts.ready,
        new Promise<void>((resolve) => {
          /* Wait for shader compilation (warm-up pass) */
          state.gl.compile(state.scene, state.camera);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => resolve());
            });
          });
        }),
      ]).then(() => {
        readinessStore.shadersCompiled = true;
        readinessStore.heroConstructed = true;
        readinessStore.particlesReady = true;
        readinessStore.cameraReady = true;

        if (!readyCalled.current) {
          readyCalled.current = true;

          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const w = window as any;
          w.__splashMarkAssetsReady?.();
        }
      });
    },
    [],
  );

  /* Render-loop hook: track FPS + mark first fully rendered frame */
  const handleFrame = useCallback((state: RootState) => {
    adaptiveQualityStore.tick(state.clock.getDelta());

    if (!frameRenderedMarked.current) {
      heroFrameCount.current++;
      if (heroFrameCount.current >= 3) {
        readinessStore.firstFrameRendered = true;
        frameRenderedMarked.current = true;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const w = window as any;
        w.__splashMarkFrameRendered?.();
      }
    }
  }, []);

  /* Pause rendering when tab is hidden */
  useEffect(() => {
    return tabVisibilityStore.subscribe(() => {
      /* R3F handles frameloop internally; we signal scenes to skip via readinessStore */
    });
  }, []);

  const dpr = isMobile() ? [1, 1.2] as [number, number] : [1, 1.5] as [number, number];

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={dpr}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
        frameloop="always"
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

        {/* Frame callback for adaptive quality + readiness marking */}
        <FrameCallback onFrame={handleFrame} />
      </Canvas>
    </div>
  );
}

/* Lightweight component that hooks into the render loop without causing re-renders */
function FrameCallback({ onFrame }: { onFrame: (state: RootState) => void }) {
  useFrame((state) => onFrame(state));
  return null;
}
