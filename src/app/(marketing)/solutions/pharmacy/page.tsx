import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI for Pharmacies & Medicine Inventory | VyaparAI",
  description: "AI inventory management for pharmacies in India. Track medicines, demand and expiry with automated stock prediction.",
  path: "/solutions/pharmacy",
  keywords: ["AI inventory management India", "MSME automation software", "small business automation India"],
});

export default function Page() {
  return (
    <MarketingPageWrapper scene="solution">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Pharmacy", path: "/solutions/pharmacy" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>VyaparAI for Pharmacies</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">Pharmacies manage hundreds of SKUs with strict expiry and demand variability. VyaparAI brings AI stock prediction and automation to your counter.</AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">Demand-aware reordering</h2>
            <p className="mt-2 text-slate-400">Know which medicines will run out and reorder the right quantity, reducing both stockouts and dead stock.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Faster billing</h2>
            <p className="mt-2 text-slate-400">Turn purchase bills into structured data and GST-ready invoices without manual entry.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features/ai-invoice-processing" className="font-semibold text-indigo-400 hover:underline">Invoice AI →</Link>
          <Link href="/auth" className="font-semibold text-indigo-400 hover:underline">Start Free →</Link>
        </div>
      </section>
    </MarketingPageWrapper>
  );
}
