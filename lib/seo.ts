import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${opts.title} | ${siteConfig.shortName}`,
      description: opts.description,
      url: opts.path,
      locale: "id_ID",
      type: "website",
      siteName: siteConfig.name,
    },
  };
}
