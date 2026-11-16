import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { withTimeout } from "@/lib/safe";

export type SettingType = "text" | "textarea" | "image" | "url" | "email";
export type SettingField = {
  key: string;
  label: string;
  help?: string;
  type: SettingType;
  max: number;
  rows?: number;
  placeholder?: string;
};
export type SettingGroup = { id: string; title: string; description?: string; fields: SettingField[] };

// Nilai awal. Hanya berisi hal yang sudah ada pada website lama atau teks netral yang bisa diubah di dashboard.
export const DEFAULTS: Record<string, string> = {
  hero_headline: "Ilmu, adab, dan cinta Al-Qur'an.",
  hero_subtext: "TPQ Metode Darussalam, Tahfidz Al-Qur'an, Madrasah Diniyah, Khitobah, dan Sholawat Diba'iyah.",
  site_description:
    "Yayasan Pondok Pesantren Roudlotut Tholibat. Program: TPQ Metode Darussalam, Tahfidz Al-Qur'an, Madrasah Diniyah, Khitobah, dan Sholawat Diba'iyah.",
  instagram_url: "https://www.instagram.com/roudlotuttholibat/",
  programs: "TPQ Metode Darussalam\nTahfidz Al-Qur'an\nMadrasah Diniyah\nKhitobah\nSholawat Diba'iyah",
};

export const SETTING_GROUPS: SettingGroup[] = [
  {
    id: "beranda",
    title: "Beranda",
    description: "Tampilan paling atas halaman utama.",
    fields: [
      { key: "hero_headline", label: "Judul utama", type: "text", max: 120, help: "Kalimat besar di Beranda. Singkat dan bermakna." },
      { key: "hero_subtext", label: "Teks pendukung", type: "textarea", max: 300, rows: 2 },
      { key: "hero_image", label: "Foto utama", type: "image", max: 0, help: "Foto pondok atau kegiatan santri (orientasi tegak lebih baik). Kosong = tampil ornamen." },
      { key: "hero_image_alt", label: "Deskripsi foto utama", type: "text", max: 200, help: "Untuk pembaca layar dan SEO. Contoh: Santri mengaji di serambi pondok." },
      { key: "logo", label: "Logo pondok", type: "image", max: 0, help: "PNG/WebP berlatar transparan. Kosong = tampil tulisan nama." },
    ],
  },
  {
    id: "profil",
    title: "Profil dan Pengasuh",
    fields: [
      { key: "about_summary", label: "Ringkasan profil", type: "textarea", max: 1200, rows: 5, help: "Pisahkan paragraf dengan baris kosong." },
      { key: "caretaker_name", label: "Nama pengasuh", type: "text", max: 120 },
      { key: "caretaker_greeting", label: "Sambutan pengasuh", type: "textarea", max: 2500, rows: 6 },
      { key: "caretaker_photo", label: "Foto pengasuh", type: "image", max: 0 },
    ],
  },
  {
    id: "visi",
    title: "Visi, Misi, Nilai, dan Program",
    description: "Satu butir per baris. Tanda | memisahkan judul dan keterangan.",
    fields: [
      { key: "vision", label: "Visi", type: "textarea", max: 800, rows: 3 },
      { key: "mission", label: "Misi", type: "textarea", max: 3000, rows: 6, help: "Satu misi per baris." },
      { key: "values", label: "Nilai dan keunggulan", type: "textarea", max: 4000, rows: 6, help: "Format: Judul | Keterangan", placeholder: "Adab | Keterangan singkat" },
      { key: "programs", label: "Program pendidikan", type: "textarea", max: 4000, rows: 6, help: "Format: Nama program | Keterangan (keterangan boleh dikosongkan)", placeholder: "Nama program | Keterangan" },
      { key: "facilities", label: "Fasilitas", type: "textarea", max: 4000, rows: 6, help: "Format: Nama fasilitas | Keterangan" },
    ],
  },
  {
    id: "pendaftaran",
    title: "Pendaftaran",
    description: "Isi hanya yang benar-benar berlaku. Bagian yang kosong tidak ditampilkan di halaman Pendaftaran.",
    fields: [
      { key: "registration_status", label: "Status pendaftaran", type: "text", max: 120, placeholder: "Contoh: Pendaftaran santri baru dibuka", help: "Satu kalimat pendek yang tampil menonjol." },
      { key: "registration_info", label: "Keterangan pendaftaran", type: "textarea", max: 2000, rows: 4, help: "Pisahkan paragraf dengan baris kosong." },
      { key: "registration_steps", label: "Alur pendaftaran", type: "textarea", max: 4000, rows: 6, help: "Satu langkah per baris, berurutan. Format: Judul | Keterangan", placeholder: "Isi formulir | Keterangan" },
      { key: "registration_requirements", label: "Persyaratan", type: "textarea", max: 3000, rows: 5, help: "Satu persyaratan per baris." },
    ],
  },
  {
    id: "sejarah",
    title: "Sejarah",
    fields: [
      { key: "history", label: "Linimasa sejarah", type: "textarea", max: 8000, rows: 10, help: "Satu peristiwa per baris. Format: Tahun | Judul | Keterangan", placeholder: "1990 | Judul peristiwa | Keterangan" },
    ],
  },
  {
    id: "kontak",
    title: "Kontak dan Lokasi",
    fields: [
      { key: "contact_address", label: "Alamat lengkap", type: "textarea", max: 400, rows: 3 },
      { key: "contact_whatsapp", label: "Nomor WhatsApp", type: "text", max: 20, placeholder: "081234567890" },
      { key: "contact_email", label: "Email", type: "email", max: 200 },
      { key: "contact_hours", label: "Jam pelayanan", type: "text", max: 160, placeholder: "Senin sampai Sabtu, 08.00 sampai 14.00" },
      { key: "contact_maps_url", label: "Tautan Google Maps", type: "url", max: 500, placeholder: "https://maps.app.goo.gl/..." },
      { key: "instagram_url", label: "Tautan Instagram", type: "url", max: 300 },
    ],
  },
  {
    id: "seo",
    title: "SEO",
    fields: [{ key: "site_description", label: "Deskripsi website (mesin pencari)", type: "textarea", max: 300, rows: 3 }],
  },
];

export const ALL_FIELDS: SettingField[] = SETTING_GROUPS.flatMap((g) => g.fields);
export const FIELD_BY_KEY = new Map(ALL_FIELDS.map((f) => [f.key, f]));

export type Settings = Record<string, string>;

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await withTimeout(db()<{ key: string; value: string }[]>`select key, value from settings`, 8000, "getSettings");
  const out: Settings = { ...DEFAULTS };
  for (const r of rows) out[r.key] = r.value;
  return out;
});

export const s = (settings: Settings, key: string): string => settings[key] ?? "";

/** Satu baris tidak kosong = satu butir. */
export const parseLines = (text: string): string[] =>
  text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

/** "A | B | C" menjadi [A, B, C] (selalu sepanjang `cols`). */
export const parsePairs = (text: string, cols: number): string[][] =>
  parseLines(text).map((line) => {
    const parts = line.split("|").map((p) => p.trim());
    while (parts.length < cols) parts.push("");
    return parts.slice(0, cols - 1).concat(parts.slice(cols - 1).join(" | "));
  });

export const parseParagraphs = (text: string): string[] =>
  text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
