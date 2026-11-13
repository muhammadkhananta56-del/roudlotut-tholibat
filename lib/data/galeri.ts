export type GalleryItem = {
  id: string;
  /** Path foto di public/, contoh "/foto/khataman-2024-01.jpg" */
  src: string;
  alt: string;
  caption: string;
  /** Format YYYY-MM-DD */
  date: string;
  /** Slug dari activityCategories */
  category: string;
};

export type VideoItem = {
  id: string;
  title: string;
  /** Tautan video (YouTube, Instagram, dan sebagainya) */
  url: string;
  date: string;
};

// Isi dengan dokumentasi asli. Kosong = halaman menampilkan keadaan kosong.
export const galleryItems: GalleryItem[] = [];
export const videos: VideoItem[] = [];

export function sortedGallery(): GalleryItem[] {
  return [...galleryItems].sort((a, b) => (a.date < b.date ? 1 : -1));
}
