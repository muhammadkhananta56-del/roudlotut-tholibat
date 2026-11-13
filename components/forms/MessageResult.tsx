"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

type Props = {
  title: string;
  message: string;
  whatsappHref: string | null;
  emailHref?: string | null;
  onEdit: () => void;
};

export default function MessageResult({ title, message, whatsappHref, emailHref, onEdit }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [copy, setCopy] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, []);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopy("ok");
    } catch {
      areaRef.current?.select();
      setCopy("fail");
    }
  }

  const primary =
    "inline-flex min-h-12 items-center justify-center rounded-button bg-brand-700 px-6 font-semibold text-white transition hover:bg-brand-900 active:translate-y-px";
  const secondary =
    "inline-flex min-h-12 items-center justify-center rounded-button border border-brand-700 px-6 font-semibold text-brand-700 transition hover:bg-brand-700 hover:text-white active:translate-y-px";

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-brand-900 outline-offset-4">
            {title}
          </h3>
          <p className="mt-1 text-ink-500">
            Pesan belum terkirim. Data Anda baru sampai ke pihak pondok setelah Anda menekan tombol kirim
            di bawah.
          </p>
        </div>
      </div>

      <label htmlFor="pesan-siap" className="block text-sm font-semibold text-brand-900">
        Isi pesan
      </label>
      <textarea
        id="pesan-siap"
        ref={areaRef}
        readOnly
        value={message}
        rows={Math.min(14, message.split("\n").length + 1)}
        className="w-full rounded-input border border-ink-500/80 bg-cream-50 p-4 text-base text-ink-900"
      />

      <div className="flex flex-wrap gap-3">
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={primary}>
            Kirim lewat WhatsApp
          </a>
        ) : (
          <span role="note" className="rounded-input bg-cream-100 px-4 py-3 text-sm text-ink-900">
            Nomor WhatsApp resmi belum diisi di website, jadi tombol kirim belum tersedia. Salin pesan lalu
            kirim sendiri ke nomor pondok.
          </span>
        )}
        {emailHref && (
          <a href={emailHref} className={secondary}>
            Kirim lewat email
          </a>
        )}
        <button type="button" onClick={copyMessage} className={secondary}>
          Salin pesan
        </button>
        <button type="button" onClick={onEdit} className="inline-flex min-h-12 items-center px-3 font-semibold text-brand-700 underline underline-offset-4">
          Ubah isian
        </button>
      </div>
      <p role="status" className="min-h-6 text-sm text-ink-500">
        {copy === "ok" && "Pesan disalin. Tempel di WhatsApp."}
        {copy === "fail" && "Penyalinan otomatis gagal. Teks pesan sudah dipilih, tekan Ctrl+C atau tekan lama lalu pilih Salin."}
      </p>
    </div>
  );
}
