"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import SubmitButton from "@/components/admin/SubmitButton";

/** Tombol hapus dengan dialog konfirmasi (elemen <dialog> bawaan: fokus terkunci, Esc menutup). */
export default function ConfirmDelete({ action, id, extra, title, message, iconOnly = false, label = "Hapus" }: {
  action: (fd: FormData) => void | Promise<void>; id: string; extra?: Record<string, string>;
  title: string; message: string; iconOnly?: boolean; label?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} aria-label={`${label}: ${title}`}
        className={iconOnly ? "abtn abtn-outline px-3 text-danger-600" : "abtn abtn-outline text-danger-600"}>
        <Trash2 size={16} aria-hidden />{!iconOnly && label}
      </button>
      <dialog ref={ref} className="confirm" aria-labelledby={`d-${id}`}>
        <form action={action} className="p-6">
          <input type="hidden" name="id" value={id} />
          {extra && Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <h2 id={`d-${id}`} className="text-xl">Hapus &ldquo;{title.length > 60 ? title.slice(0, 60) + "…" : title}&rdquo;?</h2>
          <p className="mt-2 text-ink-600">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => ref.current?.close()} className="abtn abtn-outline" autoFocus>Batal</button>
            <SubmitButton className="abtn abtn-danger" pendingText="Menghapus…">Ya, hapus</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
