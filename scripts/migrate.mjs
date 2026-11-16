// Menjalankan semua file di db/migrations yang belum pernah dijalankan.
import postgres from "postgres";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL belum diisi. Isi di .env.local lalu jalankan ulang.");
  process.exit(1);
}
const local = /@(localhost|127\.0\.0\.1)/.test(url) || url.includes("sslmode=disable");
const sql = postgres(url, { max: 1, prepare: false, ssl: local ? false : "require", onnotice: () => {} });
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");

try {
  await sql`create table if not exists schema_migrations (
  name text primary key,
  applied_at timestamptz not null default now()
)`;
  const done = new Set((await sql`select name from schema_migrations`).map((r) => r.name));
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  let ran = 0;
  for (const f of files) {
    if (done.has(f)) continue;
    console.log(`Menjalankan ${f} ...`);
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(join(dir, f), "utf8"));
      await tx`insert into schema_migrations (name) values (${f})`;
    });
    ran++;
  }
  console.log(ran ? `Selesai: ${ran} migrasi dijalankan.` : "Database sudah mutakhir.");
} catch (e) {
  console.error("Migrasi gagal:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}


