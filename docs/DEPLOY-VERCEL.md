# Panduan Deploy ke Vercel

Prasyarat: Supabase sudah disiapkan sampai selesai (`docs/SETUP-SUPABASE.md`: migrasi, bucket `media`, akun admin).

## 1. Ganti project lama dengan project baru

ZIP ini sengaja **tidak** berisi folder `.git` maupun `.env.local`. Cara mengganti tanpa kehilangan riwayat Git:

1. Tutup editor. Salin folder `.git` dan file `.env.local` lama Anda ke tempat aman.
2. Hapus **semua isi** folder project lama (`app`, `components`, `lib`, `public`, `package.json`, dan seterusnya), **kecuali `.git`**.
3. Ekstrak ZIP baru ke folder yang sama. Pastikan `.git` masih ada dan file `.gitignore` baru ikut tersalin.
4. Buat `.env.local` baru dari `.env.example` (`docs/SETUP-SUPABASE.md` langkah 4). Jangan pakai kunci lama.
5. Pasang dan jalankan lokal:
   ```bash
   npm install
   npm run dev            # http://localhost:3000 dan http://localhost:3000/panel-akses
   ```

## 2. Pastikan rahasia tidak ikut ke GitHub

Sebelum `git add`, jalankan:

```bash
git status --ignored | grep -E "\.env"
```

`.env.local` **harus** muncul di bagian *Ignored*, **tidak** di *Changes/Untracked*. Bila ada `.env*` selain `.env.example`
di daftar yang akan di-commit, **berhenti** dan periksa `.gitignore`. Lalu:

```bash
git add -A
git status                      # periksa sekali lagi: tidak ada .env.local, node_modules, .next
git commit -m "Redesain website dan tambah CMS admin"
git push
```

## 3. Impor ke Vercel

1. https://vercel.com/new, pilih repository GitHub Anda, **Import**.
2. *Framework Preset* terdeteksi **Next.js**. *Build Command* dan *Install Command* biarkan bawaan
   (`npm run build`, `npm install`). *Node.js Version*: 22.x (atau 20.9+).
3. Buka **Environment Variables** dan isi (pilih environment **Production**):

| Nama | Nilai | Catatan |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://domain-anda.vercel.app` | Tanpa `/` di akhir. Dipakai untuk sitemap dan Open Graph. Ganti saat domain sendiri dipasang |
| `DATABASE_URL` | connection string **Transaction pooler** (port 6543) | Tandai **Sensitive** |
| `SESSION_SECRET` | string acak >= 32 karakter | Tandai **Sensitive**. Mengganti nilainya = semua admin otomatis logout |
| `SUPABASE_URL` | `https://<ref>.supabase.co` | |
| `SUPABASE_SERVICE_ROLE_KEY` | kunci `service_role` | Tandai **Sensitive**. Jangan beri awalan `NEXT_PUBLIC_` |
| `SUPABASE_STORAGE_BUCKET` | `media` | |

   > Variabel yang diawali `NEXT_PUBLIC_` ikut terkirim ke browser. Hanya `NEXT_PUBLIC_SITE_URL` yang boleh begitu.

4. **Deploy**.

## 4. Atur region fungsi (sangat disarankan)

Bila database Supabase di Singapura tetapi fungsi Vercel di Amerika, setiap halaman menunggu beberapa kali perjalanan
antarbenua ke database. Atur: Project, **Settings**, **Functions**, **Function Region**, pilih **Singapore (sin1)**,
lalu **Redeploy**.

## 5. Periksa bahwa website berjalan normal

Buka URL produksi dan centang satu per satu:

- [ ] Beranda terbuka tanpa error. Bagian yang masih kosong (belum ada berita/jadwal/foto) tidak tampil. Itu normal.
- [ ] `/admin` tanpa login menampilkan 404; login lewat `/panel-akses`. Masuk dengan akun dari `npm run admin:create`.
- [ ] **Pengaturan Situs**: isi alamat, WhatsApp, profil. Simpan. Buka `/kontak` dan `/profil` di tab lain: data tampil.
- [ ] Unggah **foto utama** di Pengaturan Situs. Foto tampil di Beranda. Klik kanan, *Open image in new tab*: URL berawalan
      `https://<ref>.supabase.co/storage/v1/object/public/media/...`. Ini bukti Supabase Storage bekerja.
- [ ] **Berita**: tulis, simpan draft, klik *Pratinjau*, ubah ke *Terbit*, simpan. Muncul di `/berita` dan Beranda.
- [ ] **Jadwal Pengajian**: tambah jadwal mendatang. Muncul di `/jadwal`.
- [ ] **Galeri**: unggah beberapa foto sekaligus dari ponsel. Muncul di `/galeri`.
- [ ] Buka dari **ponsel**: menu, hero, galeri (ketuk foto untuk memperbesar), tidak ada geseran ke samping.
- [ ] `/robots.txt` dan `/sitemap.xml` terbuka. Jalankan https://pagespeed.web.dev pada URL produksi.
- [ ] Setelah selesai uji: hapus data contoh yang Anda buat.

## 6. Domain sendiri

Vercel, **Settings**, **Domains**, tambahkan domain dan ikuti instruksi DNS. Setelah aktif, ubah
`NEXT_PUBLIC_SITE_URL` ke domain tersebut lalu **Redeploy**.

## 7. Pembaruan berikutnya

Setiap `git push` ke branch utama otomatis di-deploy. Konten (berita, jadwal, galeri, profil) tidak perlu deploy:
ubah lewat dasbor, langsung tampil.

Bila Anda menambah migrasi database baru kelak (`db/migrations/00X_*.sql`), jalankan `npm run db:migrate` dari komputer Anda
(dengan `.env.local` yang menunjuk Supabase produksi) **sebelum** deploy kode yang membutuhkannya.

## Mengatasi masalah umum

| Gejala | Penyebab dan solusi |
|---|---|
| Build gagal / halaman error "DATABASE_URL belum diisi" | Variabel belum diisi untuk environment yang dipakai (Production vs Preview). Isi lalu Redeploy |
| Halaman error 500 setelah deploy | Vercel, **Logs**. Biasanya password di `DATABASE_URL` salah, atau memakai alamat *Direct* alih-alih *pooler* |
| Login admin selalu "Email atau password salah" | Akun belum dibuat di database **produksi**. Jalankan `npm run admin:create` dengan `.env.local` yang menunjuk produksi |
| "Terlalu banyak percobaan masuk" | Tunggu 15 menit. Pembatasan: 5 gagal per akun atau 20 per IP |
| Login berhasil lalu langsung terlempar ke login | `SESSION_SECRET` kosong/kurang dari 32 karakter atau berubah di antara deploy |
| Unggah foto gagal "Penyimpanan foto gagal" | Bucket `media` belum dibuat, atau `SUPABASE_URL`/`SERVICE_ROLE_KEY` salah. Lihat Logs untuk kode status dari Supabase |
| Unggah foto gagal dengan pesan tentang ukuran | Batas fungsi Vercel 4,5 MB. Browser mengecilkan foto otomatis; foto yang tetap terlalu besar perlu dikecilkan dulu |
| Foto tampil rusak (ikon gambar patah) | Bucket tidak *Public*. Aktifkan di Supabase, Storage, `media`, Edit bucket |
| Halaman lambat | Fungsi Vercel dan database beda region. Lihat bagian 4 |
| Perubahan di dasbor tidak tampil | Segarkan paksa (Ctrl+Shift+R). Halaman publik dirender per permintaan, jadi tidak ada cache server yang basi |
