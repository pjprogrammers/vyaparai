"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import { GridBackground, GradientOrb, FloatingDots } from "./backgrounds";
import type { MarketingSceneTheme } from "./marketing-scene";

const MarketingScene3D = dynamic(
  () => import("./marketing-scene").then((m) => m.MarketingScene3D),
  { ssr: false }
);

export function MarketingPageWrapper({
  children,
  scene = "default",
}: {
  children: ReactNode;
  scene?: MarketingSceneTheme;
}) {
  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <GridBackground />
      <div className="pointer-events-none fixed inset-0 z-0">
        <MarketingScene3D theme={scene} />
      </div>
      <GradientOrb className="top-0 -right-40 w-[500px] h-[500px]" color="#6366f1" />
      <GradientOrb className="bottom-0 -left-40 w-[400px] h-[400px]" color="#818cf8" delay={2} />
      <FloatingDots count={20} />
      <div className="relative z-10">{children}</div>
    </main>
  );
}

export function AnimatedH1({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.h1
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`text-4xl font-bold tracking-tight text-white sm:text-5xl ${className}`}
    >
      {children}
    </motion.h1>
  );
}

export function AnimatedP({
  children,
  className = "",
  delay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`text-lg text-slate-400 ${className}`}
    >
      {children}
    </motion.p>
  );
}

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:bg-slate-800/50 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedArticle({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.article>
  );
}

export function StaggerList({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerListItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
