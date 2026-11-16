"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveScheduleAction } from "@/app/actions/schedule";
import SubmitButton from "@/components/admin/SubmitButton";
import Field from "@/components/admin/Field";
import { useFields } from "@/components/admin/useFields";

export type ScheduleFormData = {
  id: string; title: string; speaker: string; location: string; description: string;
  startsAt: string; endsAt: string; status: string; isPublished: boolean;
};

export default function ScheduleForm({ initial }: { initial: ScheduleFormData }) {
  const [state, action] = useActionState(saveScheduleAction, null);
  const { bind } = useFields({ title: initial.title, speaker: initial.speaker, location: initial.location, description: initial.description, startsAt: initial.startsAt, endsAt: initial.endsAt, status: initial.status });
  const [published, setPublished] = useState(initial.isPublished);
  const e = state?.errors;
  return (
    <form action={action} className="panel max-w-3xl space-y-6 p-6" noValidate>
      <input type="hidden" name="id" value={initial.id} />
      {state?.message && <p role="alert" className="rounded-md border border-danger-600/40 bg-danger-100 px-4 py-3 text-sm font-medium text-danger-600">{state.message}</p>}
      <Field label="Nama kegiatan" name="title" error={e?.title} required><input {...bind("title", e)} className="field" maxLength={160} placeholder="Contoh: Pengajian Kitab Ta'lim Muta'allim" /></Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Mulai (WIB)" name="startsAt" error={e?.startsAt} required><input {...bind("startsAt", e)} type="datetime-local" className="field" /></Field>
        <Field label="Selesai (WIB)" name="endsAt" error={e?.endsAt} hint="Boleh dikosongkan."><input {...bind("endsAt", e)} type="datetime-local" className="field" /></Field>
        <Field label="Pemateri" name="speaker" error={e?.speaker}><input {...bind("speaker", e)} className="field" maxLength={120} /></Field>
        <Field label="Lokasi" name="location" error={e?.location}><input {...bind("location", e)} className="field" maxLength={160} /></Field>
      </div>
      <Field label="Deskripsi" name="description" error={e?.description}><textarea {...bind("description", e)} rows={4} className="field" maxLength={2000} /></Field>
      <div className="grid items-end gap-6 sm:grid-cols-2">
        <Field label="Status kegiatan" name="status" error={e?.status}>
          <select {...bind("status", e)} className="field"><option value="scheduled">Terjadwal</option><option value="done">Selesai</option><option value="cancelled">Dibatalkan</option></select>
        </Field>
        <label className="flex min-h-11 items-center gap-3 font-medium text-forest-900">
          <input type="checkbox" name="isPublished" checked={published} onChange={(ev) => setPublished(ev.target.checked)} className="h-5 w-5 accent-emerald-600" />
          Tampilkan di website
        </label>
      </div>
      <div className="flex flex-wrap gap-3"><SubmitButton>Simpan jadwal</SubmitButton><Link href="/admin/jadwal" className="abtn abtn-outline">Batal</Link></div>
    </form>
  );
}
