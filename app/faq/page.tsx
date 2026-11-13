import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import StarMotif from "@/components/motif/StarMotif";
import { getFaqs } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pertanyaan Umum",
  description: "Jawaban atas pertanyaan yang sering diajukan calon wali santri PP. Roudlotut Tholibat.",
  path: "/faq",
});

export default function FaqPage() {
  const faqs = getFaqs();
  return (
    <>
      <PageHero title="Pertanyaan Umum" description="Jawaban singkat untuk calon wali santri." crumbs={[{ label: "Pertanyaan Umum" }]} />
      <PageBody>
        <Container className="pb-20">
          <div className="max-w-3xl divide-y divide-brand-700/20 border-y border-brand-700/20">
            {faqs.map((f) => (
              <details key={f.question} className="group">
                <summary className="flex min-h-16 items-center justify-between gap-4 py-4 text-lg font-semibold text-brand-900 hover:text-brand-500">
                  {f.question}
                  <StarMotif className="faq-mark h-7 w-7 shrink-0 text-brand-700" strokeWidth={3} />
                </summary>
                <p className="pb-6 pr-10 text-ink-500">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-ink-500">
            Pertanyaan Anda belum terjawab? Tulis lewat{" "}
            <Link href="/kontak" className="font-semibold text-brand-700 underline underline-offset-4">
              halaman Kontak
            </Link>
            .
          </p>
        </Container>
      </PageBody>
    </>
  );
}
