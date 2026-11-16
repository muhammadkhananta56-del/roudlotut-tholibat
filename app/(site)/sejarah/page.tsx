import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/motion/Reveal";
import PageHero from "@/components/site/PageHero";
import { getSettings, parsePairs, s } from "@/lib/settings";

export const metadata: Metadata = { title: "Sejarah", description: "Perjalanan Pondok Pesantren Roudlotut Tholibat." };

export default async function SejarahPage() {
  const events = parsePairs(s(await getSettings(), "history"), 3);
  return (
    <>
      <PageHero eyebrow="Sejarah" title="Perjalanan pondok kami">Dari waktu ke waktu, langkah demi langkah.</PageHero>
      <section className="py-20 sm:py-24">
        <Container>
          {events.length === 0 ? (
            <EmptyState title="Sejarah sedang disiapkan">Catatan perjalanan pondok akan segera ditampilkan di halaman ini.</EmptyState>
          ) : (
            <ol className="relative mx-auto max-w-3xl border-l border-gold-500/60 pl-8 sm:pl-12">
              {events.map(([year, title, desc], i) => (
                <li key={i} className="relative pb-12 last:pb-0">
                  <span aria-hidden className="absolute -left-[2.45rem] top-2 h-3 w-3 rotate-45 bg-gold-500 sm:-left-[3.45rem]" />
                  <Reveal>
                    {year && <p className="font-display text-3xl text-gold-700 sm:text-4xl">{year}</p>}
                    {title && <h2 className="mt-1 text-2xl sm:text-3xl">{title}</h2>}
                    {desc && <p className="mt-3 max-w-prose text-lg text-ink-600">{desc}</p>}
                  </Reveal>
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>
    </>
  );
}
