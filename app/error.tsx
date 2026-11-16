"use client";

import StarMotif from "@/components/ui/StarMotif";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 bg-ivory-50 px-6 text-center">
      <StarMotif className="h-16 w-16 text-gold-500" strokeWidth={1.5} />
      <h1 className="text-4xl">Terjadi kendala</h1>
      <p className="max-w-md text-ink-600">Halaman gagal dimuat. Silakan coba lagi beberapa saat lagi.</p>
      <button type="button" onClick={reset} className="btn btn-primary">Muat ulang</button>
    </main>
  );
}
