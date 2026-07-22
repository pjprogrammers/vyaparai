"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import { GridBackground, GradientOrb, FloatingDots } from "./backgrounds";

const MarketingScene3D = dynamic(
  () => import("./scenes/hero-scene").then((m) => m.HeroScene),
  { ssr: false },
);

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MarketingPageWrapper({ children, scene: _scene }: { children: ReactNode; scene?: string }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <div className="noise-overlay" />
      <GridBackground />
      <GradientOrb className="w-[600px] h-[600px] -top-40 -left-40" color="#facc15" />
      <GradientOrb className="w-[500px] h-[500px] -bottom-20 -right-20" color="#f59e0b" delay={2} />
      <FloatingDots count={30} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function AnimatedH1({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal>
      <h1
        className={`text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl ${className}`}
      >
        {children}
      </h1>
    </Reveal>
  );
}

export function AnimatedP({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <p className={`text-lg text-neutral-400 leading-relaxed ${className}`}>
        {children}
      </p>
    </Reveal>
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
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        className={`glass-dark-elevated rounded-2xl p-6 ${className}`}
      >
        {children}
      </motion.div>
    </Reveal>
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
  return (
    <Reveal delay={delay}>
      <article className={className}>{children}</article>
    </Reveal>
  );
}

export function StaggerList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 ${className}`}>{children}</div>
  );
}

export function StaggerListItem({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  return (
    <Reveal delay={index * 0.06}>{children}</Reveal>
  );
}
