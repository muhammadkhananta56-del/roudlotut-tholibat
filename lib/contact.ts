import { siteConfig } from "@/lib/site";

/** Mengubah nomor Indonesia (08..., +62..., 62...) menjadi format wa.me, atau null bila tidak valid. */
export function normalizeWhatsapp(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return /^628\d{7,12}$/.test(d) ? d : null;
}

export function waLink(raw: string, text?: string): string | null {
  const n = normalizeWhatsapp(raw);
  if (!n) return null;
  return text ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : `https://wa.me/${n}`;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function mailtoLink(email: string, subject: string, body: string): string | null {
  if (!isEmail(email)) return null;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Saluran kontak resmi yang sudah diisi dengan benar di lib/site.ts. */
export function getChannels() {
  const wa = normalizeWhatsapp(siteConfig.whatsapp);
  return {
    whatsappNumber: wa,
    whatsappDisplay: siteConfig.whatsapp,
    email: isEmail(siteConfig.email) ? siteConfig.email : null,
  };
}
