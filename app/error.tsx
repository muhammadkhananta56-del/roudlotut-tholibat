"use client";

import Container from "@/components/ui/Container";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex min-h-[50vh] flex-col items-start justify-center gap-4 py-20">
      <h1 className="text-3xl font-bold text-brand-900 sm:text-4xl">Halaman gagal dimuat</h1>
      <p className="max-w-xl text-ink-500">
        Terjadi kesalahan saat menampilkan halaman ini. Coba muat ulang. Bila masih gagal,
        hubungi pengelola website.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-12 items-center rounded-button bg-brand-700 px-6 font-semibold text-white hover:bg-brand-900"
      >
        Muat ulang halaman
      </button>
    </Container>
  );
}
