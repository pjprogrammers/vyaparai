import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI Software for Kirana Stores | VyaparAI",
  description: "AI software for kirana stores in India. Automate billing, inventory and stock prediction so owners can focus on customers.",
  path: "/solutions/kirana-store",
  keywords: ["AI software for kirana store", "small business automation India", "AI inventory management India"],
});

export default function Page() {
  return (
    <MarketingPageWrapper scene="solution">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Kirana Store", path: "/solutions/kirana-store" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>VyaparAI for Kirana Stores</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">Your neighbourhood store runs on thin margins and fast footfall. VyaparAI acts as an AI employee that handles billing, stock and demand prediction.</AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">No more manual stock books</h2>
            <p className="mt-2 text-slate-400">Upload supplier bills and inventory updates itself. Get low-stock alerts before you run out of Rice or Sugar.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Answer customers instantly</h2>
            <p className="mt-2 text-slate-400">The Customer AI checks live stock and drafts accurate replies you approve before sending.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features/inventory-ai" className="font-semibold text-indigo-400 hover:underline">Inventory AI →</Link>
          <Link href="/auth" className="font-semibold text-indigo-400 hover:underline">Start Free →</Link>
        </div>
      </section>
    </MarketingPageWrapper>
  );
}
