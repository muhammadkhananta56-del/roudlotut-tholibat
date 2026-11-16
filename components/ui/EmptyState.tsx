import StarMotif from "@/components/ui/StarMotif";

export default function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[var(--radius-media)] border border-dashed border-sage-300 bg-ivory-100/60 px-8 py-16 text-center">
      <StarMotif className="h-12 w-12 text-gold-500" strokeWidth={1.5} />
      <h2 className="text-2xl">{title}</h2>
      {children && <p className="text-ink-600">{children}</p>}
    </div>
  );
}
