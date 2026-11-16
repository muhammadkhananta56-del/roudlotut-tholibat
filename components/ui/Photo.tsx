import Image from "next/image";

/**
 * Foto dari penyimpanan. Berkas sudah dikecilkan dan dijadikan WebP saat diunggah,
 * jadi optimizer Next dilewati (hemat kuota hosting). Pembungkus harus `relative` dengan rasio tertentu.
 */
export default function Photo({
  src, alt, sizes, priority = false, className = "",
}: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  return <Image src={src} alt={alt} fill unoptimized sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}
