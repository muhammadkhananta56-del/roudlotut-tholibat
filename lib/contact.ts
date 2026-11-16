
/** Mengubah nomor Indonesia menjadi format wa.me, atau null bila tidak valid. */
export function normalizeWhatsapp(raw: string): string | null {
  let d = raw.replace(/\D/g, "");

  if (d.startsWith("00")) d = d.slice(2);

  if (d.startsWith("0")) {
    d = "62" + d.slice(1);
  } else if (d.startsWith("8")) {
    d = "62" + d;
  }

  return /^628\d{7,12}$/.test(d) ? d : null;
}

export function waLink(raw: string, text?: string): string | null {
  const n = normalizeWhatsapp(raw);
  if (!n) return null;

  return text
    ? `https://wa.me/${n}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${n}`;
}

export const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Hanya tautan HTTP(S) yang boleh tampil sebagai href. */
export function safeHttpUrl(v: string): string | null {
  try {
    const u = new URL(v);

    return u.protocol === "https:" || u.protocol === "http:"
      ? u.toString()
      : null;
  } catch {
    return null;
  }
}
