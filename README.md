# Website Company Profile PP. Roudlotut Tholibat

Website resmi Pondok Pesantren Roudlotut Tholibat: beranda, profil, sejarah, berita, jadwal pengajian, galeri, dan kontak.
Konten dikelola dari dasbor admin. Dibangun dengan Next.js, Tailwind CSS, dan database PostgreSQL (Supabase).

Panduan ini ditulis untuk **Windows** dan untuk pemula. Ikuti urutannya.

---

## 1. Ekstrak ZIP
1. Klik kanan file `roudlotut-tholibat-premium-final.zip`, pilih **Extract All...**.
2. Pilih lokasi yang mudah, misalnya `C:\Proyek\roudlotut-tholibat`.
3. Pastikan di dalam folder itu langsung terlihat file `package.json` (bukan folder di dalam folder).

## 2. Buka di VS Code
1. Pasang VS Code dari https://code.visualstudio.com bila belum ada.
2. Buka VS Code, pilih **File > Open Folder...**, lalu pilih folder hasil ekstrak.
3. Buka terminal: menu **Terminal > New Terminal** (pintasan `Ctrl + \``). Semua perintah di bawah diketik di terminal ini.

## 3. Pasang Node.js
1. Cek dulu: ketik `node -v`. Jika muncul versi **20.9 atau lebih baru** (misalnya `v22.x`), lewati langkah ini.
2. Jika belum ada, unduh versi **LTS** dari https://nodejs.org, pasang dengan pilihan bawaan, lalu **tutup dan buka lagi VS Code**.
3. Cek lagi dengan `node -v` dan `npm -v`.

## 4. Pasang dependensi
```powershell
npm install
```
Tunggu sampai selesai (beberapa menit). Folder `node_modules` akan muncul otomatis.

## 5. Buat file `.env.local`
File ini berisi pengaturan rahasia. **Jangan dibagikan dan jangan diunggah ke GitHub** (sudah dikecualikan oleh `.gitignore`).

1. Di terminal, salin contohnya:
   ```powershell
   copy .env.example .env.local
   ```
2. Buka `.env.local` di VS Code dan isi nilainya (langkah 6 dan 7).

| Isian | Keterangan |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Lokal: `http://localhost:3000`. Setelah online: alamat website Anda, tanpa `/` di akhir |
| `DATABASE_URL` | Koneksi database Supabase (langkah 6) |
| `SESSION_SECRET` | Kunci rahasia sesi admin (langkah 7) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` | Penyimpanan foto Supabase (lihat `docs/SETUP-SUPABASE.md`) |

## 6. Mengatur DATABASE_URL
1. Masuk ke https://supabase.com, buka project Anda.
2. Buka **Project Settings > Database > Connection string**.
3. Untuk Vercel pilih **Transaction pooler** (port `6543`). Untuk komputer sendiri boleh yang sama.
4. Salin teksnya ke `.env.local`, ganti `[YOUR-PASSWORD]` dengan password database Anda:
   ```
   DATABASE_URL=postgresql://postgres.xxxx:PASSWORDANDA@aws-0-xxx.pooler.supabase.com:6543/postgres
   ```
Jika password mengandung simbol khusus (`@`, `#`, `/`), ubah dulu password di Supabase menjadi huruf dan angka saja.

## 7. Membuat SESSION_SECRET
Di terminal, jalankan:
```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
Salin hasilnya (teks acak panjang) ke `.env.local`:
```
SESSION_SECRET=hasil-teks-acak-tadi
```
Minimal 32 karakter. Jangan pernah mengganti nilai ini di website yang sedang berjalan kecuali Anda siap membuat semua admin login ulang.

## 8. Siapkan database (sekali saja)
```powershell
npm run db:migrate
npm run admin:create
npm run storage:setup
```
- `db:migrate` membuat tabel. Aman dijalankan ulang, tidak menghapus data.
- `admin:create` meminta email, nama, dan password (minimal 10 karakter) untuk akun admin.
- `storage:setup` menyiapkan tempat foto di Supabase.

## 9. Jalankan website
```powershell
npm run dev
```
Buka http://localhost:3000 di browser. Hentikan dengan `Ctrl + C`.

## 10. Login admin
Alamat login: **http://localhost:3000/panel-akses** (online: `https://alamat-anda/panel-akses`).
- Tidak ada tombol login di menu publik, dan tidak ada pendaftaran akun. Hanya akun dari `npm run admin:create` yang bisa masuk.
- Setelah login Anda masuk ke dasbor `/admin`. Alamat `/admin` tanpa login menampilkan halaman 404.
- Lupa password atau perlu admin baru: jalankan lagi `npm run admin:create`.

## 11. Uji build produksi
```powershell
npm run typecheck
npm run lint
npm run build
npm run start
```
Jika `build` selesai tanpa error, website siap di-deploy. `npm run start` menjalankan hasil build di http://localhost:3000.

## 12. Deploy ke Vercel
Langkah lengkap ada di `docs/DEPLOY-VERCEL.md`. Ringkasnya:
1. Unggah project ke GitHub (tanpa `.env.local`).
2. Di https://vercel.com pilih **Add New > Project**, impor repositori itu.
3. Di **Settings > Environment Variables** isi semua variabel dari `.env.example` dengan nilai asli.
4. Klik **Deploy**. Setelah online, ubah `NEXT_PUBLIC_SITE_URL` menjadi alamat Vercel/domain Anda lalu deploy ulang.
5. Cek: halaman publik terbuka, `/admin` menampilkan 404, `/panel-akses` bisa login.

---

## Desain
Palet **Warm Elegant Islamic** (didefinisikan sebagai token di `app/globals.css`):
Warm Ivory `#F5F1E9`, Soft Beige `#EAE3D7`, Muted Sage `#7D9078`, Deep Olive `#35443A`, Antique Gold `#B49A69`, Charcoal `#303630`.
Teks abu-abu memakai `#5F5F58` (turunan Warm Gray yang lebih gelap) agar kontras terbaca. Animasi hanya memakai CSS dan
`IntersectionObserver`, dan otomatis dimatikan bila perangkat memakai pengaturan *reduce motion*.

## Struktur singkat
```
app/(site)/      halaman publik (beranda, profil, sejarah, berita, jadwal, galeri, kontak)
app/panel-akses/ halaman login admin (tidak ada di menu publik)
app/admin/       dasbor admin (dilindungi)
app/actions/     Server Action (CRUD, login, unggah)
components/      site/ (header, footer, kartu), admin/, ui/, motion/
lib/             database, sesi, validasi, penyimpanan
db/migrations/   skema database
scripts/         migrate, create-admin, setup-storage
tests/           uji end-to-end (lihat tests/README.md; hanya untuk database lokal)
docs/            panduan Supabase, Vercel, desain
```

## Keamanan
- Login: password di-hash (bcrypt), cookie sesi `HttpOnly`, `Secure` di HTTPS, `SameSite=Lax`, batas percobaan login.
- `/admin` dilindungi dua lapis (`proxy.ts` dan `requireAdmin()` di setiap halaman dan Server Action).
- Tidak ada registrasi publik. Rahasia hanya dibaca di server.
- Tabel Supabase memakai Row Level Security; website mengakses data lewat server.
