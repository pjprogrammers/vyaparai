import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI Invoice Processing & Extraction | VyaparAI",
  description: "Automatically extract data from supplier invoices with AI OCR and Gemini. GST-ready invoice automation for Indian small businesses.",
  path: "/features/ai-invoice-processing",
  keywords: ["AI invoice generator", "automatic invoice processing", "AI invoice extraction", "GST invoice automation", "AI invoice processing software"],
});

const faqs: FaqItem[] = [
  { question: "How does AI invoice processing work?", answer: "You upload a supplier bill (image or PDF). VyaparAI runs OCR to read the text, understands it with Gemini AI, validates the structured data, and writes it to your Firestore database." },
  { question: "Does it support GST invoices?", answer: "Yes. VyaparAI extracts supplier, items, quantity, price and GST, and can generate GST-compliant customer invoices." },
  { question: "What happens after extraction?", answer: "Inventory is updated automatically, an expense record is created, and the dashboard reflects the change immediately." },
];

export default function Page() {
  return (
    <MarketingPageWrapper scene="invoice">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "AI Invoice Processing", path: "/features/ai-invoice-processing" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>AI Invoice Processing</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">
          Turn supplier bills into structured, validated business data in seconds.
        </AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">Upload → OCR → AI → JSON</h2>
            <p className="mt-2 text-slate-400">Documents flow through a real pipeline: upload to Firebase Storage, extract text with Tesseract OCR or Google Cloud Vision, parse with Gemini, validate with Zod, and store in Firestore.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">GST invoice automation</h2>
            <p className="mt-2 text-slate-400">Automatically capture GST, line items and totals. Generate GST-ready customer invoices with a single click.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features/inventory-ai" className="font-semibold text-yellow-400 hover:underline">Next: Inventory AI →</Link>
          <Link href="/auth" className="font-semibold text-yellow-400 hover:underline">Try VyaparAI →</Link>
        </div>
      </section>
      <FaqSection items={faqs} />
    </MarketingPageWrapper>
  );
}
