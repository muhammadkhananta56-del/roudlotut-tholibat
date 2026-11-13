import Link from "next/link";
import Container from "@/components/ui/Container";
import StarMotif from "@/components/motif/StarMotif";

export default function NotFound() {
  return (
    <section className="on-dark pattern-light relative overflow-hidden bg-brand-900 text-white">
      <StarMotif
        className="pointer-events-none absolute -right-20 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 text-gold-400/20"
        strokeWidth={0.6}
      />
      <Container className="relative flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
        <h1 className="text-4xl font-bold sm:text-6xl">Halaman tidak ditemukan</h1>
        <p className="max-w-xl text-lg text-white/85">
          Alamat yang Anda buka tidak ada atau sudah dipindahkan. Kembali ke Beranda, atau lihat
          informasi pendaftaran santri baru.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-button bg-gold-400 px-6 font-semibold text-brand-900 transition hover:brightness-95"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/ppdb"
            className="inline-flex min-h-12 items-center rounded-button border border-white/50 px-6 font-semibold text-white transition hover:bg-white/10"
          >
            Informasi pendaftaran
          </Link>
        </div>
      </Container>
    </section>
  );
}
