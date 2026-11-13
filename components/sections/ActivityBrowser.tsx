"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import EmptyState from "@/components/ui/EmptyState";
import { activityCategories, type Activity } from "@/lib/data/kegiatan";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export default function ActivityBrowser({ items }: { items: Activity[] }) {
  const [category, setCategory] = useState("semua");
  const sorted = useMemo(() => [...items].sort((a, b) => (a.date < b.date ? 1 : -1)), [items]);
  const visible = category === "semua" ? sorted : sorted.filter((a) => a.category === category);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Kegiatan belum ditambahkan"
        action={{ href: siteConfig.instagram, label: `Lihat di Instagram ${siteConfig.instagramHandle}`, external: true }}
      >
        <p>
          Kategori kegiatan yang disiapkan: {activityCategories.map((c) => c.name).join(", ")}. Daftar
          kegiatan akan tampil di sini setelah datanya diterima dari pihak pondok.
        </p>
      </EmptyState>
    );
  }

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition ${
      active ? "border-brand-700 bg-brand-700 text-white" : "border-brand-700/30 bg-white text-brand-900 hover:border-brand-700"
    }`;
  const used = activityCategories.filter((c) => items.some((i) => i.category === c.slug));

  return (
    <div className="space-y-8">
      <div role="group" aria-label="Filter kategori kegiatan" className="flex flex-wrap gap-2">
        <button type="button" className={chip(category === "semua")} aria-pressed={category === "semua"} onClick={() => setCategory("semua")}>
          Semua
        </button>
        {used.map((c) => (
          <button key={c.slug} type="button" className={chip(category === c.slug)} aria-pressed={category === c.slug} onClick={() => setCategory(c.slug)}>
            {c.name}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        Menampilkan {visible.length} kegiatan
      </p>
      <ul className="grid gap-10 md:grid-cols-2">
        {visible.map((a) => (
          <li key={a.slug}>
            <article className="space-y-4">
              {a.cover && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-cream-100">
                  <Image src={a.cover} alt={a.coverAlt ?? a.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
              )}
              <p className="text-sm text-ink-500">
                <time dateTime={a.date}>{formatDate(a.date)}</time>
                {a.location ? `, ${a.location}` : ""}
              </p>
              <h3 className="text-2xl font-bold text-brand-900">{a.title}</h3>
              <div className="space-y-3 text-ink-500">
                {a.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
