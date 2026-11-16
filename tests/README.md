# Pengujian end-to-end

Suite `e2e.mjs` menjalankan 116 pemeriksaan terhadap server **produksi** (`next start`) yang terhubung ke
database PostgreSQL dan *mock* Supabase Storage lokal: halaman publik, autentikasi, CRUD berita/jadwal/galeri/kategori,
pengaturan situs, unggah foto, keamanan, SEO, dan tautan.

> **PERINGATAN:** suite ini mengosongkan tabel `news`, `schedules`, `gallery`, `settings`. Ia menolak berjalan
> bila `DATABASE_URL` bukan `localhost`. Jangan pernah memakai database produksi.

## Cara menjalankan

```bash
# 1. PostgreSQL lokal kosong untuk uji, mis. database rt_test
export DATABASE_URL=postgres://USER:PASS@localhost:5432/rt_test
# 2. .env.local berisi DATABASE_URL (uji), SESSION_SECRET (>=32 karakter), NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run db:migrate
ADMIN_EMAIL=admin@contoh.id ADMIN_NAME="Ustadz Uji" ADMIN_PASSWORD='Sandi-Uji-Kuat-2026' npm run admin:create
npm run build
./tests/start-test-servers.sh        # mock Storage (:54321) + next start (:3000)
node tests/e2e.mjs                   # hasil juga ditulis ke tests/last-results.json
```

`mock-storage.mjs` menirukan endpoint REST Supabase Storage (upload, hapus, URL publik) dan menolak permintaan
tanpa header `Authorization`/`apikey` yang benar. Ini menguji **kode driver kita**, bukan Supabase asli.
