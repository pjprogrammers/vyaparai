"use client";

import { useEffect } from "react";

/* ── Device Class ── */

export enum DeviceType {
  PhonePortrait = "phonePortrait",
  PhoneLandscape = "phoneLandscape",
  TabletPortrait = "tabletPortrait",
  TabletLandscape = "tabletLandscape",
  Desktop = "desktop",
  Ultrawide = "ultrawide",
}

/* ── Camera Preset ── */

interface CameraPreset {
  fov: number;
  zOffset: number;
  amplitude: number;
  sceneScale: number;
  particleSpread: number;
  safeMargin: { left: number; right: number; top: number; bottom: number };
  fogNearOffset: number;
  fogFarOffset: number;
  mouseInfluence: number;
}

/* ── Device Presets ── */

const PRESETS: Record<DeviceType, CameraPreset> = {
  [DeviceType.PhonePortrait]: {
    fov: 68,
    zOffset: 4,
    amplitude: 0.5,
    sceneScale: 0.55,
    particleSpread: 2.5,
    safeMargin: { left: 8, right: 8, top: 14, bottom: 10 },
    fogNearOffset: -5,
    fogFarOffset: 12,
    mouseInfluence: 0.15,
  },
  [DeviceType.PhoneLandscape]: {
    fov: 52,
    zOffset: 1.5,
    amplitude: 0.65,
    sceneScale: 0.7,
    particleSpread: 3.5,
    safeMargin: { left: 6, right: 6, top: 10, bottom: 8 },
    fogNearOffset: -6,
    fogFarOffset: 15,
    mouseInfluence: 0.2,
  },
  [DeviceType.TabletPortrait]: {
    fov: 48,
    zOffset: 0.5,
    amplitude: 0.8,
    sceneScale: 0.85,
    particleSpread: 4.5,
    safeMargin: { left: 5, right: 5, top: 10, bottom: 8 },
    fogNearOffset: -6.5,
    fogFarOffset: 16,
    mouseInfluence: 0.25,
  },
  [DeviceType.TabletLandscape]: {
    fov: 45,
    zOffset: 0,
    amplitude: 0.9,
    sceneScale: 0.95,
    particleSpread: 4.8,
    safeMargin: { left: 5, right: 5, top: 10, bottom: 8 },
    fogNearOffset: -7,
    fogFarOffset: 17,
    mouseInfluence: 0.28,
  },
  [DeviceType.Desktop]: {
    fov: 45,
    zOffset: 1.5,
    amplitude: 1,
    sceneScale: 0.92,
    particleSpread: 5,
    safeMargin: { left: 5, right: 5, top: 10, bottom: 8 },
    fogNearOffset: -7,
    fogFarOffset: 17,
    mouseInfluence: 0.3,
  },
  [DeviceType.Ultrawide]: {
    fov: 38,
    zOffset: 1,
    amplitude: 1.1,
    sceneScale: 1.0,
    particleSpread: 6,
    safeMargin: { left: 8, right: 8, top: 10, bottom: 8 },
    fogNearOffset: -7,
    fogFarOffset: 18,
    mouseInfluence: 0.35,
  },
};

/* ── Breakpoints (sorted ascending by ar) ── */

const BREAKPOINTS: { ar: number; type: DeviceType }[] = [
  { ar: 0, type: DeviceType.PhonePortrait },
  { ar: 0.6, type: DeviceType.PhoneLandscape },
  { ar: 0.85, type: DeviceType.TabletPortrait },
  { ar: 1.2, type: DeviceType.TabletLandscape },
  { ar: 1.6, type: DeviceType.Desktop },
  { ar: 2, type: DeviceType.Ultrawide },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPreset(a: CameraPreset, b: CameraPreset, t: number): CameraPreset {
  return {
    fov: lerp(a.fov, b.fov, t),
    zOffset: lerp(a.zOffset, b.zOffset, t),
    amplitude: lerp(a.amplitude, b.amplitude, t),
    sceneScale: lerp(a.sceneScale, b.sceneScale, t),
    particleSpread: lerp(a.particleSpread, b.particleSpread, t),
    safeMargin: {
      left: lerp(a.safeMargin.left, b.safeMargin.left, t),
      right: lerp(a.safeMargin.right, b.safeMargin.right, t),
      top: lerp(a.safeMargin.top, b.safeMargin.top, t),
      bottom: lerp(a.safeMargin.bottom, b.safeMargin.bottom, t),
    },
    fogNearOffset: lerp(a.fogNearOffset, b.fogNearOffset, t),
    fogFarOffset: lerp(a.fogFarOffset, b.fogFarOffset, t),
    mouseInfluence: lerp(a.mouseInfluence, b.mouseInfluence, t),
  };
}

function getPresetForAspect(ar: number): CameraPreset {
  for (let i = 0; i < BREAKPOINTS.length - 1; i++) {
    const lo = BREAKPOINTS[i];
    const hi = BREAKPOINTS[i + 1];
    if (ar >= lo.ar && ar < hi.ar) {
      const t = (ar - lo.ar) / (hi.ar - lo.ar);
      return lerpPreset(PRESETS[lo.type], PRESETS[hi.type], t);
    }
  }
  return PRESETS[BREAKPOINTS[BREAKPOINTS.length - 1].type];
}

function getDeviceTypeForAspect(ar: number): DeviceType {
  for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
    if (ar >= BREAKPOINTS[i].ar) return BREAKPOINTS[i].type;
  }
  return DeviceType.PhonePortrait;
}

/* ── Module-level store (zero React overhead) ── */

interface ResponsiveStore {
  preset: CameraPreset;
  deviceType: DeviceType;
  aspectRatio: number;
}

export const responsiveStore: ResponsiveStore = {
  preset: PRESETS[DeviceType.Desktop],
  deviceType: DeviceType.Desktop,
  aspectRatio: 1.6,
};

function updateStore() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ar = w / h;
  responsiveStore.aspectRatio = ar;
  responsiveStore.preset = getPresetForAspect(ar);
  responsiveStore.deviceType = getDeviceTypeForAspect(ar);
}

/* ── Safe zone check ── */

export function isInsideSafeZone(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  const m = responsiveStore.preset.safeMargin;
  const left = (m.left / 100) * viewportWidth;
  const right = viewportWidth - (m.right / 100) * viewportWidth;
  const top = viewportHeight - (m.top / 100) * viewportHeight;
  const bottom = (m.bottom / 100) * viewportHeight;
  return x >= left && x <= right && y >= bottom && y <= top;
}

/* ── React hook ── */

export function useResponsive(): CameraPreset {
  useEffect(() => {
    updateStore();
    const onResize = () => updateStore();
    window.addEventListener("resize", onResize);

    /* Tab visibility: pause/resume */
    const onVisChange = () => {
      tabVisibilityStore.visible = !document.hidden;
      adaptiveQualityStore.isTabVisible = !document.hidden;
      tabVisibilityStore._notify();
    };
    document.addEventListener("visibilitychange", onVisChange);
    onVisChange();

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, []);

  return responsiveStore.preset;
}

/* ── Mobile helpers ── */

export function isMobile(): boolean {
  return (
    responsiveStore.deviceType === DeviceType.PhonePortrait ||
    responsiveStore.deviceType === DeviceType.PhoneLandscape
  );
}

export function isTablet(): boolean {
  return (
    responsiveStore.deviceType === DeviceType.TabletPortrait ||
    responsiveStore.deviceType === DeviceType.TabletLandscape
  );
}

export function isLowEndDevice(): boolean {
  return isMobile() || (typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4);
}

export function getTransmissionSamples(): number {
  return isMobile() ? 2 : 4;
}

/* ── Adaptive Quality (sustained FPS monitor) ── */

export type QualityLevel = "high" | "medium" | "low";

interface AdaptiveQuality {
  level: QualityLevel;
  dprMax: number;
  particleScale: number;
  transmissionSamples: number;
  amplitudeScale: number;
}

const QUALITY_PRESETS: Record<QualityLevel, AdaptiveQuality> = {
  high: { level: "high", dprMax: 1.5, particleScale: 1, transmissionSamples: 4, amplitudeScale: 1 },
  medium: { level: "medium", dprMax: 1.2, particleScale: 0.7, transmissionSamples: 2, amplitudeScale: 0.85 },
  low: { level: "low", dprMax: 1, particleScale: 0.5, transmissionSamples: 2, amplitudeScale: 0.6 },
};

export const adaptiveQualityStore = {
  level: "high" as QualityLevel,
  quality: QUALITY_PRESETS.high,
  fps: 60,
  isTabVisible: true,
  _fpsSamples: [] as number[],
  _lastTime: 0,
  _frameCount: 0,
  _adjustCooldown: 0,

  tick(delta: number) {
    if (!this.isTabVisible) return;

    this._frameCount++;
    this._lastTime += delta;
    if (this._lastTime >= 1) {
      const currentFps = this._frameCount / this._lastTime;
      this._fpsSamples.push(currentFps);
      if (this._fpsSamples.length > 10) this._fpsSamples.shift();
      this.fps = this._fpsSamples.reduce((a, b) => a + b, 0) / this._fpsSamples.length;
      this._frameCount = 0;
      this._lastTime = 0;

      if (this._adjustCooldown > 0) {
        this._adjustCooldown--;
      } else {
        this._adjust();
      }
    }
  },

  _adjust() {
    const avg = this.fps;
    let next: QualityLevel = this.level;

    if (avg < 24) {
      next = "low";
    } else if (avg < 45) {
      next = this.level === "high" ? "medium" : this.level === "low" ? "medium" : "low";
    } else if (avg > 55 && this.level !== "high") {
      next = this.level === "low" ? "medium" : "high";
    }

    if (next !== this.level) {
      this.level = next;
      this.quality = QUALITY_PRESETS[next];
      this._adjustCooldown = 5;
    }
  },
};

/* ── Tab visibility (pause rendering when hidden) ── */

export const tabVisibilityStore = {
  visible: true,
  _handlers: [] as (() => void)[],

  subscribe(fn: () => void) {
    this._handlers.push(fn);
    return () => {
      this._handlers = this._handlers.filter((h) => h !== fn);
    };
  },

  _notify() {
    for (const h of this._handlers) h();
  },
};

/* ── 3D readiness tracker (for loader) ── */

interface ReadinessState {
  webglReady: boolean;
  heroConstructed: boolean;
  shadersCompiled: boolean;
  particlesReady: boolean;
  cameraReady: boolean;
  firstFrameRendered: boolean;
}

export const readinessStore: ReadinessState = {
  webglReady: false,
  heroConstructed: false,
  shadersCompiled: false,
  particlesReady: false,
  cameraReady: false,
  firstFrameRendered: false,
};

export function isFullyReady(): boolean {
  return (
    readinessStore.webglReady &&
    readinessStore.heroConstructed &&
    readinessStore.shadersCompiled &&
    readinessStore.particlesReady &&
    readinessStore.cameraReady &&
    readinessStore.firstFrameRendered
  );
}
