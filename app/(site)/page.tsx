import { withTimeout } from "@/lib/safe";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import StarMotif from "@/components/ui/StarMotif";
import Photo from "@/components/ui/Photo";
import Ornament from "@/components/ui/Ornament";
import Wave from "@/components/ui/Wave";
import Reveal from "@/components/motion/Reveal";
import ScrollScene from "@/components/motion/ScrollScene";
import Parallax from "@/components/motion/Parallax";
import SectionHeading from "@/components/site/SectionHeading";
import NewsCard from "@/components/site/NewsCard";
import ScheduleRow from "@/components/site/ScheduleRow";
import ProgramCard from "@/components/site/ProgramCard";
import { getSettings, parseParagraphs, parsePairs, s } from "@/lib/settings";
import { homeGallery, latestNews, upcomingSchedules } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import { safeHttpUrl, waLink } from "@/lib/contact";
import { SITE_FULL_NAME, siteUrl } from "@/lib/site";

export default async function HomePage() {
  const [st, schedules, news, gallery] = await Promise.all([
    getSettings(),
    withTimeout(upcomingSchedules(3), 8000, "upcomingSchedules"),
    withTimeout(latestNews(3), 8000, "latestNews"),
    withTimeout(homeGallery(6), 8000, "homeGallery"),
  ]);
  const heroImg = publicUrl(s(st, "hero_image"));
  const caretakerImg = publicUrl(s(st, "caretaker_photo"));
  const about = parseParagraphs(s(st, "about_summary"));
  const greeting = s(st, "caretaker_greeting");
  const programs = parsePairs(s(st, "programs"), 2);
  const values = parsePairs(s(st, "values"), 2);
  const regStatus = s(st, "registration_status");
  const regInfo = parseParagraphs(s(st, "registration_info"))[0] ?? "";
  const wa = waLink(s(st, "contact_whatsapp"), "Assalamu'alaikum, saya ingin bertanya tentang Pondok Pesantren Roudlotut Tholibat.");
  const maps = safeHttpUrl(s(st, "contact_maps_url"));
  const logo = publicUrl(s(st, "logo"));

  const jsonLd = {
    "@context": "https://schema.org", "@type": "EducationalOrganization", name: SITE_FULL_NAME, url: siteUrl(),
    ...(logo ? { logo: logo.startsWith("http") ? logo : siteUrl() + logo } : {}),
    ...(s(st, "contact_address") ? { address: s(st, "contact_address") } : {}),
    ...(safeHttpUrl(s(st, "instagram_url")) ? { sameAs: [safeHttpUrl(s(st, "instagram_url"))] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* HERO */}
      <ScrollScene className="hero-bg pattern-dark relative overflow-hidden">
        <div aria-hidden className="blob -left-24 top-24 h-72 w-72 bg-sage-300" />
        <div aria-hidden className="blob -bottom-20 right-1/3 h-64 w-64 bg-gold-300" style={{ animationDelay: "-6s" }} />
        <StarMotif className="star-spin pointer-events-none absolute -right-40 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 text-gold-500/10 sm:text-gold-500/20" strokeWidth={0.5} />
        <Container className="relative grid min-h-[44rem] items-center gap-10 pb-24 pt-32 lg:min-h-svh lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="hero-drift">
            <p dir="rtl" lang="ar" className="hero-fade text-left font-arabic text-3xl text-gold-700 sm:text-4xl" style={{ "--i": 0 } as React.CSSProperties}>بسم الله الرحمن الرحيم</p>
            <h1 className="mt-6 text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="hero-line" style={{ "--i": 1 } as React.CSSProperties}><span>PP. Roudlotut</span></span>
              <span className="hero-line" style={{ "--i": 2 } as React.CSSProperties}><span>Tholibat</span></span>
            </h1>
            <span aria-hidden className="hero-rule mt-7 block h-px w-24 bg-gold-500" />
            {s(st, "hero_headline") && (
              <p className="hero-fade mt-6 font-display text-2xl italic text-gold-700 sm:text-3xl" style={{ "--i": 4 } as React.CSSProperties}>{s(st, "hero_headline")}</p>
            )}
            {s(st, "hero_subtext") && (
              <p className="hero-fade mt-5 max-w-xl text-lg text-ink-600" style={{ "--i": 5 } as React.CSSProperties}>{s(st, "hero_subtext")}</p>
            )}
            <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ "--i": 6 } as React.CSSProperties}>
              <Link href="/pendaftaran" className="btn btn-primary">Daftar santri baru</Link>
              <Link href="#program" className="link-arrow">Lihat program pendidikan <ArrowRight size={18} aria-hidden /></Link>
            </div>
            {programs.length > 0 && (
              <ul className="hero-fade mt-9 flex flex-wrap gap-2" aria-label="Program pendidikan" style={{ "--i": 7 } as React.CSSProperties}>
                {programs.map(([name]) => <li key={name} className="rounded-full border border-gold-500/50 bg-paper/70 px-3.5 py-1.5 text-sm font-medium text-forest-900">{name}</li>)}
              </ul>
            )}
          </div>

          <div className="arch-drift relative mx-auto w-full max-w-sm lg:max-w-md">
            <div aria-hidden className="float-slow absolute -right-4 -top-4 h-full w-full rounded-t-full border border-gold-500/50" />
            <div className="hero-arch relative aspect-[3/4] overflow-hidden rounded-t-full bg-sage-100 shadow-[0_30px_60px_-30px_rgb(53_68_58/0.5)]">
              {heroImg ? (
                <Parallax className="h-full w-full" range={20}>
                  <div className="parallax-img relative h-full w-full"><Photo src={heroImg} alt={s(st, "hero_image_alt") || "Suasana PP. Roudlotut Tholibat"} sizes="(min-width:1024px) 28rem, 90vw" priority /></div>
                </Parallax>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-sage-100 to-sage-200"><StarMotif className="float-slow h-40 w-40 text-gold-500/60" strokeWidth={0.8} /></div>
              )}
            </div>
          </div>
        </Container>
      </ScrollScene>

      {/* PROGRAM PENDIDIKAN: bagian paling menonjol setelah hero */}
      {programs.length > 0 && (
        <section id="program" className="on-dark pattern-light relative bg-forest-900 pb-24 pt-20 text-ivory-50 sm:pb-28 sm:pt-24">
          <Wave />
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Pendidikan" title="Program pendidikan pesantren">
                <span className="text-ivory-50/80">Jenjang belajar Al-Qur&apos;an dan ilmu agama yang dijalankan di Roudlotut Tholibat.</span>
              </SectionHeading>
              <Link href="/profil#program" className="link-arrow">Profil program <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <ul className="mt-12 flex flex-wrap justify-center gap-5">
              {programs.map(([name, desc], i) => (
                <li key={name} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]">
                  <Reveal delay={Math.min(i, 5) * 90} className="h-full"><ProgramCard name={name} desc={desc} /></Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* TENTANG */}
      {(about.length > 0 || greeting) && (
        <section className="bg-ivory-50 py-24 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <SectionHeading className="lg:col-span-5" eyebrow="Mengenal Kami" title="Tentang pondok pesantren kami" />
            <div className="lg:col-span-7">
              <Reveal delay={100}>
                <div className="space-y-5 text-lg text-ink-600">{about.map((p, i) => <p key={i}>{p}</p>)}</div>
                <Link href="/profil" className="link-arrow mt-7">Selengkapnya <ArrowRight size={18} aria-hidden /></Link>
              </Reveal>
              {greeting && (
                <Reveal delay={150} className="mt-12 border-l border-gold-500 pl-6 sm:pl-8">
                  <p className="font-display text-xl italic leading-relaxed text-forest-900 sm:text-2xl">&ldquo;{greeting.length > 280 ? greeting.slice(0, 280).trimEnd() + "…" : greeting}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-4">
                    {caretakerImg && <div className="relative h-14 w-14 overflow-hidden rounded-full"><Photo src={caretakerImg} alt={s(st, "caretaker_name") || "Pengasuh pondok"} sizes="56px" /></div>}
                    <div><p className="font-semibold text-forest-900">{s(st, "caretaker_name")}</p><p className="text-sm text-ink-400">Pengasuh</p></div>
                  </div>
                </Reveal>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* KEUNGGULAN */}
      {values.length > 0 && (
        <section className="bg-sage-50 py-24 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Keunggulan" title="Nilai yang kami jaga" />
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.slice(0, 6).map(([title, desc], i) => (
                <li key={title}>
                  <Reveal delay={(i % 3) * 80} className="h-full">
                    <div className="card-lift h-full rounded-[var(--radius-media)] border border-sage-300 bg-paper p-6 sm:p-7">
                      <span aria-hidden className="block h-px w-10 bg-gold-500" />
                      <h3 className="mt-5 text-2xl">{title}</h3>
                      {desc && <p className="mt-2 text-ink-600">{desc}</p>}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* PENGAJIAN */}
      {schedules.length > 0 && (
        <section className="bg-ivory-50 py-24 sm:py-28">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Jadwal Pengajian" title="Pengajian terdekat" />
              <Link href="/jadwal" className="link-arrow">Semua jadwal <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <div className="mt-10 border-b border-sage-300">{schedules.map((sc) => <ScheduleRow key={sc.id} item={sc} />)}</div>
          </Container>
        </section>
      )}

      {/* BERITA */}
      {news.length > 0 && (
        <section className="bg-ivory-100 py-24 sm:py-28">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Kabar Pondok" title="Berita terbaru" />
              <Link href="/berita" className="link-arrow">Semua berita <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal className={news.length > 1 ? "lg:col-span-7" : "lg:col-span-12"}><NewsCard item={news[0]} featured /></Reveal>
              {news.length > 1 && (
                <div className="grid gap-10 lg:col-span-5">{news.slice(1).map((n, i) => <Reveal key={n.id} delay={(i + 1) * 100}><NewsCard item={n} /></Reveal>)}</div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* GALERI */}
      {gallery.length > 0 && (
        <section className="bg-ivory-50 py-24 sm:py-28">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Aktivitas santri" title="Kehidupan santri sehari-hari" />
              <Link href="/galeri" className="link-arrow">Lihat galeri <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
              {gallery.map((g, i) => {
                const span = i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : i === 3 ? "md:col-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3] md:aspect-auto";
                return (
                  <li key={g.id} className={span}>
                    <Reveal variant="wipe" delay={i * 70} className="h-full">
                      <Link href="/galeri" className="zoom-hover relative block h-full min-h-40 overflow-hidden rounded-[var(--radius-media)] bg-sage-100" aria-label={`Buka galeri: ${g.title || "foto kegiatan"}`}>
                        <Photo src={publicUrl(i === 0 ? g.path : g.thumb_path)!} alt={g.title || g.description || "Foto kegiatan pondok"} sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} />
                        {g.title && <span className="gcap absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/80 to-transparent p-3 pt-10 text-sm font-medium text-ivory-50">{g.title}</span>}
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {/* PENDAFTARAN */}
      <section className="bg-ivory-100 py-24 sm:py-28">
        <Container>
          <Reveal className="grid items-center gap-8 rounded-[var(--radius-media)] border border-gold-500/50 bg-paper p-8 sm:p-12 lg:grid-cols-[1.3fr_auto] lg:gap-14">
            <div>
              <p className="eyebrow">Pendaftaran santri</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">{regStatus || "Bergabunglah bersama kami"}</h2>
              <p className="mt-4 max-w-2xl text-lg text-ink-600">{regInfo.length > 260 ? regInfo.slice(0, 260).trimEnd() + "…" : regInfo || "Lihat program, alur, dan persyaratan pendaftaran, atau tanyakan langsung kepada pengurus pondok."}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:flex-col">
              <Link href="/pendaftaran" className="btn btn-primary">Informasi pendaftaran</Link>
              {wa && <a href={wa} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Tanya via WhatsApp</a>}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* KONTAK */}
      <section className="on-dark pattern-light relative bg-forest-900 py-24 text-ivory-50 sm:py-28">
        <Wave />
        <Container className="relative text-center">
          <Ornament className="mx-auto mb-10 max-w-xs" />
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl sm:text-5xl">Silaturahmi dan tanya jawab</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ivory-50/80">Kami senang menerima pertanyaan seputar pondok, program, dan kegiatan.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              {wa && <a href={wa} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>}
              <Link href="/kontak" className={wa ? "btn btn-ghost" : "btn btn-primary"}>Kontak dan lokasi</Link>
              {maps && <a href={maps} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Buka peta</a>}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
