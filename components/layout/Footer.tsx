import Link from "next/link";
import Container from "@/components/ui/Container";
import StarMotif from "@/components/motif/StarMotif";
import { footerExtraLinks, profilePages, programs, siteConfig } from "@/lib/site";
import { getChannels, waLink } from "@/lib/contact";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  const { email, whatsappNumber, whatsappDisplay } = getChannels();
  const wa = whatsappNumber ? waLink(whatsappDisplay) : null;

  return (
    <footer className="on-dark pattern-light relative overflow-hidden bg-brand-900 text-white">
      <StarMotif
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 text-gold-400/15"
        strokeWidth={0.6}
      />
      <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-md text-sm leading-relaxed text-white/85">
            {siteConfig.description}
          </p>
          <address className="space-y-1.5 text-sm not-italic text-white/85">
            <p>{siteConfig.address || "[ALAMAT LENGKAP]"}</p>
            <p>
              WhatsApp:{" "}
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-white"
                >
                  {whatsappDisplay}
                </a>
              ) : (
                "[NOMOR WHATSAPP RESMI]"
              )}
            </p>
            <p>
              Email:{" "}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="underline underline-offset-4 hover:text-white"
                >
                  {email}
                </a>
              ) : (
                "[EMAIL RESMI]"
              )}
            </p>
            <p>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-white"
              >
                Instagram {siteConfig.instagramHandle}
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Tentang pondok">
          <h2 className="mb-4 font-display text-lg font-semibold text-gold-400">Tentang pondok</h2>
          <ul className="space-y-2 text-sm">
            {profilePages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-white/85 hover:text-white">
                  {p.label}
                </Link>
              </li>
            ))}
            {[
              { href: "/kegiatan", label: "Kegiatan" },
              { href: "/galeri", label: "Galeri" },
              { href: "/berita", label: "Berita" },
              { href: "/kontak", label: "Kontak" },
              ...footerExtraLinks,
            ].map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-white/85 hover:text-white">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Program pendidikan">
          <h2 className="mb-4 font-display text-lg font-semibold text-gold-400">Program</h2>
          <ul className="space-y-2 text-sm">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/program/${p.slug}`} className="text-white/85 hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="relative border-t border-white/15">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Hak cipta dilindungi.
          </p>
          <Link href="/kebijakan-privasi" className="underline-offset-4 hover:text-white hover:underline">
            Kebijakan Privasi
          </Link>
        </Container>
      </div>
    </footer>
  );
}
