"use client";

import {
  HeroSection,
  OCRSection,
  InventorySection,
  AnalyticsSection,
  AIBrainSection,
  AutomationSection,
  PricingSection,
  CTASection,
} from "@/components/marketing/sections";
import { ThreeDHub } from "@/components/marketing/three-d-hub";

export default function HomePage() {
  return (
    <main className="relative">
      <ThreeDHub />
      <div className="relative z-10">
        <HeroSection />
        <OCRSection />
        <InventorySection />
        <AnalyticsSection />
        <AIBrainSection />
        <AutomationSection />
        <PricingSection />
        <CTASection />
      </div>
    </main>
  );
}
