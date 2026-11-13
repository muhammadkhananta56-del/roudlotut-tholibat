export type ActivityCategory = { slug: string; name: string };

export type Activity = {
  slug: string;
  title: string;
  /** Slug dari activityCategories */
  category: string;
  /** Format YYYY-MM-DD */
  date: string;
  location?: string;
  /** Paragraf deskripsi, satu elemen satu paragraf */
  body: string[];
  /** Path foto di public/, contoh "/foto/khataman-2024.jpg" */
  cover?: string;
  coverAlt?: string;
};

export const activityCategories: ActivityCategory[] = [
  { slug: "harian", name: "Kegiatan Harian" },
  { slug: "keagamaan", name: "Kegiatan Keagamaan" },
  { slug: "pendidikan", name: "Kegiatan Pendidikan" },
  { slug: "khataman", name: "Khataman" },
  { slug: "tahunan", name: "Kegiatan Tahunan" },
  { slug: "santri", name: "Kegiatan Santri" },
  { slug: "sosial", name: "Kegiatan Sosial" },
];

// Isi daftar ini dengan kegiatan asli. Kosong = halaman menampilkan keadaan kosong.
export const activities: Activity[] = [];
