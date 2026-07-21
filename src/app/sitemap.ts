import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const routes: {
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/features/ai-invoice-processing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/features/inventory-ai", priority: 0.8, changeFrequency: "monthly" },
    { path: "/features/customer-ai", priority: 0.8, changeFrequency: "monthly" },
    { path: "/features/business-insights", priority: 0.8, changeFrequency: "monthly" },
    { path: "/solutions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/solutions/kirana-store", priority: 0.7, changeFrequency: "monthly" },
    { path: "/solutions/pharmacy", priority: 0.7, changeFrequency: "monthly" },
    { path: "/solutions/retail-business", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blog/how-ai-helps-msme", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog/inventory-management-guide", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
