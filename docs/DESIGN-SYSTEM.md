# Sistem Desain: Modern Islamic Editorial, Elegant Green Heritage

Sumber kebenaran: token di `app/globals.css` (`@theme`). Catatan jujur: arah ini disusun dari brief Anda; **tidak ada riset
visual langsung ke Awwwards/Behance/Dribbble** yang dilakukan, dan tidak ada desain situs lain yang disalin.

## Warna (fungsi, bukan dekorasi)

| Token | Hex | Dipakai untuk |
|---|---|---|
| forest-950 / 900 / 800 | `#0a2a20` / `#0f3b2e` / `#14503d` | Hero, footer, band kontak, judul, tombol utama |
| emerald-600 / 500 | `#1d7a57` / `#2a9168` | Tautan, hover, fokus, elemen interaktif |
| sage-300 / 200 / 100 / 50 | `#b7cbb8` ... `#f1f5ee` | Garis pemisah, latar seksi lembut, badge |
| ivory-50 | `#fcf9f1` | Latar utama |
| ivory-100 / 200 | `#f6f1e3` / `#ece4cd` | Variasi latar seksi |
| gold-700 / 500 / 300 | `#7a5f26` / `#b0914a` / `#d2bd86` | **Sangat terbatas**: label kecil, angka, garis tipis, satu aksen per layar. Tidak pernah sebagai latar kartu |
| ink-900 / 600 / 400 | `#1c2420` / `#46504b` / `#66706a` | Teks isi / sekunder / keterangan kecil |

Semua pasangan teks-latar diukur >= 4,5:1 (lihat `docs/LAPORAN-PENGUJIAN.md`). Tanpa hijau neon. Gradasi hanya di dua tempat kecil: scrim judul pada foto galeri dan latar ornamen hero bila foto belum ada.

## Tipografi

- **Playfair Display** (judul, editorial) dan **Plus Jakarta Sans** (isi). Amiri hanya untuk teks Arab (basmalah).
- Skala judul: `text-3xl` sampai `text-7xl` responsif; isi 17px, `line-height` 1,7; kolom baca maks. 65 karakter; label `eyebrow` huruf besar berspasi lebar.

## Ruang, bentuk, komponen

- Skala 4px; seksi `py-24/28`; kontainer maks. 76rem.
- Sudut: tombol 6px, media 14px, hero berbentuk **lengkung (arch)**, rujukan arsitektur masjid. Kartu dihindari: berita memakai gambar + teks tanpa bingkai, program/jadwal/nilai berupa **baris editorial bergaris**, bukan kartu berwarna.
- Motif **bintang khatam** (delapan titik) dipakai sebagai logo cadangan, pemisah, dan tekstur latar sangat halus; tidak dipakai sebagai pengisi ruang kosong.
- Setiap seksi di Beranda memakai pola tata letak berbeda: hero terbelah + lengkung, editorial 5/7, baris bernomor dengan judul menempel, baris tanggal, 1 besar + 2 kecil, mosaik asimetris, band penutup.

## Gerak

Prinsip: gerak memperkuat isi, bukan bersaing dengannya. Hanya `transform`/`opacity`/`clip-path`.

| Efek | Tempat | Catatan |
|---|---|---|
| Fade-up, staggered, wipe (clip-path) | Seksi, kartu, foto galeri | Muncul sekali saat masuk layar |
| Parallax halus (maks. ±20px) | Foto hero | Aktif hanya saat terlihat; mati saat reduce-motion |
| Bintang berputar pelan dan hero bergeser saat scroll | Hero | Terikat progres scroll, `rAF` |
| Header: transparan di hero, solid + blur saat scroll | Semua halaman | |
| Transisi halaman (fade 450ms) | `template.tsx` | |
| Zoom foto saat hover | Galeri, berita | |

`prefers-reduced-motion: reduce` mematikan seluruh animasi dan transformasi. Tidak ada pop-up, tidak ada loading screen, tidak ada efek 3D.

## Perlakuan gambar

Rasio konsisten (16:10 berita, 3:4 lengkung hero, mosaik beranda), `object-cover`, dimensi eksplisit (cegah CLS), `lazy` kecuali hero (`priority`).
Diproses saat unggah: maks. 1800px, WebP, tanpa EXIF. Tanpa foto, tampil ornamen, bukan foto stok atau AI.
