const TZ = "Asia/Jakarta";

/** Date yang dapat diformat, atau null bila nilainya kosong/tidak valid. */
export function toValidDate(d: Date | string | null | undefined): Date | null {
  if (d === null || d === undefined || d === "") return null;
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export const fmtDate = (d: Date | string) => {
  const date = toValidDate(d);
  return date ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: TZ }).format(date) : "";
};

export const fmtDateShort = (d: Date | string) => {
  const date = toValidDate(d);
  return date ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: TZ }).format(date) : "";
};

export const fmtTime = (d: Date | string) => {
  const date = toValidDate(d);
  return date ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(date) : "";
};

export function dayParts(d: Date | string) {
  const date = toValidDate(d);
  if (!date) return { day: "-", month: "", weekday: "", year: "" };
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
