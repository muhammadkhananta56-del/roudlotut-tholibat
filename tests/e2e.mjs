// Uji end-to-end terhadap server produksi lokal (lihat tests/README.md).
// Meniru browser: cookie, submit form tanpa JavaScript, dan pemanggilan Server Action untuk unggah foto.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import postgres from "postgres";

// PENGAMAN: suite ini MENGOSONGKAN tabel berita, jadwal, galeri, dan pengaturan. Jangan pernah diarahkan ke database produksi.
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("DITOLAK: DATABASE_URL harus mengarah ke localhost (database uji). Suite ini menghapus data.");
  process.exit(2);
}
const BASE = process.env.BASE || "http://localhost:3000";
const MOCK = "http://127.0.0.1:54321";
const KEY = "test-service-role-key-SECRET-XYZ";
const EMAIL = "admin@contoh.id", PASS = "Sandi-Uji-Kuat-2026";
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
const manifest = JSON.parse(fs.readFileSync(".next/server/server-reference-manifest.json", "utf8")).node;
const actionId = (name) => Object.entries(manifest).find(([, v]) => v.exportedName === name)?.[0];

const results = [];
let cookie = "";
function t(area, name, ok, note = "") {
  results.push({ area, name, ok: !!ok, note });
  console.log(`${ok ? "PASS" : "FAIL"}  [${area}] ${name}${note ? "  - " + note : ""}`);
}
async function guard(area, name, fn) { try { await fn(); } catch (e) { t(area, name, false, "EXCEPTION " + e.message); } }

const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], unesc(m[2])]));

async function get(p, { c = cookie, headers = {} } = {}) {
  const r = await fetch(BASE + p, { headers: { cookie: c, ...headers }, redirect: "manual" });
  return { status: r.status, loc: r.headers.get("location") || "", headers: r.headers, text: (await r.text()).replace(/<!-- -->/g, "") };
}
function forms(html) {
  return [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)].map((m) => {
    const inner = m[2], fields = [];
    for (const i of inner.matchAll(/<input\b([^>]*?)\/?>/g)) {
      const a = attrs(i[1]);
      if (!a.name) continue;
      if (a.type === "checkbox" && !("checked" in a) && !/\bchecked\b/.test(i[1])) continue;
      fields.push([a.name, a.type === "checkbox" ? (a.value ?? "on") : (a.value ?? ""), a.type]);
    }
    for (const x of inner.matchAll(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/g)) { const a = attrs(x[1]); if (a.name) fields.push([a.name, unesc(x[2]), "textarea"]); }
    for (const x of inner.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)) {
      const a = attrs(x[1]); if (!a.name) continue;
      const sel = x[2].match(/<option[^>]*selected[^>]*value="([^"]*)"/) || x[2].match(/<option[^>]*value="([^"]*)"[^>]*selected/) || x[2].match(/<option[^>]*value="([^"]*)"/);
      fields.push([a.name, sel ? unesc(sel[1]) : "", "select"]);
    }
    return { inner, fields };
  });
}
async function submit(p, pick, overrides = {}, { c = cookie, page } = {}) {
  const html = page ?? (await get(p, { c })).text;
  const f = forms(html).find(pick);
  if (!f) throw new Error("form tidak ditemukan di " + p);
  const fd = new FormData();
  const used = new Set();
  for (const [name, value] of f.fields) {
    if (name in overrides) { if (!used.has(name)) { used.add(name); if (overrides[name] !== null) fd.append(name, overrides[name]); } }
    else fd.append(name, value);
  }
  for (const [k, v] of Object.entries(overrides)) if (!used.has(k) && v !== null) fd.append(k, v);
  const r = await fetch(BASE + p, { method: "POST", body: fd, headers: { cookie: c, origin: BASE }, redirect: "manual" });
  return { status: r.status, loc: r.headers.get("location") || "", text: await r.text(), headers: r.headers };
}
async function callAction(name, fields, { c = cookie, page = "/admin/galeri" } = {}) {
  const fd = new FormData();
  // Urutan penting: bagian terreferensi (_1_*) harus tiba SEBELUM field akar "0", seperti browser sungguhan.
  for (const [k, v] of Object.entries(fields)) fd.set("_1_" + k, v);
  fd.set("0", JSON.stringify(["$K1"]));
  const r = await fetch(BASE + page, { method: "POST", body: fd, headers: { cookie: c, origin: BASE, "next-action": actionId(name), accept: "text/x-component" }, redirect: "manual" });
  const text = await r.text();
  return { status: r.status, text, ok: /"ok":true/.test(text), path: (text.match(/"path":"([^"]+)"/) || [])[1], message: (text.match(/"message":"([^"]+)"/) || [])[1] };
}
const mockState = async () => (await fetch(MOCK + "/__state")).json();
const login = async (email, password, next = "") => {
  const page = (await get("/panel-akses", { c: "" })).text;
  const r = await submit("/panel-akses", (f) => f.fields.some((x) => x[0] === "email"), { email, password, next }, { c: "", page });
  return r;
};
const setCookieOf = (r) => (r.headers.getSetCookie?.() || []).map((s) => s.split(";")[0]).join("; ");
const jpg = (w, h) => sharp({ create: { width: w, height: h, channels: 3, background: { r: 30, g: 110, b: 80 } } }).jpeg({ quality: 80 }).withExif({ IFD0: { Copyright: "RAHASIA-EXIF" } }).toBuffer();
const png = (w, h) => sharp({ create: { width: w, height: h, channels: 4, background: { r: 200, g: 180, b: 100, alpha: 1 } } }).png().toBuffer();
const file = (buf, name, type) => new File([buf], name, { type });
const tomorrow = (h = 8, days = 1) => new Date(Date.now() + days * 86400e3 + 7 * 3600e3).toISOString().slice(0, 11) + String(h).padStart(2, "0") + ":00";

await sql`truncate news, schedules, gallery, settings, activity_log, login_attempts`;
await sql`delete from news_categories where name like 'Khutbah%'`;

// ============ A. HALAMAN PUBLIK (database kosong) ============
await guard("Publik", "halaman", async () => {
  for (const p of ["/", "/profil", "/sejarah", "/berita", "/jadwal", "/galeri", "/pendaftaran", "/kontak", "/robots.txt", "/sitemap.xml"]) {
    const r = await get(p, { c: "" });
    t("Publik", `GET ${p} (DB kosong) 200`, r.status === 200, `status ${r.status}`);
  }
  const r404 = await get("/halaman-tidak-ada", { c: "" });
  t("Publik", "404 untuk halaman tidak ada", r404.status === 404);
  const home = (await get("/", { c: "" })).text;
  t("Publik", "Beranda: satu <h1>, lang=id, viewport", (home.match(/<h1/g) || []).length === 1 && /<html lang="id"/.test(home) && /name="viewport"/.test(home));
  t("Publik", "Beranda DB kosong tidak menampilkan bagian kosong/placeholder [..]", !/\[[A-Z ]{6,}\]/.test(home) && !/lorem/i.test(home));
  t("Publik", "Halaman Berita kosong menampilkan empty state", /Belum ada berita/.test((await get("/berita", { c: "" })).text));
  t("Publik", "Halaman Jadwal kosong menampilkan empty state", /Belum ada jadwal mendatang/.test((await get("/jadwal", { c: "" })).text));
  t("Publik", "Halaman Galeri kosong menampilkan empty state", /Belum ada foto/.test((await get("/galeri", { c: "" })).text));
  t("Publik", "Header keamanan (nosniff, X-Frame-Options)", home && (await get("/", { c: "" })).headers.get("x-content-type-options") === "nosniff" && (await get("/", { c: "" })).headers.get("x-frame-options") === "SAMEORIGIN");
});

// ============ B. AUTENTIKASI ============
await guard("Auth", "akses tanpa login", async () => {
  for (const p of ["/admin", "/admin/berita", "/admin/berita/baru", "/admin/jadwal", "/admin/galeri", "/admin/kategori", "/admin/pengaturan"]) {
    const r = await get(p, { c: "" });
    t("Auth", `${p} tanpa cookie menampilkan 404 (alamat login tidak terbuka)`, r.status === 404 && !r.loc, `${r.status} ${r.loc}`);
  }
  const forged = await get("/admin", { c: "rt_admin=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.palsu" });
  t("Auth", "cookie sesi palsu ditolak", forged.status === 404);
  const none = await callAction("saveSettingsAction", { x: "y" }, { c: "" });
  t("Auth", "Server Action tanpa login tidak berhasil", !none.ok);
});
await guard("Auth", "login", async () => {
  const bad = await login(EMAIL, "salah-salah-salah");
  t("Auth", "password salah ditolak dengan pesan generik", /Email atau password salah/.test(bad.text) && !setCookieOf(bad).includes("rt_admin"));
  const unknown = await login("tidakada@contoh.id", "apa-saja-1234");
  t("Auth", "email tidak terdaftar: pesan sama persis (anti user-enumeration)", /Email atau password salah/.test(unknown.text));
  const ok = await login(EMAIL, PASS, "//evil.example.com");
  const sc = (ok.headers.getSetCookie?.() || []).find((s) => s.startsWith("rt_admin="));
  t("Auth", "login benar -> redirect", [302, 303, 307].includes(ok.status), `${ok.status} ${ok.loc}`);
  t("Auth", "open redirect (next=//evil) dinetralkan", ok.loc === "/admin" || ok.loc.endsWith("/admin"), ok.loc);
  t("Auth", "cookie sesi HttpOnly + SameSite=Lax + Path=/", !!sc && /HttpOnly/i.test(sc) && /SameSite=lax/i.test(sc) && /Path=\//.test(sc), sc ? sc.replace(/=[^;]+/, "=***") : "tidak ada");
  cookie = setCookieOf(ok);
  const dash = await get("/admin");
  t("Auth", "dasbor terbuka setelah login", dash.status === 200 && /Assalamu/.test(dash.text) && /Ustadz Uji/.test(dash.text));
  const ld = await get("/panel-akses");
  t("Auth", "halaman login saat sudah masuk diarahkan ke dasbor", [302, 303, 307].includes(ld.status));
  t("Auth", "halaman admin: Cache-Control no-store + noindex", /no-store/.test(dash.headers.get("cache-control") || "") && /noindex/.test(dash.text));
  t("Auth", "password tersimpan sebagai hash bcrypt", (await sql`select password_hash from admins limit 1`)[0].password_hash.startsWith("$2"));
});

// ============ C. PENGATURAN + UPLOAD GAMBAR ============
let heroPath = "";
await guard("Upload", "foto utama", async () => {
  const exifJpg = await jpg(3000, 2000);
  t("Upload", "sumber uji memuat EXIF", !!(await sharp(exifJpg).metadata()).exif);
  const r = await callAction("uploadImageAction", { folder: "site", file: file(exifJpg, "foto.jpg", "image/jpeg") });
  t("Upload", "unggah JPG 3000x2000 via Server Action", r.ok && /^site\/\d{4}\/\d{2}\/[0-9a-f-]+\.webp$/.test(r.path || ""), r.path || r.text.slice(0, 120));
  heroPath = r.path;
  const stored = await mockState();
  const obj = await fetch(`${MOCK}/storage/v1/object/public/media/${heroPath}`);
  const buf = Buffer.from(await obj.arrayBuffer());
  const meta = await sharp(buf).metadata();
  t("Upload", "hasil: WebP, lebar <= 1800, EXIF/GPS dibuang", meta.format === "webp" && meta.width <= 1800 && !meta.exif, `${meta.format} ${meta.width}x${meta.height} exif=${!!meta.exif}`);
  const post = stored.log.find((l) => l.m === "POST" && l.p === heroPath);
  t("Upload", "driver Supabase mengirim auth + content-type + cache-control benar", !!post && post.type === "image/webp" && /immutable/.test(post.cache || ""));
  t("Upload", "tidak ada request ditolak karena auth", !stored.log.some((l) => l.denied));
  const bad1 = await callAction("uploadImageAction", { folder: "site", file: file(Buffer.from("ini bukan gambar"), "x.jpg", "image/jpeg") });
  t("Upload", "teks berkedok .jpg ditolak (validasi isi berkas)", !bad1.ok && /bukan gambar/i.test(bad1.message || bad1.text), bad1.message);
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  const bad2 = await callAction("uploadImageAction", { folder: "site", file: file(svg, "x.png", "image/png") });
  t("Upload", "SVG (vektor XSS) ditolak", !bad2.ok, bad2.message);
  const bad3 = await callAction("uploadImageAction", { folder: "../../etc", file: file(await png(50, 50), "x.png", "image/png") });
  t("Upload", "folder tujuan di luar daftar putih ditolak", !bad3.ok);
  const big = await callAction("uploadImageAction", { folder: "site", file: file(Buffer.alloc(5 * 1024 * 1024, 7), "besar.jpg", "image/jpeg") });
  t("Upload", "berkas 5 MB ditolak", !big.ok);
});
await guard("Pengaturan", "simpan", async () => {
  const page = (await get("/admin/pengaturan")).text;
  const pick = (f) => f.fields.some((x) => x[0] === "hero_headline");
  const bad = await submit("/admin/pengaturan", pick, { contact_whatsapp: "abc", contact_email: "bukan-email", instagram_url: "javascript:alert(1)", hero_image: "site/../../x.webp" }, { page });
  t("Pengaturan", "validasi server: WA, email, URL javascript:, path gambar tidak valid", /Nomor tidak valid/.test(bad.text) && /Format email tidak valid/.test(bad.text) && /tautan http/.test(bad.text) && /Berkas gambar tidak valid/.test(bad.text));
  const ok = await submit("/admin/pengaturan", pick, {
    hero_headline: "Ilmu, adab, dan cinta Al-Qur'an.", hero_image: heroPath, hero_image_alt: "Santri mengaji di serambi",
    about_summary: "Paragraf pertama profil uji.\n\nParagraf kedua profil uji.", caretaker_name: "KH. Uji Coba", caretaker_greeting: "Sambutan pengasuh untuk pengujian.",
    vision: "Visi uji.", mission: "Misi satu\nMisi dua", values: "Adab | Menjaga sopan santun", facilities: "Masjid | Tempat ibadah",
    history: "1990 | Pendirian | Catatan pendirian uji", programs: "TPQ Metode Darussalam | Belajar membaca Al-Qur'an\nTahfidz Al-Qur'an",
    contact_address: "Jl. Uji No. 1\nSurabaya", contact_whatsapp: "081234567890", contact_email: "info@contoh.id", contact_hours: "Senin-Sabtu 08.00-14.00", contact_maps_url: "https://maps.app.goo.gl/uji",
  }, { page });
  t("Pengaturan", "simpan berhasil -> redirect ?ok=saved", [302, 303, 307].includes(ok.status) && /ok=saved/.test(ok.loc), `${ok.status} ${ok.loc}`);
  const rows = await sql`select count(*)::int n from settings`;
  t("Pengaturan", "tersimpan persisten di database", rows[0].n > 15, `${rows[0].n} baris`);
  const home = (await get("/", { c: "" })).text;
  t("Beranda dinamis", "Beranda menampilkan konten dari CMS (headline, program, pengasuh)", /cinta Al-Qur&#x27;an|cinta Al-Qur'an/.test(home) && /Tahfidz Al-Qur/.test(home) && /KH\. Uji Coba/.test(home));
  t("Beranda dinamis", "foto utama dari Supabase Storage tampil dengan alt", home.includes("/storage/v1/object/public/media/" + heroPath) && /alt="Santri mengaji di serambi"/.test(home));
  t("Beranda dinamis", "JSON-LD terisi dan aman (< di-escape)", /application\/ld\+json/.test(home) && /EducationalOrganization/.test(home));
  for (const [p, needle] of [["/profil", "Visi uji"], ["/sejarah", "Pendirian"], ["/kontak", "Jl. Uji No. 1"]]) t("Beranda dinamis", `${p} menampilkan data dari CMS`, (await get(p, { c: "" })).text.includes(needle));
  const kontak = (await get("/kontak", { c: "" })).text;
  t("Beranda dinamis", "link WhatsApp dinormalisasi ke wa.me/6281234567890", kontak.includes("https://wa.me/6281234567890"));
  const dt = await get("/dev-uploads/site/x.webp", { c: "" });
  t("Keamanan", "/dev-uploads dinonaktifkan saat Supabase aktif", dt.status === 404);
});

// ============ D. KATEGORI ============
await guard("Kategori", "CRUD", async () => {
  const add = await submit("/admin/kategori", (f) => f.inner.includes('id="add-news"'), { name: "Khutbah" });
  t("Kategori", "tambah kategori berita", /ok=saved/.test(add.loc));
  const dup = await submit("/admin/kategori", (f) => f.inner.includes('id="add-news"'), { name: "khutbah" });
  t("Kategori", "nama duplikat (tanpa peduli huruf besar) ditolak", /err=duplicate/.test(dup.loc));
  const inv = await submit("/admin/kategori", (f) => f.inner.includes('id="add-news"'), { name: "x" });
  t("Kategori", "nama terlalu pendek ditolak", /err=invalid/.test(inv.loc));
  const cat = (await sql`select id from news_categories where name='Khutbah'`)[0];
  const ren = await submit("/admin/kategori", (f) => f.inner.includes(`id="n-${cat.id}"`), { name: "Khutbah Jumat" });
  t("Kategori", "ubah nama", (await sql`select name from news_categories where id=${cat.id}`)[0]?.name === "Khutbah Jumat" && /ok=saved/.test(ren.loc));
});

// ============ E. BERITA ============
let newsId = "", newsSlug = "", coverPath = "";
await guard("Berita", "CRUD", async () => {
  const cats = await sql`select id from news_categories where name='Khutbah Jumat'`;
  const cover = await callAction("uploadImageAction", { folder: "news", file: file(await jpg(1600, 900), "sampul.jpg", "image/jpeg") });
  coverPath = cover.path;
  t("Berita", "unggah gambar sampul", cover.ok && /^news\//.test(coverPath || ""));
  const pick = (f) => f.fields.some((x) => x[0] === "title") && f.fields.some((x) => x[0] === "body");
  const page = (await get("/admin/berita/baru")).text;
  const invalid = await submit("/admin/berita/baru", pick, { title: "abc", body: "pendek" }, { page });
  t("Berita", "validasi: judul & isi terlalu pendek", /Judul minimal 5/.test(invalid.text) && /Isi berita minimal 20/.test(invalid.text));
  const noAlt = await submit("/admin/berita/baru", pick, { title: "Judul Tanpa Alt", body: "Isi berita yang cukup panjang untuk lolos validasi.", coverPath }, { page });
  t("Berita", "validasi: sampul tanpa deskripsi ditolak", /Isi deskripsi gambar sampul/.test(noAlt.text));
  const bogus = await submit("/admin/berita/baru", pick, { title: "Judul Path Palsu", body: "Isi berita yang cukup panjang untuk lolos validasi.", coverPath: "gallery/../../rahasia.webp", coverAlt: "x" }, { page });
  t("Berita", "validasi: path sampul di luar news/ ditolak", /Berkas gambar tidak valid/.test(bogus.text));

  const draft = await submit("/admin/berita/baru", pick, {
    title: "Peringatan Maulid Nabi di Pondok", excerpt: "Ringkasan acara maulid.", body: "Paragraf pertama berita.\n\n## Susunan Acara\n\n- Pembukaan\n- Pembacaan sholawat\n\nPenutup berita.",
    categoryId: cats[0].id, status: "draft", coverPath, coverAlt: "Santri membaca sholawat",
  }, { page });
  const m = draft.loc.match(/\/admin\/berita\/([0-9a-f-]{36})\?ok=saved/);
  t("Berita", "simpan draft -> redirect ke halaman edit", !!m, draft.loc);
  newsId = m?.[1];
  const row = (await sql`select slug, status from news where id=${newsId}`)[0];
  newsSlug = row.slug;
  t("Berita", "slug otomatis & status draft di DB", newsSlug === "peringatan-maulid-nabi-di-pondok" && row.status === "draft", newsSlug);
  t("Berita", "draft TIDAK tampil di publik (daftar, detail, sitemap)", !(await get("/berita", { c: "" })).text.includes("Maulid") && (await get(`/berita/${newsSlug}`, { c: "" })).status === 404 && !(await get("/sitemap.xml", { c: "" })).text.includes(newsSlug));
  const prev = await get(`/admin/berita/${newsId}/pratinjau`);
  t("Berita", "pratinjau draft untuk admin", prev.status === 200 && /PRATINJAU/.test(prev.text) && /Susunan Acara/.test(prev.text));
  t("Berita", "pratinjau tidak bisa dibuka tanpa login", (await get(`/admin/berita/${newsId}/pratinjau`, { c: "" })).status >= 300);

  const editPage = (await get(`/admin/berita/${newsId}`)).text;
  t("Berita", "form edit terisi data tersimpan", editPage.includes("Peringatan Maulid Nabi di Pondok") && editPage.includes(coverPath));
  const pub = await submit(`/admin/berita/${newsId}`, pick, { status: "published", publishedAt: "" }, { page: editPage });
  t("Berita", "terbitkan lewat edit", /ok=saved/.test(pub.loc), pub.loc);
  const detail = await get(`/berita/${newsSlug}`, { c: "" });
  t("Berita", "detail publik 200 + judul + subjudul + daftar", detail.status === 200 && /<h2[^>]*>Susunan Acara/.test(detail.text) && /<li>Pembukaan/.test(detail.text));
  t("Berita", "OG tags + JSON-LD NewsArticle + gambar sampul beralt", /property="og:title"/.test(detail.text) && /NewsArticle/.test(detail.text) && /alt="Santri membaca sholawat"/.test(detail.text));
  t("Berita", "muncul di daftar, kategori, pencarian, beranda, sitemap", (await get("/berita", { c: "" })).text.includes("Maulid") && (await get("/berita?kategori=khutbah", { c: "" })).text.includes("Maulid") && (await get("/berita?q=maulid", { c: "" })).text.includes("Maulid") && (await get("/", { c: "" })).text.includes("Maulid") && (await get("/sitemap.xml", { c: "" })).text.includes(newsSlug));
  t("Berita", "pencarian tanpa hasil + input aman dari SQL injection", /Berita tidak ditemukan/.test((await get("/berita?q=" + encodeURIComponent("' OR 1=1; DROP TABLE news;--"), { c: "" })).text) && (await sql`select count(*)::int n from news`)[0].n === 1);

  const xss = await submit("/admin/berita/baru", pick, { title: "<img src=x onerror=alert(1)>Uji XSS", body: "Isi <script>alert('xss')</script> berita uji keamanan.", status: "published" }, { page });
  const xid = xss.loc.match(/berita\/([0-9a-f-]{36})/)?.[1];
  const xslug = (await sql`select slug from news where id=${xid}`)[0]?.slug;
  const xhtml = (await get(`/berita/${xslug}`, { c: "" })).text;
  t("Keamanan", "XSS pada judul/isi berita di-escape (tidak dieksekusi)", !/<img src=x onerror/.test(xhtml) && !/<script>alert\('xss'\)/.test(xhtml) && /&lt;img src=x onerror/.test(xhtml));

  const tog = await submit("/admin/berita", (f) => f.fields.some((x) => x[0] === "id" && x[1] === newsId) && !f.inner.includes("Ya, hapus"), {});
  t("Berita", "tombol 'Tarik' mengembalikan ke draft", /ok=updated/.test(tog.loc) && (await sql`select status from news where id=${newsId}`)[0].status === "draft");
  await submit("/admin/berita", (f) => f.fields.some((x) => x[0] === "id" && x[1] === newsId) && !f.inner.includes("Ya, hapus"), {});
  t("Berita", "tombol 'Terbitkan' menayangkan lagi", (await sql`select status from news where id=${newsId}`)[0].status === "published");
  const list = (await get("/admin/berita?q=maulid&status=published")).text;
  t("Berita", "daftar admin: pencarian + filter status", list.includes("Peringatan Maulid") && !list.includes("Uji XSS"));
  const del = await submit("/admin/berita", (f) => f.inner.includes("Ya, hapus") && f.fields.some((x) => x[0] === "id" && x[1] === newsId), {});
  t("Berita", "hapus berita -> hilang dari DB & publik", /ok=deleted/.test(del.loc) && (await sql`select 1 from news where id=${newsId}`).length === 0 && (await get(`/berita/${newsSlug}`, { c: "" })).status === 404);
  const st = await mockState();
  t("Berita", "gambar sampul ikut terhapus dari Storage", st.log.some((l) => l.m === "DELETE" && l.prefixes.includes(coverPath)) && !st.keys.includes(coverPath));
  const cdel = await submit("/admin/kategori", (f) => f.inner.includes("Ya, hapus") && f.fields.some((x) => x[0] === "kind" && x[1] === "news") && f.inner.includes("Khutbah Jumat"), {});
  t("Kategori", "hapus kategori tidak menghapus berita (jadi tanpa kategori)", /ok=deleted/.test(cdel.loc) && (await sql`select category_id from news where id=${xid}`).length === 1);
});

// ============ F. JADWAL ============
await guard("Jadwal", "CRUD", async () => {
  const pick = (f) => f.fields.some((x) => x[0] === "startsAt");
  const page = (await get("/admin/jadwal/baru")).text;
  const bad = await submit("/admin/jadwal/baru", pick, { title: "ab", startsAt: "" }, { page });
  t("Jadwal", "validasi: nama & waktu mulai wajib", /minimal 3/.test(bad.text) && /wajib diisi/.test(bad.text));
  const badEnd = await submit("/admin/jadwal/baru", pick, { title: "Pengajian Uji", startsAt: tomorrow(10), endsAt: tomorrow(8) }, { page });
  t("Jadwal", "validasi: selesai sebelum mulai ditolak", /tidak boleh sebelum/.test(badEnd.text));
  const mk = (title, startsAt, extra = {}) => submit("/admin/jadwal/baru", pick, { title, startsAt, speaker: "Ustadz Uji", location: "Masjid Pondok", description: "Deskripsi uji", isPublished: "on", status: "scheduled", ...extra }, { page });
  t("Jadwal", "tambah jadwal mendatang", /ok=saved/.test((await mk("Pengajian Kitab Uji", tomorrow(8))).loc));
  await mk("Pengajian Lampau Uji", tomorrow(8, -3));
  await mk("Pengajian Tersembunyi Uji", tomorrow(9, 2), { isPublished: null });
  const pub = (await get("/jadwal", { c: "" })).text;
  t("Jadwal", "publik: yang terbit & mendatang tampil", pub.includes("Pengajian Kitab Uji") && pub.includes("Ustadz Uji") && pub.includes("Masjid Pondok"));
  t("Jadwal", "publik: jadwal lampau otomatis masuk Riwayat", /Riwayat[\s\S]*Pengajian Lampau Uji/.test(pub) && !/Akan datang[\s\S]*?<\/section>/.test("") );
  t("Jadwal", "publik: jadwal disembunyikan tidak tampil", !pub.includes("Tersembunyi"));
  t("Jadwal", "waktu ditampilkan dalam WIB", /08[.:]00 WIB/.test(pub), (pub.match(/\d\d[.:]\d\d WIB/) || [])[0]);
  t("Jadwal", "tampil di Beranda", (await get("/", { c: "" })).text.includes("Pengajian Kitab Uji"));
  const id = (await sql`select id from schedules where title='Pengajian Kitab Uji'`)[0].id;
  const canc = await submit("/admin/jadwal", (f) => f.fields.some((x) => x[0] === "id" && x[1] === id) && f.fields.some((x) => x[0] === "status" && x[1] === "cancelled"), {});
  t("Jadwal", "tandai dibatalkan -> badge 'Dibatalkan' di publik", /ok=updated/.test(canc.loc) && /Dibatalkan/.test((await get("/jadwal", { c: "" })).text));
  await submit("/admin/jadwal", (f) => f.fields.some((x) => x[0] === "id" && x[1] === id) && f.fields.some((x) => x[0] === "status" && x[1] === "done"), {});
  t("Jadwal", "tandai selesai -> pindah ke Riwayat", /Riwayat[\s\S]*Pengajian Kitab Uji/.test((await get("/jadwal", { c: "" })).text) && !(await get("/", { c: "" })).text.includes("Pengajian terdekat"));
  const ep = (await get(`/admin/jadwal/${id}`)).text;
  const ed = await submit(`/admin/jadwal/${id}`, pick, { title: "Pengajian Kitab Uji (Revisi)", status: "scheduled" }, { page: ep });
  t("Jadwal", "edit jadwal tersimpan", (await sql`select title, status from schedules where id=${id}`)[0].title.includes("Revisi") && /ok=saved/.test(ed.loc));
  const del = await submit("/admin/jadwal", (f) => f.inner.includes("Ya, hapus") && f.fields.some((x) => x[0] === "id" && x[1] === id), {});
  t("Jadwal", "hapus jadwal", /ok=deleted/.test(del.loc) && (await sql`select 1 from schedules where id=${id}`).length === 0);
});

// ============ G. GALERI ============
await guard("Galeri", "upload & kelola", async () => {
  const cat = (await sql`select id from gallery_categories where slug='pengajian'`)[0].id;
  const outs = [];
  for (const [name, buf, type] of [["a.jpg", await jpg(1200, 800), "image/jpeg"], ["b.png", await png(800, 1000), "image/png"], ["c.jpg", await jpg(2400, 1600), "image/jpeg"], ["palsu.jpg", Buffer.from("bukan gambar"), "image/jpeg"]]) {
    outs.push(await callAction("uploadGalleryPhotoAction", { file: file(buf, name, type), categoryId: cat }));
  }
  t("Galeri", "unggah 3 foto valid (JPG, PNG, JPG besar) berurutan", outs[0].ok && outs[1].ok && outs[2].ok, outs.map((o) => o.ok).join(","));
  t("Galeri", "berkas palsu ditolak dengan pesan jelas", !outs[3].ok && /bukan gambar/i.test(outs[3].message || ""), outs[3].message);
  const rows = await sql`select id, path, thumb_path, width, height, sort_order, category_id from gallery order by sort_order`;
  t("Galeri", "3 baris tersimpan dengan thumbnail, dimensi, kategori, urutan", rows.length === 3 && rows.every((r) => r.thumb_path.endsWith("-thumb.webp") && r.width > 0 && r.category_id === cat) && rows.map((r) => r.sort_order).join() === "1,2,3");
  const st = await mockState();
  t("Galeri", "6 objek (utama + thumbnail) ada di Storage", rows.every((r) => st.keys.includes(r.path) && st.keys.includes(r.thumb_path)));
  const th = await sharp(Buffer.from(await (await fetch(`${MOCK}/storage/v1/object/public/media/${rows[2].thumb_path}`)).arrayBuffer())).metadata();
  t("Galeri", "thumbnail <= 640px", th.width <= 640, `${th.width}px`);
  const gal = (await get("/galeri", { c: "" })).text;
  t("Galeri", "halaman publik menampilkan 3 foto (lazy, beralt)", (gal.match(/aria-label="Perbesar foto/g) || []).length === 3 && /loading="lazy"/.test(gal));
  t("Galeri", "filter kategori publik", (await get("/galeri?kategori=pengajian", { c: "" })).text.includes("Perbesar foto") && !(await get("/galeri?kategori=lingkungan", { c: "" })).text.includes("Perbesar foto"));

  const first = rows[0].id;
  const edPage = (await get(`/admin/galeri/${first}`)).text;
  const ed = await submit(`/admin/galeri/${first}`, (f) => f.fields.some((x) => x[0] === "showOnHome" || x[0] === "title"), { title: "Santri mengaji", description: "Kajian sore", showOnHome: "on" }, { page: edPage });
  const after = (await sql`select title, show_on_home from gallery where id=${first}`)[0];
  t("Galeri", "edit judul/deskripsi/tampil di beranda", /ok=saved/.test(ed.loc) && after.title === "Santri mengaji" && after.show_on_home === true);
  t("Galeri", "foto 'tampil di beranda' muncul di Beranda", (await get("/", { c: "" })).text.includes("Kehidupan santri sehari-hari"));
  const mv = await submit("/admin/galeri", (f) => f.fields.some((x) => x[0] === "id" && x[1] === first) && f.fields.some((x) => x[0] === "dir" && x[1] === "down"), {});
  const order = (await sql`select id from gallery order by sort_order`).map((r) => r.id);
  t("Galeri", "turunkan urutan foto pertama", order[1] === first && mv.status >= 300, order.indexOf(first) + "");
  const del = await submit("/admin/galeri", (f) => f.inner.includes("Ya, hapus") && f.fields.some((x) => x[0] === "id" && x[1] === first), {});
  const st2 = await mockState();
  t("Galeri", "hapus foto: baris DB + 2 objek Storage terhapus", /ok=deleted/.test(del.loc) && (await sql`select 1 from gallery where id=${first}`).length === 0 && !st2.keys.includes(rows[0].path) && !st2.keys.includes(rows[0].thumb_path));
  t("Galeri", "urutan tersisa tetap utuh", (await sql`select count(*)::int n from gallery`)[0].n === 2);
});

// ============ H. KEAMANAN, SEO, TAUTAN ============
await guard("Keamanan", "kebocoran rahasia", async () => {
  const pages = ["/", "/profil", "/sejarah", "/berita", "/jadwal", "/galeri", "/pendaftaran", "/kontak", "/robots.txt", "/sitemap.xml"];
  let leak = false;
  for (const p of pages) { const h = (await get(p, { c: "" })).text; if (h.includes(KEY) || h.includes("rtpass") || h.includes("postgres://")) leak = true; }
  for (const p of ["/admin", "/admin/pengaturan", "/admin/galeri"]) { const h = (await get(p)).text; if (h.includes(KEY) || h.includes("rtpass") || h.includes("postgres://")) leak = true; }
  t("Keamanan", "SERVICE_ROLE_KEY / DATABASE_URL tidak ada di HTML publik maupun admin", !leak);
  let bundleLeak = false;
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|css|html|json|map)$/.test(e.name) && fs.readFileSync(p, "utf8").includes(KEY)) bundleLeak = true; } };
  walk(".next/static");
  t("Keamanan", "kunci rahasia tidak ada di bundel JavaScript klien (.next/static)", !bundleLeak);
  const robots = (await get("/robots.txt", { c: "" })).text;
  t("SEO", "robots.txt memblokir /admin & menunjuk sitemap", /Disallow: \/admin/.test(robots) && /Sitemap:/.test(robots));
});
await guard("SEO", "tautan & metadata", async () => {
  const seen = new Set(), queue = ["/"], dead = [];
  let imgNoAlt = 0, pagesChecked = 0, h1Bad = [];
  while (queue.length && seen.size < 60) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const r = await get(p, { c: "" });
    if (r.status !== 200) { dead.push(`${p} -> ${r.status}`); continue; }
    pagesChecked++;
    if (!p.startsWith("/robots") && !p.startsWith("/sitemap")) {
      if ((r.text.match(/<h1[\s>]/g) || []).length !== 1) h1Bad.push(p);
      imgNoAlt += [...r.text.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\salt=/.test(m[0])).length;
    }
    for (const m of r.text.matchAll(/href="(\/[^"#?]*)(?:\?[^"]*)?"/g)) if (!m[1].startsWith("/_next") && !seen.has(m[1]) && !/\.(ico|png|webp|svg)$/.test(m[1])) queue.push(m[1]);
  }
  t("Tautan", `tidak ada tautan internal mati (${pagesChecked} halaman dirayapi)`, dead.length === 0, dead.join("; "));
  t("SEO", "tepat satu <h1> per halaman", h1Bad.length === 0, h1Bad.join(","));
  t("SEO", "semua <img> memiliki atribut alt", imgNoAlt === 0, `${imgNoAlt} tanpa alt`);
  const home = (await get("/", { c: "" })).text;
  t("SEO", "title, meta description, og:title, og:image di Beranda", /<title>[^<]+<\/title>/.test(home) && /name="description"/.test(home) && /property="og:title"/.test(home) && /property="og:image"/.test(home));
  const sm = (await get("/sitemap.xml", { c: "" })).text;
  t("SEO", "sitemap memuat halaman utama dan berita terbit", /<loc>http:\/\/localhost:3000\/berita<\/loc>/.test(sm) && /uji-xss|img-src/.test(sm));
});

// ============ I. LOGOUT + RATE LIMIT ============
await guard("Auth", "logout & rate limit", async () => {
  const lo = await submit("/admin", (f) => f.inner.includes("Keluar"), {});
  const gone = (lo.headers.getSetCookie?.() || []).find((s) => s.startsWith("rt_admin="));
  t("Auth", "logout menghapus cookie & redirect ke login", [302, 303, 307].includes(lo.status) && /\/panel-akses/.test(lo.loc) && (!gone || /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(gone)));
  t("Auth", "setelah logout, dasbor tertutup lagi", (await get("/admin", { c: "" })).status >= 300);
  let blocked = false;
  for (let i = 0; i < 7; i++) { const r = await login("brute@contoh.id", "tebakan-ke-" + i); if (/Terlalu banyak percobaan/.test(r.text)) blocked = true; }
  t("Auth", "pembatasan percobaan login (5 gagal/15 menit)", blocked);
  const r = await login(EMAIL, PASS);
  t("Auth", "akun lain tidak ikut terkunci", [302, 303, 307].includes(r.status));
});

const fail = results.filter((r) => !r.ok);
fs.writeFileSync("tests/last-results.json", JSON.stringify(results, null, 1));
console.log(`\n==== ${results.length - fail.length}/${results.length} lulus ====`);
if (fail.length) { console.log("GAGAL:"); for (const f of fail) console.log(" -", `[${f.area}] ${f.name}`, f.note); }
await sql.end();
process.exit(fail.length ? 1 : 0);
