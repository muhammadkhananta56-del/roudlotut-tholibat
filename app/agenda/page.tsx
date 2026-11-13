import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import AgendaRow from "@/components/ui/AgendaRow";
import { pastAgenda, sortedAgenda, upcomingAgenda } from "@/lib/data/agenda";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Agenda",
  description: "Agenda kegiatan PP. Roudlotut Tholibat.",
  path: "/agenda",
});

export default function AgendaPage() {
  const all = sortedAgenda();
  const upcoming = upcomingAgenda();
  const past = pastAgenda();
  return (
    <>
      <PageHero title="Agenda Kegiatan" description="Jadwal kegiatan yang akan dan telah berlangsung." crumbs={[{ label: "Agenda" }]} />
      <PageBody>
        <Container className="space-y-14 pb-20">
          {all.length === 0 ? (
            <EmptyState
              title="Agenda belum ditambahkan"
              action={{ href: siteConfig.instagram, label: `Cek kabar di Instagram ${siteConfig.instagramHandle}`, external: true }}
            >
              <p>Jadwal kegiatan akan tampil di sini setelah diterima dari pihak pondok.</p>
            </EmptyState>
          ) : (
            <>
              <section aria-labelledby="akan-datang" className="max-w-3xl space-y-4">
                <h2 id="akan-datang" className="text-2xl font-bold text-brand-900">Akan datang</h2>
                {upcoming.length > 0 ? (
                  <ul>{upcoming.map((a) => <AgendaRow key={a.id} item={a} />)}</ul>
                ) : (
                  <p className="text-ink-500">Belum ada agenda mendatang.</p>
                )}
              </section>
              {past.length > 0 && (
                <section aria-labelledby="telah-berlangsung" className="max-w-3xl space-y-4">
                  <h2 id="telah-berlangsung" className="text-2xl font-bold text-brand-900">Telah berlangsung</h2>
                  <ul>{past.map((a) => <AgendaRow key={a.id} item={a} />)}</ul>
                </section>
              )}
            </>
          )}
        </Container>
      </PageBody>
    </>
  );
}
