# Laporan Pengujian Akhir

**Hasil: 116 dari 116 pemeriksaan otomatis lulus.** Laporan tabel di bawah dihasilkan langsung dari `tests/last-results.json` (hasil run terakhir), bukan ditulis tangan.

## Lingkungan pengujian

| Komponen | Versi / keterangan |
|---|---|
| Next.js | 16.4.6, build produksi (`next build` + `next start`) |
| Node.js | 22.23.4 |
| Database | PostgreSQL 16 **lokal** (bukan Supabase) |
| Penyimpanan foto | **Mock** Supabase Storage lokal (`tests/mock-storage.mjs`), bukan Supabase asli |
| Klien | Skrip Node (fetch) yang meniru browser: cookie, submit form, pemanggilan Server Action. **Bukan browser sungguhan.** |

## Pemeriksaan statis

| Pemeriksaan | Hasil |
|---|---|
| `npm run typecheck` (TypeScript strict) | Lulus, 0 error |
| `npm run lint` | Lulus, 0 error, 0 peringatan |
| `npm run build` produksi | Lulus, 24 route |
| Build **tanpa** `DATABASE_URL`/env (simulasi deploy pertama) | Lulus. Semua halaman berbasis DB dirender saat diminta, bukan saat build |
| `npm audit --omit=dev` | 0 kerentanan |
| Rasio kontras warna (dihitung) | Semua pasangan teks/latar >= 4,5:1 (WCAG AA); teks isi 15,1:1 |

## Hasil pengujian fungsional (otomatis)

### Publik

| Fitur yang diuji | Status |
|---|---|
| GET / (DB kosong) 200 | Lulus |
| GET /profil (DB kosong) 200 | Lulus |
| GET /sejarah (DB kosong) 200 | Lulus |
| GET /berita (DB kosong) 200 | Lulus |
| GET /jadwal (DB kosong) 200 | Lulus |
| GET /galeri (DB kosong) 200 | Lulus |
| GET /kontak (DB kosong) 200 | Lulus |
| GET /robots.txt (DB kosong) 200 | Lulus |
| GET /sitemap.xml (DB kosong) 200 | Lulus |
| 404 untuk halaman tidak ada | Lulus |
| Beranda: satu <h1>, lang=id, viewport | Lulus |
| Beranda DB kosong tidak menampilkan bagian kosong/placeholder [..] | Lulus |
| Halaman Berita kosong menampilkan empty state | Lulus |
| Halaman Jadwal kosong menampilkan empty state | Lulus |
| Halaman Galeri kosong menampilkan empty state | Lulus |
| Header keamanan (nosniff, X-Frame-Options) | Lulus |

### Auth

| Fitur yang diuji | Status |
|---|---|
| /admin tanpa cookie diarahkan ke login | Lulus |
| /admin/berita tanpa cookie diarahkan ke login | Lulus |
| /admin/berita/baru tanpa cookie diarahkan ke login | Lulus |
| /admin/jadwal tanpa cookie diarahkan ke login | Lulus |
| /admin/galeri tanpa cookie diarahkan ke login | Lulus |
| /admin/kategori tanpa cookie diarahkan ke login | Lulus |
| /admin/pengaturan tanpa cookie diarahkan ke login | Lulus |
| cookie sesi palsu ditolak | Lulus |
| Server Action tanpa login tidak berhasil | Lulus |
| password salah ditolak dengan pesan generik | Lulus |
| email tidak terdaftar: pesan sama persis (anti user-enumeration) | Lulus |
| login benar -> redirect | Lulus |
| open redirect (next=//evil) dinetralkan | Lulus |
| cookie sesi HttpOnly + SameSite=Lax + Path=/ | Lulus |
| dasbor terbuka setelah login | Lulus |
| halaman login saat sudah masuk diarahkan ke dasbor | Lulus |
| halaman admin: Cache-Control no-store + noindex | Lulus |
| password tersimpan sebagai hash bcrypt | Lulus |
| logout menghapus cookie & redirect ke login | Lulus |
| setelah logout, dasbor tertutup lagi | Lulus |
| pembatasan percobaan login (5 gagal/15 menit) | Lulus |
| akun lain tidak ikut terkunci | Lulus |

### Upload

| Fitur yang diuji | Status |
|---|---|
| sumber uji memuat EXIF | Lulus |
| unggah JPG 3000x2000 via Server Action | Lulus |
| hasil: WebP, lebar <= 1800, EXIF/GPS dibuang | Lulus |
| driver Supabase mengirim auth + content-type + cache-control benar | Lulus |
| tidak ada request ditolak karena auth | Lulus |
| teks berkedok .jpg ditolak (validasi isi berkas) | Lulus |
| SVG (vektor XSS) ditolak | Lulus |
| folder tujuan di luar daftar putih ditolak | Lulus |
| berkas 5 MB ditolak | Lulus |

### Pengaturan

| Fitur yang diuji | Status |
|---|---|
| validasi server: WA, email, URL javascript:, path gambar tidak valid | Lulus |
| simpan berhasil -> redirect ?ok=saved | Lulus |
| tersimpan persisten di database | Lulus |

### Beranda dinamis

| Fitur yang diuji | Status |
|---|---|
| Beranda menampilkan konten dari CMS (headline, program, pengasuh) | Lulus |
| foto utama dari Supabase Storage tampil dengan alt | Lulus |
| JSON-LD terisi dan aman (< di-escape) | Lulus |
| /profil menampilkan data dari CMS | Lulus |
| /sejarah menampilkan data dari CMS | Lulus |
| /kontak menampilkan data dari CMS | Lulus |
| link WhatsApp dinormalisasi ke wa.me/6281234567890 | Lulus |

### Keamanan

| Fitur yang diuji | Status |
|---|---|
| /dev-uploads dinonaktifkan saat Supabase aktif | Lulus |
| XSS pada judul/isi berita di-escape (tidak dieksekusi) | Lulus |
| SERVICE_ROLE_KEY / DATABASE_URL tidak ada di HTML publik maupun admin | Lulus |
| kunci rahasia tidak ada di bundel JavaScript klien (.next/static) | Lulus |

### Kategori

| Fitur yang diuji | Status |
|---|---|
| tambah kategori berita | Lulus |
| nama duplikat (tanpa peduli huruf besar) ditolak | Lulus |
| nama terlalu pendek ditolak | Lulus |
| ubah nama | Lulus |
| hapus kategori tidak menghapus berita (jadi tanpa kategori) | Lulus |

### Berita

| Fitur yang diuji | Status |
|---|---|
| unggah gambar sampul | Lulus |
| validasi: judul & isi terlalu pendek | Lulus |
| validasi: sampul tanpa deskripsi ditolak | Lulus |
| validasi: path sampul di luar news/ ditolak | Lulus |
| simpan draft -> redirect ke halaman edit | Lulus |
| slug otomatis & status draft di DB | Lulus |
| draft TIDAK tampil di publik (daftar, detail, sitemap) | Lulus |
| pratinjau draft untuk admin | Lulus |
| pratinjau tidak bisa dibuka tanpa login | Lulus |
| form edit terisi data tersimpan | Lulus |
| terbitkan lewat edit | Lulus |
| detail publik 200 + judul + subjudul + daftar | Lulus |
| OG tags + JSON-LD NewsArticle + gambar sampul beralt | Lulus |
| muncul di daftar, kategori, pencarian, beranda, sitemap | Lulus |
| pencarian tanpa hasil + input aman dari SQL injection | Lulus |
| tombol 'Tarik' mengembalikan ke draft | Lulus |
| tombol 'Terbitkan' menayangkan lagi | Lulus |
| daftar admin: pencarian + filter status | Lulus |
| hapus berita -> hilang dari DB & publik | Lulus |
| gambar sampul ikut terhapus dari Storage | Lulus |

### Jadwal

| Fitur yang diuji | Status |
|---|---|
| validasi: nama & waktu mulai wajib | Lulus |
| validasi: selesai sebelum mulai ditolak | Lulus |
| tambah jadwal mendatang | Lulus |
| publik: yang terbit & mendatang tampil | Lulus |
| publik: jadwal lampau otomatis masuk Riwayat | Lulus |
| publik: jadwal disembunyikan tidak tampil | Lulus |
| waktu ditampilkan dalam WIB | Lulus |
| tampil di Beranda | Lulus |
| tandai dibatalkan -> badge 'Dibatalkan' di publik | Lulus |
| tandai selesai -> pindah ke Riwayat | Lulus |
| edit jadwal tersimpan | Lulus |
| hapus jadwal | Lulus |

### Galeri

| Fitur yang diuji | Status |
|---|---|
| unggah 3 foto valid (JPG, PNG, JPG besar) berurutan | Lulus |
| berkas palsu ditolak dengan pesan jelas | Lulus |
| 3 baris tersimpan dengan thumbnail, dimensi, kategori, urutan | Lulus |
| 6 objek (utama + thumbnail) ada di Storage | Lulus |
| thumbnail <= 640px | Lulus |
| halaman publik menampilkan 3 foto (lazy, beralt) | Lulus |
| filter kategori publik | Lulus |
| edit judul/deskripsi/tampil di beranda | Lulus |
| foto 'tampil di beranda' muncul di Beranda | Lulus |
| turunkan urutan foto pertama | Lulus |
| hapus foto: baris DB + 2 objek Storage terhapus | Lulus |
| urutan tersisa tetap utuh | Lulus |

### SEO

| Fitur yang diuji | Status |
|---|---|
| robots.txt memblokir /admin & menunjuk sitemap | Lulus |
| tepat satu <h1> per halaman | Lulus |
| semua <img> memiliki atribut alt | Lulus |
| title, meta description, og:title, og:image di Beranda | Lulus |
| sitemap memuat halaman utama dan berita terbit | Lulus |

### Tautan

| Fitur yang diuji | Status |
|---|---|
| tidak ada tautan internal mati (8 halaman dirayapi) | Lulus |

## Belum bisa diverifikasi di lingkungan ini

Bagian berikut **tidak diuji** dan tidak boleh dianggap sudah terbukti. Verifikasi manual setelah deploy (daftar periksa ada di `docs/DEPLOY-VERCEL.md`).

| Hal | Alasan | Cara memverifikasi |
|---|---|---|
| Tampilan visual dan responsif (desktop, tablet, ponsel), tidak ada overflow horizontal | Tidak ada browser di lingkungan ini. Layout dirancang mobile-first dengan `overflow-x: clip`, grid fluida, dan target sentuh >= 44px, tetapi belum dilihat langsung | Buka di ponsel dan laptop; periksa semua halaman |
| Animasi, parallax, transisi halaman, dan perilaku `prefers-reduced-motion` | Perilaku visual/runtime browser | Lihat langsung; aktifkan "Reduce motion" di OS dan pastikan gerakan berhenti |
| JavaScript sisi klien: pengecilan foto di browser sebelum unggah, uploader multi-foto, dialog konfirmasi hapus, lightbox galeri, menu mobile | Berjalan di browser. Sisi server dari unggah foto sudah diuji penuh (lewat pemanggilan Server Action langsung) | Unggah foto dari ponsel dan laptop; hapus data dan pastikan dialog muncul |
| **Supabase Storage asli** | Tidak ada akses internet ke Supabase. Hanya diuji terhadap mock yang meniru endpoint REST dan memvalidasi header auth | Langkah 5 di `docs/DEPLOY-VERCEL.md`: unggah satu foto dan buka URL-nya |
| **Supabase Postgres asli** (pooler port 6543, SSL, `prepare: false`) | Diuji pada PostgreSQL lokal tanpa SSL | `npm run db:migrate` terhadap Supabase; login admin di situs yang sudah di-deploy |
| Kunci API Supabase format baru (`sb_secret_...`) untuk Storage | Belum dapat diuji. Kode memakai kunci `service_role` format JWT (legacy) | Lihat catatan di `docs/SETUP-SUPABASE.md` |
| Deploy di Vercel (batas body 4,5 MB, region fungsi, variabel lingkungan) | Tidak ada akses Vercel | Ikuti `docs/DEPLOY-VERCEL.md` |
| Skor Lighthouse / Core Web Vitals (LCP, CLS, INP) | Tidak ada browser. Langkah pendukung sudah dilakukan: font self-host, gambar berdimensi/lazy, `priority` pada foto hero, hanya transform/opacity untuk animasi | Jalankan PageSpeed Insights pada URL produksi |
| Pembaca layar dan navigasi keyboard secara nyata | Tidak diuji dengan teknologi bantu. Sudah ada: skip-link, fokus terlihat, ARIA pada menu/dialog, `alt` pada semua gambar (diuji), satu `<h1>` per halaman (diuji) | Coba Tab melalui seluruh halaman; coba VoiceOver/TalkBack/NVDA |
| Perilaku di bawah beban / banyak admin bersamaan | Tidak diuji | Tidak perlu untuk skala pondok; pembatasan login berbasis DB sudah diuji |
| Header `Strict-Transport-Security` dan cookie `Secure` di HTTPS sungguhan | Diuji di http://localhost. Cookie sesi bertanda `Secure` (terbukti di uji), sehingga pada `npm run start` lokal via HTTP sebagian browser (mis. Safari) menolak menyimpannya; untuk uji lokal pakai `npm run dev` | Otomatis benar di domain HTTPS Vercel |
| Content-Security-Policy | **Belum diterapkan** (Next.js memakai skrip inline; CSP ketat perlu nonce). Header keamanan lain sudah aktif | Keterbatasan yang diketahui |

## Catatan keterbatasan lain

- Batas unggah foto efektif **4 MB per foto** (batas body Server Action); browser mengecilkan foto otomatis sebelum dikirim.
- Foto yang diunggah tetapi form berita tidak jadi disimpan akan tertinggal di Storage (tidak tampil di situs). Bisa dibersihkan manual dari dashboard Supabase.
- Zona waktu jadwal tetap **WIB (UTC+7)**.
- Transisi halaman memakai fade ringan (`template.tsx`), bukan View Transitions API.
