export const profileContent: Record<
  string,
  { title: string; placeholder: string; needs: string[] }
> = {
  sejarah: {
    title: "Sejarah Pondok Pesantren",
    placeholder: "[SEJARAH LEMBAGA]",
    needs: ["Tahun berdiri", "Nama pendiri", "Perjalanan singkat pondok"],
  },
  "visi-misi": {
    title: "Visi dan Misi",
    placeholder: "[VISI DAN MISI]",
    needs: ["Teks visi", "Daftar misi"],
  },
  pengasuh: {
    title: "Profil dan Sambutan Pengasuh",
    placeholder: "[NAMA PENGASUH]",
    needs: ["Nama lengkap dan gelar", "Foto resmi", "Riwayat singkat", "Teks sambutan"],
  },
  "struktur-organisasi": {
    title: "Struktur Organisasi",
    placeholder: "[STRUKTUR ORGANISASI]",
    needs: ["Nama dan jabatan pengurus", "Foto (opsional)"],
  },
  identitas: {
    title: "Identitas dan Informasi Lembaga",
    placeholder: "[IDENTITAS LEMBAGA]",
    needs: ["Nama resmi yayasan", "Alamat lengkap", "Legalitas / nomor izin (bila ada)"],
  },
  fasilitas: {
    title: "Fasilitas Pondok",
    placeholder: "[DAFTAR FASILITAS]",
    needs: ["Daftar fasilitas", "Foto tiap fasilitas"],
  },
};

export const programSections = [
  { key: "deskripsi", title: "Deskripsi", placeholder: "[DESKRIPSI PROGRAM]" },
  { key: "tujuan", title: "Tujuan", placeholder: "[TUJUAN PROGRAM]" },
  { key: "materi", title: "Materi dan Kegiatan", placeholder: "[MATERI / KEGIATAN]" },
  { key: "metode", title: "Metode Pembelajaran", placeholder: "[METODE PEMBELAJARAN]" },
];