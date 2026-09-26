"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useScroll } from "motion/react";
import * as THREE from "three";

let webGLSupport: boolean | null = null;

function getWebGLSupport(): boolean {
  if (webGLSupport !== null) return webGLSupport;
  try {
    const canvas = document.createElement("canvas");
    webGLSupport = !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    webGLSupport = false;
  }
  return webGLSupport;
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function useWebGL() {
  return useSyncExternalStore(subscribe, getWebGLSupport, getServerSnapshot);
}

export function ThreeDHub() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(0);
  const hasWebGL = useWebGL();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    scrollRef.current = 0;
    return scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  useEffect(() => {
    if (!hasWebGL) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 700;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfacc15, 3.5);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xfde047, 4, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const glowTexture = makeGlowTexture();
    const glowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(8, 8, 1);
    glow.position.z = -1;
    scene.add(glow);

    const hubGroup = new THREE.Group();
    scene.add(hubGroup);

    const barrelGeo = new THREE.CylinderGeometry(2.2, 2.3, 1.4, 48);
    barrelGeo.rotateX(Math.PI / 2);
    const metallicMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      metalness: 0.9,
      roughness: 0.22,
    });
    const barrel = new THREE.Mesh(barrelGeo, metallicMat);
    hubGroup.add(barrel);

    const bezelGeo = new THREE.TorusGeometry(2.3, 0.08, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x292524,
      metalness: 0.95,
      roughness: 0.15,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = 0.65;
    hubGroup.add(bezel);

    const ledRingGeo = new THREE.TorusGeometry(2.05, 0.04, 16, 64);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const ledRing = new THREE.Mesh(ledRingGeo, ledMat);
    ledRing.position.z = 0.69;
    hubGroup.add(ledRing);

    const innerHousingGeo = new THREE.CylinderGeometry(1.8, 1.95, 0.8, 48);
    innerHousingGeo.rotateX(Math.PI / 2);
    const innerHousingMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.7,
      roughness: 0.35,
    });
    const innerHousing = new THREE.Mesh(innerHousingGeo, innerHousingMat);
    innerHousing.position.z = 0.35;
    hubGroup.add(innerHousing);

    const irisGroup = new THREE.Group();
    irisGroup.position.z = 0.55;
    const apertureBladesCount = 8;
    for (let i = 0; i < apertureBladesCount; i++) {
      const angle = (i / apertureBladesCount) * Math.PI * 2;
      const bladeGeo = new THREE.BoxGeometry(0.55, 0.09, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x292524,
        metalness: 0.8,
        roughness: 0.3,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0);
      blade.rotation.z = angle + 0.4;
      irisGroup.add(blade);
    }
    hubGroup.add(irisGroup);

    const lensGeo = new THREE.SphereGeometry(1.55, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      transmission: 0.75,
      opacity: 0.9,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const lens = new THREE.Mesh(lensGeo, glassMat);
    lens.position.z = 0.3;
    hubGroup.add(lens);

    const sensorGeo = new THREE.CircleGeometry(0.55, 32);
    const sensorMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.85,
    });
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.z = 0.2;
    hubGroup.add(sensor);

    const ring1Geo = new THREE.TorusGeometry(3.1, 0.02, 12, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 4;
    hubGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.5, 0.015, 12, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    hubGroup.add(ring2);

    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 9;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.05,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const nx = (clientX / rect.width) * 2 - 1;
      const ny = -(clientY / rect.height) * 2 + 1;

      targetRotY = nx * 0.3;
      targetRotX = -ny * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let visible = !document.hidden;
    const handleVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let animId: number;
    const timer = new THREE.Timer();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();

      if (!visible) return;

      const elapsedTime = timer.getElapsed();
      const p = scrollRef.current;

      const deviceScale = 1 - Math.min(p * 0.5, 0.5);
      const drift = p * 2.6;
      const spin = p * Math.PI * 0.6;
      const settle = Math.min(p * 1.5, 1);

      if (!mediaQuery.matches) {
        currentRotX += (targetRotX - currentRotX) * 0.04;
        currentRotY += (targetRotY - currentRotY) * 0.04;

        hubGroup.scale.setScalar(deviceScale);
        hubGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.7) * 0.08 + settle * 0.35;
        hubGroup.rotation.y = currentRotY + Math.cos(elapsedTime * 0.5) * 0.08 + spin;
        hubGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15 - drift;
        hubGroup.position.z = settle * -0.8;

        irisGroup.rotation.z = elapsedTime * 0.25;

        ring1.rotation.z = elapsedTime * 0.35;
        ring2.rotation.x = elapsedTime * 0.25;
        ring2.rotation.z = -elapsedTime * 0.15;

        const ledPulse = 1.8 + Math.sin(elapsedTime * 2.5) * 0.7;
        ledMat.emissiveIntensity = ledPulse;

        particles.rotation.y = elapsedTime * 0.04;

        glow.position.y = hubGroup.position.y;
        glow.position.x = hubGroup.position.x;
        glow.scale.setScalar(8 * deviceScale * (1 - settle * 0.25));
      }

      const layerOpacity = 0.22 - Math.min(p, 0.6) * 0.07;
      layer.style.opacity = String(layerOpacity);

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      barrelGeo.dispose();
      bezelGeo.dispose();
      ledRingGeo.dispose();
      innerHousingGeo.dispose();
      lensGeo.dispose();
      sensorGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      particleGeo.dispose();

      metallicMat.dispose();
      bezelMat.dispose();
      ledMat.dispose();
      innerHousingMat.dispose();
      glassMat.dispose();
      sensorMat.dispose();
      ringMat.dispose();
      ringMat2.dispose();
      particleMat.dispose();
      glowTexture.dispose();
      glowMat.dispose();

      renderer.dispose();
    };
  }, [hasWebGL]);

  if (!hasWebGL) return null;

  const background = (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      aria-hidden="true"
    >
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );

  return createPortal(background, document.body);
}

function makeGlowTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(250, 204, 21, 0.55)");
    gradient.addColorStop(0.5, "rgba(250, 204, 21, 0.12)");
    gradient.addColorStop(1, "rgba(250, 204, 21, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}