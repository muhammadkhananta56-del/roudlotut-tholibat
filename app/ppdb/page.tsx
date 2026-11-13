import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import PendingNotice from "@/components/ui/PendingNotice";
import Reveal from "@/components/motion/Reveal";
import PpdbForm from "@/components/forms/PpdbForm";
import { ppdbFee, ppdbFlow, ppdbRequirements, ppdbSchedule } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pendaftaran Santri Baru",
  description: "Informasi dan formulir pendaftaran santri baru PP. Roudlotut Tholibat.",
  path: "/ppdb",
});

const howItWorks = [
  { title: "Isi formulir", detail: "Lengkapi data calon santri dan wali. Semua isian bertanda bintang wajib diisi." },
  { title: "Susun dan periksa pesan", detail: "Website menyusun data Anda menjadi satu pesan. Periksa isinya, ubah bila perlu." },
  { title: "Kirim lewat WhatsApp", detail: "Anda sendiri yang menekan tombol kirim. Pihak pondok memberi tahu langkah berikutnya." },
];

export default function PpdbPage() {
  return (
    <>
      <PageHero
        title="Pendaftaran Santri Baru"
        description="Baca syarat dan alurnya, lalu isi formulir di halaman ini."
        crumbs={[{ label: "Pendaftaran Santri" }]}
      />
      <PageBody>
        <Container className="grid gap-14 pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="space-y-12">
            <Reveal>
              <section id="syarat" className="scroll-mt-28 space-y-4">
                <h2 className="text-2xl font-bold text-brand-900">Persyaratan</h2>
                {ppdbRequirements.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {ppdbRequirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <PendingNotice label="[PERSYARATAN PENDAFTARAN]" needs={["Daftar berkas dan syarat usia atau kemampuan"]} />
                )}
              </section>
            </Reveal>

            <Reveal>
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-brand-900">Alur pendaftaran</h2>
                {ppdbFlow.length > 0 ? (
                  <ol className="space-y-4">
                    {ppdbFlow.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 font-bold text-white">{i + 1}</span>
                        <div>
                          <p className="font-semibold text-brand-900">{s.title}</p>
                          <p className="text-ink-500">{s.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <PendingNotice label="[ALUR PENDAFTARAN LENGKAP]" needs={["Tahap seleksi, verifikasi, dan pengumuman"]} />
                )}
              </section>
            </Reveal>

            <Reveal>
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-brand-900">Cara kerja formulir di website ini</h2>
                <ol className="space-y-4">
                  {howItWorks.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 font-bold text-brand-900">{i + 1}</span>
                      <div>
                        <p className="font-semibold text-brand-900">{s.title}</p>
                        <p className="text-ink-500">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>

            <Reveal>
              <div className="grid gap-6 sm:grid-cols-2">
                <section className="space-y-2">
                  <h2 className="text-xl font-bold text-brand-900">Jadwal</h2>
                  {ppdbSchedule ? <p>{ppdbSchedule}</p> : <PendingNotice label="[JADWAL PENDAFTARAN]" />}
                </section>
                <section className="space-y-2">
                  <h2 className="text-xl font-bold text-brand-900">Biaya</h2>
                  {ppdbFee ? (
                    <p>{ppdbFee}</p>
                  ) : (
                    <p className="text-ink-500">
                      Rincian biaya belum dipublikasikan. Tanyakan ke pihak pondok lewat{" "}
                      <Link href="/kontak" className="font-semibold text-brand-700 underline underline-offset-4">
                        halaman Kontak
                      </Link>
                      .
                    </p>
                  )}
                </section>
              </div>
            </Reveal>
          </div>

          <section id="formulir" aria-labelledby="judul-formulir" className="scroll-mt-28 self-start rounded-card bg-cream-50 p-6 shadow-soft sm:p-9 lg:sticky lg:top-28">
            <h2 id="judul-formulir" className="mb-6 text-2xl font-bold text-brand-900">
              Formulir pendaftaran
            </h2>
            <PpdbForm />
          </section>
        </Container>
      </PageBody>
    </>
  );
}
