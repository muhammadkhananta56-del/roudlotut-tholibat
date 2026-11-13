import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import StarMotif from "@/components/motif/StarMotif";
import { programs } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Program Pendidikan",
  description:
    "Program pendidikan PP. Roudlotut Tholibat: TPQ Metode Darussalam, Tahfidz Al-Qur'an, Madrasah Diniyah, Khitobah, dan Sholawat Diba'iyah.",
  path: "/program",
});

export default function ProgramIndex() {
  return (
    <>
      <PageHero
        title="Program Pendidikan"
        description="Pilih program untuk melihat deskripsi, tujuan, materi, dan metode pembelajarannya."
        crumbs={[{ label: "Program" }]}
      />
      <PageBody>
        <Container className="pb-20">
          <ul className="border-t border-brand-700/20">
            {programs.map((p) => (
              <li key={p.slug} className="border-b border-brand-700/20">
                <Link
                  href={`/program/${p.slug}`}
                  className="group flex min-h-24 items-center justify-between gap-6 py-6 transition-colors hover:bg-cream-50 sm:px-4"
                >
                  <span className="font-display text-2xl font-bold text-brand-900 transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl">
                    {p.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm font-semibold text-brand-700">
                    <span className="hidden sm:inline">Lihat detail</span>
                    <StarMotif
                      className="h-9 w-9 text-brand-700 transition-transform duration-500 group-hover:rotate-90"
                      strokeWidth={2.2}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </PageBody>
    </>
  );
}
