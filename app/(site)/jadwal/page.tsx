import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/site/PageHero";
import ScheduleRow from "@/components/site/ScheduleRow";
import { pastSchedules, upcomingSchedules } from "@/lib/queries";

export const metadata: Metadata = { title: "Jadwal Pengajian", description: "Jadwal pengajian dan kegiatan keagamaan Pondok Pesantren Roudlotut Tholibat." };

export default async function JadwalPage() {
  const [upcoming, past] = await Promise.all([upcomingSchedules(), pastSchedules(12)]);
  return (
    <>
      <PageHero eyebrow="Jadwal Pengajian" title="Pengajian dan kegiatan">Semua waktu dalam WIB. Jadwal diperbarui langsung oleh pengurus.</PageHero>
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-3xl">Akan datang</h2>
          <div className="mt-8">
            {upcoming.length === 0 ? (
              <EmptyState title="Belum ada jadwal mendatang">Jadwal pengajian berikutnya akan tampil di sini setelah ditetapkan.</EmptyState>
            ) : (
              <div className="border-b border-sage-300">{upcoming.map((s) => <ScheduleRow key={s.id} item={s} />)}</div>
            )}
          </div>
          {past.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl">Riwayat</h2>
              <div className="mt-8 border-b border-sage-300">{past.map((s) => <ScheduleRow key={s.id} item={s} muted />)}</div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
