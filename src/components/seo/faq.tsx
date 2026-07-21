import { faqSchema } from "@/lib/seo/schema";
import { JsonLd } from "./json-ld";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({
  items,
  title = "Frequently Asked Questions",
  subtitle,
}: {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-6 py-16">
      <h2 id="faq-heading" className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-slate-500">{subtitle}</p>
      )}
      <div className="mt-6 space-y-3">
        {items.map((it) => (
          <details
            key={it.question}
            className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between font-medium text-slate-900 list-none [&::-webkit-details-marker]:hidden">
              <span>{it.question}</span>
              <svg
                className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{it.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
