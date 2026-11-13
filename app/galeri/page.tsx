import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import GalleryBrowser from "@/components/sections/GalleryBrowser";
import { sortedGallery, videos } from "@/lib/data/galeri";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Galeri",
  description: "Dokumentasi foto dan video kegiatan PP. Roudlotut Tholibat.",
  path: "/galeri",
});

export default function GaleriPage() {
  return (
    <>
      <PageHero
        title="Galeri"
        description="Dokumentasi kegiatan santri. Klik foto untuk memperbesar."
        crumbs={[{ label: "Galeri" }]}
      />
      <PageBody>
        <Container className="space-y-16 pb-20">
          <GalleryBrowser items={sortedGallery()} />
          {videos.length > 0 && (
            <section aria-labelledby="judul-video" className="space-y-6">
              <h2 id="judul-video" className="text-3xl font-bold text-brand-900">
                Video
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {videos.map((v) => (
                  <li key={v.id}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-card bg-cream-50 p-5 transition hover:bg-cream-100"
                    >
                      <span className="block font-semibold text-brand-900">{v.title}</span>
                      <span className="text-sm text-ink-500">{formatDate(v.date)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </PageBody>
    </>
  );
}
