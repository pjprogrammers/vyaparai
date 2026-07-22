import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";
import { MarketingPageWrapper, AnimatedH1, AnimatedP, AnimatedArticle } from "@/components/3d/marketing-wrapper";

export const metadata: Metadata = seoMetadata({
  title: "Customer AI Assistant for WhatsApp & Web | VyaparAI",
  description: "Grounded AI customer reply assistant that checks inventory, follows business rules and waits for owner approval before sending.",
  path: "/features/customer-ai",
  keywords: ["AI customer reply assistant", "WhatsApp AI assistant for business", "AI sales assistant"],
});

const faqs: FaqItem[] = [
  { question: "Does the AI answer customers directly?", answer: "No. The AI checks your inventory, drafts a reply grounded in real stock and price, and waits for the owner to approve before anything is sent." },
  { question: "Which channels are supported?", answer: "The assistant is designed for WhatsApp and web enquiries, with the owner-approval gate at the centre of the workflow." },
  { question: "What if an item is out of stock?", answer: "The AI is instructed by business rules to politely say the item is unavailable and offer to notify the customer when it returns." },
];

export default function Page() {
  return (
    <MarketingPageWrapper scene="customer">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "Customer AI", path: "/features/customer-ai" }])} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <AnimatedH1>Customer AI</AnimatedH1>
        <AnimatedP delay={0.1} className="mt-4">A customer AI assistant that never hallucinates. It checks inventory, follows your business rules, drafts a reply and waits for your approval.</AnimatedP>
        <div className="mt-10 space-y-8">
          <AnimatedArticle delay={0.2}>
            <h2 className="text-2xl font-semibold text-white">Inventory-grounded replies</h2>
            <p className="mt-2 text-slate-400">"Do you have Aashirvaad Atta?" → the AI checks stock, sees 20 packets, and drafts an accurate, priced response.</p>
          </AnimatedArticle>
          <AnimatedArticle delay={0.3}>
            <h2 className="text-2xl font-semibold text-white">Owner approval gate</h2>
            <p className="mt-2 text-slate-400">Customer message → inventory check → business rules → AI draft → owner approval → send. You stay in control.</p>
          </AnimatedArticle>
        </div>
        <div className="mt-10 flex gap-4">
          <Link href="/features/business-insights" className="font-semibold text-yellow-400 hover:underline">Next: Business Insights →</Link>
          <Link href="/auth" className="font-semibold text-yellow-400 hover:underline">Try VyaparAI →</Link>
        </div>
      </section>
      <FaqSection items={faqs} />
    </MarketingPageWrapper>
  );
}
