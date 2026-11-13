"use client";

import { useState, type FormEvent } from "react";
import { ppdbSchema, firstErrors } from "@/lib/schemas";
import { buildPpdbMessage } from "@/lib/messages";
import { getChannels, waLink } from "@/lib/contact";
import { programs } from "@/lib/site";
import { RadioField, SelectField, TextArea, TextField } from "./fields";
import MessageResult from "./MessageResult";

const ORDER = [
  "namaSantri",
  "tempatLahir",
  "tanggalLahir",
  "jenisKelamin",
  "alamat",
  "namaWali",
  "whatsappWali",
  "program",
  "catatan",
] as const;

const programOptions = [...programs.map((p) => p.name), "Belum menentukan"];

export default function PpdbForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const channels = getChannels();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw: Record<string, string> = {};
    for (const key of ORDER) raw[key] = String(fd.get(key) ?? "");

    const parsed = ppdbSchema.safeParse(raw);
    if (!parsed.success) {
      const errs = firstErrors(parsed.error);
      setErrors(errs);
      const first = ORDER.find((k) => errs[k]);
      if (first) {
        const id = first === "jenisKelamin" ? "ppdb-jenisKelamin-0" : `ppdb-${first}`;
        document.getElementById(id)?.focus();
      }
      return;
    }
    setErrors({});
    setMessage(buildPpdbMessage(parsed.data));
  }

  const errorCount = Object.keys(errors).length;
  const whatsappHref = message && channels.whatsappNumber ? waLink(channels.whatsappDisplay, message) : null;

  return (
    <div>
      {message !== null && (
        <MessageResult
          title="Pesan pendaftaran siap dikirim"
          message={message}
          whatsappHref={whatsappHref}
          onEdit={() => setMessage(null)}
        />
      )}
      <form
        onSubmit={onSubmit}
        noValidate
        hidden={message !== null}
        className="space-y-8"
        aria-label="Formulir pendaftaran santri baru"
      >
        {errorCount > 0 && (
          <p role="alert" className="rounded-input border-2 border-danger bg-white p-4 font-medium text-danger">
            Ada {errorCount} isian yang perlu diperbaiki. Isian yang bermasalah ditandai merah di bawah.
          </p>
        )}

        <fieldset className="space-y-5">
          <legend className="mb-2 font-display text-xl font-bold text-brand-900">1. Data calon santri</legend>
          <TextField id="ppdb-namaSantri" name="namaSantri" label="Nama lengkap" required autoComplete="off" error={errors.namaSantri} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="ppdb-tempatLahir" name="tempatLahir" label="Tempat lahir" required autoComplete="off" error={errors.tempatLahir} />
            <TextField id="ppdb-tanggalLahir" name="tanggalLahir" label="Tanggal lahir" type="date" required error={errors.tanggalLahir} />
          </div>
          <RadioField id="ppdb-jenisKelamin" name="jenisKelamin" legend="Jenis kelamin" options={["Laki-laki", "Perempuan"]} error={errors.jenisKelamin} />
          <TextArea id="ppdb-alamat" name="alamat" label="Alamat lengkap" rows={3} required error={errors.alamat} />
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="mb-2 font-display text-xl font-bold text-brand-900">2. Data orang tua atau wali</legend>
          <TextField id="ppdb-namaWali" name="namaWali" label="Nama orang tua atau wali" required autoComplete="name" error={errors.namaWali} />
          <TextField
            id="ppdb-whatsappWali"
            name="whatsappWali"
            label="Nomor WhatsApp wali"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            hint="Contoh: 081234567890"
            error={errors.whatsappWali}
          />
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="mb-2 font-display text-xl font-bold text-brand-900">3. Program dan catatan</legend>
          <SelectField id="ppdb-program" name="program" label="Program yang diminati" options={programOptions} required error={errors.program} />
          <TextArea id="ppdb-catatan" name="catatan" label="Catatan tambahan" rows={3} error={errors.catatan} />
        </fieldset>

        <div className="space-y-3">
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-button bg-brand-700 px-8 font-semibold text-white transition hover:bg-brand-900 active:translate-y-px sm:w-auto"
          >
            Susun pesan pendaftaran
          </button>
          <p className="text-sm text-ink-500">
            Data hanya diproses di perangkat Anda. Tidak ada yang tersimpan di website sampai Anda sendiri
            mengirimnya.
          </p>
        </div>
      </form>
    </div>
  );
}
