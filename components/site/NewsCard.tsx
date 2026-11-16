import Link from "next/link";
import Photo from "@/components/ui/Photo";
import StarMotif from "@/components/ui/StarMotif";
import { fmtDate } from "@/lib/format";
import { publicUrl } from "@/lib/storage";
import type { NewsRow } from "@/lib/queries";

export default function NewsCard({ item, featured = false }: { item: NewsRow; featured?: boolean }) {
  const cover = publicUrl(item.cover_path);
  return (
    <article className="group transition-transform duration-500 hover:-translate-y-1">
      <Link href={`/berita/${item.slug}`} className="block">
        <div className={`zoom-hover relative overflow-hidden rounded-[var(--radius-media)] bg-sage-100 ${featured ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[16/10]"}`}>
          {cover ? (
            <Photo src={cover} alt={item.cover_alt} sizes={featured ? "(min-width:768px) 60vw, 100vw" : "(min-width:768px) 30vw, 100vw"} />
          ) : (
            <div className="flex h-full items-center justify-center text-sage-300"><StarMotif className="h-16 w-16" strokeWidth={1} /></div>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3 text-sm text-ink-400">
          {item.category_name && <span className="font-semibold uppercase tracking-wider text-gold-700">{item.category_name}</span>}
          {item.published_at && <time dateTime={new Date(item.published_at).toISOString()}>{fmtDate(item.published_at)}</time>}
        </div>
        <h3 className={`mt-2 transition-colors group-hover:text-emerald-600 ${featured ? "text-3xl sm:text-[2rem]" : "text-xl"}`}>{item.title}</h3>
        {item.excerpt && <p className={`mt-2 text-ink-600 ${featured ? "" : "line-clamp-3 text-base"}`}>{item.excerpt}</p>}
      </Link>
    </article>
  );
}
