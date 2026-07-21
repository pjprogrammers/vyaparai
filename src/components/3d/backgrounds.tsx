"use client";

import { motion } from "motion/react";

export function GridBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.025]">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
    </div>
  );
}

export function GradientOrb({
  className = "",
  color = "#6366f1",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[120px] ${className}`}
      style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)` }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function FloatingDots({ count = 25, className = "" }: { count?: number; className?: string }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 5 + 1) * 100,
    y: seededRandom(i * 5 + 2) * 100,
    size: seededRandom(i * 5 + 3) * 3 + 1,
    delay: seededRandom(i * 5 + 4) * 4,
    duration: seededRandom(i * 5 + 5) * 4 + 4,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-400/15"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}

export function RadialGlow({ className = "", color = "#6366f1" }: { className?: string; color?: string }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, ${color}12 0%, transparent 60%)`,
      }}
    />
  );
}

export function NoiseOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none opacity-[0.03] ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
    />
  );
}
