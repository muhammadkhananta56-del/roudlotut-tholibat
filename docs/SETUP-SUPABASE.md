# Panduan Setup Supabase

Anda membutuhkan satu project Supabase untuk **database** (PostgreSQL) dan **penyimpanan foto** (Storage).
Semua langkah di bawah dilakukan **sekali**. Kunci rahasia hanya diisi di komputer Anda (`.env.local`) dan di
Vercel, **tidak pernah** di GitHub atau di ZIP.

## 0. Buat ulang kunci lama (WAJIB bila project Supabase lama dipakai lagi)

`SERVICE_ROLE_KEY` project lama ada di dalam ZIP yang pernah dibagikan. Anggap kunci itu sudah terbuka.

1. Supabase Dashboard, pilih project, **Project Settings**, **API Keys** (atau **JWT Keys**).
2. Buat ulang (*rotate/regenerate*) kunci `service_role`. Kunci lama berhenti berfungsi.
3. Ganti juga password database: **Project Settings**, **Database**, **Reset database password**.

Alternatif paling bersih: buat project Supabase baru, lalu hapus yang lama.

## 1. Buat project

1. https://supabase.com/dashboard, **New project**.
2. **Region**: pilih **Southeast Asia (Singapore)**, paling dekat dengan Indonesia.
3. Isi **Database password**. Simpan di pengelola password. Hindari karakter `@ : / ? # %` agar mudah dipakai di URL
   (bila terpaksa memakai, ubah ke bentuk URL-encoded saat mengisi `DATABASE_URL`).

## 2. Ambil `DATABASE_URL`

1. Klik tombol **Connect** di bagian atas dashboard project.
2. Pilih **Transaction pooler** (port **6543**). Salin *connection string*-nya, bentuknya:
   `postgresql://postgres.<ref>:[PASSWORD]@aws-0-<region>.pooler.supabase.com:6543/postgres`
3. Ganti `[PASSWORD]` dengan password database Anda.

> Pakai **pooler (6543)**, bukan *Direct connection*. Alamat direct hanya IPv6 dan akan gagal dari Vercel.
> Antarmuka Supabase kadang berubah letak menu. Bila "Connect" tidak ada, cari "Connection string" di Project Settings, Database.

## 3. Ambil `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`

1. **Project Settings**, **API** (atau **Data API**): salin **Project URL** (`https://xxxx.supabase.co`) sebagai `SUPABASE_URL`.
2. Salin kunci **`service_role`** sebagai `SUPABASE_SERVICE_ROLE_KEY`.
   - Kunci ini **rahasia penuh**. Jangan pernah memakai awalan `NEXT_PUBLIC_`, jangan tempel ke chat, jangan commit.
   - Kode ini dikembangkan untuk kunci `service_role` berformat JWT (diawali `eyJ...`). Bila dashboard Anda hanya menampilkan
     kunci format baru (`sb_secret_...`), buka tab **Legacy API Keys** dan pakai `service_role` dari sana. Kompatibilitas
     `sb_secret_...` untuk Storage **belum diuji**.

## 4. Isi `.env.local` di komputer Anda

Di folder project, salin `.env.example` menjadi `.env.local` lalu isi (file ini sudah di-`.gitignore`):

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres.<ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:6543/postgres
SESSION_SECRET=<hasil perintah di bawah>
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role>
SUPABASE_STORAGE_BUCKET=media
```

Membuat `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 5. Buat tabel (migrasi)

```bash
npm install
npm run db:migrate
```

Keluaran yang benar: `Menjalankan 001_init.sql ...` lalu `Selesai: 1 migrasi dijalankan.`
Menjalankan lagi aman (`Database sudah mutakhir.`). Migrasi membuat 9 tabel, mengaktifkan **Row Level Security** di semuanya
(menutup akses lewat Data API publik Supabase; website ini hanya mengakses data lewat server), dan mengisi kategori awal
(berita: Pengumuman, Kegiatan, Pendidikan; galeri: Kegiatan Santri, Pengajian, Lingkungan Pondok). Semua kategori bisa diubah di dasbor.

## 6. Buat bucket penyimpanan foto

```bash
npm run storage:setup
```

Skrip membuat bucket publik `media` (maks 5 MB per berkas; hanya WebP/JPEG/PNG). Bila lebih suka manual:
**Storage**, **New bucket**, nama `media`, aktifkan **Public bucket**.

Bucket *publik* dipilih agar foto bisa tampil di website tanpa tanda tangan URL. **Menulis dan menghapus** hanya bisa
dilakukan server kita (dengan `service_role`); pengunjung hanya bisa membaca foto yang memang ditampilkan.

## 7. Buat akun admin pertama

```bash
npm run admin:create
```

Masukkan email, nama, dan password (minimal 10 karakter; ketikan password tidak terlihat). Password disimpan hanya sebagai
hash bcrypt. Menjalankan lagi dengan email yang sama = mengganti password (cara reset password).

Selesai. Lanjut ke `docs/DEPLOY-VERCEL.md`, atau uji lokal dengan `npm run dev` lalu buka http://localhost:3000/panel-akses.
