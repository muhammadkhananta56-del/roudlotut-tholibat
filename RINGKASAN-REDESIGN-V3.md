# Ringkasan Redesign v3

## Perubahan
- **Beranda**: hero dengan CTA "Daftar santri baru" dan daftar program; **Program Pendidikan** kini section gelap yang menonjol tepat setelah hero (kartu berbingkai mihrab, ikon, hover halus, muncul bertahap); bagian **Keunggulan** dari data Nilai; **Kehidupan santri** (galeri bento dengan keterangan foto); banner CTA **Pendaftaran**; Jadwal, Berita, Kontak dipertahankan.
- **Halaman baru /pendaftaran**: status, keterangan, alur bernomor, persyaratan, program, kartu kontak (WhatsApp dengan pesan awal). Tanpa data terisi, tidak ada informasi yang dikarang. Masuk sitemap dan nav.
- **Navbar**: tombol "Daftar santri baru" (layar >= 1280px), tautan Pendaftaran di layar 1024-1279px, tombol yang sama di menu HP.
- **Footer**: 4 kolom (identitas + CTA, Program, Jelajahi, Hubungi), tautan lebih besar untuk sentuhan.
- **Galeri**: keterangan foto selalu terlihat di layar sentuh, bayangan lembut.
- **Tipografi**: label bagian tidak lagi huruf kapital semua.
- **Admin**: grup baru "Pendaftaran" di Pengaturan Situs. Auth, database, Supabase, routing lain tidak diubah.
- Layout siap foto: hero, galeri, dan pengasuh membaca dari Supabase Storage; bila kosong, bagian foto tidak ditampilkan (bukan gambar acak).

## Pengujian (dijalankan)
- typecheck lulus, lint lulus, build produksi lulus.
- Suite end-to-end bawaan terhadap server produksi + PostgreSQL 16 lokal: 117 lulus, 0 gagal.
- Dua tes diperbarui (halaman /pendaftaran ditambah; judul bagian galeri beranda diganti).

## Belum diuji
- Browser nyata (mobile/tablet/desktop) tidak tersedia di lingkungan ini. Tampilan visual, hamburger, overflow, dan animasi belum dilihat langsung; hanya lewat render HTML server dan pembacaan kode. Mohon cek di HP dan laptop setelah deploy.
- Foto asli tidak ada di ZIP (dikelola lewat Supabase).

## Perbaikan v4 (crash beranda di produksi)
- Log Vercel menunjukkan `RangeError: Invalid time value` di `ScheduleRow` yang menjatuhkan beranda, disusul "Task timed out after 300 seconds".
- Fungsi format tanggal (`lib/format.ts`) kini aman terhadap nilai kosong/tidak valid; baris jadwal dengan tanggal rusak dilewati, bukan menjatuhkan halaman.
- Query beranda dan pengaturan (`lib/safe.ts`) dibatasi 8 detik; bila gagal/lambat, halaman tetap tampil dengan data yang ada (galat dicatat di Vercel Logs).
- Diuji: typecheck, lint, build, 117 tes e2e lulus; beranda tetap 200 saat database dimatikan.
