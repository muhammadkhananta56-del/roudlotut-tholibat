import type { Metadata, Viewport } from "next";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/amiri/arabic-400.css";
import "./globals.css";
import { SITE_FULL_NAME, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE_FULL_NAME, template: `%s | ${SITE_FULL_NAME}` },
  applicationName: SITE_FULL_NAME,
  openGraph: { type: "website", locale: "id_ID", siteName: SITE_FULL_NAME },
};

export const viewport: Viewport = { themeColor: "#0f3b2e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
