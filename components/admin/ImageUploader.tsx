"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { uploadImageAction } from "@/app/actions/upload";
import { prepareImage } from "@/components/admin/resize";

/** Mengunggah satu gambar segera setelah dipilih; path hasilnya dikirim lewat <input type="hidden" name={name}>. */
export default function ImageUploader({ name, folder, initialPath, initialUrl, aspect = "aspect-[16/9]" }: {
  name: string; folder: "news" | "site"; initialPath: string | null; initialUrl: string | null; aspect?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(initialPath ?? "");
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const fd = new FormData();
      fd.set("folder", folder);
      fd.set("file", await prepareImage(file));
      const r = await uploadImageAction(fd);
      if (r.ok && r.path && r.url) { setPath(r.path); setUrl(r.url); } else setError(r.message || "Unggahan gagal.");
    } catch {
      setError("Unggahan gagal. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={path} />
      <div className={`relative ${aspect} w-full max-w-md overflow-hidden rounded-[var(--radius-ctl)] border border-dashed border-sage-300 bg-sage-50`}>
        {url ? <Image src={url} alt="Pratinjau gambar" fill unoptimized sizes="28rem" className="object-contain" /> : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-400"><ImagePlus aria-hidden /><span className="text-sm">Belum ada gambar</span></div>
        )}
        {busy && <div className="absolute inset-0 flex items-center justify-center gap-2 bg-paper/80 text-forest-900"><span className="spinner" />Mengunggah…</div>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor={id} className="abtn abtn-outline cursor-pointer">{url ? "Ganti gambar" : "Pilih gambar"}</label>
        <input id={id} ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onPick} disabled={busy} />
        {url && <button type="button" onClick={() => { setPath(""); setUrl(""); }} className="abtn abtn-outline text-danger-600"><Trash2 size={16} aria-hidden />Hapus</button>}
      </div>
      <p className="hint">JPG, PNG, atau WebP. Foto besar dikecilkan otomatis.</p>
      {error && <p role="alert" className="err">{error}</p>}
    </div>
  );
}
