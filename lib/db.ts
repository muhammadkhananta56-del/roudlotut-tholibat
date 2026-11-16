import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __rtSql?: Sql };

/** Koneksi PostgreSQL tunggal per proses. Hanya boleh dipakai di server. */
export function db(): Sql {
  if (g.__rtSql) return g.__rtSql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diisi. Lihat README bagian Konfigurasi.");
  const local = /@(localhost|127\.0\.0\.1)/.test(url) || url.includes("sslmode=disable");
  g.__rtSql = postgres(url, {
    // Satu koneksi per instance serverless; pooler Supabase (port 6543) yang membagi koneksi.
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    prepare: false, // wajib untuk transaction pooler Supabase
    ssl: local ? false : "require",
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: () => {},
  });
  return g.__rtSql;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);
