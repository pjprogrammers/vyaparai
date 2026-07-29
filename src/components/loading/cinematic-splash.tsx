"use client";

import { useSplash } from "./splash-context";

export function CinematicSplash() {
  const { visible, dismissing } = useSplash();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative mb-10 flex items-center justify-center">
        <div
          className={`h-5 w-5 rounded-full bg-yellow-400 shadow-[0_0_20px_4px_rgba(250,204,21,0.6)] ${dismissing ? "opacity-0 scale-105 blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}`}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <span
          className={`bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-5xl font-extrabold tracking-wide text-transparent ${dismissing ? "opacity-0 scale-90 blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}`}
        >
          VA
        </span>
        <span
          className={`text-sm font-medium tracking-[0.3em] uppercase text-white/50 ${dismissing ? "opacity-0 translate-y-[-8px] blur-lg transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}`}
        >
          VyaparAI
        </span>
      </div>
    </div>
  );
}
