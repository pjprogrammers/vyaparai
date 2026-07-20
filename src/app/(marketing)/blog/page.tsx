import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = seoMetadata({
  title: "Blog — AI for Indian MSMEs | VyaparAI",
  description:
    "Articles on AI for Indian small businesses: automation, inventory management, invoice processing and MSME digital transformation.",
  path: "/blog",
  keywords: ["AI tools for small business India", "MSME digital transformation", "AI vs ERP"],
});

const posts = [
  {
    href: "/blog/how-ai-helps-msme",
    t: "How AI is transforming Indian MSMEs in 2026",
    d: "Why AI adoption is accelerating among kirana stores, pharmacies and retailers — and what it means for growth.",
    date: "2026-01-12",
  },
  {
    href: "/blog/inventory-management-guide",
    t: "AI Inventory Management: A Practical Guide",
    d: "How small businesses can predict stock demand and stop losing sales to stockouts.",
    date: "2026-02-03",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Blog</h1>
        <p className="mt-4 text-lg text-slate-600">
          Practical guides on AI for Indian small businesses.
        </p>
        <div className="mt-10 space-y-6">
          {posts.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400"
            >
              <p className="text-xs text-slate-400">{p.date}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{p.t}</h2>
              <p className="mt-2 text-sm text-slate-500">{p.d}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
