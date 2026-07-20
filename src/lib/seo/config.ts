export const siteConfig = {
  name: "VyaparAI",
  // Domain is read from env (NEXT_PUBLIC_SITE_URL) so staging/production
  // share one codebase. Falls back to the canonical production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://vyaparai.vercel.app",
  tagline: "AI Employee for Your Business",
  description:
    "VyaparAI is an AI-powered business automation assistant for Indian MSMEs. Automate invoices, inventory, customer support, reports and business insights with AI.",
  locale: "en_IN",
  twitter: "@vyaparai",
  // Brand + primary SaaS keywords (avoid stuffing; used for metadata hints).
  keywords: [
    "vyaparai",
    "vyapar ai",
    "vyaparai software",
    "AI business assistant",
    "AI automation software for MSME",
    "AI tools for small business India",
    "AI invoice processing",
    "AI inventory management",
    "MSME digital transformation",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
