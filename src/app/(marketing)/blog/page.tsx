import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedCard, StaggerList, StaggerListItem } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "Blog — AI for Indian MSMEs | VyaparAI",
  description: "Articles on AI for Indian small businesses: automation, inventory management, invoice processing and MSME digital transformation.",
  path: "/blog",
  keywords: ["AI tools for small business India", "MSME digital transformation", "AI vs ERP"],
});

const posts = [
  { href: "/blog/how-ai-helps-msme", t: "How AI is transforming Indian MSMEs in 2026", d: "Why AI adoption is accelerating among kirana stores, pharmacies and retailers.", date: "2026-01-12" },
  { href: "/blog/inventory-management-guide", t: "AI Inventory Management: A Practical Guide", d: "How small businesses can predict stock demand and stop losing sales to stockouts.", date: "2026-02-03" },
];

export default function Page() {
  return (
    <MarketingPageWrapper scene="blog">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>Blog</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">Practical guides on AI for Indian small businesses.</AnimatedP>
        <StaggerList className="mt-10 space-y-6">
          {posts.map((p) => (
            <StaggerListItem key={p.href}>
              <Link href={p.href}>
                <AnimatedCard className="hover:border-indigo-500/30">
                  <p className="text-xs text-slate-500">{p.date}</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">{p.t}</h2>
                  <p className="mt-2 text-sm text-slate-400">{p.d}</p>
                </AnimatedCard>
              </Link>
            </StaggerListItem>
          ))}
        </StaggerList>
      </section>
    </MarketingPageWrapper>
  );
}
