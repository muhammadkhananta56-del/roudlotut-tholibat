export type AgendaItem = {
  id: string;
  title: string;
  /** Tanggal mulai, format ISO, contoh "2026-12-20T08:00:00+07:00" */
  startsAt: string;
  endsAt?: string;
  location?: string;
  description?: string;
  status: "akan datang" | "berlangsung" | "selesai" | "dibatalkan";
};

// Isi dengan agenda asli. Kosong = halaman menampilkan keadaan kosong.
export const agendas: AgendaItem[] = [];

export function sortedAgenda(): AgendaItem[] {
  return [...agendas].sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1));
}

function endTime(a: AgendaItem): number {
  return new Date(a.endsAt ?? a.startsAt).getTime();
}

/** Agenda yang belum lewat dan tidak dibatalkan, dihitung saat halaman dibuat ulang. */
export function upcomingAgenda(limit?: number): AgendaItem[] {
  const now = Date.now();
  const list = sortedAgenda().filter(
    (a) => a.status !== "selesai" && a.status !== "dibatalkan" && endTime(a) >= now
  );
  return limit ? list.slice(0, limit) : list;
}

export function pastAgenda(): AgendaItem[] {
  const now = Date.now();
  return sortedAgenda()
    .filter((a) => a.status === "selesai" || a.status === "dibatalkan" || endTime(a) < now)
    .reverse();
}
