"use client";

import { useState, type FormEvent } from "react";
import { contactSchema, firstErrors } from "@/lib/schemas";
import { buildContactMessage } from "@/lib/messages";
import { getChannels, mailtoLink, waLink } from "@/lib/contact";
import { siteConfig } from "@/lib/site";
import { TextArea, TextField } from "./fields";
import MessageResult from "./MessageResult";

const ORDER = ["nama", "kontak", "pesan"] as const;

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const channels = getChannels();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw: Record<string, string> = {};
    for (const key of ORDER) raw[key] = String(fd.get(key) ?? "");

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const errs = firstErrors(parsed.error);
      setErrors(errs);
      const first = ORDER.find((k) => errs[k]);
      if (first) document.getElementById(`kontak-${first}`)?.focus();
      return;
    }
    setErrors({});
    setMessage(buildContactMessage(parsed.data));
  }

  const whatsappHref = message && channels.whatsappNumber ? waLink(channels.whatsappDisplay, message) : null;
  const emailHref =
    message && channels.email ? mailtoLink(channels.email, `Pesan untuk ${siteConfig.shortName}`, message) : null;
  const errorCount = Object.keys(errors).length;

  return (
    <div>
      {message !== null && (
        <MessageResult
          title="Pesan siap dikirim"
          message={message}
          whatsappHref={whatsappHref}
          emailHref={emailHref}
          onEdit={() => setMessage(null)}
        />
      )}
      <form onSubmit={onSubmit} noValidate hidden={message !== null} className="space-y-5" aria-label="Formulir pesan">
        {errorCount > 0 && (
          <p role="alert" className="rounded-input border-2 border-danger bg-white p-4 font-medium text-danger">
            Ada {errorCount} isian yang perlu diperbaiki.
          </p>
        )}
        <TextField id="kontak-nama" name="nama" label="Nama" required autoComplete="name" error={errors.nama} />
        <TextField
          id="kontak-kontak"
          name="kontak"
          label="Email atau WhatsApp Anda"
          autoComplete="off"
          hint="Agar pihak pondok bisa membalas."
          error={errors.kontak}
        />
        <TextArea id="kontak-pesan" name="pesan" label="Pesan" rows={5} required error={errors.pesan} />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-700 px-8 font-semibold text-white transition hover:bg-brand-900 active:translate-y-px"
        >
          Susun pesan
        </button>
        <p className="text-sm text-ink-500">
          Pesan dikirim lewat WhatsApp atau email Anda sendiri. Website ini belum menyimpan pesan.
        </p>
      </form>
    </div>
  );
}
