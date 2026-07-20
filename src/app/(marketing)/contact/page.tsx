import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = seoMetadata({
  title: "Contact VyaparAI — AI for Indian MSMEs",
  description:
    "Get in touch with the VyaparAI team for demos, partnerships and support for AI business automation.",
  path: "/contact",
  keywords: ["vyaparai contact", "AI automation software for MSME"],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Contact us</h1>
        <p className="mt-4 text-lg text-slate-600">
          Want a demo or have questions about AI automation for your business?
          Reach out and we'll get back to you.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <ul className="space-y-3 text-slate-700">
            <li>
              <span className="font-semibold">Email:</span>{" "}
              <a href="mailto:hello@vyaparai.com" className="text-indigo-600 hover:underline">
                hello@vyaparai.com
              </a>
            </li>
            <li>
              <span className="font-semibold">Website:</span>{" "}
              <a href={siteConfig.url} className="text-indigo-600 hover:underline">
                {siteConfig.url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            For product support, use the in-app help after signing up at{" "}
            <a href="/auth" className="text-indigo-600 hover:underline">
              Start Free
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
