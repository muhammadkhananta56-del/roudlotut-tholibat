import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${siteConfig.name}, ke Beranda`}>
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold-400 bg-brand-700 text-xs font-bold text-white shadow-sm"
      >
        PRT
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-[11px] font-medium ${light ? "text-white/70" : "text-ink-500"}`}>
          {siteConfig.tagline}
        </span>
        <span
          className={`font-display text-base font-bold sm:text-lg ${light ? "text-white" : "text-brand-900"}`}
        >
          {siteConfig.name}
        </span>
      </span>
    </Link>
  );
}
