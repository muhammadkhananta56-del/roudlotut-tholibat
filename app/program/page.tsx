import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { programs } from "@/lib/site";

export const metadata: Metadata = { title: "Program Pendidikan" };

export default function ProgramIndex() {
  return (
    <>
      <PageHero title="Program Pendidikan" crumbs={[{ label: "Program" }]} />
      <Container className="py-12 md:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/program/${p.slug}`}
                className="group flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-brand-700/10 bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-gold-400"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50 text-brand-700">
                  <BookOpen className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="font-display text-xl font-semibold text-brand-900">{p.name}</h2>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:text-brand-500">
                  Lihat detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}