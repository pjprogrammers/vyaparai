import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = seoMetadata({
  title: "AI Solutions for Indian Businesses | VyaparAI",
  description:
    "VyaparAI helps kirana stores, pharmacies and retail businesses in India automate invoices, inventory and customer operations with AI.",
  path: "/solutions",
  keywords: [
    "AI software for kirana store",
    "AI inventory management India",
    "small business automation India",
    "MSME digital transformation",
  ],
});

const solutions = [
  {
    href: "/solutions/kirana-store",
    t: "Kirana Store",
    d: "Automate billing, stock and daily ops for your neighbourhood store.",
  },
  {
    href: "/solutions/pharmacy",
    t: "Pharmacy",
    d: "Track medicines, expiry and demand with AI inventory.",
  },
  {
    href: "/solutions/retail-business",
    t: "Retail Business",
    d: "Scale with AI insights, forecasting and automation.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Solutions</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          VyaparAI is built for the way Indian small businesses actually work.
          Pick your type to see what AI automation looks like for you.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {solutions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400"
            >
              <h2 className="text-xl font-semibold text-slate-900">{s.t}</h2>
              <p className="mt-2 text-sm text-slate-500">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
