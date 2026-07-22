"use client";

import { type ReactNode } from "react";

export function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </div>
  );
}

export function GradientOrb({
  className = "",
  color = "#facc15",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute blur-[120px] ${className}`}
      style={{
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        animation: `pulse 8s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

export function FloatingDots({ count = 25 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-yellow-400/20"
          style={{
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function RadialGlow({
  className = "",
  color = "#facc15",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)`,
      }}
    />
  );
}

export function NoiseOverlay() {
  return (
    <div className="noise-overlay" />
  );
}
