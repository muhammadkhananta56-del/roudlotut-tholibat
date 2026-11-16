"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, ExternalLink, Images, LayoutDashboard, LogOut, Menu, Newspaper, Settings, Tags, X } from "lucide-react";
import StarMotif from "@/components/ui/StarMotif";
import { logoutAction } from "@/app/actions/auth";

const ITEMS = [
  { href: "/admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/jadwal", label: "Jadwal Pengajian", icon: CalendarDays },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: Settings },
];

export default function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) { setPrevPath(pathname); setOpen(false); }

  const nav = (
    <nav aria-label="Menu admin" className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6 text-gold-300"><StarMotif className="h-9 w-9" strokeWidth={2.5} /><div><p className="font-display text-lg leading-tight text-ivory-50">Roudlotut Tholibat</p><p className="text-xs uppercase tracking-widest text-ivory-50/60">Dasbor admin</p></div></div>
      <ul className="flex-1 space-y-1 px-3">
        {ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[0.95rem] font-medium text-ivory-50/80 transition-colors hover:bg-ivory-50/10 aria-[current=page]:bg-ivory-50/15 aria-[current=page]:text-ivory-50">
                <Icon size={18} aria-hidden />{label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-2 border-t border-ivory-50/10 p-4">
        <Link href="/" target="_blank" className="flex min-h-10 items-center gap-2 rounded-md px-2 text-sm text-ivory-50/80 hover:text-ivory-50"><ExternalLink size={16} aria-hidden />Lihat website</Link>
        <p className="truncate px-2 text-sm text-ivory-50/60" title={name}>Masuk sebagai {name}</p>
        <form action={logoutAction}><button type="submit" className="flex min-h-10 w-full items-center gap-2 rounded-md px-2 text-sm text-ivory-50/80 hover:bg-ivory-50/10 hover:text-ivory-50"><LogOut size={16} aria-hidden />Keluar</button></form>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="on-dark fixed inset-y-0 left-0 hidden w-64 bg-forest-950 lg:block">{nav}</aside>
      <div className="on-dark sticky top-0 z-30 flex items-center justify-between bg-forest-950 px-4 py-2 lg:hidden">
        <span className="font-display text-lg text-ivory-50">Admin</span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu admin" aria-expanded={open} className="flex h-11 w-11 items-center justify-center text-ivory-50"><Menu /></button>
      </div>
      {open && (
        <div className="on-dark fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-forest-950">
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup menu" className="absolute right-2 top-3 flex h-11 w-11 items-center justify-center text-ivory-50"><X /></button>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
