"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateGalleryAction } from "@/app/actions/gallery";
import SubmitButton from "@/components/admin/SubmitButton";
import Field from "@/components/admin/Field";
import { useFields } from "@/components/admin/useFields";

export default function GalleryEditForm({ id, initial, categories }: {
  id: string; initial: { title: string; description: string; categoryId: string; showOnHome: boolean }; categories: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(updateGalleryAction, null);
  const { bind } = useFields({ title: initial.title, description: initial.description, categoryId: initial.categoryId });
  const [home, setHome] = useState(initial.showOnHome);
  const e = state?.errors;
  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="id" value={id} />
      {state?.message && <p role="alert" className="err">{state.message}</p>}
      <Field label="Judul foto" name="title" error={e?.title}><input {...bind("title", e)} className="field" maxLength={140} /></Field>
      <Field label="Deskripsi" name="description" error={e?.description}><textarea {...bind("description", e)} rows={3} className="field" maxLength={500} /></Field>
      <Field label="Kategori" name="categoryId" error={e?.categoryId}>
        <select {...bind("categoryId", e)} className="field"><option value="">Tanpa kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </Field>
      <label className="flex min-h-11 items-center gap-3 font-medium text-forest-900">
        <input type="checkbox" name="showOnHome" checked={home} onChange={(ev) => setHome(ev.target.checked)} className="h-5 w-5 accent-emerald-600" />
        Tampilkan di halaman utama (maksimal 6 foto pertama)
      </label>
      <div className="flex flex-wrap gap-3"><SubmitButton>Simpan</SubmitButton><Link href="/admin/galeri" className="abtn abtn-outline">Batal</Link></div>
    </form>
  );
}
