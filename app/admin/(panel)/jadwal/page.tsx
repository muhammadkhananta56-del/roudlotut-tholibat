import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import { adminListSchedules, one, toPage } from "@/lib/queries";
import { dayParts, fmtTime } from "@/lib/format";
import { deleteScheduleAction, setScheduleStatusAction } from "@/app/actions/schedule";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import SubmitButton from "@/components/admin/SubmitButton";
import Pagination from "@/components/site/Pagination";
import { AdminEmpty, FilterForm, Flash, PageHeader, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Jadwal pengajian" };

export default async function AdminSchedules({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = one(sp.q).trim().slice(0, 80);
  const status = one(sp.status);
  const page = toPage(sp.page);
  const { rows, total, pages } = await adminListSchedules({ page, q, status });
  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  const tone = { scheduled: "green", done: "gray", cancelled: "red" } as const;
  const label = { scheduled: "Terjadwal", done: "Selesai", cancelled: "Dibatalkan" } as const;
  return (
    <>
      <PageHeader title="Jadwal pengajian" description={`${total} jadwal`}><Link href="/admin/jadwal/baru" className="abtn abtn-primary"><Plus size={16} aria-hidden />Tambah jadwal</Link></PageHeader>
      <Flash ok={one(sp.ok)} />
      <FilterForm q={q} status={status} statuses={[["scheduled", "Terjadwal"], ["done", "Selesai"], ["cancelled", "Dibatalkan"]]} placeholder="Cari nama kegiatan" />
      {rows.length === 0 ? (
        q || status ? <AdminEmpty title="Tidak ada hasil">Coba ubah kata kunci atau filter.</AdminEmpty>
          : <AdminEmpty title="Belum ada jadwal" href="/admin/jadwal/baru" cta="Tambah jadwal pertama">Jadwal yang ditampilkan akan otomatis muncul di halaman publik.</AdminEmpty>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-[0.95rem]">
            <thead className="border-b border-sage-200 text-sm text-ink-400"><tr><th className="p-4 font-semibold">Kegiatan</th><th className="p-4 font-semibold">Waktu</th><th className="p-4 font-semibold">Status</th><th className="p-4 text-right font-semibold">Aksi</th></tr></thead>
            <tbody className="divide-y divide-sage-200">
              {rows.map((s) => {
                const d = dayParts(s.starts_at);
                return (
                  <tr key={s.id}>
                    <td className="p-4"><Link href={`/admin/jadwal/${s.id}`} className="font-semibold text-forest-900 hover:text-emerald-600">{s.title}</Link><p className="text-sm text-ink-400">{[s.speaker, s.location].filter(Boolean).join(" · ")}</p></td>
                    <td className="whitespace-nowrap p-4 text-ink-600">{d.weekday}, {d.day} {d.month} {d.year}<br />{fmtTime(s.starts_at)} WIB</td>
                    <td className="p-4"><div className="flex flex-col items-start gap-1"><StatusBadge tone={tone[s.status]}>{label[s.status]}</StatusBadge>{!s.is_published && <StatusBadge tone="gray">Disembunyikan</StatusBadge>}</div></td>
                    <td className="p-4"><div className="flex flex-wrap justify-end gap-2">
                      <Link href={`/admin/jadwal/${s.id}`} className="abtn abtn-outline px-3" aria-label={`Edit: ${s.title}`}><Pencil size={16} aria-hidden /></Link>
                      {s.status !== "done" && <form action={setScheduleStatusAction}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="status" value="done" /><SubmitButton className="abtn abtn-outline" pendingText="…">Selesai</SubmitButton></form>}
                      {s.status !== "cancelled" && <form action={setScheduleStatusAction}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="status" value="cancelled" /><SubmitButton className="abtn abtn-outline" pendingText="…">Batalkan</SubmitButton></form>}
                      {s.status !== "scheduled" && <form action={setScheduleStatusAction}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="status" value="scheduled" /><SubmitButton className="abtn abtn-outline" pendingText="…">Jadwalkan lagi</SubmitButton></form>}
                      <ConfirmDelete action={deleteScheduleAction} id={s.id} title={s.title} message="Jadwal ini akan dihapus permanen." iconOnly />
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={pages} basePath="/admin/jadwal" params={params} />
    </>
  );
}
