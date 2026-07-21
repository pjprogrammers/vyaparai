import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedCard, StaggerList, StaggerListItem } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "Contact VyaparAI — AI for Indian MSMEs",
  description: "Get in touch with the VyaparAI team for demos, partnerships, support and questions about AI business automation.",
  path: "/contact",
  keywords: ["vyaparai contact", "AI automation software for MSME", "vyaparai support", "vyaparai demo"],
});

export default function Page() {
  return (
    <MarketingPageWrapper scene="contact">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-3 inline-block rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1 text-sm font-medium text-indigo-400">Get in Touch</p>
        <AnimatedH1>Talk to the VyaparAI Team</AnimatedH1>
        <AnimatedP delay={0.1} className="mx-auto mt-6 max-w-2xl">
          We would love to hear from you. Whether you have a question, want a demo, need support, or want to explore partnerships.
        </AnimatedP>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <StaggerList className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {[
            { icon: <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: "Email Us", desc: "For product questions, partnership inquiries or general feedback.", link: "hello@vyaparai.com", href: "mailto:hello@vyaparai.com" },
            { icon: <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: "Get a Demo", desc: "See VyaparAI in action for your business type.", link: "Start Free →", href: "/auth" },
            { icon: <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>, title: "Product Support", desc: "Already using VyaparAI? Use the in-app help section.", link: "Open Dashboard →", href: "/auth" },
            { icon: <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: "Partnerships", desc: "Interested in integrating or becoming a channel partner?", link: "partnerships@vyaparai.com", href: "mailto:partnerships@vyaparai.com" },
          ].map((c) => (
            <StaggerListItem key={c.title}>
              <AnimatedCard className="h-full hover:border-indigo-500/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">{c.icon}</div>
                <h2 className="text-lg font-semibold text-white">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
                <a href={c.href} className="mt-4 inline-block text-sm font-semibold text-indigo-400 hover:underline">{c.link}</a>
              </AnimatedCard>
            </StaggerListItem>
          ))}
        </StaggerList>
      </section>
    </MarketingPageWrapper>
  );
}
