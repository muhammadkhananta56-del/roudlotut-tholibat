import Link from "next/link";
import { Info } from "lucide-react";

const OK: Record<string, string> = { saved: "Perubahan berhasil disimpan.", deleted: "Data berhasil dihapus.", updated: "Status berhasil diperbarui." };
const ERR: Record<string, string> = { invalid: "Isian tidak valid.", duplicate: "Nama tersebut sudah dipakai." };

export function Flash({ ok, err }: { ok?: string; err?: string }) {
  const msg = ok && OK[ok] ? { t: OK[ok], bad: false } : err && ERR[err] ? { t: ERR[err], bad: true } : null;
  if (!msg) return null;
  return (
    <div role={msg.bad ? "alert" : "status"} className={`mb-6 rounded-md border px-4 py-3 text-sm font-medium ${msg.bad ? "border-danger-600/40 bg-danger-100 text-danger-600" : "border-emerald-500/40 bg-sage-100 text-forest-900"}`}>{msg.t}</div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl">{title}</h1>{description && <p className="mt-1 text-ink-600">{description}</p>}</div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export function StatusBadge({ tone, children }: { tone: "green" | "gray" | "red" | "gold"; children: React.ReactNode }) {
  const c = { green: "bg-sage-100 text-forest-800", gray: "bg-ivory-200 text-ink-600", red: "bg-danger-100 text-danger-600", gold: "bg-[#f3e8c8] text-gold-700" }[tone];
  return <span className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-bold ${c}`}>{children}</span>;
}

export function AdminEmpty({ title, children, href, cta }: { title: string; children: React.ReactNode; href?: string; cta?: string }) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <Info className="text-gold-500" aria-hidden />
      <h2 className="text-xl">{title}</h2>
      <p className="max-w-md text-ink-600">{children}</p>
      {href && cta && <Link href={href} className="abtn abtn-primary mt-2">{cta}</Link>}
    </div>
  );
}

export function FilterForm({ q, status, statuses, placeholder }: { q: string; status: string; statuses: [string, string][]; placeholder: string }) {
  return (
    <form role="search" className="mb-5 flex flex-wrap gap-3">
      <label className="sr-only" htmlFor="q">Cari</label>
      <input id="q" name="q" defaultValue={q} placeholder={placeholder} className="field max-w-xs" maxLength={80} />
      <label className="sr-only" htmlFor="status">Status</label>
      <select id="status" name="status" defaultValue={status} className="field w-auto">
        <option value="">Semua status</option>
        {statuses.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <button type="submit" className="abtn abtn-outline">Terapkan</button>
    </form>
  );
}
