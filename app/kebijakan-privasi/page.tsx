import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Kebijakan Privasi",
  description: "Cara website PP. Roudlotut Tholibat memperlakukan data yang Anda isi.",
  path: "/kebijakan-privasi",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Kebijakan Privasi" crumbs={[{ label: "Kebijakan Privasi" }]} />
      <PageBody>
        <Container className="pb-20">
          <div className="max-w-[70ch] space-y-8">
            <p className="rounded-card bg-cream-50 p-5 text-ink-500">
              [KONFIRMASI] Naskah ini disusun sesuai cara kerja website saat ini. Mohon ditinjau pihak
              pondok sebelum dianggap final.
            </p>
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-900">Data yang Anda isi</h2>
              <p>
                Formulir pendaftaran dan formulir pesan meminta data seperti nama, tanggal lahir, alamat, dan
                nomor WhatsApp. Data ini diproses di perangkat Anda untuk menyusun sebuah pesan. Website ini
                belum memiliki database, jadi tidak ada data formulir yang tersimpan di server kami.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-900">Saat Anda mengirim pesan</h2>
              <p>
                Data baru sampai ke pihak pondok ketika Anda sendiri menekan tombol kirim lewat WhatsApp atau
                email. Pada saat itu, data diproses oleh layanan yang Anda pilih sesuai kebijakan layanan
                tersebut.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-900">Data anak</h2>
              <p>
                Data calon santri adalah data anak. Isi formulir hanya bila Anda adalah orang tua atau wali,
                dan kirimkan hanya kepada pihak pondok.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-900">Pelacakan</h2>
              <p>Website ini tidak memasang alat analitik atau iklan.</p>
            </section>
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-900">Perubahan</h2>
              <p>
                Bila pendaftaran online nantinya disimpan di server, kebijakan ini akan diperbarui sebelum fitur
                itu dipakai.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-900">Pertanyaan</h2>
              <p>
                Hubungi {siteConfig.shortName} lewat halaman Kontak untuk pertanyaan tentang data Anda.
              </p>
            </section>
          </div>
        </Container>
      </PageBody>
    </>
  );
}
