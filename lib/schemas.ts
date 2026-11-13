import { z } from "zod";
import { normalizeWhatsapp, isEmail } from "@/lib/contact";
import { programs } from "@/lib/site";

const programNames = [...programs.map((p) => p.name), "Belum menentukan"];

function validPastDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const year = d.getUTCFullYear();
  return year >= 1980 && d.getTime() <= Date.now();
}

export const ppdbSchema = z.object({
  namaSantri: z
    .string()
    .trim()
    .min(3, "Tulis nama lengkap calon santri, minimal 3 huruf.")
    .max(100, "Nama terlalu panjang, maksimal 100 huruf."),
  tempatLahir: z
    .string()
    .trim()
    .min(2, "Tulis tempat lahir.")
    .max(60, "Tempat lahir terlalu panjang."),
  tanggalLahir: z
    .string()
    .refine(validPastDate, "Pilih tanggal lahir yang valid, tidak boleh setelah hari ini."),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"], { message: "Pilih jenis kelamin." }),
  alamat: z
    .string()
    .trim()
    .min(10, "Tulis alamat lengkap, minimal 10 huruf.")
    .max(300, "Alamat terlalu panjang, maksimal 300 huruf."),
  namaWali: z
    .string()
    .trim()
    .min(3, "Tulis nama orang tua atau wali, minimal 3 huruf.")
    .max(100, "Nama terlalu panjang, maksimal 100 huruf."),
  whatsappWali: z
    .string()
    .trim()
    .refine((v) => normalizeWhatsapp(v) !== null, "Tulis nomor WhatsApp yang valid, contoh 081234567890."),
  program: z.enum(programNames as [string, ...string[]], { message: "Pilih program." }),
  catatan: z.string().trim().max(500, "Catatan terlalu panjang, maksimal 500 huruf."),
});

export type PpdbInput = z.infer<typeof ppdbSchema>;

export const contactSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, "Tulis nama Anda.")
    .max(80, "Nama terlalu panjang, maksimal 80 huruf."),
  kontak: z
    .string()
    .trim()
    .max(120, "Terlalu panjang.")
    .refine(
      (v) => v === "" || isEmail(v) || normalizeWhatsapp(v) !== null,
      "Isi dengan email atau nomor WhatsApp yang valid, atau kosongkan."
    ),
  pesan: z
    .string()
    .trim()
    .min(10, "Tulis pesan minimal 10 huruf.")
    .max(1000, "Pesan terlalu panjang, maksimal 1000 huruf."),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Mengambil satu pesan galat pertama untuk setiap kolom. */
export function firstErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
