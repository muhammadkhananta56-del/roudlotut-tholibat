"use client";

import { useState } from "react";
import EmptyState from "@/components/ui/EmptyState";
import NewsCard from "@/components/ui/NewsCard";
import { newsCategories, type NewsItem } from "@/lib/data/berita";
import { siteConfig } from "@/lib/site";

export default function NewsBrowser({ items }: { items: NewsItem[] }) {
  const [category, setCategory] = useState("semua");

  if (items.length === 0) {
    return (
      <EmptyState
        title="Berita belum ditambahkan"
        action={{ href: siteConfig.instagram, label: `Ikuti kabar di Instagram ${siteConfig.instagramHandle}`, external: true }}
      >
        <p>Berita dan pengumuman pondok akan tampil di sini setelah ditulis.</p>
      </EmptyState>
    );
  }

  const used = newsCategories.filter((c) => items.some((i) => i.category === c.slug));
  const visible = category === "semua" ? items : items.filter((i) => i.category === category);
  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition ${
      active ? "border-brand-700 bg-brand-700 text-white" : "border-brand-700/30 bg-white text-brand-900 hover:border-brand-700"
    }`;

  return (
    <div className="space-y-8">
      <div role="group" aria-label="Filter kategori berita" className="flex flex-wrap gap-2">
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
        Menampilkan {visible.length} berita
      </p>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((n) => (
          <NewsCard key={n.slug} item={n} />
        ))}
      </div>
    </div>
  );
}
