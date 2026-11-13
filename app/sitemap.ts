import type { MetadataRoute } from "next";
import { siteConfig, programs, profilePages } from "@/lib/site";
import { news } from "@/lib/data/berita";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const fixed = [
    "/",
    "/program",
    "/kegiatan",
    "/galeri",
    "/berita",
    "/ppdb",
    "/agenda",
    "/faq",
    "/kontak",
    "/kebijakan-privasi",
  ];
  const paths = [
    ...fixed,
    ...profilePages.map((p) => p.href),
    ...programs.map((p) => `/program/${p.slug}`),
    ...news.map((n) => `/berita/${n.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}` }));
}
