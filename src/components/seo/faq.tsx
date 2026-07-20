import { faqSchema } from "@/lib/seo/schema";
import { JsonLd } from "./json-ld";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({
  items,
  title = "Frequently Asked Questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-6 py-16">
      <h2 id="faq-heading" className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
      <dl className="mt-6 space-y-4">
        {items.map((it) => (
          <div key={it.question} className="rounded-2xl border border-slate-200 bg-white p-5">
            <dt className="font-semibold text-slate-900">{it.question}</dt>
            <dd className="mt-1 text-sm text-slate-600">{it.answer}</dd>
          </div>
        ))}
      </dl>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
