import { siteConfig, programs } from "@/lib/site";

export type Faq = { question: string; answer: string };

/** Setiap jawaban hanya memuat hal yang sudah pasti. Yang belum ada diarahkan ke kontak. */
export function getFaqs(): Faq[] {
  const programNames = programs.map((p) => p.name).join(", ");
  return [
    {
      question: "Program apa saja yang tersedia di pondok?",
      answer: `Program yang tercantum di profil resmi kami: ${programNames}. Rincian materi dan jadwal tiap program akan ditambahkan di halaman programnya setelah dikonfirmasi pihak pondok.`,
    },
    {
      question: "Bagaimana cara mendaftarkan santri baru?",
      answer:
        "Isi formulir di halaman Pendaftaran Santri. Formulir menyusun data Anda menjadi satu pesan yang Anda kirim sendiri ke pihak pondok lewat WhatsApp. Langkah berikutnya diinformasikan oleh pihak pondok setelah pesan diterima.",
    },
    {
      question: "Apakah data yang saya isi di formulir tersimpan di website?",
      answer:
        "Belum. Saat ini data hanya diproses di perangkat Anda dan baru terkirim ketika Anda sendiri menekan tombol kirim di WhatsApp. Penjelasan lengkap ada di halaman Kebijakan Privasi.",
    },
    {
      question: "Berapa biaya pendidikan di pondok?",
      answer:
        "Rincian biaya belum dipublikasikan di website ini. Silakan tanyakan langsung ke pihak pondok lewat halaman Kontak.",
    },
    {
      question: "Di mana lokasi pondok?",
      answer: siteConfig.address
        ? siteConfig.address
        : `Alamat lengkap belum dicantumkan di website ini. Tautan Google Maps tersedia di profil Instagram ${siteConfig.instagramHandle}.`,
    },
    {
      question: "Di mana saya bisa melihat kegiatan santri terbaru?",
      answer: `Dokumentasi kegiatan, termasuk khataman, saat ini rutin dibagikan di Instagram ${siteConfig.instagramHandle}. Foto dan berita juga akan tampil di halaman Galeri dan Berita setelah ditambahkan.`,
    },
  ];
}
