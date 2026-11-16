import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetNews } from "@/lib/queries";
import { fmtDate } from "@/lib/format";
import { publicUrl } from "@/lib/storage";
import Photo from "@/components/ui/Photo";
import RichText from "@/components/ui/RichText";

export const metadata = { title: "Pratinjau berita" };

export default async function Preview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const n = await adminGetNews((await params).id);
  if (!n) notFound();
  const cover = publicUrl(n.cover_path);
  const live = n.status === "published" && n.published_at && n.published_at <= new Date();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ivory-50">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-gold-700 px-4 py-2 text-sm font-semibold text-ivory-50">
        <span>PRATINJAU. {live ? "Berita ini sudah tayang." : n.status === "draft" ? "Berita ini masih draft dan belum tampil di website." : "Berita ini dijadwalkan tayang nanti."}</span>
        <span className="flex gap-4"><Link href={`/admin/berita/${n.id}`} className="underline">Kembali mengedit</Link>{live && <Link href={`/berita/${n.slug}`} className="underline" target="_blank">Buka halaman publik</Link>}</span>
      </div>
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap gap-3 text-sm text-ink-400">{n.category_name && <span className="font-semibold uppercase tracking-wider text-gold-700">{n.category_name}</span>}{n.published_at && <time>{fmtDate(n.published_at)}</time>}</div>
        <h1 className="mt-3 text-4xl sm:text-5xl">{n.title}</h1>
        {n.excerpt && <p className="mt-5 text-xl text-ink-600">{n.excerpt}</p>}
        {cover && <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-media)]"><Photo src={cover} alt={n.cover_alt} sizes="56rem" priority /></div>}
        <div className="mt-10"><RichText text={n.body} /></div>
      </article>
    </div>
  );
}
