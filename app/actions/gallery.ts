"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { db, isUuid } from "@/lib/db";
import { galleryEditSchema } from "@/lib/validation";
import { str, zodErrors, type FormState } from "@/lib/form-state";
import { ImageError, storeImage } from "@/lib/images";
import { removeObjects } from "@/lib/storage";
import { adminGetGallery } from "@/lib/queries";
import { logActivity, refreshSite } from "@/lib/actions-util";

export type PhotoUploadResult = { ok: boolean; message?: string };

/** Satu foto per permintaan (klien mengunggah berurutan) agar tidak melewati batas body 4,5 MB Vercel. */
export async function uploadGalleryPhotoAction(fd: FormData): Promise<PhotoUploadResult> {
  const admin = await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File)) return { ok: false, message: "Berkas tidak ditemukan." };
  const categoryRaw = str(fd, "categoryId");
  const categoryId = isUuid(categoryRaw) ? categoryRaw : null;
  const title = str(fd, "title").slice(0, 140);
  try {
    const img = await storeImage(file, "gallery", true);
    const sql = db();
    const [{ next }] = await sql<{ next: number }[]>`select coalesce(max(sort_order), 0)::int + 1 as next from gallery`;
    try {
      await sql`insert into gallery (title, category_id, path, thumb_path, width, height, sort_order)
                values (${title}, ${categoryId}, ${img.path}, ${img.thumbPath}, ${img.width}, ${img.height}, ${next})`;
    } catch (e) {
      await removeObjects([img.path, img.thumbPath]);
      throw e;
    }
    await logActivity(admin, "mengunggah", "foto galeri", title || "(tanpa judul)");
    refreshSite();
    return { ok: true };
  } catch (e) {
    if (e instanceof ImageError) return { ok: false, message: e.message };
    console.error("uploadGalleryPhotoAction gagal", e);
    return { ok: false, message: "Unggahan gagal. Coba lagi." };
  }
}

export async function updateGalleryAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const parsed = galleryEditSchema.safeParse({
    title: str(fd, "title"),
    description: str(fd, "description"),
    categoryId: str(fd, "categoryId"),
    showOnHome: fd.get("showOnHome") === "on",
  });
  if (!parsed.success) return { errors: zodErrors(parsed.error) };
  const v = parsed.data;
  if (!isUuid(id) || !(await adminGetGallery(id))) return { message: "Foto tidak ditemukan." };
  await db()`update gallery set title = ${v.title}, description = ${v.description}, category_id = ${v.categoryId},
             show_on_home = ${v.showOnHome} where id = ${id}`;
  await logActivity(admin, "mengubah", "foto galeri", v.title || "(tanpa judul)");
  refreshSite();
  redirect("/admin/galeri?ok=saved");
}

export async function deleteGalleryAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const old = isUuid(id) ? await adminGetGallery(id) : null;
  if (old) {
    await db()`delete from gallery where id = ${id}`;
    await removeObjects([old.path, old.thumb_path]);
    await logActivity(admin, "menghapus", "foto galeri", old.title || "(tanpa judul)");
    refreshSite();
  }
  redirect("/admin/galeri?ok=deleted");
}

export async function moveGalleryAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const dir = str(fd, "dir");
  if (isUuid(id) && (dir === "up" || dir === "down")) {
    const sql = db();
    await sql.begin(async (tx) => {
      const rows = await tx<{ id: string }[]>`select id from gallery order by sort_order asc, created_at desc for update`;
      const i = rows.findIndex((r) => r.id === id);
      const j = dir === "up" ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= rows.length) return;
      [rows[i], rows[j]] = [rows[j], rows[i]];
      for (let k = 0; k < rows.length; k++) await tx`update gallery set sort_order = ${k + 1} where id = ${rows[k].id}`;
    });
    refreshSite();
  }
  redirect("/admin/galeri");
}
