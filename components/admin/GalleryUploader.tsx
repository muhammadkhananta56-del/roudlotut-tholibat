"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UploadCloud, XCircle } from "lucide-react";
import { uploadGalleryPhotoAction } from "@/app/actions/gallery";
import { prepareImage } from "@/components/admin/resize";

type Row = { name: string; state: "wait" | "up" | "ok" | "err"; msg?: string };

export default function GalleryUploader({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 30);
    if (!files.length) return;
    setBusy(true);
    setRows(files.map((f) => ({ name: f.name, state: "wait" })));
    const patch = (i: number, r: Partial<Row>) => setRows((cur) => cur.map((x, j) => (j === i ? { ...x, ...r } : x)));
    for (let i = 0; i < files.length; i++) {
      patch(i, { state: "up" });
      try {
        const fd = new FormData();
        fd.set("file", await prepareImage(files[i]));
        fd.set("categoryId", categoryId);
        const r = await uploadGalleryPhotoAction(fd);
        patch(i, r.ok ? { state: "ok" } : { state: "err", msg: r.message });
      } catch {
        patch(i, { state: "err", msg: "Gagal terkirim" });
      }
    }
    setBusy(false);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48">
          <label htmlFor={`${id}-cat`} className="label">Kategori untuk unggahan ini</label>
          <select id={`${id}-cat`} className="field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={busy}>
            <option value="">Tanpa kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <label htmlFor={id} className={`abtn abtn-primary ${busy ? "pointer-events-none opacity-60" : "cursor-pointer"}`}><UploadCloud size={18} aria-hidden />Pilih foto (bisa banyak)</label>
        <input id={id} ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onPick} disabled={busy} />
      </div>
      <p className="hint">Maksimal 30 foto sekali unggah. Judul dan deskripsi bisa diisi setelah foto masuk.</p>
      {rows.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm" aria-live="polite">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              {r.state === "ok" && <CheckCircle2 size={16} className="text-emerald-600" aria-hidden />}
              {r.state === "err" && <XCircle size={16} className="text-danger-600" aria-hidden />}
              {(r.state === "up") && <span className="spinner text-forest-900" aria-hidden />}
              {r.state === "wait" && <span className="h-4 w-4 rounded-full border border-sage-300" aria-hidden />}
              <span className="truncate">{r.name}</span>
              <span className={r.state === "err" ? "text-danger-600" : "text-ink-400"}>{r.state === "ok" ? "berhasil" : r.state === "up" ? "mengunggah…" : r.state === "err" ? r.msg : "menunggu"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
