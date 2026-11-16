import { readFile } from "node:fs/promises";
import { safeLocalPath } from "@/lib/storage";

// Hanya untuk pengembangan lokal tanpa Supabase. Dinonaktifkan di produksi.
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  if (process.env.NODE_ENV === "production" || process.env.SUPABASE_URL) return new Response("Not found", { status: 404 });
  const { path } = await ctx.params;
  const full = safeLocalPath(path.join("/"));
  if (!full || !full.endsWith(".webp")) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(full);
    return new Response(new Uint8Array(data), { headers: { "Content-Type": "image/webp", "Cache-Control": "no-store" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
