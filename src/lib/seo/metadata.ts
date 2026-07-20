import type { Metadata } from "next";
import { siteConfig } from "./config";

function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
}

// Build consistent, unique metadata for a marketing page.
export function seoMetadata({
  title,
  description,
  path,
  keywords,
  ogImage = "/og-image.png",
}: SeoOptions): Metadata {
  const url = abs(path);
  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...(keywords ?? [])],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
