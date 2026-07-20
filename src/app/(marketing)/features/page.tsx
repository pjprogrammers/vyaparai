import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = seoMetadata({
  title: "AI Business Automation Features | VyaparAI",
  description:
    "Explore VyaparAI features: AI invoice processing, inventory AI, customer AI assistant and AI business insights for Indian MSMEs.",
  path: "/features",
  keywords: [
    "AI business assistant",
    "AI automation software for MSME",
    "AI ERP for small businesses",
    "AI accounting assistant",
  ],
});

const features = [
  {
    href: "/features/ai-invoice-processing",
    t: "AI Invoice Processing",
    d: "Upload a bill, get structured JSON, automatic inventory and expense updates.",
    kw: "AI invoice generator, automatic invoice processing, AI invoice extraction, GST invoice automation",
  },
  {
    href: "/features/inventory-ai",
    t: "Inventory AI",
    d: "Smart stock prediction, automatic updates and low-stock alerts.",
    kw: "AI inventory management, stock prediction software, smart inventory system",
  },
  {
    href: "/features/customer-ai",
    t: "Customer AI",
    d: "Grounded customer replies with inventory checks and owner approval.",
    kw: "AI customer reply assistant, WhatsApp AI assistant for business",
  },
  {
    href: "/features/business-insights",
    t: "Business Insights",
    d: "AI analysis of sales, inventory and expenses into actionable recommendations.",
    kw: "AI business insights, AI analytics for small business",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Features</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          VyaparAI is an AI-powered business automation assistant built for Indian
          MSMEs. Each capability is a real workflow, not a chatbot.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400"
            >
              <h2 className="text-xl font-semibold text-slate-900">{f.t}</h2>
              <p className="mt-2 text-sm text-slate-500">{f.d}</p>
              <p className="mt-3 text-xs text-indigo-600">{f.kw}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
