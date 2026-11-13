import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import PendingNotice from "@/components/ui/PendingNotice";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import Reveal from "@/components/motion/Reveal";
import { programs } from "@/lib/site";
import { programSections } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

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
  if (!program) return { title: "Program" };
  return buildMetadata({
    title: program.name,
    description: `Program ${program.name} di PP. Roudlotut Tholibat: deskripsi, tujuan, materi, dan metode pembelajaran.`,
    path: `/program/${slug}`,
  });
}

export default async function ProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
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
      <PageBody>
        <Container className="space-y-14 pb-20">
          <Reveal variant="wipe">
            <PhotoPlaceholder
              alt={program.name}
              label={`Foto program ${program.name} belum tersedia`}
              className="aspect-[16/8] w-full"
              sizes="(min-width: 1152px) 72rem, 100vw"
            />
          </Reveal>

          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {programSections.map((s, i) => (
              <Reveal key={s.key} delay={(i % 2) * 100}>
                <section className="space-y-3">
                  <h2 className="text-2xl font-bold text-brand-900">{s.title}</h2>
                  <PendingNotice label={s.placeholder} />
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="on-dark flex flex-wrap items-center justify-between gap-5 rounded-card bg-brand-900 p-8 text-white md:p-10">
              <p className="max-w-xl font-display text-2xl font-bold">
                Tertarik dengan program {program.name}?
              </p>
              <Link
                href="/ppdb#formulir"
                className="inline-flex min-h-12 items-center rounded-button bg-gold-400 px-6 font-semibold text-brand-900 transition hover:brightness-95 active:translate-y-px"
              >
                Isi formulir pendaftaran
              </Link>
            </div>
          </Reveal>

          <section aria-labelledby="program-lain">
            <h2 id="program-lain" className="mb-4 text-2xl font-bold text-brand-900">
              Program lainnya
            </h2>
            <ul className="flex flex-wrap gap-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/program/${p.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-brand-700/40 px-5 text-sm font-medium text-brand-700 transition hover:bg-brand-700 hover:text-white"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </PageBody>
    </>
  );
}
