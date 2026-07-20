import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, articleSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = seoMetadata({
  title: "AI Inventory Management: A Practical Guide | VyaparAI",
  description:
    "Learn how small businesses can use AI inventory management and stock prediction to avoid stockouts and reduce dead stock.",
  path: "/blog/inventory-management-guide",
  keywords: ["AI inventory management", "stock prediction software", "smart inventory system"],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: "Inventory guide", path: "/blog/inventory-management-guide" },
          ]),
          articleSchema({
            headline: "AI Inventory Management: A Practical Guide",
            description:
              "Learn how small businesses can use AI inventory management and stock prediction to avoid stockouts and reduce dead stock.",
            datePublished: "2026-02-03",
            path: "/blog/inventory-management-guide",
          }),
        ]}
      />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs text-slate-400">February 3, 2026 · VyaparAI</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          AI Inventory Management: A Practical Guide
        </h1>
        <div className="mt-6 space-y-4 text-slate-700">
          <p>
            Stockouts lose sales; overstocking ties up cash. AI inventory management
            finds the balance by predicting demand from your real sales history.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">How stock prediction works</h2>
          <p>
            Compute average daily usage from the last 30 days of sales, divide current
            stock by it, and you get days until out — then reorder just enough.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Automate the updates</h2>
          <p>
            Connect purchases and sales to stock so it is always accurate. See how{" "}
            <Link href="/features/inventory-ai" className="text-indigo-600 hover:underline">
              Inventory AI
            </Link>{" "}
            does this for Indian businesses.
          </p>
        </div>
        <div className="mt-10">
          <Link href="/blog" className="font-semibold text-indigo-600 hover:underline">
            ← Back to blog
          </Link>
        </div>
      </article>
    </>
  );
}
