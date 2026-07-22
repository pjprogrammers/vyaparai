"use client";

import { useState, useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

const VyaparCanvas = dynamic(
  () =>
    import("@/components/3d/vyapar-canvas").then((m) => m.VyaparCanvas),
  { ssr: false },
);

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
  });

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <div className="noise-overlay" />

      <VyaparCanvas scrollProgress={scrollProgress} />

      <MarketingNav />

      <main className="relative z-10">{children}</main>

      <MarketingFooter />
    </div>
  );
}
