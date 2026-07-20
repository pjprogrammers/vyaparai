import Link from "next/link";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = seoMetadata({
  title: "AI for Retail Businesses | VyaparAI",
  description:
    "AI powered business management software for retail businesses in India. Automate operations, forecasting and customer engagement.",
  path: "/solutions/retail-business",
  keywords: ["AI powered business management software", "AI ERP for small businesses", "MSME digital transformation"],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Retail Business", path: "/solutions/retail-business" },
        ])}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">VyaparAI for Retail Businesses</h1>
        <p className="mt-4 text-lg text-slate-600">
          Scale your retail store with an AI ERP alternative that is simpler and
          built for Indian MSMEs — automation, forecasting and insights in one place.
        </p>

        <div className="mt-10 space-y-8">
          <article>
            <h2 className="text-2xl font-semibold text-slate-900">Forecast demand</h2>
            <p className="mt-2 text-slate-600">
              Predict next month's revenue and stock needs from your real sales
              history.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-semibold text-slate-900">Automate the back office</h2>
            <p className="mt-2 text-slate-600">
              From invoice capture to inventory and insights, VyaparAI reduces the
              manual work that slows retail growth.
            </p>
          </article>
        </div>

        <div className="mt-10 flex gap-4">
          <Link href="/features/business-insights" className="font-semibold text-indigo-600 hover:underline">
            Business Insights →
          </Link>
          <Link href="/auth" className="font-semibold text-indigo-600 hover:underline">
            Start Free →
          </Link>
        </div>
      </section>
    </>
  );
}
