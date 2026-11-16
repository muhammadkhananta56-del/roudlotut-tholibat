import "server-only";
import { db, isUuid } from "@/lib/db";

export const PER_PAGE = 9;
export const ADMIN_PER_PAGE = 10;

export const toPage = (v: string | string[] | undefined): number => {
  const n = parseInt(Array.isArray(v) ? v[0] : (v ?? "1"), 10);
  return Number.isFinite(n) && n > 0 && n < 10_000 ? n : 1;
};
export const one = (v: string | string[] | undefined): string => (Array.isArray(v) ? v[0] : v) ?? "";

export type Category = { id: string; name: string; slug: string };

export type NewsRow = {
  id: string; title: string; slug: string; excerpt: string; body: string;
  category_id: string | null; category_name: string | null; category_slug: string | null;
  cover_path: string | null; cover_alt: string; status: "draft" | "published";
  published_at: Date | null; created_at: Date; updated_at: Date;
};
const newsCols = (sql: ReturnType<typeof db>) => sql`
  n.id, n.title, n.slug, n.excerpt, n.body, n.category_id, c.name as category_name, c.slug as category_slug,
  n.cover_path, n.cover_alt, n.status, n.published_at, n.created_at, n.updated_at`;

export type ScheduleRow = {
  id: string; title: string; speaker: string; location: string; description: string;
  starts_at: Date; ends_at: Date | null; status: "scheduled" | "done" | "cancelled"; is_published: boolean;
};

export type GalleryRow = {
  id: string; title: string; description: string; category_id: string | null; category_name: string | null;
  path: string; thumb_path: string; width: number; height: number; sort_order: number; show_on_home: boolean;
};

// ---------- Kategori ----------
export async function listCategories(kind: "news" | "gallery"): Promise<Category[]> {
  const sql = db();
  return kind === "news"
    ? sql<Category[]>`select id, name, slug from news_categories order by name`
    : sql<Category[]>`select id, name, slug from gallery_categories order by name`;
}

// ---------- Berita (publik) ----------
const isLive = (sql: ReturnType<typeof db>) => sql`n.status = 'published' and n.published_at <= now()`;

export async function listPublicNews(opts: { page: number; categorySlug?: string; q?: string }) {
  const sql = db();
  const cat = opts.categorySlug ? sql`and c.slug = ${opts.categorySlug}` : sql``;
  const q = opts.q ? sql`and (n.title ilike ${"%" + opts.q.replace(/[%_\\]/g, "\\$&") + "%"} or n.excerpt ilike ${"%" + opts.q.replace(/[%_\\]/g, "\\$&") + "%"})` : sql``;
  const [{ total }] = await sql<{ total: number }[]>`
    select count(*)::int as total from news n left join news_categories c on c.id = n.category_id
    where ${isLive(sql)} ${cat} ${q}`;
  const rows = await sql<NewsRow[]>`
    select ${newsCols(sql)} from news n left join news_categories c on c.id = n.category_id
    where ${isLive(sql)} ${cat} ${q}
    order by n.published_at desc limit ${PER_PAGE} offset ${(opts.page - 1) * PER_PAGE}`;
  return { rows, total, pages: Math.max(1, Math.ceil(total / PER_PAGE)) };
}

export async function latestNews(limit: number) {
  const sql = db();
  return sql<NewsRow[]>`
    select ${newsCols(sql)} from news n left join news_categories c on c.id = n.category_id
    where ${isLive(sql)} order by n.published_at desc limit ${limit}`;
}

export async function getNewsBySlug(slug: string) {
  const sql = db();
  const rows = await sql<NewsRow[]>`
    select ${newsCols(sql)} from news n left join news_categories c on c.id = n.category_id
    where n.slug = ${slug} and ${isLive(sql)}`;
  return rows[0] ?? null;
}

export async function relatedNews(id: string, limit = 3) {
  const sql = db();
  return sql<NewsRow[]>`
    select ${newsCols(sql)} from news n left join news_categories c on c.id = n.category_id
    where ${isLive(sql)} and n.id <> ${id} order by n.published_at desc limit ${limit}`;
}

export async function allPublishedNewsSlugs() {
  const sql = db();
  return sql<{ slug: string; updated_at: Date }[]>`
    select n.slug, n.updated_at from news n where ${isLive(sql)} order by n.published_at desc`;
}

// ---------- Jadwal (publik) ----------
const endExpr = (sql: ReturnType<typeof db>) => sql`coalesce(ends_at, starts_at + interval '3 hours')`;

export async function upcomingSchedules(limit?: number) {
  const sql = db();
  return sql<ScheduleRow[]>`
    select id, title, speaker, location, description, starts_at, ends_at, status, is_published
    from schedules
    where is_published and status in ('scheduled', 'cancelled') and ${endExpr(sql)} >= now()
    order by starts_at asc ${limit ? sql`limit ${limit}` : sql``}`;
}

export async function pastSchedules(limit = 20) {
  const sql = db();
  return sql<ScheduleRow[]>`
    select id, title, speaker, location, description, starts_at, ends_at, status, is_published
    from schedules
    where is_published and (status = 'done' or ${endExpr(sql)} < now())
    order by starts_at desc limit ${limit}`;
}

// ---------- Galeri (publik) ----------
export async function listPublicGallery(categorySlug?: string) {
  const sql = db();
  return sql<GalleryRow[]>`
    select g.id, g.title, g.description, g.category_id, c.name as category_name, g.path, g.thumb_path,
           g.width, g.height, g.sort_order, g.show_on_home
    from gallery g left join gallery_categories c on c.id = g.category_id
    ${categorySlug ? sql`where c.slug = ${categorySlug}` : sql``}
    order by g.sort_order asc, g.created_at desc`;
}

export async function homeGallery(limit = 6) {
  const sql = db();
  return sql<GalleryRow[]>`
    select g.id, g.title, g.description, g.category_id, c.name as category_name, g.path, g.thumb_path,
           g.width, g.height, g.sort_order, g.show_on_home
    from gallery g left join gallery_categories c on c.id = g.category_id
    where g.show_on_home order by g.sort_order asc, g.created_at desc limit ${limit}`;
}

// ---------- Admin ----------
export async function adminListNews(opts: { page: number; q: string; status: string }) {
  const sql = db();
  const q = opts.q ? sql`and n.title ilike ${"%" + opts.q.replace(/[%_\\]/g, "\\$&") + "%"}` : sql``;
  const st = opts.status === "draft" || opts.status === "published" ? sql`and n.status = ${opts.status}` : sql``;
  const [{ total }] = await sql<{ total: number }[]>`select count(*)::int as total from news n where true ${q} ${st}`;
  const rows = await sql<NewsRow[]>`
    select ${newsCols(sql)} from news n left join news_categories c on c.id = n.category_id
    where true ${q} ${st} order by n.updated_at desc limit ${ADMIN_PER_PAGE} offset ${(opts.page - 1) * ADMIN_PER_PAGE}`;
  return { rows, total, pages: Math.max(1, Math.ceil(total / ADMIN_PER_PAGE)) };
}

export async function adminGetNews(id: string) {
  if (!isUuid(id)) return null;
  const sql = db();
  const rows = await sql<NewsRow[]>`
    select ${newsCols(sql)} from news n left join news_categories c on c.id = n.category_id where n.id = ${id}`;
  return rows[0] ?? null;
}

export async function adminListSchedules(opts: { page: number; q: string; status: string }) {
  const sql = db();
  const q = opts.q ? sql`and title ilike ${"%" + opts.q.replace(/[%_\\]/g, "\\$&") + "%"}` : sql``;
  const st = ["scheduled", "done", "cancelled"].includes(opts.status) ? sql`and status = ${opts.status}` : sql``;
  const [{ total }] = await sql<{ total: number }[]>`select count(*)::int as total from schedules where true ${q} ${st}`;
  const rows = await sql<ScheduleRow[]>`
    select id, title, speaker, location, description, starts_at, ends_at, status, is_published
    from schedules where true ${q} ${st} order by starts_at desc limit ${ADMIN_PER_PAGE} offset ${(opts.page - 1) * ADMIN_PER_PAGE}`;
  return { rows, total, pages: Math.max(1, Math.ceil(total / ADMIN_PER_PAGE)) };
}

export async function adminGetSchedule(id: string) {
  if (!isUuid(id)) return null;
  const rows = await db()<ScheduleRow[]>`
    select id, title, speaker, location, description, starts_at, ends_at, status, is_published from schedules where id = ${id}`;
  return rows[0] ?? null;
}

export async function adminGetGallery(id: string) {
  if (!isUuid(id)) return null;
  const rows = await db()<GalleryRow[]>`
    select g.id, g.title, g.description, g.category_id, c.name as category_name, g.path, g.thumb_path,
           g.width, g.height, g.sort_order, g.show_on_home
    from gallery g left join gallery_categories c on c.id = g.category_id where g.id = ${id}`;
  return rows[0] ?? null;
}

export async function dashboardData() {
  const sql = db();
  const [counts] = await sql<{ news_total: number; news_published: number; news_draft: number; sched_total: number; sched_upcoming: number; gallery_total: number }[]>`
    select
      (select count(*) from news)::int as news_total,
      (select count(*) from news where status = 'published')::int as news_published,
      (select count(*) from news where status = 'draft')::int as news_draft,
      (select count(*) from schedules)::int as sched_total,
      (select count(*) from schedules where status = 'scheduled' and coalesce(ends_at, starts_at + interval '3 hours') >= now())::int as sched_upcoming,
      (select count(*) from gallery)::int as gallery_total`;
  const latest = await sql<{ id: string; title: string; status: string; updated_at: Date }[]>`
    select id, title, status, updated_at from news order by updated_at desc limit 5`;
  const next = await sql<{ id: string; title: string; starts_at: Date; status: string }[]>`
    select id, title, starts_at, status from schedules
    where status = 'scheduled' and coalesce(ends_at, starts_at + interval '3 hours') >= now() order by starts_at asc limit 5`;
  const activity = await sql<{ id: string; admin_name: string; action: string; entity: string; entity_title: string; created_at: Date }[]>`
    select id, admin_name, action, entity, entity_title, created_at from activity_log order by created_at desc limit 8`;
  return { counts, latest, next, activity };
}
