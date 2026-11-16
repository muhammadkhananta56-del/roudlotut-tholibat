import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import { adminListNews, one, toPage } from "@/lib/queries";
import { fmtDateShort } from "@/lib/format";
import { deleteNewsAction, toggleNewsStatusAction } from "@/app/actions/news";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import SubmitButton from "@/components/admin/SubmitButton";
import Pagination from "@/components/site/Pagination";
import { AdminEmpty, FilterForm, Flash, PageHeader, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Berita" };

export default async function AdminNewsList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = one(sp.q).trim().slice(0, 80);
  const status = one(sp.status);
  const page = toPage(sp.page);
  const { rows, total, pages } = await adminListNews({ page, q, status });
  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  return (
    <>
      <PageHeader title="Berita" description={`${total} berita`}><Link href="/admin/berita/baru" className="abtn abtn-primary"><Plus size={16} aria-hidden />Tulis berita</Link></PageHeader>
      <Flash ok={one(sp.ok)} />
      <FilterForm q={q} status={status} statuses={[["published", "Terbit"], ["draft", "Draft"]]} placeholder="Cari judul berita" />
      {rows.length === 0 ? (
        q || status ? <AdminEmpty title="Tidak ada hasil">Coba ubah kata kunci atau filter.</AdminEmpty>
          : <AdminEmpty title="Belum ada berita" href="/admin/berita/baru" cta="Tulis berita pertama">Berita yang diterbitkan akan langsung tampil di website.</AdminEmpty>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="border-b border-sage-200 text-sm text-ink-400"><tr><th className="p-4 font-semibold">Judul</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold">Tanggal</th><th className="p-4 text-right font-semibold">Aksi</th></tr></thead>
            <tbody className="divide-y divide-sage-200">
              {rows.map((n) => (
                <tr key={n.id}>
                  <td className="p-4"><Link href={`/admin/berita/${n.id}`} className="font-semibold text-forest-900 hover:text-emerald-600">{n.title}</Link>{n.category_name && <p className="text-sm text-ink-400">{n.category_name}</p>}</td>
                  <td className="p-4"><StatusBadge tone={n.status === "published" ? (n.published_at && n.published_at > new Date() ? "gold" : "green") : "gray"}>{n.status === "published" ? (n.published_at && n.published_at > new Date() ? "Terjadwal tayang" : "Terbit") : "Draft"}</StatusBadge></td>
                  <td className="whitespace-nowrap p-4 text-ink-600">{fmtDateShort(n.published_at ?? n.updated_at)}</td>
                  <td className="p-4"><div className="flex justify-end gap-2">
                    <Link href={`/admin/berita/${n.id}`} className="abtn abtn-outline px-3" aria-label={`Edit: ${n.title}`}><Pencil size={16} aria-hidden /></Link>
                    <form action={toggleNewsStatusAction}><input type="hidden" name="id" value={n.id} /><SubmitButton className="abtn abtn-outline" pendingText="…">{n.status === "published" ? "Tarik" : "Terbitkan"}</SubmitButton></form>
                    <ConfirmDelete action={deleteNewsAction} id={n.id} title={n.title} message="Berita dan gambar sampulnya akan dihapus permanen." iconOnly />
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={pages} basePath="/admin/berita" params={params} />
    </>
  );
}
