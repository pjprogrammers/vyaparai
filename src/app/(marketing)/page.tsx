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

export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <OCRSection />
      <InventorySection />
      <AnalyticsSection />
      <AIBrainSection />
      <AutomationSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
