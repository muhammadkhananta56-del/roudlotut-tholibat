import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/motion/Reveal";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import { getSettings, parseLines, parseParagraphs, parsePairs, s } from "@/lib/settings";
import { publicUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Profil", description: "Profil, visi, misi, nilai, program, dan fasilitas Pondok Pesantren Roudlotut Tholibat." };

export default async function ProfilPage() {
  const st = await getSettings();
  const about = parseParagraphs(s(st, "about_summary"));
  const vision = s(st, "vision");
  const mission = parseLines(s(st, "mission"));
  const values = parsePairs(s(st, "values"), 2);
  const programs = parsePairs(s(st, "programs"), 2);
  const facilities = parsePairs(s(st, "facilities"), 2);
  const greeting = parseParagraphs(s(st, "caretaker_greeting"));
  const photo = publicUrl(s(st, "caretaker_photo"));
  const empty = !about.length && !vision && !mission.length && !values.length && !facilities.length && !greeting.length;

  return (
    <>
      <PageHero eyebrow="Profil" title="Mengenal Pondok Pesantren Roudlotut Tholibat">Identitas, arah, dan lingkungan belajar kami.</PageHero>
      {empty ? (
        <section className="py-24"><Container><EmptyState title="Profil sedang disiapkan">Informasi profil pondok akan segera ditampilkan di halaman ini.</EmptyState></Container></section>
      ) : (
        <>
          {about.length > 0 && (
            <section className="py-20 sm:py-24">
              <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <SectionHeading className="lg:col-span-5" eyebrow="Tentang" title="Siapa kami" />
                <Reveal className="space-y-5 text-lg text-ink-600 lg:col-span-7">{about.map((p, i) => <p key={i}>{p}</p>)}</Reveal>
              </Container>
            </section>
          )}

          {greeting.length > 0 && (
            <section className="bg-sage-50 py-20 sm:py-24">
              <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                {photo && (
                  <Reveal variant="wipe" className="lg:col-span-4">
                    <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-t-full"><Photo src={photo} alt={s(st, "caretaker_name") || "Pengasuh pondok"} sizes="(min-width:1024px) 22rem, 80vw" /></div>
                  </Reveal>
                )}
                <Reveal className={photo ? "lg:col-span-8" : "lg:col-span-12 lg:max-w-3xl"}>
                  <p className="eyebrow">Sambutan Pengasuh</p>
                  <div className="mt-4 space-y-4 text-lg text-ink-600">{greeting.map((p, i) => <p key={i}>{p}</p>)}</div>
                  {s(st, "caretaker_name") && <p className="mt-6 font-display text-xl text-forest-900">{s(st, "caretaker_name")}</p>}
                </Reveal>
              </Container>
            </section>
          )}

          {(vision || mission.length > 0) && (
            <section className="on-dark pattern-light bg-forest-900 py-20 text-ivory-50 sm:py-24">
              <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                {vision && <Reveal><p className="eyebrow">Visi</p><p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">{vision}</p></Reveal>}
                {mission.length > 0 && (
                  <Reveal delay={100}>
                    <p className="eyebrow">Misi</p>
                    <ol className="mt-4 space-y-4">
                      {mission.map((m, i) => <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 text-lg text-ivory-50/90"><span className="font-display text-xl text-gold-300">{String(i + 1).padStart(2, "0")}</span>{m}</li>)}
                    </ol>
                  </Reveal>
                )}
              </Container>
            </section>
          )}

          {values.length > 0 && (
            <section className="py-20 sm:py-24">
              <Container>
                <SectionHeading eyebrow="Nilai dan Keunggulan" title="Yang kami jaga" />
                <ul className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                  {values.map(([t, d], i) => (
                    <li key={t}><Reveal delay={(i % 3) * 80} className="border-t border-sage-300 py-7"><h3 className="text-2xl">{t}</h3>{d && <p className="mt-2 text-ink-600">{d}</p>}</Reveal></li>
                  ))}
                </ul>
              </Container>
            </section>
          )}

          {programs.length > 0 && (
            <section id="program" className="bg-ivory-100 py-20 sm:py-24">
              <Container>
                <SectionHeading eyebrow="Pendidikan" title="Program pendidikan" />
                <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
                  {programs.map(([t, d]) => <li key={t} className="border-t border-sage-300 py-6"><h3 className="text-2xl">{t}</h3>{d && <p className="mt-2 text-ink-600">{d}</p>}</li>)}
                </ul>
              </Container>
            </section>
          )}

          {facilities.length > 0 && (
            <section className="py-20 sm:py-24">
              <Container>
                <SectionHeading eyebrow="Fasilitas" title="Sarana belajar dan tinggal" />
                <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
                  {facilities.map(([t, d]) => <li key={t} className="border-t border-sage-300 py-6"><h3 className="text-2xl">{t}</h3>{d && <p className="mt-2 text-ink-600">{d}</p>}</li>)}
                </ul>
              </Container>
            </section>
          )}
        </>
      )}
    </>
  );
}
