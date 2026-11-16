import Link from "next/link";

export default function Pagination({ page, pages, basePath, params = {} }: { page: number; pages: number; basePath: string; params?: Record<string, string> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams(params);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return q ? `${basePath}?${q}` : basePath;
  };
  const items = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);
  return (
    <nav aria-label="Halaman" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && <Link href={href(page - 1)} className="btn btn-ghost min-h-11 px-4">Sebelumnya</Link>}
      {items.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && items[i - 1] !== p - 1 && <span aria-hidden className="text-ink-400">…</span>}
          <Link href={href(p)} aria-current={p === page ? "page" : undefined}
            className={`flex h-11 min-w-11 items-center justify-center rounded-[var(--radius-ctl)] px-3 font-semibold ${p === page ? "bg-forest-900 text-ivory-50" : "text-forest-900 hover:bg-sage-100"}`}>{p}</Link>
        </span>
      ))}
      {page < pages && <Link href={href(page + 1)} className="btn btn-ghost min-h-11 px-4">Berikutnya</Link>}
    </nav>
  );
}
