import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { Admin } from "@/lib/auth/dal";

export async function logActivity(admin: Admin, action: string, entity: string, title: string) {
  try {
    await db()`insert into activity_log (admin_id, admin_name, action, entity, entity_title)
               values (${admin.id}, ${admin.name}, ${action}, ${entity}, ${title.slice(0, 160)})`;
  } catch (e) {
    console.error("logActivity gagal", e);
  }
}

export async function uniqueSlug(table: "news" | "news_categories" | "gallery_categories", base: string): Promise<string> {
  const sql = db();
  for (let i = 1; i < 200; i++) {
    const candidate = i === 1 ? base : `${base}-${i}`;
    const hit = await sql`select 1 from ${sql(table)} where slug = ${candidate} limit 1`;
    if (hit.length === 0) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export const refreshSite = () => revalidatePath("/", "layout");

export const isUniqueViolation = (e: unknown) =>
  typeof e === "object" && e !== null && (e as { code?: string }).code === "23505";
