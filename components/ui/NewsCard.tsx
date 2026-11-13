import Link from "next/link";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { newsCategories, type NewsItem } from "@/lib/data/berita";
import { formatDate } from "@/lib/format";

export default function NewsCard({ item }: { item: NewsItem }) {
  const category = newsCategories.find((c) => c.slug === item.category)?.name;
  return (
    <article className="group relative flex flex-col gap-4">
      <PhotoPlaceholder
        src={item.cover}
        alt={item.coverAlt ?? ""}
        label="Foto berita belum tersedia"
        className="aspect-[16/10] w-full"
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="space-y-2">
        <p className="text-sm text-ink-500">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          {category ? `, ${category}` : ""}
        </p>
        <h3 className="text-xl font-bold text-brand-900">
          <Link
            href={`/berita/${item.slug}`}
            className="decoration-gold-400 decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:underline"
          >
            {item.title}
          </Link>
        </h3>
        <p className="text-ink-500">{item.excerpt}</p>
      </div>
    </article>
  );
}
