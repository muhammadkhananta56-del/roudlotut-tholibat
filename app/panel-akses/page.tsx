import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import StarMotif from "@/components/ui/StarMotif";
import { getAdmin } from "@/lib/auth/dal";
import { one } from "@/lib/queries";

export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (await getAdmin()) redirect("/admin");
  const next = one((await searchParams).next);
  return (
    <main className="on-dark pattern-light flex min-h-svh items-center justify-center bg-forest-950 px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-media)] bg-ivory-50 p-8 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <StarMotif className="mx-auto h-12 w-12 text-gold-500" strokeWidth={2} />
          <h1 className="mt-4 !text-forest-900 text-3xl">Masuk admin</h1>
          <p className="mt-1 text-ink-600">PP. Roudlotut Tholibat</p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
