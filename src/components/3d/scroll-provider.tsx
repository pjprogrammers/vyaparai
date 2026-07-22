"use client";

import { createContext, useContext, useRef, useCallback, type ReactNode } from "react";
import { useMotionValueEvent, useScroll, type MotionValue } from "motion/react";

interface ScrollContextValue {
  scrollY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  progress: number;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be used within ScrollProvider");
  return ctx;
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  const progressRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <ScrollContext.Provider
      value={{
        scrollY,
        scrollProgress: scrollYProgress,
        get progress() {
          return progressRef.current;
        },
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}
