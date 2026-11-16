import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import RichText from "@/components/ui/RichText";
import NewsCard from "@/components/site/NewsCard";
import { getNewsBySlug, relatedNews } from "@/lib/queries";
import { fmtDate } from "@/lib/format";
import { publicUrl } from "@/lib/storage";
import { SITE_FULL_NAME, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNewsBySlug(slug);
  if (!n) return { title: "Berita tidak ditemukan" };
  const cover = publicUrl(n.cover_path);
  const desc = n.excerpt || n.body.replace(/\s+/g, " ").slice(0, 160);
  return {
    title: n.title, description: desc, alternates: { canonical: `/berita/${n.slug}` },
    openGraph: { type: "article", title: n.title, description: desc, publishedTime: n.published_at?.toISOString(), ...(cover ? { images: [cover] } : {}) },
  };
}

export default async function BeritaDetail({ params }: Props) {
  const { slug } = await params;
  const n = await getNewsBySlug(slug);
  if (!n) notFound();
  const related = await relatedNews(n.id, 3);
  const cover = publicUrl(n.cover_path);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "NewsArticle", headline: n.title, datePublished: n.published_at?.toISOString(),
    dateModified: n.updated_at.toISOString(), mainEntityOfPage: `${siteUrl()}/berita/${n.slug}`,
    publisher: { "@type": "Organization", name: SITE_FULL_NAME },
    ...(cover ? { image: cover.startsWith("http") ? cover : siteUrl() + cover } : {}),
  };

  return (
    <article className="pt-32 sm:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Container>
        <Link href="/berita" className="link-arrow"><ArrowLeft size={18} aria-hidden /> Semua berita</Link>
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-400">
            {n.category_name && <span className="font-semibold uppercase tracking-wider text-gold-700">{n.category_name}</span>}
            {n.published_at && <time dateTime={n.published_at.toISOString()}>{fmtDate(n.published_at)}</time>}
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl">{n.title}</h1>
          {n.excerpt && <p className="mt-5 text-xl text-ink-600">{n.excerpt}</p>}
        </header>
        {cover && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-media)] bg-sage-100">
            <Photo src={cover} alt={n.cover_alt} sizes="(min-width:1280px) 76rem, 100vw" priority />
          </div>
        )}
        <div className="mt-12"><RichText text={n.body} /></div>
      </Container>
      {related.length > 0 && (
        <section className="mt-24 bg-ivory-100 py-20" aria-labelledby="lainnya">
          <Container>
            <h2 id="lainnya" className="text-3xl">Berita lainnya</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">{related.map((r) => <NewsCard key={r.id} item={r} />)}</div>
          </Container>
        </section>
      )}
    </article>
  );
}
