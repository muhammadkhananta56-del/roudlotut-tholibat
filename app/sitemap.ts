import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { allPublishedNewsSlugs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ["", "/profil", "/sejarah", "/berita", "/jadwal", "/pendaftaran", "/galeri", "/kontak"].map((p) => ({
    url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7,
  }));
  try {
    const news = await allPublishedNewsSlugs();
    return [...pages, ...news.map((n) => ({ url: `${base}/berita/${n.slug}`, lastModified: n.updated_at, priority: 0.6 }))];
  } catch {
    return pages;
  }
}
