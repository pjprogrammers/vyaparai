import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI Business Insights & Analytics | VyaparAI",
  description: "AI business insights engine that analyses sales, inventory and expenses to give Indian MSMEs actionable recommendations.",
  path: "/features/business-insights",
  keywords: ["AI business insights", "AI analytics for small business", "sales forecasting software"],
});

const faqs: FaqItem[] = [
  { question: "What does the insights engine analyse?", answer: "It analyses your sales, inventory and expenses with Gemini AI and produces plain-language, actionable recommendations." },
  { question: "Does it forecast sales?", answer: "Yes. Based on your historical revenue, VyaparAI predicts next month's expected revenue and explains the trend." },
  { question: "How often are insights generated?", answer: "Insights can be generated on demand from the dashboard and are designed to run daily as part of the automation engine." },
];

export default function Page() {
  return (
    <MarketingPageWrapper scene="insights">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "Business Insights", path: "/features/business-insights" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>Business Insights</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">Move from raw data to decisions. VyaparAI's insights engine turns your business activity into recommendations you can act on.</AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">Proactive recommendations</h2>
            <p className="mt-2 text-slate-400">"Your Rice sales increased 20%. Customers who buy Rice also buy Oil — create a combo offer."</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Sales forecasting</h2>
            <p className="mt-2 text-slate-400">Predict next month's revenue from past performance, with a clear explanation of the trend.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features" className="font-semibold text-yellow-400 hover:underline">← All features</Link>
          <Link href="/blog" className="font-semibold text-yellow-400 hover:underline">Read the blog →</Link>
        </div>
      </section>
      <FaqSection items={faqs} />
    </MarketingPageWrapper>
  );
}
