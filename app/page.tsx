import Link from "next/link";
import type { CSSProperties } from "react";
import Container from "@/components/ui/Container";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import PendingNotice from "@/components/ui/PendingNotice";
import NewsCard from "@/components/ui/NewsCard";
import AgendaRow from "@/components/ui/AgendaRow";
import StarMotif from "@/components/motif/StarMotif";
import Reveal from "@/components/motion/Reveal";
import ScrollScene from "@/components/motion/ScrollScene";
import ProgramCarousel from "@/components/sections/ProgramCarousel";
import StatsBand from "@/components/sections/StatsBand";
import { programs, siteConfig } from "@/lib/site";
import { aboutSummary, caretakerGreeting, caretakerName } from "@/lib/content";
import { sortedNews } from "@/lib/data/berita";
import { upcomingAgenda } from "@/lib/data/agenda";
import { sortedGallery } from "@/lib/data/galeri";
import PhotoGrid from "@/components/sections/PhotoGrid";

// Agenda mendatang dihitung ulang tiap jam.
export const revalidate = 3600;

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

export default function HomePage() {
  const latestNews = sortedNews().slice(0, 3);
  const upcoming = upcomingAgenda(3);
  const latestPhotos = sortedGallery().slice(0, 6);

  return (
    <>
      {/* HERO: satu rangkaian masuk saat halaman dibuka, lalu bintang dan bingkai bergerak mengikuti scroll */}
      <ScrollScene className="on-dark pattern-light relative overflow-hidden bg-brand-900 text-white">
        <StarMotif
          className="star-spin pointer-events-none absolute -right-48 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 text-gold-400/20 lg:-right-28"
          strokeWidth={0.5}
        />
        <Container className="relative grid items-center gap-12 pb-28 pt-12 md:pt-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:pb-32 lg:pt-16">
          <div className="space-y-7">
            <h1 className="text-[clamp(2.125rem,9vw,4.25rem)] font-bold leading-[1.05]">
              <span className="hero-line" style={idx(0)}>
                <span>PP. ROUDLOTUT </span>
              </span>
              <span className="hero-line text-gold-400" style={idx(1)}>
                <span>THOLIBAT</span>
              </span>
            </h1>
            <p className="hero-fade max-w-xl text-lg text-white/90" style={idx(3)}>
              Yayasan Pondok Pesantren dengan program TPQ Metode Darussalam, Tahfidz Al-Qur&apos;an,
              Madrasah Diniyah, Khitobah, dan Sholawat Diba&apos;iyah.
            </p>
            <div className="hero-fade flex flex-wrap gap-3" style={idx(4)}>
              <Link
                href="/ppdb"
                className="inline-flex min-h-12 items-center rounded-button bg-gold-400 px-7 font-semibold text-brand-900 transition hover:brightness-95 active:translate-y-px"
              >
                Daftar santri baru
              </Link>
              <Link
                href="/profil/sejarah"
                className="inline-flex min-h-12 items-center rounded-button border border-white/55 px-7 font-semibold text-white transition hover:bg-white/10 active:translate-y-px"
              >
                Baca profil pondok
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none lg:justify-self-end lg:w-[min(100%,25rem)]">
            <div className="arch-drift relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-[16px] border-2 border-gold-400/70"
              />
              <PhotoPlaceholder
                src={siteConfig.images.hero}
                alt="Kegiatan santri PP. Roudlotut Tholibat"
                label="Foto kegiatan pondok belum tersedia"
                shape="arch"
                priority
                sizes="(min-width: 1024px) 25rem, 24rem"
                className="hero-arch relative aspect-[3/4] w-full"
              />
            </div>
          </div>
        </Container>
      </ScrollScene>

      {/* MENGENAL PONDOK */}
      <section className="relative -mt-12 rounded-t-[var(--radius-panel)] bg-white pt-16 md:pt-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal variant="wipe">
            <PhotoPlaceholder
              src={siteConfig.images.about}
              alt="Lingkungan PP. Roudlotut Tholibat"
              label="Foto lingkungan pondok belum tersedia"
              shape="arch"
              className="mx-auto aspect-[4/5] w-full max-w-sm"
              sizes="(min-width: 1024px) 24rem, 24rem"
            />
          </Reveal>
          <Reveal className="space-y-6">
            <h2 className="text-3xl font-bold text-brand-900 sm:text-4xl lg:text-5xl">
              Mengenal PP. Roudlotut Tholibat
            </h2>
            {aboutSummary ? (
              <p className="max-w-[62ch] text-lg text-ink-500">{aboutSummary}</p>
            ) : (
              <div className="max-w-[62ch]">
                <PendingNotice
                  label="[RINGKASAN PROFIL LEMBAGA]"
                  needs={["Ringkasan 2 sampai 3 kalimat tentang pondok"]}
                />
              </div>
            )}
            <Link
              href="/profil/sejarah"
              className="inline-flex min-h-12 items-center rounded-button border border-brand-700 px-6 font-semibold text-brand-700 transition hover:bg-brand-700 hover:text-white active:translate-y-px"
            >
              Baca sejarah pondok
            </Link>
          </Reveal>
        </Container>

        <Container className="mt-16 md:mt-24">
          <Reveal>
            <div className="grid items-center gap-8 rounded-card bg-cream-50 p-6 sm:p-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
              <PhotoPlaceholder
                src={siteConfig.images.pengasuh}
                alt={caretakerName ? `Pengasuh ${caretakerName}` : "Pengasuh pondok"}
                label="Foto pengasuh belum tersedia"
                className="mx-auto aspect-[3/4] w-full max-w-60"
                sizes="16rem"
              />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Sambutan Pengasuh</h2>
                {caretakerGreeting ? (
                  <p className="max-w-[62ch] text-lg text-ink-500">{caretakerGreeting}</p>
                ) : (
                  <PendingNotice label="[SAMBUTAN PENGASUH]" needs={["Teks sambutan", "Foto resmi pengasuh"]} />
                )}
                <p className="font-semibold text-brand-900">{caretakerName || "[NAMA PENGASUH]"}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* PROGRAM */}
      <section className="mt-16 bg-cream-50 py-16 md:mt-24 md:py-24" aria-labelledby="judul-program">
        <Container className="mb-10 max-w-6xl">
          <Reveal className="max-w-2xl space-y-3">
            <h2 id="judul-program" className="text-3xl font-bold text-brand-900 sm:text-4xl lg:text-5xl">
              {programs.length} program pendidikan
            </h2>
            <p className="text-lg text-ink-500">
              Geser untuk melihat semua program. Rincian materi dan jadwal tiap program ada di halamannya.
            </p>
          </Reveal>
        </Container>
        <ProgramCarousel programs={programs} />
      </section>

      <StatsBand />

      {/* DOKUMENTASI */}
      {latestPhotos.length > 0 ? (
        <section className="bg-white py-16 md:py-24" aria-labelledby="judul-dokumentasi">
          <Container className="space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="judul-dokumentasi" className="text-3xl font-bold text-brand-900 sm:text-4xl">
                Dokumentasi terbaru
              </h2>
              <Link
                href="/galeri"
                className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-brand-500"
              >
                Buka galeri
              </Link>
            </div>
            <PhotoGrid items={latestPhotos} />
          </Container>
        </section>
      ) : (
        <section className="bg-white py-16 md:py-24" aria-labelledby="judul-dokumentasi">
          <Container className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <Reveal className="space-y-4">
              <h2 id="judul-dokumentasi" className="text-3xl font-bold text-brand-900 sm:text-4xl lg:text-5xl">
                Dokumentasi kegiatan ada di Instagram kami
              </h2>
              <p className="max-w-[60ch] text-lg text-ink-500">
                Sorotan yang sudah tersedia: Khataman 2021, 2022, dan 2024, Ngaji, Sanlat, serta kegiatan
                tahun 2023. Foto pilihan akan menyusul di halaman Galeri.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex flex-col items-start gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-button bg-brand-700 px-6 font-semibold text-white transition hover:bg-brand-900 active:translate-y-px"
              >
                Buka Instagram {siteConfig.instagramHandle}
              </a>
              <Link
                href="/galeri"
                className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-brand-500"
              >
                Lihat halaman Galeri
              </Link>
            </Reveal>
          </Container>
        </section>
      )}

      {/* BERITA DAN AGENDA: hanya tampil bila ada data */}
      {(latestNews.length > 0 || upcoming.length > 0) && (
        <section className="bg-cream-50 py-16 md:py-24" aria-label="Berita dan agenda">
          <Container
            className={`grid gap-12 ${latestNews.length > 0 && upcoming.length > 0 ? "lg:grid-cols-[1.5fr_1fr]" : ""}`}
          >
            {latestNews.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-bold text-brand-900 sm:text-4xl">Berita terbaru</h2>
                  <Link
                    href="/berita"
                    className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-brand-500"
                  >
                    Semua berita
                  </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  {latestNews.map((n, i) => (
                    <div key={n.slug} className={i === 0 ? "sm:col-span-2" : ""}>
                      <NewsCard item={n} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {upcoming.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-bold text-brand-900 sm:text-4xl">Agenda mendatang</h2>
                  <Link
                    href="/agenda"
                    className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-brand-500"
                  >
                    Semua agenda
                  </Link>
                </div>
                <ul className="rounded-card bg-white px-5">
                  {upcoming.map((a) => (
                    <AgendaRow key={a.id} item={a} />
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* AJAKAN DAFTAR */}
      <section className="pattern-dark relative overflow-hidden bg-gold-400" aria-labelledby="judul-daftar">
        <StarMotif
          className="pointer-events-none absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 text-brand-900/15"
          strokeWidth={0.6}
        />
        <Container className="relative grid items-center gap-8 py-16 md:py-24 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal className="space-y-4 lg:pl-40">
            <h2 id="judul-daftar" className="text-3xl font-bold text-brand-900 sm:text-4xl lg:text-5xl">
              Pendaftaran santri baru
            </h2>
            <p className="max-w-[56ch] text-lg text-brand-900">
              Isi formulir pendaftaran, lalu kirim datanya ke pihak pondok lewat WhatsApp. Syarat dan alur
              pendaftaran ada di halaman yang sama.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col items-start gap-3 lg:items-end">
            <Link
              href="/ppdb#formulir"
              className="inline-flex min-h-12 items-center rounded-button bg-brand-900 px-7 font-semibold text-white transition hover:bg-brand-700 active:translate-y-px"
            >
              Isi formulir pendaftaran
            </Link>
            <Link
              href="/ppdb#syarat"
              className="inline-flex min-h-11 items-center font-semibold text-brand-900 underline decoration-brand-900 decoration-2 underline-offset-4"
            >
              Baca syarat dan alur
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
