import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedCard, StaggerList, StaggerListItem } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "AI Solutions for Indian Businesses | VyaparAI",
  description: "VyaparAI helps kirana stores, pharmacies and retail businesses in India automate invoices, inventory and customer operations with AI.",
  path: "/solutions",
  keywords: ["AI software for kirana store", "AI inventory management India", "small business automation India", "MSME digital transformation"],
});

const solutions = [
  { href: "/solutions/kirana-store", t: "Kirana Store", d: "Automate billing, stock and daily ops for your neighbourhood store." },
  { href: "/solutions/pharmacy", t: "Pharmacy", d: "Track medicines, expiry and demand with AI inventory." },
  { href: "/solutions/retail-business", t: "Retail Business", d: "Scale with AI insights, forecasting and automation." },
];

export default function Page() {
  return (
    <MarketingPageWrapper scene="solution">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }])} />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <AnimatedH1>Solutions</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4 max-w-2xl">VyaparAI is built for the way Indian small businesses actually work. Pick your type to see what AI automation looks like for you.</AnimatedP>
        <StaggerList className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {solutions.map((s, i) => (
            <StaggerListItem key={s.href}>
              <Link href={s.href}>
                <AnimatedCard delay={i * 0.1} className="h-full hover:border-indigo-500/30">
                  <h2 className="text-xl font-semibold text-white">{s.t}</h2>
                  <p className="mt-2 text-sm text-slate-400">{s.d}</p>
                </AnimatedCard>
              </Link>
            </StaggerListItem>
          ))}
        </StaggerList>
      </section>
    </MarketingPageWrapper>
  );
}
