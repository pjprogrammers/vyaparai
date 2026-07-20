import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection, type FaqItem } from "@/components/seo/faq";

export const metadata: Metadata = seoMetadata({
  title: "Customer AI Assistant for WhatsApp & Web | VyaparAI",
  description:
    "Grounded AI customer reply assistant that checks inventory, follows business rules and waits for owner approval before sending.",
  path: "/features/customer-ai",
  keywords: [
    "AI customer reply assistant",
    "WhatsApp AI assistant for business",
    "AI sales assistant",
  ],
});

const faqs: FaqItem[] = [
  {
    question: "Does the AI answer customers directly?",
    answer:
      "No. The AI checks your inventory, drafts a reply grounded in real stock and price, and waits for the owner to approve before anything is sent. This prevents hallucination.",
  },
  {
    question: "Which channels are supported?",
    answer:
      "The assistant is designed for WhatsApp and web enquiries, with the owner-approval gate at the centre of the workflow.",
  },
  {
    question: "What if an item is out of stock?",
    answer:
      "The AI is instructed by business rules to politely say the item is unavailable and offer to notify the customer when it returns.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
          { name: "Customer AI", path: "/features/customer-ai" },
        ])}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Customer AI</h1>
        <p className="mt-4 text-lg text-slate-600">
          A customer AI assistant that never hallucinates. It checks inventory,
          follows your business rules, drafts a reply and waits for your approval.
        </p>

        <div className="mt-10 space-y-8">
          <article>
            <h2 className="text-2xl font-semibold text-slate-900">Inventory-grounded replies</h2>
            <p className="mt-2 text-slate-600">
              “Do you have Aashirvaad Atta?” → the AI checks stock, sees 20 packets,
              and drafts an accurate, priced response.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-semibold text-slate-900">Owner approval gate</h2>
            <p className="mt-2 text-slate-600">
              Customer message → inventory check → business rules → AI draft → owner
              approval → send. You stay in control.
            </p>
          </article>
        </div>

        <div className="mt-10 flex gap-4">
          <Link href="/features/business-insights" className="font-semibold text-indigo-600 hover:underline">
            Next: Business Insights →
          </Link>
          <Link href="/auth" className="font-semibold text-indigo-600 hover:underline">
            Try VyaparAI →
          </Link>
        </div>
      </section>

      <FaqSection items={faqs} />
    </>
  );
}
