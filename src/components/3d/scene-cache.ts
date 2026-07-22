"use client";

import * as THREE from "three";

/* ── Shared Geometries ── */

export const SharedGeo = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere16: new THREE.SphereGeometry(1, 16, 16),
  sphere8: new THREE.SphereGeometry(1, 8, 8),
  sphere6: new THREE.SphereGeometry(1, 6, 6),
  sphere32: new THREE.SphereGeometry(1, 32, 32),
  ico1: new THREE.IcosahedronGeometry(1, 1),
  ico2: new THREE.IcosahedronGeometry(1, 2),
  ico3: new THREE.IcosahedronGeometry(1, 3),
  dodeca: new THREE.DodecahedronGeometry(1, 0),
  octa: new THREE.OctahedronGeometry(1, 0),
  plane: new THREE.PlaneGeometry(1, 1),
} as const;

/* ── Shared Materials (emissive yellow) ── */

function makeMat(props: THREE.MeshStandardMaterialParameters) {
  return new THREE.MeshStandardMaterial(props);
}

export const SharedMat = {
  yellowSolid: makeMat({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.8 }),
  yellowGlow: makeMat({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 1.5, transparent: true, opacity: 0.7 }),
  yellowDim: makeMat({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.5, transparent: true, opacity: 0.5 }),
  yellowFaint: makeMat({ color: "#facc15", emissive: "#facc15", emissiveIntensity: 0.3, transparent: true, opacity: 0.3 }),
  amberSolid: makeMat({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 0.5 }),
  amberGlow: makeMat({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 1.5, transparent: true, opacity: 0.4 }),
  darkMetal: makeMat({ color: "#1a1a1a", metalness: 0.8, roughness: 0.2 }),
  darkMatte: makeMat({ color: "#1a1a1a", metalness: 0.3, roughness: 0.7 }),
  blackBg: makeMat({ color: "#0a0a0a" }),
  darkBg: makeMat({ color: "#141414", transparent: true, opacity: 0.5 }),
  whiteTransmission: makeMat({ color: "#ffffff", transparent: true, opacity: 0.15 }),
  lineYellow: new THREE.LineBasicMaterial({ color: "#facc15", transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false }),
  particleYellow: new THREE.PointsMaterial({ color: "#facc15", size: 0.03, transparent: true, opacity: 0.8, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }),
} as const;

/* ── Per-component cloned material helper ── */

export function cloneMat(base: THREE.MeshStandardMaterial, overrides: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  const m = base.clone();
  Object.assign(m, overrides);
  return m;
}

/* ── Shared Dummy for InstancedMesh ── */

export const sharedDummy = new THREE.Object3D();
