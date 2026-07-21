import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp"],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/admin/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended"],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/admin/"],
      },
      {
        userAgent: ["ClaudeBot", "PerplexityBot", "Applebot-Extended", "Meta-ExternalAgent"],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/admin/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/admin/"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
