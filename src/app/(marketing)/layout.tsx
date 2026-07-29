"use client";

import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { SplashProvider } from "@/components/loading/splash-context";
import { CinematicSplash } from "@/components/loading/cinematic-splash";
import { RouteTransition } from "@/components/loading/route-transition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SplashProvider>
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <div className="noise-overlay" />

        <CinematicSplash />

        <MarketingNav />

        <main className="relative z-10 pt-16 lg:pt-20">
          <RouteTransition>{children}</RouteTransition>
        </main>

        <MarketingFooter />
      </div>
    </SplashProvider>
  );
}
