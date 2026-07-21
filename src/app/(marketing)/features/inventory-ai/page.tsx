import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI Inventory Management & Stock Prediction | VyaparAI",
  description: "Smart inventory system with AI stock prediction, automatic updates from invoices and low-stock alerts for Indian small businesses.",
  path: "/features/inventory-ai",
  keywords: ["AI inventory management", "stock prediction software", "smart inventory system", "inventory automation software", "AI inventory management India"],
});

const faqs: FaqItem[] = [
  { question: "How does stock prediction work?", answer: "VyaparAI analyses your last 30 days of sales and current stock to compute average daily usage, then estimates days until a product runs out and recommends a reorder quantity and preferred supplier." },
  { question: "Does inventory update automatically?", answer: "Yes. Every processed supplier invoice adds stock, and every recorded sale subtracts it — no manual entry required." },
  { question: "What triggers a low-stock alert?", answer: "When projected days until out fall below the reorder buffer, VyaparAI raises a low-stock alert with a recommended order and supplier." },
];

export default function Page() {
  return (
    <MarketingPageWrapper scene="inventory">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "Inventory AI", path: "/features/inventory-ai" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>Inventory AI</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">A smart inventory system that updates itself and predicts demand.</AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">Stock prediction software</h2>
            <p className="mt-2 text-slate-400">Know exactly when Sugar will run out and how much to reorder — before you lose a sale.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Inventory automation</h2>
            <p className="mt-2 text-slate-400">Connect invoices with stock so every purchase and sale keeps inventory accurate in real time.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features/customer-ai" className="font-semibold text-indigo-400 hover:underline">Next: Customer AI →</Link>
          <Link href="/solutions/kirana-store" className="font-semibold text-indigo-400 hover:underline">Kirana solution →</Link>
        </div>
      </section>
      <FaqSection items={faqs} />
    </MarketingPageWrapper>
  );
}
