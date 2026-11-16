"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { ImageError, storeImage } from "@/lib/images";
import { publicUrl } from "@/lib/storage";

export type UploadResult = { ok: boolean; message?: string; path?: string; url?: string };

/** Unggah satu gambar (sampul berita, foto situs). Mengembalikan path untuk disimpan lewat form. */
export async function uploadImageAction(fd: FormData): Promise<UploadResult> {
  await requireAdmin();
  const folder = String(fd.get("folder") ?? "");
  if (folder !== "news" && folder !== "site") return { ok: false, message: "Folder tidak valid." };
  const file = fd.get("file");
  if (!(file instanceof File)) return { ok: false, message: "Pilih berkas gambar terlebih dahulu." };
  try {
    const r = await storeImage(file, folder, false);
    return { ok: true, path: r.path, url: publicUrl(r.path) ?? undefined };
  } catch (e) {
    return { ok: false, message: e instanceof ImageError || e instanceof Error ? e.message : "Unggahan gagal." };
  }
}
