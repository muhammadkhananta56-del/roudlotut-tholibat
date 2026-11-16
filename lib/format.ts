const TZ = "Asia/Jakarta";

export const fmtDate = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: TZ }).format(new Date(d));

export const fmtDateShort = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: TZ }).format(new Date(d));

export const fmtTime = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(new Date(d));

export function dayParts(d: Date | string) {
  const date = new Date(d);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", { ...o, timeZone: TZ }).format(date);
  return { day: f({ day: "numeric" }), month: f({ month: "short" }), weekday: f({ weekday: "long" }), year: f({ year: "numeric" }) };
}

/** Nilai untuk <input type="datetime-local">, dalam WIB (UTC+7). */
export function toLocalInput(d: Date | string | null | undefined): string {
  if (!d) return "";
  return new Date(new Date(d).getTime() + 7 * 3600_000).toISOString().slice(0, 16);
}

/** Mengubah nilai datetime-local (dianggap WIB) menjadi Date. Null bila tidak valid. */
export function fromLocalInput(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return null;
  const d = new Date(`${s}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}
