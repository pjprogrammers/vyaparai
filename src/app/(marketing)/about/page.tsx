import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle, AnimatedCard, StaggerList, StaggerListItem } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "About VyaparAI — AI for Indian MSMEs",
  description: "VyaparAI is on a mission to give every Indian small business an AI employee that automates invoices, inventory and insights.",
  path: "/about",
  keywords: ["vyaparai india", "AI tools for MSME India", "MSME digital transformation", "about vyaparai"],
});

export default function Page() {
  return (
    <MarketingPageWrapper scene="about">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-3 inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1 text-sm font-medium text-indigo-400">Our Story</p>
        <AnimatedH1>We Believe Every Indian Business Deserves an AI Employee</AnimatedH1>
        <AnimatedP delay={0.1} className="mx-auto mt-6 max-w-2xl">
          VyaparAI is an AI-powered business automation platform that helps Indian MSMEs manage invoices, inventory, customers and insights.
        </AnimatedP>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedArticle delay={0.1}>
          <h2 className="text-2xl font-bold text-white">Our Story</h2>
          <p className="mt-4 leading-relaxed text-slate-400">India has over 63 million MSMEs that form the backbone of the economy. Yet most still run on paper ledgers and WhatsApp messages. We started VyaparAI with a simple idea: what if every small business could have an AI employee?</p>
        </AnimatedArticle>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedArticle delay={0.1}>
          <h2 className="text-2xl font-bold text-white">Our Values</h2>
        </AnimatedArticle>
        <StaggerList className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {[
            { title: "Democratize Operations", desc: "Every small shop deserves the same operational leverage as a large enterprise." },
            { title: "Automation Over Chat", desc: "We build autonomous workflows, not chatbots." },
            { title: "Privacy First", desc: "Your data stays yours — we never train on your documents." },
            { title: "Built for India", desc: "Designed for Indian MSMEs with understanding of Indian tax structures and supplier patterns." },
          ].map((v) => (
            <StaggerListItem key={v.title}>
              <AnimatedCard><h3 className="font-semibold text-white">{v.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{v.desc}</p></AnimatedCard>
            </StaggerListItem>
          ))}
        </StaggerList>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedArticle delay={0.1}>
          <h2 className="text-2xl font-bold text-white">How VyaparAI Works</h2>
        </AnimatedArticle>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-4">
          {[
            { step: "01", title: "Upload a Document", desc: "Take a photo of a supplier bill or upload a PDF." },
            { step: "02", title: "AI Processes & Understands", desc: "OCR extracts text, Gemini AI understands the structure." },
            { step: "03", title: "Inventory & Expenses Update", desc: "Stock levels adjust automatically." },
            { step: "04", title: "Insights & Predictions", desc: "Get AI-powered recommendations grounded in your data." },
          ].map((s, i) => (
            <AnimatedArticle key={s.step} delay={i * 0.1}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-lg font-bold text-indigo-400">{s.step}</div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
              </div>
            </AnimatedArticle>
          ))}
        </div>
      </section>
    </MarketingPageWrapper>
  );
}
