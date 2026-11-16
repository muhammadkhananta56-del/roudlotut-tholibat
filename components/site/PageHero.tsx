import Container from "@/components/ui/Container";
import StarMotif from "@/components/ui/StarMotif";

export default function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="pattern-dark relative overflow-hidden bg-ivory-100 pb-14 pt-32 sm:pt-40">
      <StarMotif className="pointer-events-none absolute -right-16 -top-10 h-80 w-80 text-gold-500/20" strokeWidth={0.6} />
      <Container className="relative">
        <p className="eyebrow hero-fade" style={{ "--i": 0 } as React.CSSProperties}>{eyebrow}</p>
        <h1 className="hero-fade mt-3 max-w-3xl text-4xl sm:text-5xl lg:text-6xl" style={{ "--i": 1 } as React.CSSProperties}>{title}</h1>
        {children && <p className="hero-fade mt-5 max-w-2xl text-lg text-ink-600" style={{ "--i": 2 } as React.CSSProperties}>{children}</p>}
        <span className="mt-8 block h-px w-24 bg-gold-500" />
      </Container>
    </section>
  );
}
