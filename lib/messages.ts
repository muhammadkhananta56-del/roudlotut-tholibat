import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { ContactInput, PpdbInput } from "@/lib/schemas";

export function buildPpdbMessage(d: PpdbInput): string {
  const lines = [
    `Assalamu'alaikum, saya ingin mendaftarkan calon santri di ${siteConfig.shortName}.`,
    "",
    `Nama calon santri: ${d.namaSantri}`,
    `Tempat, tanggal lahir: ${d.tempatLahir}, ${formatDate(d.tanggalLahir)}`,
    `Jenis kelamin: ${d.jenisKelamin}`,
    `Alamat: ${d.alamat}`,
    `Nama orang tua/wali: ${d.namaWali}`,
    `WhatsApp wali: ${d.whatsappWali}`,
    `Program pilihan: ${d.program}`,
  ];
  if (d.catatan) lines.push(`Catatan: ${d.catatan}`);
  lines.push("", "Mohon informasi langkah selanjutnya. Terima kasih.");
  return lines.join("\n");
}

export function buildContactMessage(d: ContactInput): string {
  const lines = [`Assalamu'alaikum, saya ${d.nama}.`, "", d.pesan];
  if (d.kontak) lines.push("", `Kontak untuk membalas: ${d.kontak}`);
  return lines.join("\n");
}
