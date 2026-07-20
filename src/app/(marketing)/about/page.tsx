import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = seoMetadata({
  title: "About VyaparAI — AI for Indian MSMEs",
  description:
    "VyaparAI is on a mission to give every Indian small business an AI employee that automates invoices, inventory and insights.",
  path: "/about",
  keywords: ["vyaparai india", "AI tools for MSME India", "MSME digital transformation"],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">About VyaparAI</h1>
        <p className="mt-4 text-lg text-slate-600">
          VyaparAI is an AI-powered business automation assistant for Indian MSMEs.
          We believe every kirana store, pharmacy and retailer deserves the same
          operational leverage that large enterprises get from expensive ERP systems.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-slate-900">Our mission</h2>
        <p className="mt-2 text-slate-600">
          Give every small business an “AI employee” that handles invoices,
          inventory, customers and decisions — so owners can focus on growth.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-slate-900">Why VyaparAI</h2>
        <p className="mt-2 text-slate-600">
          Most tools are chatbots. VyaparAI is a workflow engine: Documents → AI →
          Business Data → Automation → Predictions → Actions.
        </p>
      </section>
    </>
  );
}
