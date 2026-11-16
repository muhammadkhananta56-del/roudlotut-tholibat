
export const SITE_NAME = "PP. Roudlotut Tholibat";
export const SITE_FULL_NAME = "Pondok Pesantren Roudlotut Tholibat";

export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const NAV = [
  { href: "/profil", label: "Profil" },
  { href: "/sejarah", label: "Sejarah" },
  { href: "/berita", label: "Berita" },
  { href: "/jadwal", label: "Jadwal Pengajian" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const NAV_CTA = { href: "/pendaftaran", label: "Pendaftaran" } as const;

// Data profil lembaga
export const about = {
  summary: "",
  history: "",
  caretakerGreeting: "",
  caretakerName: "",
  vision: "",
  mission: [] as string[],
};

// Data program pendidikan
export const programs: {
  slug: string;
  name: string;
  summary: string;
}[] = [];

// Konfigurasi website
export const siteConfig = {
  address: "",
  instagram: "",
  instagramHandle: "@roudlotuttholibat",
  hours: "",
  mapsUrl: "",
  images: {
    hero: "",
    pengasuh: "",
  },
};
