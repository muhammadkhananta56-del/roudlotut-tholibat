// Pusat data situs. Semua isian yang perlu dari pihak pondok ada di file ini.
// Teks kosong ("") berarti belum diisi: halaman akan menampilkan penanda
// [BERKURUNG SIKU] atau menyembunyikan bagian terkait, bukan data karangan.

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
  /** Asal angka. Wajib diisi agar tidak ada statistik tanpa sumber. */
  source: string;
};

export const siteConfig = {
  name: "PP. ROUDLOTUT THOLIBAT",
  shortName: "PP. Roudlotut Tholibat",
  tagline: "Yayasan Pondok Pesantren",
  description:
    "Yayasan Pondok Pesantren Roudlotut Tholibat. Program: TPQ Metode Darussalam, Tahfidz Al-Qur'an, Madrasah Diniyah, Khitobah, dan Sholawat Diba'iyah.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  instagram: "https://www.instagram.com/roudlotuttholibat/",
  instagramHandle: "@roudlotuttholibat",

  // ISI DENGAN DATA RESMI
  address: "",
  whatsapp: "", // contoh format: 081234567890
  email: "",
  hours: "", // contoh: "Senin sampai Sabtu, 08.00 sampai 14.00"
  mapsUrl: "", // salin dari bio Instagram atau Google Maps

  // Logo: taruh file di public/brand/ lalu isi, contoh: "/brand/logo.png"
  logoSrc: "",

  // Foto: taruh file di public/foto/ lalu isi, contoh: "/foto/hero.jpg"
  images: {
    hero: "",
    about: "",
    pengasuh: "",
  },

  // Statistik: biarkan kosong sampai ada data resmi. Bagian ini hanya tampil bila terisi.
  stats: [] as Stat[],
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
  { href: "/profil/visi-misi", label: "Visi dan Misi" },
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
    children: programs.map((p) => ({ href: `/program/${p.slug}`, label: p.name })),
  },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Galeri", href: "/galeri" },
  { label: "Berita", href: "/berita" },
  { label: "Kontak", href: "/kontak" },
];

export const footerExtraLinks = [
  { href: "/ppdb", label: "Pendaftaran Santri" },
  { href: "/agenda", label: "Agenda" },
  { href: "/faq", label: "Pertanyaan Umum" },
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
];
