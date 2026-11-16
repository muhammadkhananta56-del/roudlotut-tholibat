"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type GalleryItem = { id: string; title: string; description: string; category: string | null; thumb: string; full: string; w: number; h: number };

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [idx, setIdx] = useState(0);
  const [lastFocus, setLastFocus] = useState<HTMLElement | null>(null);

  const open = (i: number, el: HTMLElement) => { setIdx(i); setLastFocus(el); dlg.current?.showModal(); };
  const close = useCallback(() => dlg.current?.close(), []);
  const step = useCallback((d: number) => setIdx((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    const el = dlg.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => { if (!el.open) return; if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    const onClose = () => lastFocus?.focus();
    window.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => { window.removeEventListener("keydown", onKey); el.removeEventListener("close", onClose); };
  }, [step, lastFocus]);

  const cur = items[idx];
  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {items.map((it, i) => (
          <li key={it.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button type="button" onClick={(e) => open(i, e.currentTarget)} aria-label={`Perbesar foto: ${it.title || "tanpa judul"}`}
              className="zoom-hover group relative block w-full overflow-hidden rounded-[var(--radius-media)] bg-sage-100 text-left" style={{ aspectRatio: `${it.w} / ${it.h}` }}>
              <Image src={it.thumb} alt={it.title || it.description || "Foto kegiatan pondok"} fill unoptimized loading="lazy" sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
              {it.title && (
                <span className="gcap absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/80 to-transparent p-3 pt-10 text-sm font-medium text-ivory-50">{it.title}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dlg} className="lightbox" aria-label="Penampil foto" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {cur && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-10" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
            <button type="button" onClick={close} aria-label="Tutup" className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-ivory-50/10 text-ivory-50 hover:bg-ivory-50/20"><X /></button>
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Foto sebelumnya" className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory-50/10 text-ivory-50 hover:bg-ivory-50/20 sm:left-6"><ChevronLeft /></button>
                <button type="button" onClick={() => step(1)} aria-label="Foto berikutnya" className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory-50/10 text-ivory-50 hover:bg-ivory-50/20 sm:right-6"><ChevronRight /></button>
              </>
            )}
            <Image key={cur.id} src={cur.full} alt={cur.title || cur.description || "Foto kegiatan pondok"} width={cur.w} height={cur.h} unoptimized className="max-h-[78vh] w-auto max-w-full rounded-md object-contain" />
            <div className="max-w-2xl text-center text-ivory-50">
              {cur.title && <p className="font-display text-xl">{cur.title}</p>}
              {cur.description && <p className="mt-1 text-sm text-ivory-50/75">{cur.description}</p>}
              <p className="mt-2 text-xs text-ivory-50/50" aria-live="polite">{idx + 1} dari {items.length}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
