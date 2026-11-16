import "server-only";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { putObject } from "@/lib/storage";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["jpeg", "png", "webp"]);

export class ImageError extends Error {}

export type ProcessedImage = { path: string; thumbPath: string; width: number; height: number };

/**
 * Validasi berdasarkan ISI berkas (bukan ekstensi atau tipe kiriman browser), lalu
 * putar sesuai EXIF, kecilkan, ubah ke WebP, dan buang metadata (termasuk lokasi GPS).
 */
export async function storeImage(file: File, folder: "news" | "gallery" | "site", withThumb: boolean): Promise<ProcessedImage> {
  if (!file || typeof file === "string" || file.size === 0) throw new ImageError("Pilih berkas gambar terlebih dahulu.");
  if (file.size > MAX_UPLOAD_BYTES) throw new ImageError("Ukuran foto maksimal 4 MB.");
  const input = Buffer.from(await file.arrayBuffer());

  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    meta = await sharp(input, { limitInputPixels: 60_000_000 }).metadata();
  } catch {
    throw new ImageError("Berkas bukan gambar yang valid.");
  }
  if (!meta.format || !ALLOWED.has(meta.format)) throw new ImageError("Format harus JPG, PNG, atau WebP.");

  const id = randomUUID();
  const now = new Date();
  const base = `${folder}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${id}`;
  try {
    const main = await sharp(input, { limitInputPixels: 60_000_000 })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    await putObject(`${base}.webp`, main.data, "image/webp");

    let thumbPath = `${base}.webp`;
    if (withThumb) {
      const thumb = await sharp(input, { limitInputPixels: 60_000_000 })
        .rotate()
        .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 76 })
        .toBuffer();
      thumbPath = `${base}-thumb.webp`;
      await putObject(thumbPath, thumb, "image/webp");
    }
    return { path: `${base}.webp`, thumbPath, width: main.info.width, height: main.info.height };
  } catch (e) {
    if (e instanceof ImageError) throw e;
    console.error("storeImage gagal", e);
    throw new ImageError(e instanceof Error && e.message.startsWith("Penyimpanan") ? e.message : "Foto gagal diproses.");
  }
}
