"use client";

import { useSplash } from "./splash-context";

export function CinematicSplash() {
  const { visible, dismissing } = useSplash();

  if (!visible) return null;

  return (
    <div
      className={`cinematic-splash ${dismissing ? "cinematic-splash--dissolve" : ""}`}
      aria-hidden="true"
    >
      <div className="cinematic-splash__noise" />

      <div className="cinematic-splash__particles">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="cinematic-splash__particle"
            style={{
              "--p-index": i,
              "--p-angle": `${(i / 12) * 360}deg`,
              "--p-delay": `${i * 0.08}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="cinematic-splash__core">
        <span className="cinematic-splash__core-dot" />
        <span className="cinematic-splash__ring cinematic-splash__ring--1" />
        <span className="cinematic-splash__ring cinematic-splash__ring--2" />
        <span className="cinematic-splash__ring cinematic-splash__ring--3" />
      </div>

      <div className="cinematic-splash__logo">
        <span className="cinematic-splash__va">VA</span>
        <span className="cinematic-splash__brand">VyaparAI</span>
      </div>

      <div className="cinematic-splash__scan" />

      <div className="cinematic-splash__status">
        <span className="cinematic-splash__status-line">
          Initializing AI Engine
        </span>
        <span className="cinematic-splash__status-line">
          Loading Neural Core
        </span>
        <span className="cinematic-splash__status-line">
          Preparing Workspace
        </span>
        <span className="cinematic-splash__status-line cinematic-splash__status-line--ready">
          Ready
        </span>
      </div>
    </div>
  );
}
