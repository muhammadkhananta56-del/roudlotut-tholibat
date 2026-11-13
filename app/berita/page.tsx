import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import NewsBrowser from "@/components/sections/NewsBrowser";
import { sortedNews } from "@/lib/data/berita";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Berita",
  description: "Berita dan pengumuman terbaru dari PP. Roudlotut Tholibat.",
  path: "/berita",
});

export default function BeritaPage() {
  return (
    <>
      <PageHero
        title="Berita dan Pengumuman"
        description="Kabar terbaru dari pondok."
        crumbs={[{ label: "Berita" }]}
      />
      <PageBody>
        <Container className="pb-20">
          <NewsBrowser items={sortedNews()} />
        </Container>
      </PageBody>
    </>
  );
}
