import Link from "next/link";
import { CalendarDays, Images, Newspaper, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import { dashboardData } from "@/lib/queries";
import { fmtDateShort, fmtTime } from "@/lib/format";
import { PageHeader, StatusBadge } from "@/components/admin/ui";

export default async function Dashboard() {
  const admin = await requireAdmin();
  const { counts: c, latest, next, activity } = await dashboardData();
  const stats = [
    { label: "Berita", value: c.news_total, sub: `${c.news_published} terbit, ${c.news_draft} draft`, href: "/admin/berita", icon: Newspaper },
    { label: "Jadwal pengajian", value: c.sched_total, sub: `${c.sched_upcoming} akan datang`, href: "/admin/jadwal", icon: CalendarDays },
    { label: "Foto galeri", value: c.gallery_total, sub: "di seluruh kategori", href: "/admin/galeri", icon: Images },
  ];
  return (
    <>
      <PageHeader title={`Assalamu'alaikum, ${admin.name}`} description="Ringkasan konten website.">
        <Link href="/admin/berita/baru" className="abtn abtn-primary"><Plus size={16} aria-hidden />Tulis berita</Link>
        <Link href="/admin/jadwal/baru" className="abtn abtn-outline"><Plus size={16} aria-hidden />Tambah jadwal</Link>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, sub, href, icon: Icon }) => (
          <Link key={label} href={href} className="panel group p-5 transition-colors hover:border-emerald-500">
            <div className="flex items-center justify-between text-ink-600"><span className="font-semibold">{label}</span><Icon size={20} className="text-gold-700" aria-hidden /></div>
            <p className="mt-2 font-display text-4xl text-forest-900">{value}</p>
            <p className="text-sm text-ink-400">{sub}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-5" aria-labelledby="h-berita">
          <h2 id="h-berita" className="text-xl">Berita terbaru</h2>
          {latest.length === 0 ? <p className="mt-3 text-ink-600">Belum ada berita.</p> : (
            <ul className="mt-3 divide-y divide-sage-200">
              {latest.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/admin/berita/${n.id}`} className="font-medium text-forest-900 hover:text-emerald-600">{n.title}</Link>
                  <StatusBadge tone={n.status === "published" ? "green" : "gray"}>{n.status === "published" ? "Terbit" : "Draft"}</StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel p-5" aria-labelledby="h-jadwal">
          <h2 id="h-jadwal" className="text-xl">Pengajian berikutnya</h2>
          {next.length === 0 ? <p className="mt-3 text-ink-600">Tidak ada jadwal mendatang.</p> : (
            <ul className="mt-3 divide-y divide-sage-200">
              {next.map((s) => (
                <li key={s.id} className="py-3"><Link href={`/admin/jadwal/${s.id}`} className="font-medium text-forest-900 hover:text-emerald-600">{s.title}</Link><p className="text-sm text-ink-400">{fmtDateShort(s.starts_at)}, {fmtTime(s.starts_at)} WIB</p></li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel p-5 lg:col-span-2" aria-labelledby="h-aktivitas">
          <h2 id="h-aktivitas" className="text-xl">Aktivitas pengelolaan</h2>
          {activity.length === 0 ? <p className="mt-3 text-ink-600">Belum ada aktivitas.</p> : (
            <ul className="mt-3 divide-y divide-sage-200 text-[0.95rem]">
              {activity.map((a) => (
                <li key={a.id} className="flex flex-wrap justify-between gap-2 py-2.5"><span><strong>{a.admin_name || "Admin"}</strong> {a.action} {a.entity} <em className="not-italic text-ink-600">&ldquo;{a.entity_title}&rdquo;</em></span><span className="text-ink-400">{fmtDateShort(a.created_at)}, {fmtTime(a.created_at)}</span></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
