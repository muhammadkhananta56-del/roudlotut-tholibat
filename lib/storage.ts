import "server-only";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

/**
 * Penyimpanan foto.
 *  - Produksi: Supabase Storage (REST, memakai SERVICE_ROLE_KEY di server saja).
 *  - Pengembangan lokal tanpa Supabase: folder .local-uploads (ditolak di produksi).
 */
const bucket = () => process.env.SUPABASE_STORAGE_BUCKET || "media";
const supabaseBase = () => process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";

export function storageDriver(): "supabase" | "local" {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.NODE_ENV === "production") {
    throw new Error("SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di produksi.");
  }
  return "local";
}

export const LOCAL_DIR = resolve(process.cwd(), ".local-uploads");

/** URL publik sebuah objek. Tidak memerlukan rahasia. */
export function publicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (process.env.SUPABASE_URL) return `${supabaseBase()}/storage/v1/object/public/${bucket()}/${path}`;
  return `/dev-uploads/${path}`;
}

export function safeLocalPath(path: string): string | null {
  const full = resolve(LOCAL_DIR, path);
  return full.startsWith(LOCAL_DIR + sep) ? full : null;
}

export async function putObject(path: string, data: Buffer, contentType: string): Promise<void> {
  if (storageDriver() === "local") {
    const full = safeLocalPath(path);
    if (!full) throw new Error("Path tidak valid");
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, data);
    return;
  }
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${supabaseBase()}/storage/v1/object/${bucket()}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-upsert": "false",
    },
    body: new Uint8Array(data),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Supabase Storage upload gagal", res.status, detail);
    throw new Error("Penyimpanan foto gagal. Periksa konfigurasi Supabase Storage.");
  }
}

/** Menghapus objek. Kegagalan hanya dicatat; tidak menggagalkan operasi utama. */
export async function removeObjects(paths: (string | null | undefined)[]): Promise<void> {
  const list = paths.filter((p): p is string => !!p);
  if (!list.length) return;
  try {
    if (storageDriver() === "local") {
      await Promise.all(list.map(async (p) => { const f = safeLocalPath(p); if (f) await rm(f, { force: true }); }));
      return;
    }
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${supabaseBase()}/storage/v1/object/${bucket()}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: list }),
    });
    if (!res.ok) console.error("Supabase Storage hapus gagal", res.status, await res.text().catch(() => ""));
  } catch (e) {
    console.error("removeObjects gagal", e);
  }
}
