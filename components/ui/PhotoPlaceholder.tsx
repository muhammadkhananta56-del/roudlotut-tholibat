import Image from "next/image";
import StarMotif from "@/components/motif/StarMotif";

/**
 * Slot foto. Bila `src` diisi, menampilkan foto asli (file di folder public/).
 * Bila kosong, menampilkan penanda berpola, bukan foto stok, supaya tidak ada
 * gambar yang seolah-olah menggambarkan pondok padahal bukan.
 */
export default function PhotoPlaceholder({
  src,
  alt = "",
  label = "Foto belum tersedia",
  shape = "card",
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  src?: string;
  alt?: string;
  label?: string;
  shape?: "card" | "arch";
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const radius = shape === "arch" ? "rounded-t-[999px] rounded-b-[16px]" : "rounded-card";

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-brand-700 ${radius} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={`pattern-light relative flex items-end justify-center overflow-hidden bg-brand-700 ${radius} ${className}`}
    >
      <StarMotif className="absolute left-1/2 top-[42%] w-3/5 max-w-64 -translate-x-1/2 -translate-y-1/2 text-gold-400/35" strokeWidth={0.8} />
      <span className="relative mb-5 px-4 text-center text-sm font-medium text-white">
        {label}
      </span>
    </div>
  );
}
