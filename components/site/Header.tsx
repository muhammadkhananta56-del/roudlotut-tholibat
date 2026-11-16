"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import StarMotif from "@/components/ui/StarMotif";
import { NAV, NAV_CTA, SITE_NAME } from "@/lib/site";

const ITEMS = [{ href: "/", label: "Beranda" }, ...NAV];

export default function Header({ logoUrl }: { logoUrl: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", on, { passive: true });
    const t = requestAnimationFrame(on);
    return () => { cancelAnimationFrame(t); window.removeEventListener("scroll", on); };
  }, []);

  // Tutup menu setelah pindah halaman.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) { setPrevPath(pathname); setOpen(false); }

  // Kunci scroll body, Escape menutup, Tab terkunci di dalam drawer, fokus dikembalikan ke tombol menu.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      if (wasOpen.current) { openBtnRef.current?.focus(); wasOpen.current = false; }
      return;
    }
    wasOpen.current = true;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && close();
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, [open, close]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  const logo = logoUrl
    ? <Image src={logoUrl} alt="" width={44} height={44} unoptimized className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
    : <StarMotif className="h-9 w-9 shrink-0 text-gold-700" strokeWidth={2.5} />;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ${scrolled ? "bg-ivory-50/90 py-2.5 shadow-[0_1px_0_var(--color-sage-200),0_8px_24px_-16px_rgb(53_68_58/0.35)] backdrop-blur-md" : "py-4 sm:py-5"}`}>
        <div className="mx-auto flex w-full max-w-[76rem] items-center justify-between gap-3 px-4 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 text-forest-900 sm:gap-3" aria-label={`${SITE_NAME}, ke beranda`}>
            {logo}
            <span className="font-display text-[1rem] font-semibold leading-tight tracking-wide sm:text-lg">{SITE_NAME}</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
                className="relative px-3 py-2 text-[0.92rem] font-medium text-forest-900 transition-colors hover:text-emerald-600 after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100">
                {n.label}
              </Link>
            ))}
            <Link href={NAV_CTA.href} aria-current={active(NAV_CTA.href) ? "page" : undefined}
              className="px-3 py-2 text-[0.92rem] font-medium text-forest-900 transition-colors hover:text-emerald-600 xl:hidden">{NAV_CTA.label}</Link>
          </nav>
          <Link href={NAV_CTA.href} className="btn btn-primary hidden !min-h-11 !px-5 xl:inline-flex">Daftar santri baru</Link>

          <button ref={openBtnRef} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="menu-mobile" aria-haspopup="dialog"
            aria-label="Buka menu" className="-mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/5 active:bg-forest-900/10 lg:hidden">
            <Menu size={26} aria-hidden />
          </button>
        </div>
      </header>

      {/* Drawer ditaruh DI LUAR <header>: backdrop-filter pada header menjadikannya acuan posisi bagi
          elemen fixed, sehingga panel menu sebelumnya tidak punya tinggi dan tidak bisa disentuh. */}
      <div className={`fixed inset-0 z-[70] transition-[visibility] duration-300 lg:hidden ${open ? "visible" : "invisible"}`} inert={!open}>
        <div aria-hidden onClick={close} className={`absolute inset-0 bg-forest-950/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
        <div ref={panelRef} id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu navigasi"
          className={`pattern-dark absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-ivory-50 shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <span className="eyebrow">Menu</span>
            <button ref={closeBtnRef} type="button" onClick={close} aria-label="Tutup menu"
              className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-forest-900 transition-colors hover:bg-forest-900/5 active:bg-forest-900/10">
              <X size={26} aria-hidden />
            </button>
          </div>
          <nav aria-label="Navigasi seluler" className="flex flex-col px-5 pb-10">
            {ITEMS.map((n, i) => (
              <Link key={n.href} href={n.href} onClick={close} aria-current={active(n.href) ? "page" : undefined}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                className={`flex min-h-14 items-center justify-between border-b border-sage-200 font-display text-2xl text-forest-900 transition-[opacity,transform,color] duration-500 hover:text-emerald-600 aria-[current=page]:text-emerald-600 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                {n.label}
                <span className="h-1.5 w-1.5 rotate-45 bg-gold-500 opacity-0 [[aria-current=page]_&]:opacity-100" />
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-5 pb-8">
            <Link href={NAV_CTA.href} onClick={close} className="btn btn-primary mb-8 w-full">Daftar santri baru</Link>
            <StarMotif className="h-10 w-10 text-gold-500/60" strokeWidth={1.2} />
            <p className="mt-3 font-display text-lg text-forest-900">{SITE_NAME}</p>
          </div>
        </div>
      </div>
    </>
  );
}
