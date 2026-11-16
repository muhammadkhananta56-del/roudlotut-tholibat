# Panduan Deployment — PP. Roudlotut Tholibat

Teknologi: **Next.js 16 (App Router) + Tailwind CSS 4 + PostgreSQL & Storage Supabase**, di-host di **Vercel**.
Website ini membutuhkan Node.js (bukan situs statis), jadi **tidak bisa** diunggah ke hosting biasa/cPanel tanpa Node.

## 1. Ekstrak dan persyaratan
- Ekstrak ZIP sampai `package.json` terlihat langsung di folder (bukan folder di dalam folder).
- Node.js **20.9 atau lebih baru** (disarankan 22 LTS), akun Supabase, akun Vercel, akun GitHub.

## 2. Jalankan lokal
```bash
npm install
cp .env.example .env.local        # Windows: copy .env.example .env.local
# isi .env.local (lihat tabel di bawah)
npm run db:migrate                 # buat tabel
npm run admin:create               # buat akun admin
npm run dev                        # http://localhost:3000  | admin: /panel-akses
```

## 3. Environment variable
| Nama | Isi |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Alamat publik, tanpa `/` di akhir |
| `DATABASE_URL` | Supabase, *Transaction pooler* (port 6543) |
| `SESSION_SECRET` | Acak >= 32 karakter: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Dari Supabase, Project Settings > API (kunci ini rahasia) |
| `SUPABASE_STORAGE_BUCKET` | `media` (bucket harus *Public*) |

## 4. Build production
```bash
npm run typecheck && npm run lint && npm run build
npm run start
```

## 5. Deploy ke Vercel
Langkah lengkap + daftar centang pengujian: **`docs/DEPLOY-VERCEL.md`**. Penyiapan Supabase: **`docs/SETUP-SUPABASE.md`**.
Ringkasnya: push ke GitHub (pastikan `.env.local` tidak ikut), impor di vercel.com/new, isi semua environment variable di atas,
atur *Function Region* ke Singapore (sin1), Deploy.

## 6. Domain
Vercel > Settings > Domains > tambahkan domain, ikuti DNS. Lalu ubah `NEXT_PUBLIC_SITE_URL` dan Redeploy.

## 7. Masalah umum
Tabel gejala dan solusi ada di bagian akhir `docs/DEPLOY-VERCEL.md` (error 500, login admin, unggah foto, foto rusak, halaman lambat).

## 8. Foto dan logo
Semua foto dan logo dikelola dari dasbor admin (Pengaturan Situs & Galeri) dan disimpan di Supabase Storage,
bukan di folder `public/`. Bila belum diunggah, bagian terkait tidak ditampilkan.

## 9. Halaman Pendaftaran (baru di v3)
Isi dari dasbor admin: **Pengaturan > Pendaftaran** (status, keterangan, alur, persyaratan). Tidak perlu migrasi database.
Selama kosong, halaman /pendaftaran hanya menampilkan program dan tombol WhatsApp/Kontak, tanpa informasi buatan.
