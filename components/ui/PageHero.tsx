import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Container from "./Container";
import StarMotif from "@/components/motif/StarMotif";

export type Crumb = { label: string; href?: string };

export default function PageHero({
  title,
  description,
  crumbs = [],
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="on-dark pattern-light relative overflow-hidden bg-brand-900 pb-20 pt-10 text-white md:pb-24 md:pt-14">
      <StarMotif
        className="pointer-events-none absolute -right-16 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 text-gold-400/20 md:-right-10 md:h-[32rem] md:w-[32rem]"
        strokeWidth={0.6}
      />
      <Container className="relative">
        <nav aria-label="Jejak halaman" className="mb-5 text-sm text-white/85">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Beranda
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                {c.href ? (
                  <Link href={c.href} className="underline-offset-4 hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-gold-400">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-white/85">{description}</p>
        )}
      </Container>
    </section>
  );
}

/** Panel putih yang menimpa bagian bawah PageHero dengan sudut atas membulat. */
export function PageBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative -mt-8 rounded-t-[var(--radius-panel)] bg-white pt-12 md:pt-16 ${className}`}
    >
      {children}
    </div>
  );
}
