import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import StarMotif from "@/components/ui/StarMotif";
import { NAV, NAV_CTA, SITE_FULL_NAME } from "@/lib/site";
import { parsePairs, s, type Settings } from "@/lib/settings";
import { safeHttpUrl, waLink } from "@/lib/contact";

export default function Footer({ settings }: { settings: Settings }) {
  const wa = waLink(s(settings, "contact_whatsapp"));
  const ig = safeHttpUrl(s(settings, "instagram_url"));
  const email = s(settings, "contact_email");
  const address = s(settings, "contact_address");
  const programs = parsePairs(s(settings, "programs"), 2).map(([n]) => n);
  const links = [...NAV, NAV_CTA];
  const head = "mb-4 font-display text-lg font-semibold text-ivory-50";
  return (
    <footer className="on-dark pattern-light relative bg-forest-950 text-ivory-50/80">
      <Reveal variant="fade">
        <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 text-gold-300">
              <StarMotif className="h-10 w-10 shrink-0" strokeWidth={2} />
              <p className="font-display text-xl font-semibold text-ivory-50">{SITE_FULL_NAME}</p>
            </div>
            <p dir="rtl" lang="ar" className="mt-5 font-arabic text-2xl text-gold-300">بسم الله الرحمن الرحيم</p>
            <Link href={NAV_CTA.href} className="btn btn-primary mt-6">Daftar santri baru</Link>
          </div>
          {programs.length > 0 && (
            <div>
              <p className={head}>Program</p>
              <ul className="space-y-2">
                {programs.map((p) => <li key={p}><Link href="/profil#program" className="inline-block py-0.5 transition-colors hover:text-gold-300">{p}</Link></li>)}
              </ul>
            </div>
          )}
          <nav aria-label="Navigasi footer">
            <p className={head}>Jelajahi</p>
            <ul className="space-y-2">
              {links.map((n) => <li key={n.href}><Link href={n.href} className="inline-block py-0.5 transition-colors hover:text-gold-300">{n.label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <p className={head}>Hubungi</p>
            <ul className="space-y-3 text-[0.95rem]">
              {address && <li className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-gold-300" aria-hidden /><span className="whitespace-pre-line">{address}</span></li>}
              {wa && <li className="flex gap-3"><MessageCircle size={18} className="mt-1 shrink-0 text-gold-300" aria-hidden /><a href={wa} className="hover:text-gold-300">WhatsApp</a></li>}
              {email && <li className="flex gap-3"><Mail size={18} className="mt-1 shrink-0 text-gold-300" aria-hidden /><a href={`mailto:${email}`} className="break-all hover:text-gold-300">{email}</a></li>}
              {ig && <li className="flex gap-3"><Camera size={18} className="mt-1 shrink-0 text-gold-300" aria-hidden /><a href={ig} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">Instagram</a></li>}
              {!address && !wa && !email && <li className="text-ivory-50/60">Informasi kontak akan segera tersedia.</li>}
            </ul>
          </div>
        </Container>
      </Reveal>
      <div className="border-t border-ivory-50/10 py-5 text-center text-sm text-ivory-50/60">
        © {new Date().getFullYear()} {SITE_FULL_NAME}
      </div>
    </footer>
  );
}
