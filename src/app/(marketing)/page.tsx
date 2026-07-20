import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";

export const metadata: Metadata = seoMetadata({
  title: "VyaparAI — AI Business Assistant for MSMEs | Automate Your Business",
  description:
    "VyaparAI is an AI-powered business automation assistant for Indian MSMEs. Automate invoices, inventory, customer support, reports and business insights with AI.",
  path: "/",
  keywords: [
    "vyaparai",
    "vyapar ai",
    "vyaparai app",
    "vyaparai software",
    "vyaparai india",
    "vyaparai AI assistant",
    "AI business assistant for small business",
    "AI automation software for MSME",
    "AI powered business management software",
    "AI accounting assistant",
  ],
});

const faqs: FaqItem[] = [
  {
    question: "What is VyaparAI?",
    answer:
      "VyaparAI is an AI-powered automation platform that helps MSMEs manage invoices, inventory, customers and business insights. It is an AI employee for your business, not just a chatbot.",
  },
  {
    question: "Who can use VyaparAI?",
    answer:
      "Kirana stores, retailers, pharmacies, wholesalers, manufacturers and other small businesses in India can use VyaparAI to automate their daily operations.",
  },
  {
    question: "How does AI invoice processing work?",
    answer:
      "You upload a supplier bill (image or PDF). VyaparAI runs OCR, understands the document with Gemini AI, validates the data with Zod, and updates your inventory and expenses automatically.",
  },
  {
    question: "Is VyaparAI available in regional languages?",
    answer:
      "VyaparAI supports English today, with regional language support planned as part of the roadmap for wider Indian MSME adoption.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Home", path: "/" }])}
      />

      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
            AI Employee for Your Business
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            VyaparAI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            An AI-powered business automation assistant for Indian MSMEs. Automate
            invoices, inventory, customer support, reports and business insights with AI.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/auth"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Start Free
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explore Features
            </Link>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {[
              { t: "Documents → AI", d: "Upload a bill, get structured data instantly." },
              { t: "Inventory Automation", d: "Stock updates itself from every invoice." },
              { t: "AI Insights", d: "Proactive recommendations, not just chat." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">{f.t}</h2>
                <p className="mt-1 text-sm text-slate-500">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Core capabilities</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/features/ai-invoice-processing", t: "AI Invoice Processing", d: "OCR + Gemini turns bills into structured data." },
            { href: "/features/inventory-ai", t: "Inventory AI", d: "Stock prediction and automatic updates." },
            { href: "/features/customer-ai", t: "Customer AI", d: "Grounded replies with owner approval." },
            { href: "/features/business-insights", t: "Business Insights", d: "AI recommendations from your data." },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-400"
            >
              <h3 className="font-semibold text-slate-900">{f.t}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900">Built for Indian businesses</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { href: "/solutions/kirana-store", t: "Kirana Stores" },
            { href: "/solutions/pharmacy", t: "Pharmacies" },
            { href: "/solutions/retail-business", t: "Retail Businesses" },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-2xl bg-indigo-600 px-5 py-6 text-center text-white shadow-sm transition hover:bg-indigo-500"
            >
              <span className="font-semibold">{s.t}</span>
            </Link>
          ))}
        </div>
      </section>

      <FaqSection items={faqs} />
    </>
  );
}
