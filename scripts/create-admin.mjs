// Membuat atau memperbarui akun admin. Password tidak pernah disimpan polos: hanya hash bcrypt.
// Cara pakai interaktif:   npm run admin:create
// Cara pakai non-interaktif (CI): ADMIN_EMAIL=... ADMIN_NAME=... ADMIN_PASSWORD=... npm run admin:create
import postgres from "postgres";
import bcrypt from "bcryptjs";
import readline from "node:readline";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL belum diisi. Isi di .env.local lalu jalankan ulang.");
  process.exit(1);
}

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else if (s === "\r\n" || s === "\n") rl.output.write(s);
      };
    }
    rl.question(question, (a) => {
      rl.close();
      resolve(a.trim());
    });
  });
}

const email = (process.env.ADMIN_EMAIL || (await ask("Email admin: "))).toLowerCase();
const name = process.env.ADMIN_NAME || (await ask("Nama tampilan: "));
const password = process.env.ADMIN_PASSWORD || (await ask("Password (minimal 10 karakter): ", { hidden: true }));

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("Format email tidak valid.");
if (!name) throw new Error("Nama wajib diisi.");
if (password.length < 10) throw new Error("Password minimal 10 karakter.");
if (/^(1234567890|password12|admin12345)/i.test(password)) throw new Error("Password terlalu mudah ditebak.");

const local = /@(localhost|127\.0\.0\.1)/.test(url) || url.includes("sslmode=disable");
const sql = postgres(url, { max: 1, prepare: false, ssl: local ? false : "require", onnotice: () => {} });
try {
  const hash = await bcrypt.hash(password, 12);
  await sql`
    insert into admins (email, name, password_hash) values (${email}, ${name}, ${hash})
    on conflict (email) do update set name = excluded.name, password_hash = excluded.password_hash`;
  console.log(`\nAkun admin siap: ${email}. Masuk di /panel-akses`);
} catch (e) {
  console.error("Gagal membuat admin:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
