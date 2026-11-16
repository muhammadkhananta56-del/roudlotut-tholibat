import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/motion/Reveal";
import PageHero from "@/components/site/PageHero";
import NewsCard from "@/components/site/NewsCard";
import Pagination from "@/components/site/Pagination";
import { listCategories, listPublicNews, one, toPage } from "@/lib/queries";

export const metadata: Metadata = { title: "Berita", description: "Berita dan artikel dari Pondok Pesantren Roudlotut Tholibat." };

export default async function BeritaPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const page = toPage(sp.page);
  const kategori = one(sp.kategori).slice(0, 80);
  const q = one(sp.q).trim().slice(0, 80);
  const [cats, data] = await Promise.all([listCategories("news"), listPublicNews({ page, categorySlug: kategori || undefined, q: q || undefined })]);
  const params: Record<string, string> = {};
  if (kategori) params.kategori = kategori;
  if (q) params.q = q;

  return (
    <>
      <PageHero eyebrow="Berita" title="Kabar dari pondok">Pengumuman, kegiatan, dan tulisan terbaru.</PageHero>
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <nav aria-label="Kategori berita" className="flex flex-wrap gap-2">
              <Link href={q ? `/berita?q=${encodeURIComponent(q)}` : "/berita"} aria-current={!kategori ? "true" : undefined}
                className="rounded-full border border-sage-300 px-4 py-1.5 text-sm font-semibold text-forest-900 hover:border-forest-900 aria-[current=true]:border-forest-900 aria-[current=true]:bg-forest-900 aria-[current=true]:text-ivory-50">Semua</Link>
              {cats.map((c) => (
                <Link key={c.id} href={`/berita?kategori=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={kategori === c.slug ? "true" : undefined}
                  className="rounded-full border border-sage-300 px-4 py-1.5 text-sm font-semibold text-forest-900 hover:border-forest-900 aria-[current=true]:border-forest-900 aria-[current=true]:bg-forest-900 aria-[current=true]:text-ivory-50">{c.name}</Link>
              ))}
            </nav>
            <form action="/berita" role="search" className="flex gap-2">
              {kategori && <input type="hidden" name="kategori" value={kategori} />}
              <label className="sr-only" htmlFor="cari">Cari berita</label>
              <input id="cari" name="q" defaultValue={q} placeholder="Cari berita" className="field w-full md:w-64" maxLength={80} />
              <button type="submit" className="btn btn-primary min-h-0 px-5">Cari</button>
            </form>
          </div>

          {data.rows.length === 0 ? (
            <div className="mt-14"><EmptyState title={q || kategori ? "Berita tidak ditemukan" : "Belum ada berita"}>{q || kategori ? "Coba kata kunci atau kategori lain." : "Berita terbaru akan tampil di sini setelah diterbitkan."}</EmptyState></div>
          ) : (
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {data.rows.map((n, i) => <Reveal key={n.id} delay={(i % 3) * 80}><NewsCard item={n} /></Reveal>)}
            </div>
          )}
          <Pagination page={page} pages={data.pages} basePath="/berita" params={params} />
        </Container>
      </section>
    </>
  );
}
