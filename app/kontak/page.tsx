import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Kontak" };

function waLink(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

export default function KontakPage() {
  const { address, whatsapp, email, instagram } = siteConfig;

  return (
    <>
      <PageHero title="Hubungi Kami" crumbs={[{ label: "Kontak" }]} />
      <Container className="py-12 md:py-16">
        <ul className="grid gap-6 md:grid-cols-2">
          <li className="flex gap-4 rounded-[var(--radius-card)] border border-brand-700/10 p-6 shadow-[var(--shadow-soft)]">
            <MapPin className="h-6 w-6 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-brand-900">Alamat</h2>
              <p className="text-ink-500">{address}</p>
            </div>
          </li>

          <li className="flex gap-4 rounded-[var(--radius-card)] border border-brand-700/10 p-6 shadow-[var(--shadow-soft)]">
            <MessageCircle className="h-6 w-6 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-brand-900">WhatsApp</h2>
              <a
                href={waLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline underline-offset-4"
              >
                {whatsapp}
              </a>
            </div>
          </li>

          <li className="flex gap-4 rounded-[var(--radius-card)] border border-brand-700/10 p-6 shadow-[var(--shadow-soft)]">
            <Mail className="h-6 w-6 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-brand-900">Email</h2>
              <a
                href={`mailto:${email}`}
                className="text-brand-700 underline underline-offset-4"
              >
                {email}
              </a>
            </div>
          </li>

          <li className="flex gap-4 rounded-[var(--radius-card)] border border-brand-700/10 p-6 shadow-[var(--shadow-soft)]">
            <AtSign className="h-6 w-6 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-brand-900">Instagram</h2>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline underline-offset-4"
              >
                @roudlotuttholibat
              </a>
            </div>
          </li>
        </ul>
      </Container>
    </>
  );
}
