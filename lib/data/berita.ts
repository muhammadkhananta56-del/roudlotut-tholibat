export type NewsCategory = { slug: string; name: string };

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  /** Format YYYY-MM-DD */
  date: string;
  /** Slug dari newsCategories */
  category: string;
  author: string;
  /** Path foto di public/ */
  cover?: string;
  coverAlt?: string;
  /** Satu elemen satu paragraf (teks biasa, bukan HTML) */
  body: string[];
};

export const newsCategories: NewsCategory[] = [
  { slug: "pengumuman", name: "Pengumuman" },
  { slug: "kegiatan", name: "Kegiatan" },
  { slug: "pendidikan", name: "Pendidikan" },
  { slug: "ppdb", name: "Pendaftaran" },
];

// Isi daftar ini dengan berita asli. Kosong = halaman menampilkan keadaan kosong.
export const news: NewsItem[] = [];

export function sortedNews(): NewsItem[] {
  return [...news].sort((a, b) => (a.date < b.date ? 1 : -1));
}
