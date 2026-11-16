import type { Metadata } from "next";
import { Camera, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/motion/Reveal";
import PageHero from "@/components/site/PageHero";
import { getSettings, s } from "@/lib/settings";
import { safeHttpUrl, waLink } from "@/lib/contact";

export const metadata: Metadata = { title: "Kontak dan Lokasi", description: "Alamat, kontak, dan lokasi Pondok Pesantren Roudlotut Tholibat." };

export default async function KontakPage() {
  const st = await getSettings();
  const address = s(st, "contact_address");
  const wa = waLink(s(st, "contact_whatsapp"), "Assalamu'alaikum, saya ingin bertanya tentang Pondok Pesantren Roudlotut Tholibat.");
  const email = s(st, "contact_email");
  const hours = s(st, "contact_hours");
  const maps = safeHttpUrl(s(st, "contact_maps_url"));
  const ig = safeHttpUrl(s(st, "instagram_url"));
  const none = !address && !wa && !email && !hours && !maps && !ig;
  const row = "grid grid-cols-[2.5rem_1fr] gap-3 border-t border-sage-300 py-6";
  const icon = "mt-1 text-gold-700";
  return (
    <>
      <PageHero eyebrow="Kontak" title="Hubungi dan kunjungi kami">Kami terbuka untuk silaturahmi.</PageHero>
      <section className="py-16 sm:py-20">
        <Container>
          {none ? <EmptyState title="Informasi kontak sedang disiapkan">Alamat dan kontak pondok akan segera tersedia.</EmptyState> : (
            <Reveal className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
              <address className="not-italic">
                {address && <div className={row}><MapPin className={icon} aria-hidden /><div><p className="eyebrow">Alamat</p><p className="mt-1 whitespace-pre-line text-lg">{address}</p></div></div>}
                {hours && <div className={row}><Clock className={icon} aria-hidden /><div><p className="eyebrow">Jam pelayanan</p><p className="mt-1 text-lg">{hours}</p></div></div>}
                {wa && <div className={row}><MessageCircle className={icon} aria-hidden /><div><p className="eyebrow">WhatsApp</p><a href={wa} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-lg text-emerald-600 underline-offset-4 hover:underline">{s(st, "contact_whatsapp")}</a></div></div>}
                {email && <div className={row}><Mail className={icon} aria-hidden /><div><p className="eyebrow">Email</p><a href={`mailto:${email}`} className="mt-1 inline-block break-all text-lg text-emerald-600 underline-offset-4 hover:underline">{email}</a></div></div>}
                {ig && <div className={`${row} border-b`}><Camera className={icon} aria-hidden /><div><p className="eyebrow">Instagram</p><a href={ig} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-lg text-emerald-600 underline-offset-4 hover:underline">{ig.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></div></div>}
              </address>
              <div className="flex flex-col justify-center gap-4 rounded-[var(--radius-media)] bg-sage-50 p-8 sm:p-10">
                <h2 className="text-3xl">Ada pertanyaan?</h2>
                <p className="text-ink-600">Kirim pesan singkat, pengurus akan membalas sesuai jam pelayanan.</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Chat WhatsApp</a>}
                  {maps && <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Buka di Google Maps</a>}
                </div>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
