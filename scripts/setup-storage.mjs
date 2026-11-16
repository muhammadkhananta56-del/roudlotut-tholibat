// Membuat bucket publik di Supabase Storage (sekali saja). Memakai SERVICE_ROLE_KEY dari .env.local
// di komputer Anda; kunci tidak pernah dikirim ke browser.
const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
if (!base || !key) {
  console.error("SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env.local.");
  process.exit(1);
}
const res = await fetch(`${base}/storage/v1/bucket`, {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({
    id: bucket,
    name: bucket,
    public: true,
    file_size_limit: 5 * 1024 * 1024,
    allowed_mime_types: ["image/webp", "image/jpeg", "image/png"],
  }),
});
const text = await res.text();
if (res.ok) console.log(`Bucket "${bucket}" dibuat (publik).`);
else if (/already exists|Duplicate/i.test(text)) console.log(`Bucket "${bucket}" sudah ada. Tidak ada yang perlu diubah.`);
else {
  console.error(`Gagal (${res.status}): ${text}`);
  process.exitCode = 1;
}
