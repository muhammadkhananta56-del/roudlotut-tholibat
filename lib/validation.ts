import { z } from "zod";
import { fromLocalInput } from "@/lib/format";

const UUID = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Pilihan tidak valid");
const optionalUuid = z.union([z.literal(""), UUID]).transform((v) => (v === "" ? null : v));
const storagePath = (prefix: string) =>
  z.union([z.literal(""), z.string().regex(new RegExp(`^${prefix}/[a-z0-9][a-z0-9/_-]*\\.webp$`), "Berkas gambar tidak valid")])
    .transform((v) => (v === "" ? null : v));

export const newsSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter").max(160, "Judul maksimal 160 karakter"),
  excerpt: z.string().trim().max(300, "Ringkasan maksimal 300 karakter"),
  body: z.string().trim().min(20, "Isi berita minimal 20 karakter").max(50_000, "Isi terlalu panjang"),
  categoryId: optionalUuid,
  status: z.enum(["draft", "published"], "Status tidak valid"),
  publishedAt: z.string().trim(),
  coverPath: storagePath("news"),
  coverAlt: z.string().trim().max(200, "Teks alternatif maksimal 200 karakter"),
});

export const scheduleSchema = z
  .object({
    title: z.string().trim().min(3, "Nama kegiatan minimal 3 karakter").max(160, "Maksimal 160 karakter"),
    speaker: z.string().trim().max(120, "Maksimal 120 karakter"),
    location: z.string().trim().max(160, "Maksimal 160 karakter"),
    description: z.string().trim().max(2000, "Maksimal 2000 karakter"),
    startsAt: z.string().trim().refine((v) => fromLocalInput(v) !== null, "Tanggal dan waktu mulai wajib diisi"),
    endsAt: z.string().trim().refine((v) => v === "" || fromLocalInput(v) !== null, "Waktu selesai tidak valid"),
    status: z.enum(["scheduled", "done", "cancelled"], "Status tidak valid"),
    isPublished: z.boolean(),
  })
  .refine((v) => v.endsAt === "" || fromLocalInput(v.endsAt)!.getTime() >= fromLocalInput(v.startsAt)!.getTime(), {
    path: ["endsAt"],
    message: "Waktu selesai tidak boleh sebelum waktu mulai",
  });

export const galleryEditSchema = z.object({
  title: z.string().trim().max(140, "Maksimal 140 karakter"),
  description: z.string().trim().max(500, "Maksimal 500 karakter"),
  categoryId: optionalUuid,
  showOnHome: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid").max(200),
  password: z.string().min(1, "Password wajib diisi").max(200),
});

export { storagePath };
