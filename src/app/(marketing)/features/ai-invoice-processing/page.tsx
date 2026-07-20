import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";

export const metadata: Metadata = seoMetadata({
  title: "AI Invoice Processing & Extraction | VyaparAI",
  description:
    "Automatically extract data from supplier invoices with AI OCR and Gemini. GST-ready invoice automation for Indian small businesses.",
  path: "/features/ai-invoice-processing",
  keywords: [
    "AI invoice generator",
    "automatic invoice processing",
    "AI invoice extraction",
    "GST invoice automation",
    "AI invoice processing software",
  ],
});

const faqs: FaqItem[] = [
  {
    question: "How does AI invoice processing work?",
    answer:
      "You upload a supplier bill (image or PDF). VyaparAI runs OCR to read the text, understands it with Gemini AI, validates the structured data, and writes it to your Firestore database.",
  },
  {
    question: "Does it support GST invoices?",
    answer:
      "Yes. VyaparAI extracts supplier, items, quantity, price and GST, and can generate GST-compliant customer invoices.",
  },
  {
    question: "What happens after extraction?",
    answer:
      "Inventory is updated automatically, an expense record is created, and the dashboard reflects the change immediately.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
          { name: "AI Invoice Processing", path: "/features/ai-invoice-processing" },
        ])}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">AI Invoice Processing</h1>
        <p className="mt-4 text-lg text-slate-600">
          Turn supplier bills into structured, validated business data in seconds.
          VyaparAI reads invoices with OCR, understands them with Gemini AI, and
          updates your inventory and expenses automatically.
        </p>

        <div className="mt-10 space-y-8">
          <article>
            <h2 className="text-2xl font-semibold text-slate-900">Upload → OCR → AI → JSON</h2>
            <p className="mt-2 text-slate-600">
              Documents flow through a real pipeline: upload to Firebase Storage,
              extract text with Tesseract OCR or Google Cloud Vision, parse with
              Gemini, validate with Zod, and store in Firestore.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-semibold text-slate-900">GST invoice automation</h2>
            <p className="mt-2 text-slate-600">
              Automatically capture GST, line items and totals. Generate GST-ready
              customer invoices with a single click.
            </p>
          </article>
        </div>

        <div className="mt-10 flex gap-4">
          <Link href="/features/inventory-ai" className="font-semibold text-indigo-600 hover:underline">
            Next: Inventory AI →
          </Link>
          <Link href="/auth" className="font-semibold text-indigo-600 hover:underline">
            Try VyaparAI →
          </Link>
        </div>
      </section>

      <FaqSection items={faqs} />
    </>
  );
}
