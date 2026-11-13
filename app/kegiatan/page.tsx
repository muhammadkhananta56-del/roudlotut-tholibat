import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import ActivityBrowser from "@/components/sections/ActivityBrowser";
import { activities } from "@/lib/data/kegiatan";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Kegiatan",
  description: "Kegiatan harian, keagamaan, khataman, dan kegiatan santri di PP. Roudlotut Tholibat.",
  path: "/kegiatan",
});

export default function KegiatanPage() {
  return (
    <>
      <PageHero
        title="Kegiatan Pondok"
        description="Kegiatan santri dari hari ke hari, dari ngaji harian sampai khataman."
        crumbs={[{ label: "Kegiatan" }]}
      />
      <PageBody>
        <Container className="pb-20">
          <ActivityBrowser items={activities} />
        </Container>
      </PageBody>
    </>
  );
}
