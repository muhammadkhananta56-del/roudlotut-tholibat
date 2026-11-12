import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Container from "@/components/ui/Container";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { programs, siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <Container className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div className="animate-fade-up space-y-6">
            <span className="inline-block rounded-full border border-gold-400/50 px-4 py-1 text-sm font-medium text-gold-400">
              {siteConfig.tagline}
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="max-w-xl text-lg text-white/85">
              Program pendidikan: TPQ Metode Darussalam, Tahfidz Al-Qur&apos;an,
              Madrasah Diniyah, Khitobah, dan Sholawat Diba&apos;iyah.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/profil"
                className="inline-flex min-h-12 items-center rounded-[var(--radius-button)] border border-white/40 px-6 font-semibold text-white transition hover:bg-white/10"
              >
                Jelajahi Profil
              </Link>
              <Link
                href="/ppdb"
                className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-button)] bg-gold-400 px-6 font-semibold text-brand-900 transition hover:brightness-95"
              >
                Pendaftaran Santri
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <PhotoPlaceholder
            label="Foto kegiatan pondok belum tersedia"
            className="aspect-[4/3] w-full border border-gold-400/30"
          />
        </Container>
      </section>

      {/* RINGKASAN PROFIL */}
      <section className="py-16 md:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Mengenal Pondok Kami
            </h2>
            <div className="h-1 w-16 rounded bg-gold-400" aria-hidden="true" />
            <p className="text-ink-500">
              [RINGKASAN PROFIL LEMBAGA] Teks ini akan diisi setelah sejarah dan
              profil resmi diterima dari pihak pondok.
            </p>
            <Link
              href="/profil/sejarah"
              className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-500"
            >
              Selengkapnya <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <PhotoPlaceholder className="aspect-[4/3] w-full" />
        </Container>
      </section>

      {/* SAMBUTAN PENGASUH */}
      <section className="bg-cream-50 py-16 md:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[320px_1fr]">
          <PhotoPlaceholder label="Foto pengasuh belum tersedia" className="aspect-[3/4] w-full max-w-xs" />
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Sambutan Pengasuh
            </h2>
            <div className="h-1 w-16 rounded bg-gold-400" aria-hidden="true" />
            <p className="text-ink-500">
              [SAMBUTAN PENGASUH] Isi sambutan akan dimasukkan setelah teks dan
              foto resmi diterima.
            </p>
            <p className="font-semibold text-brand-900">[NAMA PENGASUH]</p>
          </div>
        </Container>
      </section>

      {/* PROGRAM */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mb-10 space-y-3 text-center">
            <h2 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Program Pendidikan
            </h2>
            <div className="mx-auto h-1 w-16 rounded bg-gold-400" aria-hidden="true" />
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/program/${p.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-brand-700/10 bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-gold-400"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50 text-brand-700">
                    <BookOpen className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-brand-900">{p.name}</h3>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:text-brand-500">
                    Lihat program <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA PENDAFTARAN */}
      <section className="bg-brand-900 py-16 text-center text-white">
        <Container className="space-y-5">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Pendaftaran Santri Baru
          </h2>
          <p className="mx-auto max-w-2xl text-white/85">
            Informasi persyaratan, alur, dan jadwal pendaftaran akan tersedia di
            halaman pendaftaran.
          </p>
          <Link
            href="/ppdb"
            className="inline-flex min-h-12 items-center rounded-[var(--radius-button)] bg-gold-400 px-8 font-semibold text-brand-900 transition hover:brightness-95"
          >
            Lihat Informasi Pendaftaran
          </Link>
        </Container>
      </section>
    </>
  );
}
