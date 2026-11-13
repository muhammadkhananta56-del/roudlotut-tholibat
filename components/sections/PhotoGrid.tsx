import Link from "next/link";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import type { GalleryItem } from "@/lib/data/galeri";

/** Kisi foto ringkas untuk Beranda. Setiap foto membuka halaman Galeri. */
export default function PhotoGrid({ items }: { items: GalleryItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
      {items.map((item) => (
        <li key={item.id}>
          <Link href="/galeri" className="group block overflow-hidden rounded-card" aria-label={`Buka galeri: ${item.caption}`}>
            <PhotoPlaceholder
              src={item.src}
              alt={item.alt}
              className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
