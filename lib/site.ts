export const siteConfig = {
  name: "PP. ROUDLOTUT THOLIBAT",
  shortName: "PP. Roudlotut Tholibat",
  tagline: "Yayasan Pondok Pesantren",
  description:
    "Yayasan Pondok Pesantren Roudlotut Tholibat. Program: TPQ Metode Darussalam, Tahfidz Al-Qur'an, Madrasah Diniyah, Khitobah, dan Sholawat Diba'iyah.",
  instagram: "https://www.instagram.com/roudlotuttholibat/",
  // Isi dengan data resmi. Kosong = tampil placeholder.
  address: "",
  whatsapp: "",
  email: "",
};

export const programs = [
  { slug: "tpq-metode-darussalam", name: "TPQ Metode Darussalam" },
  { slug: "tahfidz-quran", name: "Tahfidz Al-Qur'an" },
  { slug: "madrasah-diniyah", name: "Madrasah Diniyah" },
  { slug: "khitobah", name: "Khitobah" }, // [KONFIRMASI] Khitobah atau Kitobah
  { slug: "sholawat-dibaiyah", name: "Sholawat Diba'iyah" },
];

export const profilePages = [
  { href: "/profil/sejarah", label: "Sejarah" },
  { href: "/profil/visi-misi", label: "Visi & Misi" },
  { href: "/profil/pengasuh", label: "Pengasuh" },
  { href: "/profil/struktur-organisasi", label: "Struktur Organisasi" },
  { href: "/profil/identitas", label: "Identitas" },
  { href: "/profil/fasilitas", label: "Fasilitas" },
];

export type NavItem = {
  label: string;
  href: string;
  children?: { href: string; label: string }[];
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil", children: profilePages },
  {
    label: "Program",
    href: "/program",
    children: programs.map((p) => ({
      href: `/program/${p.slug}`,
      label: p.name,
    })),
  },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Galeri", href: "/galeri" },
  { label: "Berita", href: "/berita" },
  { label: "Kontak", href: "/kontak" },
];
