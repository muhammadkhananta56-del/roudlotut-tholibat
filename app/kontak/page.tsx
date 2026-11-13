import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import Reveal from "@/components/motion/Reveal";
import { getChannels, waLink } from "@/lib/contact";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Kontak",
  description: "Hubungi PP. Roudlotut Tholibat lewat WhatsApp, email, atau Instagram.",
  path: "/kontak",
});

export default function KontakPage() {
  const { whatsappNumber, whatsappDisplay, email } = getChannels();
  const wa = whatsappNumber ? waLink(whatsappDisplay) : null;
  const link = "font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-500";

  const rows: { title: string; body: React.ReactNode }[] = [
    { title: "Alamat", body: siteConfig.address || <span className="text-ink-500">[ALAMAT LENGKAP]</span> },
    {
      title: "WhatsApp",
      body: wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>
          {whatsappDisplay}
        </a>
      ) : (
        <span className="text-ink-500">[NOMOR WHATSAPP RESMI]</span>
      ),
    },
    {
      title: "Email",
      body: email ? (
        <a href={`mailto:${email}`} className={link}>
          {email}
        </a>
      ) : (
        <span className="text-ink-500">[EMAIL RESMI]</span>
      ),
    },
    {
      title: "Instagram",
      body: (
        <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className={link}>
          {siteConfig.instagramHandle}
        </a>
      ),
    },
    { title: "Jam pelayanan", body: siteConfig.hours || <span className="text-ink-500">[JAM PELAYANAN]</span> },
  ];

  return (
    <>
      <PageHero title="Hubungi Kami" description="Tanyakan pendaftaran, program, atau kegiatan pondok." crumbs={[{ label: "Kontak" }]} />
      <PageBody>
        <Container className="grid gap-12 pb-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <dl className="divide-y divide-brand-700/15 border-y border-brand-700/15">
              {rows.map((r) => (
                <div key={r.title} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                  <dt className="font-semibold text-brand-900">{r.title}</dt>
                  <dd>{r.body}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              {siteConfig.mapsUrl ? (
                <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-button border border-brand-700 px-6 font-semibold text-brand-700 transition hover:bg-brand-700 hover:text-white">
                  Buka lokasi di Google Maps
                </a>
              ) : (
                <p className="text-sm text-ink-500">
                  Tautan Google Maps akan dipasang setelah alamat resmi dikonfirmasi. Sementara itu, tautan Maps ada di profil Instagram.
                </p>
              )}
            </div>
          </Reveal>
          <section aria-labelledby="judul-pesan" className="rounded-card bg-cream-50 p-6 shadow-soft sm:p-9">
            <h2 id="judul-pesan" className="mb-6 text-2xl font-bold text-brand-900">
              Kirim pesan
            </h2>
            <ContactForm />
          </section>
        </Container>
      </PageBody>
    </>
  );
}
