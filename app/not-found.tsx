import Link from "next/link";
import StarMotif from "@/components/ui/StarMotif";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 bg-ivory-50 px-6 text-center">
      <StarMotif className="h-16 w-16 text-gold-500" strokeWidth={1.5} />
      <h1 className="text-4xl">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-ink-600">Alamat yang Anda tuju tidak ada atau sudah dipindahkan.</p>
      <Link href="/" className="btn btn-primary">Kembali ke beranda</Link>
    </main>
  );
}
