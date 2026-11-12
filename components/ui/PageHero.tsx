import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "./Container";

export type Crumb = { label: string; href?: string };

export default function PageHero({
  title,
  crumbs = [],
}: {
  title: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
      <Container className="py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-white">
                Beranda
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
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
        <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        <div className="mt-4 h-1 w-16 rounded bg-gold-400" aria-hidden="true" />
      </Container>
    </section>
  );
}