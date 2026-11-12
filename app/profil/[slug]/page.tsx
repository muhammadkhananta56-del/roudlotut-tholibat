import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import PendingNotice from "@/components/ui/PendingNotice";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { profilePages } from "@/lib/site";
import { profileContent } from "@/lib/content";

export function generateStaticParams() {
  return Object.keys(profileContent).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = profileContent[slug];
  return { title: c ? c.title : "Profil" };
}

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = profileContent[slug];
  if (!content) notFound();

  return (
    <>
      <PageHero
        title={content.title}
        crumbs={[{ label: "Profil", href: "/profil" }, { label: content.title }]}
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Subhalaman profil" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {profilePages.map((p) => {
              const active = p.href === `/profil/${slug}`;
              return (
                <li key={p.href} className="shrink-0">
                  <Link
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className={`block min-h-11 whitespace-nowrap rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-brand-700 text-white"
                        : "bg-cream-50 text-ink-900 hover:text-brand-700"
                    }`}
                  >
                    {p.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="max-w-[70ch] space-y-6">
          <PendingNotice label={content.placeholder} needs={content.needs} />
          {(slug === "pengasuh" || slug === "fasilitas") && (
            <PhotoPlaceholder className="aspect-[4/3] w-full" />
          )}
        </div>
      </Container>
    </>
  );
}