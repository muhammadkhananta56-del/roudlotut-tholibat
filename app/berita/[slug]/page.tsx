import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import NewsCard from "@/components/ui/NewsCard";
import { news, newsCategories, sortedNews } from "@/lib/data/berita";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) return { title: "Berita" };
  return buildMetadata({ title: item.title, description: item.excerpt, path: `/berita/${slug}` });
}

export default async function BeritaDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();

  const category = newsCategories.find((c) => c.slug === item.category)?.name;
  const related = sortedNews()
    .filter((n) => n.slug !== slug && n.category === item.category)
    .slice(0, 3);
  const shareText = `${item.title} ${siteConfig.url.replace(/\/$/, "")}/berita/${slug}`;

  return (
    <>
      <PageHero title={item.title} crumbs={[{ label: "Berita", href: "/berita" }, { label: item.title }]} />
      <PageBody>
        <Container className="space-y-14 pb-20">
          <article className="mx-auto max-w-[70ch] space-y-6">
            <p className="text-sm text-ink-500">
              {item.author}, <time dateTime={item.date}>{formatDate(item.date)}</time>
              {category ? `, ${category}` : ""}
            </p>
            {item.cover && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-cream-100">
                <Image src={item.cover} alt={item.coverAlt ?? item.title} fill priority sizes="(min-width: 768px) 70ch, 100vw" className="object-cover" />
              </div>
            )}
            <div className="space-y-5 text-lg">
              {item.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-button border border-brand-700 px-6 font-semibold text-brand-700 transition hover:bg-brand-700 hover:text-white"
            >
              Bagikan lewat WhatsApp
            </a>
          </article>
          {related.length > 0 && (
            <section aria-labelledby="terkait" className="space-y-6">
              <h2 id="terkait" className="text-2xl font-bold text-brand-900">
                Berita terkait
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <NewsCard key={n.slug} item={n} />
                ))}
              </div>
            </section>
          )}
          <Link href="/berita" className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline underline-offset-4">
            Kembali ke daftar berita
          </Link>
        </Container>
      </PageBody>
    </>
  );
}
