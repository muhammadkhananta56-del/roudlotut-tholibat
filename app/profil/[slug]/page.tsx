import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import PendingNotice from "@/components/ui/PendingNotice";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import Reveal from "@/components/motion/Reveal";
import { profilePages, siteConfig } from "@/lib/site";
import { profileContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

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
  if (!c) return { title: "Profil" };
  return buildMetadata({ title: c.title, description: c.description, path: `/profil/${slug}` });
}

export default async function ProfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = profileContent[slug];
  if (!content) notFound();

  const photo =
    slug === "pengasuh"
      ? { src: siteConfig.images.pengasuh, label: "Foto pengasuh belum tersedia", ratio: "aspect-[3/4] max-w-xs" }
      : slug === "fasilitas"
        ? { src: "", label: "Foto fasilitas belum tersedia", ratio: "aspect-[16/9]" }
        : null;

  return (
    <>
      <PageHero
        title={content.title}
        description={content.description}
        crumbs={[{ label: "Profil", href: "/profil" }, { label: content.title }]}
      />
      <PageBody>
        <Container className="grid grid-cols-[minmax(0,1fr)] gap-10 pb-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Subhalaman profil" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {profilePages.map((p) => {
                const active = p.href === `/profil/${slug}`;
                return (
                  <li key={p.href} className="shrink-0">
                    <Link
                      href={p.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center whitespace-nowrap rounded-button px-4 text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand-700 text-white"
                          : "bg-cream-50 text-ink-900 hover:bg-cream-100 hover:text-brand-700"
                      }`}
                    >
                      {p.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Reveal className="max-w-[70ch] space-y-8">
            <PendingNotice label={content.placeholder} needs={content.needs} />
            {photo && (
              <PhotoPlaceholder
                src={photo.src}
                alt={content.title}
                label={photo.label}
                className={`w-full ${photo.ratio}`}
                sizes="(min-width: 1024px) 45rem, 100vw"
              />
            )}
          </Reveal>
        </Container>
      </PageBody>
    </>
  );
}
