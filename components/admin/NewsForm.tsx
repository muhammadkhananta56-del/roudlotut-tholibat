"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveNewsAction } from "@/app/actions/news";
import SubmitButton from "@/components/admin/SubmitButton";
import Field from "@/components/admin/Field";
import ImageUploader from "@/components/admin/ImageUploader";
import { useFields } from "@/components/admin/useFields";

export type NewsFormData = {
  id: string; title: string; excerpt: string; body: string; categoryId: string; status: "draft" | "published";
  publishedAt: string; coverPath: string; coverUrl: string; coverAlt: string;
};

export default function NewsForm({ initial, categories }: { initial: NewsFormData; categories: { id: string; name: string }[] }) {
  const [state, action] = useActionState(saveNewsAction, null);
  const { f, bind } = useFields({ title: initial.title, excerpt: initial.excerpt, body: initial.body, categoryId: initial.categoryId, status: initial.status as string, publishedAt: initial.publishedAt, coverAlt: initial.coverAlt });
  const e = state?.errors;
  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_20rem]" noValidate>
      <input type="hidden" name="id" value={initial.id} />
      <div className="space-y-6">
        {state?.message && <p role="alert" className="rounded-md border border-danger-600/40 bg-danger-100 px-4 py-3 text-sm font-medium text-danger-600">{state.message}</p>}
        <Field label="Judul berita" name="title" error={e?.title} required><input {...bind("title", e)} className="field" maxLength={160} /></Field>
        <Field label="Ringkasan" name="excerpt" error={e?.excerpt} hint="Tampil di daftar berita dan hasil pencarian. Maksimal 300 karakter.">
          <textarea {...bind("excerpt", e)} rows={3} className="field" maxLength={300} />
        </Field>
        <Field label="Isi berita" name="body" error={e?.body} required hint="Baris kosong = paragraf baru. ‘## Judul’ = subjudul. Baris berawalan ‘- ’ = daftar.">
          <textarea {...bind("body", e)} rows={16} className="field font-[inherit]" />
          <p className="hint">{f.body.length.toLocaleString("id-ID")} karakter</p>
        </Field>
      </div>

      <aside className="space-y-6">
        <div className="panel space-y-5 p-5">
          <Field label="Status" name="status" error={e?.status}>
            <select {...bind("status", e)} className="field"><option value="draft">Draft (belum tampil)</option><option value="published">Terbit</option></select>
          </Field>
          <Field label="Tanggal publikasi (WIB)" name="publishedAt" error={e?.publishedAt} hint="Kosong = sekarang saat diterbitkan. Tanggal di masa depan menjadwalkan tayang.">
            <input {...bind("publishedAt", e)} type="datetime-local" className="field" />
          </Field>
          <Field label="Kategori" name="categoryId" error={e?.categoryId}>
            <select {...bind("categoryId", e)} className="field"><option value="">Tanpa kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </Field>
        </div>
        <div className="panel space-y-4 p-5">
          <p className="label">Gambar sampul</p>
          <ImageUploader name="coverPath" folder="news" initialPath={initial.coverPath || null} initialUrl={initial.coverUrl || null} />
          <Field label="Deskripsi gambar" name="coverAlt" error={e?.coverAlt} hint="Wajib bila ada gambar. Untuk pembaca layar dan SEO."><input {...bind("coverAlt", e)} className="field" maxLength={200} /></Field>
          {e?.coverPath && <p className="err">{e.coverPath}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <SubmitButton>Simpan</SubmitButton>
          {initial.id && <Link href={`/admin/berita/${initial.id}/pratinjau`} className="abtn abtn-outline" target="_blank">Pratinjau</Link>}
          <Link href="/admin/berita" className="abtn abtn-outline">Kembali</Link>
        </div>
        {!initial.id && <p className="hint">Pratinjau tersedia setelah berita disimpan pertama kali (simpan sebagai draft bila belum siap terbit).</p>}
      </aside>
    </form>
  );
}
