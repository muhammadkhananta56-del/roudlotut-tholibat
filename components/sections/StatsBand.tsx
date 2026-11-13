import Container from "@/components/ui/Container";
import CountUp from "@/components/motion/CountUp";
import { siteConfig } from "@/lib/site";

/** Hanya tampil bila siteConfig.stats berisi data resmi. Tidak pernah memuat angka karangan. */
export default function StatsBand() {
  const stats = siteConfig.stats.filter((s) => s.source.trim() !== "");
  if (stats.length === 0) return null;
  return (
    <section aria-label="Data pondok" className="on-dark bg-brand-900 py-14 text-white">
      <Container>
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-5xl font-bold text-gold-400">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-1 text-white/85">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
