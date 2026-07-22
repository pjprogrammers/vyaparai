import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI for Retail Businesses | VyaparAI",
  description: "AI powered business management software for retail businesses in India. Automate operations, forecasting and customer engagement.",
  path: "/solutions/retail-business",
  keywords: ["AI powered business management software", "AI ERP for small businesses", "MSME digital transformation"],
});

export default function Page() {
  return (
    <MarketingPageWrapper scene="solution">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Retail Business", path: "/solutions/retail-business" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>VyaparAI for Retail Businesses</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">Scale your retail store with an AI ERP alternative that is simpler and built for Indian MSMEs.</AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">Forecast demand</h2>
            <p className="mt-2 text-slate-400">Predict next month's revenue and stock needs from your real sales history.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Automate the back office</h2>
            <p className="mt-2 text-slate-400">From invoice capture to inventory and insights, VyaparAI reduces the manual work that slows retail growth.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features/business-insights" className="font-semibold text-yellow-400 hover:underline">Business Insights →</Link>
          <Link href="/auth" className="font-semibold text-yellow-400 hover:underline">Start Free →</Link>
        </div>
      </section>
    </MarketingPageWrapper>
  );
}
