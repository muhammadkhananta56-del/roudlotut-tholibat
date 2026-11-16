import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/site/PageHero";
import GalleryGrid from "@/components/site/GalleryGrid";
import { listCategories, listPublicGallery, one } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Galeri", description: "Galeri foto kegiatan dan lingkungan Pondok Pesantren Roudlotut Tholibat." };

export default async function GaleriPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const kategori = one((await searchParams).kategori).slice(0, 80);
  const [cats, rows] = await Promise.all([listCategories("gallery"), listPublicGallery(kategori || undefined)]);
  const items = rows.map((g) => ({
    id: g.id, title: g.title, description: g.description, category: g.category_name,
    thumb: publicUrl(g.thumb_path)!, full: publicUrl(g.path)!, w: g.width, h: g.height,
  }));
  const chip = "rounded-full border border-sage-300 px-4 py-1.5 text-sm font-semibold text-forest-900 hover:border-forest-900 aria-[current=true]:border-forest-900 aria-[current=true]:bg-forest-900 aria-[current=true]:text-ivory-50";
  return (
    <>
      <PageHero eyebrow="Galeri" title="Potret kegiatan">Dokumentasi kegiatan santri dan lingkungan pondok.</PageHero>
      <section className="py-16 sm:py-20">
        <Container>
          <nav aria-label="Kategori galeri" className="mb-10 flex flex-wrap gap-2">
            <Link href="/galeri" className={chip} aria-current={!kategori ? "true" : undefined}>Semua</Link>
            {cats.map((c) => <Link key={c.id} href={`/galeri?kategori=${c.slug}`} className={chip} aria-current={kategori === c.slug ? "true" : undefined}>{c.name}</Link>)}
          </nav>
          {items.length === 0 ? <EmptyState title="Belum ada foto">Foto kegiatan akan tampil di sini setelah diunggah.</EmptyState> : <GalleryGrid items={items} />}
        </Container>
      </section>
    </>
  );
}
