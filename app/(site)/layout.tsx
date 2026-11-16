import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSettings, s } from "@/lib/settings";
import { publicUrl } from "@/lib/storage";
import { SITE_FULL_NAME } from "@/lib/site";

// Konten berasal dari database dan harus selalu segar setelah admin menyimpan perubahan.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const st = await getSettings();
    const og = publicUrl(s(st, "hero_image"));
    const description = s(st, "site_description");
    return { description, openGraph: { title: SITE_FULL_NAME, description, ...(og ? { images: [og] } : {}) } };
  } catch {
    return {};
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <a href="#konten" className="fixed left-3 top-3 z-[60] -translate-y-24 rounded bg-forest-900 px-4 py-2 font-semibold text-ivory-50 focus:translate-y-0">Lewati ke konten</a>
      <Header logoUrl={publicUrl(s(settings, "logo"))} />
      <main id="konten">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
