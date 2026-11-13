"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(true);

  // Header mengecil sedikit saat halaman digulir.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drawer: kunci scroll, fokus masuk ke tombol tutup, Tab berputar di dalam drawer, Esc menutup.
  useEffect(() => {
    if (!open) return;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (restoreFocusRef.current) menuButton?.focus();
      restoreFocusRef.current = true;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const closeDrawer = (restoreFocus: boolean) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-brand-700/15 shadow-soft" : "border-brand-700/10"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-16" : "h-[72px] lg:h-20"
        }`}
      >
        <Logo />

        <nav aria-label="Menu utama" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label} className="group relative flex h-full items-center">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:rounded after:bg-gold-400 after:transition-transform after:duration-300 hover:text-brand-500 ${
                    isActive(item.href)
                      ? "text-brand-700 after:scale-x-100"
                      : "text-ink-900 after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full min-w-60 rounded-card border border-brand-700/10 bg-white p-2 opacity-0 shadow-soft transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={pathname === child.href ? "page" : undefined}
                          className={`block rounded-lg px-3 py-2 text-sm hover:bg-cream-50 hover:text-brand-700 ${
                            pathname === child.href ? "font-semibold text-brand-700" : "text-ink-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/ppdb"
            className="inline-flex min-h-11 items-center rounded-button bg-gold-400 px-4 text-sm font-semibold text-brand-900 transition hover:brightness-95 active:translate-y-px"
          >
            <span className="hidden sm:inline">Daftar Santri</span>
            <span className="sm:hidden">Daftar</span>
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-button text-brand-900 hover:bg-cream-50 lg:hidden"
            aria-label="Buka menu"
            aria-expanded={open}
            aria-controls="drawer-menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={drawerRef}
          id="drawer-menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="flex h-[72px] items-center justify-between border-b border-brand-700/10 px-4">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => closeDrawer(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-button text-brand-900 hover:bg-cream-50"
              aria-label="Tutup menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Menu seluler" className="px-4 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                        aria-expanded={openGroup === item.label}
                        aria-controls={`sub-${item.label}`}
                        className="flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-base font-medium text-ink-900 hover:bg-cream-50"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openGroup === item.label ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {openGroup === item.label && (
                        <ul
                          id={`sub-${item.label}`}
                          className="ml-3 space-y-1 border-l-2 border-gold-400 pl-3"
                        >
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => closeDrawer(false)}
                                className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-ink-500 hover:bg-cream-50 hover:text-brand-700"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => closeDrawer(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`flex min-h-12 items-center rounded-lg px-3 text-base font-medium hover:bg-cream-50 ${
                        isActive(item.href) ? "bg-cream-50 text-brand-700" : "text-ink-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/ppdb"
              onClick={() => closeDrawer(false)}
              className="mt-6 flex min-h-12 items-center justify-center rounded-button bg-gold-400 font-semibold text-brand-900"
            >
              Daftar Santri
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
