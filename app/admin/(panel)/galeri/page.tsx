import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import { listCategories, listPublicGallery, one } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import { deleteGalleryAction, moveGalleryAction } from "@/app/actions/gallery";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { AdminEmpty, Flash, PageHeader, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Galeri" };

export default async function AdminGallery({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const kategori = one(sp.kategori);
  const [cats, rows] = await Promise.all([listCategories("gallery"), listPublicGallery(kategori || undefined)]);
  const all = kategori ? null : rows;
  return (
    <>
      <PageHeader title="Galeri" description="Unggah foto kegiatan. Urutan di sini adalah urutan tampil di website." />
      <Flash ok={one(sp.ok)} />
      <GalleryUploader categories={cats.map((c) => ({ id: c.id, name: c.name }))} />
      <form className="my-6 flex items-center gap-3" role="search">
        <label htmlFor="kategori" className="font-semibold text-forest-900">Kategori</label>
        <select id="kategori" name="kategori" defaultValue={kategori} className="field w-auto"><option value="">Semua</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
        <button type="submit" className="abtn abtn-outline">Terapkan</button>
      </form>
      {rows.length === 0 ? <AdminEmpty title="Belum ada foto">Pilih foto di atas untuk mulai mengisi galeri.</AdminEmpty> : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((g, i) => (
            <li key={g.id} className="panel overflow-hidden">
              <div className="relative aspect-[4/3] bg-sage-100"><Image src={publicUrl(g.thumb_path)!} alt={g.title || "Foto galeri"} fill unoptimized sizes="24rem" className="object-cover" loading="lazy" /></div>
              <div className="space-y-3 p-4">
                <div><p className="font-semibold text-forest-900">{g.title || <span className="text-ink-400">(tanpa judul)</span>}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">{g.category_name && <StatusBadge tone="gray">{g.category_name}</StatusBadge>}{g.show_on_home && <StatusBadge tone="gold">Di beranda</StatusBadge>}</div></div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/galeri/${g.id}`} className="abtn abtn-outline"><Pencil size={16} aria-hidden />Edit</Link>
                  {all && (<>
                    <form action={moveGalleryAction}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="dir" value="up" /><button type="submit" disabled={i === 0} className="abtn abtn-outline px-3 disabled:opacity-40" aria-label={`Naikkan urutan: ${g.title || "foto"}`}><ArrowUp size={16} aria-hidden /></button></form>
                    <form action={moveGalleryAction}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="dir" value="down" /><button type="submit" disabled={i === all.length - 1} className="abtn abtn-outline px-3 disabled:opacity-40" aria-label={`Turunkan urutan: ${g.title || "foto"}`}><ArrowDown size={16} aria-hidden /></button></form>
                  </>)}
                  <ConfirmDelete action={deleteGalleryAction} id={g.id} title={g.title || "foto ini"} message="Foto akan dihapus permanen dari galeri dan penyimpanan." iconOnly />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {kategori && <p className="hint mt-4">Pengurutan hanya tersedia saat memilih &ldquo;Semua&rdquo; kategori.</p>}
    </>
  );
}
