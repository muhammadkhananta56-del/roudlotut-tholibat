const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const monthFmt = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const timeFmt = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

/** Menerima "2026-11-13" atau ISO penuh. Mengembalikan teks tanggal Indonesia. */
export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

export function formatMonth(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? iso : monthFmt.format(d);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : timeFmt.format(d).replace(":", ".");
}

const dayFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", timeZone: "Asia/Jakarta" });
const monthShortFmt = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "Asia/Jakarta",
});
const weekdayFmt = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  timeZone: "Asia/Jakarta",
});

export function agendaParts(iso: string): { day: string; month: string; weekday: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "", month: "", weekday: "" };
  return {
    day: dayFmt.format(d),
    month: monthShortFmt.format(d),
    weekday: weekdayFmt.format(d),
  };
}
