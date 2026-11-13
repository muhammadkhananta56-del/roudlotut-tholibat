"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { activityCategories } from "@/lib/data/kegiatan";
import type { GalleryItem } from "@/lib/data/galeri";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export default function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("semua");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const usedCategories = useMemo(
    () => activityCategories.filter((c) => items.some((i) => i.category === c.slug)),
    [items]
  );
  const visible = useMemo(
    () => (category === "semua" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Foto belum ditambahkan"
        action={{ href: siteConfig.instagram, label: `Lihat di Instagram ${siteConfig.instagramHandle}`, external: true }}
      >
        <p>
          Galeri akan terisi setelah foto kegiatan asli diterima dari pihak pondok. Sementara itu,
          dokumentasi terbaru tersedia di Instagram resmi.
        </p>
      </EmptyState>
    );
  }

  const current = openIndex !== null ? visible[openIndex] : undefined;

  const openAt = (i: number, el: HTMLElement) => {
    triggerRef.current = el;
    setOpenIndex(i);
  };
  const step = (dir: 1 | -1) => {
    setOpenIndex((i) => (i === null ? null : (i + dir + visible.length) % visible.length));
  };

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition ${
      active
        ? "border-brand-700 bg-brand-700 text-white"
        : "border-brand-700/30 bg-white text-brand-900 hover:border-brand-700"
    }`;

  return (
    <div className="space-y-8">
      {usedCategories.length > 0 && (
        <div role="group" aria-label="Filter kategori foto" className="flex flex-wrap gap-2">
          <button type="button" className={chip(category === "semua")} aria-pressed={category === "semua"} onClick={() => setCategory("semua")}>
            Semua
          </button>
          {usedCategories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={chip(category === c.slug)}
              aria-pressed={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" role="status">
        Menampilkan {visible.length} foto
      </p>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {visible.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              className="group relative block w-full overflow-hidden rounded-card bg-cream-100 text-left"
              aria-label={`Perbesar foto: ${item.caption}`}
            >
              <span className="relative block aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </span>
              <span className="block bg-white px-3 py-2 text-sm text-ink-500">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Penampil foto"
        onClose={() => {
          setOpenIndex(null);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpenIndex(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          }
        }}
      >
        {current && (
          <div className="on-dark flex h-full flex-col p-4 sm:p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Tutup foto"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="relative my-3 min-h-0 flex-1">
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="min-w-0 text-center">
                <p className="text-white">{current.caption}</p>
                <p className="text-sm text-white/80">
                  <time dateTime={current.date}>{formatDate(current.date)}</time>
                  {` (${(openIndex ?? 0) + 1} dari ${visible.length})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
