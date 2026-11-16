"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { db, isUuid } from "@/lib/db";
import { categorySchema } from "@/lib/validation";
import { str } from "@/lib/form-state";
import { slugify } from "@/lib/slug";
import { logActivity, refreshSite, uniqueSlug } from "@/lib/actions-util";

const table = (kind: string) => (kind === "news" ? "news_categories" : kind === "gallery" ? "gallery_categories" : null);

export async function addCategoryAction(fd: FormData) {
  const admin = await requireAdmin();
  const t = table(str(fd, "kind"));
  const parsed = categorySchema.safeParse({ name: str(fd, "name") });
  if (!t || !parsed.success) redirect("/admin/kategori?err=invalid");
  const sql = db();
  const dup = await sql`select 1 from ${sql(t)} where lower(name) = lower(${parsed.data.name})`;
  if (dup.length) redirect("/admin/kategori?err=duplicate");
  const slug = await uniqueSlug(t, slugify(parsed.data.name));
  await sql`insert into ${sql(t)} (name, slug) values (${parsed.data.name}, ${slug})`;
  await logActivity(admin, "menambah", "kategori", parsed.data.name);
  refreshSite();
  redirect("/admin/kategori?ok=saved");
}

export async function renameCategoryAction(fd: FormData) {
  const admin = await requireAdmin();
  const t = table(str(fd, "kind"));
  const id = str(fd, "id");
  const parsed = categorySchema.safeParse({ name: str(fd, "name") });
  if (!t || !isUuid(id) || !parsed.success) redirect("/admin/kategori?err=invalid");
  const sql = db();
  const dup = await sql`select 1 from ${sql(t)} where lower(name) = lower(${parsed.data.name}) and id <> ${id}`;
  if (dup.length) redirect("/admin/kategori?err=duplicate");
  await sql`update ${sql(t)} set name = ${parsed.data.name} where id = ${id}`;
  await logActivity(admin, "mengubah", "kategori", parsed.data.name);
  refreshSite();
  redirect("/admin/kategori?ok=saved");
}

export async function deleteCategoryAction(fd: FormData) {
  const admin = await requireAdmin();
  const t = table(str(fd, "kind"));
  const id = str(fd, "id");
  if (!t || !isUuid(id)) redirect("/admin/kategori?err=invalid");
  const sql = db();
  const rows = await sql<{ name: string }[]>`select name from ${sql(t)} where id = ${id}`;
  if (rows[0]) {
    await sql`delete from ${sql(t)} where id = ${id}`; // isi kategori otomatis menjadi "tanpa kategori"
    await logActivity(admin, "menghapus", "kategori", rows[0].name);
    refreshSite();
  }
  redirect("/admin/kategori?ok=deleted");
}
