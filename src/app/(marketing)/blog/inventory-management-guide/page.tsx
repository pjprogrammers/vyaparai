import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, articleSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI Inventory Management: A Practical Guide | VyaparAI",
  description: "Learn how small businesses can use AI inventory management and stock prediction to avoid stockouts and reduce dead stock.",
  path: "/blog/inventory-management-guide",
  keywords: ["AI inventory management", "stock prediction software", "smart inventory system"],
});

export default function Page() {
  return (
    <MarketingPageWrapper scene="blog">
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: "Inventory guide", path: "/blog/inventory-management-guide" }]), articleSchema({ headline: "AI Inventory Management: A Practical Guide", description: "Learn how small businesses can use AI inventory management.", datePublished: "2026-02-03", path: "/blog/inventory-management-guide" })]} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs text-slate-500">February 3, 2026 · VyaparAI</p>
        <AnimatedH1 className="mt-2">AI Inventory Management: A Practical Guide</AnimatedH1>
        <div className="mt-6 space-y-4 text-slate-400">
          <AnimatedArticle delay={0.1}>
            <p>Stockouts lose sales; overstocking ties up cash. AI inventory management finds the balance by predicting demand from your real sales history.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">How stock prediction works</h2>
            <p className="mt-2">Compute average daily usage from the last 30 days of sales, divide current stock by it, and you get days until out — then reorder just enough.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Automate the updates</h2>
            <p className="mt-2">Connect purchases and sales to stock so it is always accurate. See how <Link href="/features/inventory-ai" className="text-indigo-400 hover:underline">Inventory AI</Link> does this for Indian businesses.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10"><Link href="/blog" className="font-semibold text-indigo-400 hover:underline">← Back to blog</Link></div>
      </article>
    </MarketingPageWrapper>
  );
}
