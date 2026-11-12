import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import PendingNotice from "@/components/ui/PendingNotice";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { programs } from "@/lib/site";
import { programSections } from "@/lib/content";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  return { title: program ? program.name : "Program" };
}

export default async function ProgramDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  const others = programs.filter((p) => p.slug !== slug);

  return (
    <>
      <PageHero
        title={program.name}
        crumbs={[{ label: "Program", href: "/program" }, { label: program.name }]}
      />
      <Container className="space-y-12 py-12 md:py-16">
        <PhotoPlaceholder className="aspect-[16/7] w-full" />

        <div className="grid gap-6 md:grid-cols-2">
          {programSections.map((s) => (
            <section key={s.key} className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-brand-900">{s.title}</h2>
              <PendingNotice label={s.placeholder} />
            </section>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-brand-900 p-8 text-white">
          <p className="font-display text-xl font-semibold">
            Tertarik dengan program {program.name}?
          </p>
          <Link
            href="/ppdb"
            className="inline-flex min-h-12 items-center rounded-[var(--radius-button)] bg-gold-400 px-6 font-semibold text-brand-900 hover:brightness-95"
          >
            Informasi Pendaftaran
          </Link>
        </div>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-900">Program Lainnya</h2>
          <ul className="flex flex-wrap gap-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/program/${p.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-brand-700/20 px-4 text-sm font-medium text-brand-700 hover:bg-cream-50"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}