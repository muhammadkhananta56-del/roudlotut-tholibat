import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import ProgramCard from "@/components/site/ProgramCard";
import { getSettings, parseLines, parseParagraphs, parsePairs, s } from "@/lib/settings";
import { safeHttpUrl, waLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Pendaftaran",
  description: "Informasi pendaftaran santri Pondok Pesantren Roudlotut Tholibat: program, alur, persyaratan, dan kontak.",
};

export default async function PendaftaranPage() {
  const st = await getSettings();
  const status = s(st, "registration_status");
  const info = parseParagraphs(s(st, "registration_info"));
  const steps = parsePairs(s(st, "registration_steps"), 2);
  const reqs = parseLines(s(st, "registration_requirements"));
  const programs = parsePairs(s(st, "programs"), 2);
  const wa = waLink(s(st, "contact_whatsapp"), "Assalamu'alaikum, saya ingin menanyakan pendaftaran santri di Pondok Pesantren Roudlotut Tholibat.");
  const maps = safeHttpUrl(s(st, "contact_maps_url"));
  const address = s(st, "contact_address");
  const hours = s(st, "contact_hours");
  const hasDetail = info.length > 0 || steps.length > 0 || reqs.length > 0;

  return (
    <>
      <PageHero eyebrow="Pendaftaran" title="Bergabung bersama keluarga besar pondok">
        Kenali program yang tersedia, lalu hubungi kami untuk informasi pendaftaran terbaru.
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {status && (
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-2 font-semibold text-forest-900"><CheckCircle2 size={18} className="text-emerald-600" aria-hidden />{status}</p>
              </Reveal>
            )}
            {info.length > 0 && <Reveal delay={80} className="mt-6 space-y-5 text-lg text-ink-600">{info.map((p, i) => <p key={i}>{p}</p>)}</Reveal>}

            {steps.length > 0 && (
              <div className="mt-14">
                <SectionHeading eyebrow="Alur" title="Langkah pendaftaran" />
                <ol className="mt-8 border-l border-gold-500/60">
                  {steps.map(([t, d], i) => (
                    <li key={t} className="relative pb-8 pl-8 last:pb-0">
                      <Reveal delay={Math.min(i, 5) * 70}>
                        <span aria-hidden className="absolute -left-[0.8rem] top-0 flex h-[1.6rem] w-[1.6rem] items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-ivory-50">{i + 1}</span>
                        <h3 className="text-xl">{t}</h3>
                        {d && <p className="mt-1 text-ink-600">{d}</p>}
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {reqs.length > 0 && (
              <div className="mt-14">
                <SectionHeading eyebrow="Persyaratan" title="Yang perlu disiapkan" />
                <ul className="prose-rt mt-6">{reqs.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            )}

            {!hasDetail && !status && (
              <Reveal className="rounded-[var(--radius-media)] border border-sage-300 bg-paper p-7">
                <h2 className="text-2xl">Informasi pendaftaran</h2>
                <p className="mt-3 text-ink-600">Rincian alur dan persyaratan pendaftaran belum dipublikasikan di website. Silakan hubungi kami langsung untuk informasi terbaru.</p>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={100} className="on-dark pattern-light rounded-[var(--radius-media)] bg-forest-900 p-7 text-ivory-50 sm:p-9">
              <h2 className="text-2xl sm:text-3xl">Tanya pendaftaran</h2>
              <p className="mt-3 text-ivory-50/80">Kami siap menjawab pertanyaan tentang program, biaya, dan jadwal pendaftaran.</p>
              <div className="mt-7 flex flex-col gap-3">
                {wa && <a href={wa} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>}
                <Link href="/kontak" className={wa ? "btn btn-ghost" : "btn btn-primary"}>Kontak dan lokasi</Link>
                {maps && <a href={maps} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Buka peta</a>}
              </div>
              {(address || hours) && (
                <ul className="mt-7 space-y-2 border-t border-ivory-50/15 pt-6 text-[0.95rem] text-ivory-50/80">
                  {address && <li className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-gold-300" aria-hidden /><span className="whitespace-pre-line">{address}</span></li>}
                  {hours && <li className="pl-[1.875rem]">{hours}</li>}
                </ul>
              )}
            </Reveal>
          </aside>
        </Container>
      </section>

      {programs.length > 0 && (
        <section className="on-dark pattern-light relative bg-forest-900 py-20 text-ivory-50 sm:py-24">
          <Container>
            <SectionHeading eyebrow="Program" title="Program yang dapat diikuti" />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map(([n, d], i) => <li key={n}><Reveal delay={Math.min(i, 5) * 80} className="h-full"><ProgramCard name={n} desc={d} /></Reveal></li>)}
            </ul>
            <Link href="/profil#program" className="link-arrow mt-10">Baca profil program <ArrowRight size={18} aria-hidden /></Link>
          </Container>
        </section>
      )}
    </>
  );
}
