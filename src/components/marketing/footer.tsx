import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features/ai-invoice-processing", label: "AI Invoice Processing" },
      { href: "/features/inventory-ai", label: "Inventory AI" },
      { href: "/features/customer-ai", label: "Customer AI" },
      { href: "/features/business-insights", label: "Business Insights" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/kirana-store", label: "Kirana Store" },
      { href: "/solutions/pharmacy", label: "Pharmacy" },
      { href: "/solutions/retail-business", label: "Retail Business" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              V
            </span>
            VyaparAI
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            AI-powered business automation assistant for Indian MSMEs.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} VyaparAI. All rights reserved. Made in India.
      </div>
    </footer>
  );
}
