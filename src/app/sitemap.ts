import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/features", priority: 0.9 },
    { path: "/features/ai-invoice-processing", priority: 0.8 },
    { path: "/features/inventory-ai", priority: 0.8 },
    { path: "/features/customer-ai", priority: 0.8 },
    { path: "/features/business-insights", priority: 0.8 },
    { path: "/solutions", priority: 0.8 },
    { path: "/solutions/kirana-store", priority: 0.7 },
    { path: "/solutions/pharmacy", priority: 0.7 },
    { path: "/solutions/retail-business", priority: 0.7 },
    { path: "/blog", priority: 0.8 },
    { path: "/blog/how-ai-helps-msme", priority: 0.6 },
    { path: "/blog/inventory-management-guide", priority: 0.6 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
  ];

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}
