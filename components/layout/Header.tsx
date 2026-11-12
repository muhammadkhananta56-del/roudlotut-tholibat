"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeAll = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-700/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Logo />

        <nav aria-label="Menu utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-brand-500 ${
                    isActive(item.href) ? "text-brand-700" : "text-ink-900"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full min-w-56 rounded-[var(--radius-card)] border border-brand-700/10 bg-white p-2 opacity-0 shadow-[var(--shadow-soft)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-900 hover:bg-cream-50 hover:text-brand-700"
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
            className="inline-flex min-h-11 items-center rounded-[var(--radius-button)] bg-gold-400 px-4 text-sm font-semibold text-brand-900 transition hover:brightness-95"
          >
            <span className="hidden sm:inline">Daftar Santri</span>
            <span className="sm:hidden">Daftar</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-button)] text-brand-900 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
