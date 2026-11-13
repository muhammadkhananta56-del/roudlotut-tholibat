import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

// Bila siteConfig.logoSrc terisi, logo asli dipakai. Bila kosong, tampil monogram
// sementara (bukan logo resmi) sampai file logo dari pihak pondok tersedia.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
      aria-label={`${siteConfig.name}, ke Beranda`}
    >
      {siteConfig.logoSrc ? (
        <Image
          src={siteConfig.logoSrc}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold-400 bg-brand-700 text-xs font-bold text-white"
        >
          PRT
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span className={`text-[11px] font-medium ${light ? "text-white/80" : "text-ink-500"}`}>
          {siteConfig.tagline}
        </span>
        <span
          className={`font-display text-base font-bold sm:text-lg ${
            light ? "text-white" : "text-brand-900"
          }`}
        >
          {siteConfig.name}
        </span>
      </span>
    </Link>
  );
}
