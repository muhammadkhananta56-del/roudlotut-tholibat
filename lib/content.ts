// Penanda isi yang menunggu data resmi dari pihak pondok.
// Ganti dengan teks asli bila sudah ada. Panduannya ada di ISI-KONTEN.md.

export const profileContent: Record<
  string,
  { title: string; description: string; placeholder: string; needs: string[] }
> = {
  sejarah: {
    title: "Sejarah Pondok Pesantren",
    description: "Perjalanan pondok sejak berdiri sampai hari ini.",
    placeholder: "[SEJARAH LEMBAGA]",
    needs: ["Tahun berdiri", "Nama pendiri", "Perjalanan singkat pondok"],
  },
  "visi-misi": {
    title: "Visi dan Misi",
    description: "Arah dan tujuan pendidikan di pondok.",
    placeholder: "[VISI DAN MISI]",
    needs: ["Teks visi", "Daftar misi"],
  },
  pengasuh: {
    title: "Profil dan Sambutan Pengasuh",
    description: "Mengenal pengasuh dan membaca sambutannya.",
    placeholder: "[NAMA PENGASUH]",
    needs: ["Nama lengkap dan gelar", "Foto resmi", "Riwayat singkat", "Teks sambutan"],
  },
  "struktur-organisasi": {
    title: "Struktur Organisasi",
    description: "Pengurus dan pengajar yang menjalankan pondok.",
    placeholder: "[STRUKTUR ORGANISASI]",
    needs: ["Nama dan jabatan pengurus", "Foto (opsional)"],
  },
  identitas: {
    title: "Identitas dan Informasi Lembaga",
    description: "Data resmi lembaga.",
    placeholder: "[IDENTITAS LEMBAGA]",
    needs: ["Nama resmi yayasan", "Alamat lengkap", "Legalitas atau nomor izin (bila ada)"],
  },
  fasilitas: {
    title: "Fasilitas Pondok",
    description: "Sarana yang digunakan santri sehari-hari.",
    placeholder: "[DAFTAR FASILITAS]",
    needs: ["Daftar fasilitas", "Foto tiap fasilitas"],
  },
};

export const programSections = [
  { key: "deskripsi", title: "Deskripsi", placeholder: "[DESKRIPSI PROGRAM]" },
  { key: "tujuan", title: "Tujuan", placeholder: "[TUJUAN PROGRAM]" },
  { key: "materi", title: "Materi dan Kegiatan", placeholder: "[MATERI DAN KEGIATAN]" },
  { key: "metode", title: "Metode Pembelajaran", placeholder: "[METODE PEMBELAJARAN]" },
];

export const aboutSummary = ""; // Ringkasan profil untuk Beranda. Kosong = tampil penanda.
export const caretakerGreeting = ""; // Sambutan pengasuh untuk Beranda.
export const caretakerName = ""; // Nama pengasuh.

// Syarat dan alur pendaftaran. Kosong = tampil penanda, bukan karangan.
export const ppdbRequirements: string[] = [];
export const ppdbFlow: { title: string; detail: string }[] = [];
export const ppdbSchedule = "";
export const ppdbFee = "";
