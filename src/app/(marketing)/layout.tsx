"use client";

import { useState, useCallback } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { SplashProvider } from "@/components/loading/splash-context";
import { CinematicSplash } from "@/components/loading/cinematic-splash";
import { RouteTransition } from "@/components/loading/route-transition";
import { useResponsive } from "@/components/3d/responsive-context";

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

  useResponsive();

  return (
    <SplashProvider>
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <div className="noise-overlay" />

        <CinematicSplash />

        <VyaparCanvas scrollProgress={scrollProgress} />

        <MarketingNav />

        <main className="relative z-10 pt-16 lg:pt-20">
          <RouteTransition>{children}</RouteTransition>
        </main>

        <MarketingFooter />
      </div>
    </SplashProvider>
  );
}
