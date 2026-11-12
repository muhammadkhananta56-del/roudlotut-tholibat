import Link from "next/link";
import { navItems, programs, siteConfig } from "@/lib/site";
import Container from "@/components/ui/Container";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-white/80">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">{siteConfig.description}</p>
        </div>

        <nav aria-label="Navigasi cepat">
          <h2 className="mb-3 font-display text-lg font-semibold text-gold-400">Navigasi</h2>
          <ul className="space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ppdb" className="hover:text-white">
                Pendaftaran Santri
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Program pendidikan">
          <h2 className="mb-3 font-display text-lg font-semibold text-gold-400">Program</h2>
          <ul className="space-y-2 text-sm">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/program/${p.slug}`} className="hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-gold-400">Kontak</h2>
          <ul className="space-y-2 text-sm">
            <li>{siteConfig.address}</li>
            <li>WhatsApp: {siteConfig.whatsapp}</li>
            <li>Email: {siteConfig.email}</li>
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-white"
              >
                Instagram @roudlotuttholibat
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 text-center text-xs">
          © {year} {siteConfig.name}. Hak cipta dilindungi.
        </Container>
      </div>
    </footer>
  );
}
