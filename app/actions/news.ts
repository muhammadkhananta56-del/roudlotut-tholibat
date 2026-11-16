"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { db, isUuid } from "@/lib/db";
import { newsSchema } from "@/lib/validation";
import { str, zodErrors, type FormState } from "@/lib/form-state";
import { fromLocalInput } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { removeObjects } from "@/lib/storage";
import { adminGetNews } from "@/lib/queries";
import { isUniqueViolation, logActivity, refreshSite, uniqueSlug } from "@/lib/actions-util";

export async function saveNewsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const parsed = newsSchema.safeParse({
    title: str(fd, "title"),
    excerpt: str(fd, "excerpt"),
    body: str(fd, "body"),
    categoryId: str(fd, "categoryId"),
    status: str(fd, "status"),
    publishedAt: str(fd, "publishedAt"),
    coverPath: str(fd, "coverPath"),
    coverAlt: str(fd, "coverAlt"),
  });
  if (!parsed.success) return { errors: zodErrors(parsed.error) };
  const v = parsed.data;

  let publishedAt: Date | null = null;
  if (v.publishedAt) {
    publishedAt = fromLocalInput(v.publishedAt);
    if (!publishedAt) return { errors: { publishedAt: "Tanggal publikasi tidak valid" } };
  } else if (v.status === "published") {
    publishedAt = new Date();
  }
  if (v.coverPath && !v.coverAlt) {
    return { errors: { coverAlt: "Isi deskripsi gambar sampul (untuk aksesibilitas dan SEO)" } };
  }

  const sql = db();
  let targetId = id;
  try {
    if (id) {
      if (!isUuid(id)) return { message: "Berita tidak ditemukan." };
      const old = await adminGetNews(id);
      if (!old) return { message: "Berita tidak ditemukan. Mungkin sudah dihapus." };
      await sql`
        update news set title = ${v.title}, excerpt = ${v.excerpt}, body = ${v.body}, category_id = ${v.categoryId},
          status = ${v.status}, published_at = ${publishedAt}, cover_path = ${v.coverPath}, cover_alt = ${v.coverAlt},
          updated_at = now() where id = ${id}`;
      if (old.cover_path && old.cover_path !== v.coverPath) await removeObjects([old.cover_path]);
    } else {
      const slug = await uniqueSlug("news", slugify(v.title));
      const [row] = await sql<{ id: string }[]>`
        insert into news (title, slug, excerpt, body, category_id, status, published_at, cover_path, cover_alt, author_id)
        values (${v.title}, ${slug}, ${v.excerpt}, ${v.body}, ${v.categoryId}, ${v.status}, ${publishedAt}, ${v.coverPath}, ${v.coverAlt}, ${admin.id})
        returning id`;
      targetId = row.id;
    }
  } catch (e) {
    if (isUniqueViolation(e)) return { message: "Alamat berita bentrok. Coba ubah judul sedikit." };
    console.error("saveNewsAction gagal", e);
    return { message: "Gagal menyimpan berita. Coba lagi." };
  }

  await logActivity(admin, id ? "mengubah" : "membuat", "berita", v.title);
  refreshSite();
  redirect(`/admin/berita/${targetId}?ok=saved`);
}

export async function deleteNewsAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const old = isUuid(id) ? await adminGetNews(id) : null;
  if (old) {
    await db()`delete from news where id = ${id}`;
    await removeObjects([old.cover_path]);
    await logActivity(admin, "menghapus", "berita", old.title);
    refreshSite();
  }
  redirect("/admin/berita?ok=deleted");
}

export async function toggleNewsStatusAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const old = isUuid(id) ? await adminGetNews(id) : null;
  if (old) {
    const next = old.status === "published" ? "draft" : "published";
    await db()`update news set status = ${next},
      published_at = case when ${next} = 'published' then coalesce(published_at, now()) else published_at end,
      updated_at = now() where id = ${id}`;
    await logActivity(admin, next === "published" ? "menerbitkan" : "menarik ke draft", "berita", old.title);
    refreshSite();
  }
  redirect("/admin/berita?ok=updated");
}
