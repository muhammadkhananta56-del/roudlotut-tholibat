import Reveal from "@/components/motion/Reveal";

export default function SectionHeading({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children?: React.ReactNode; className?: string }) {
  return (
    <Reveal className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {children && <div className="mt-4 max-w-xl text-ink-600">{children}</div>}
    </Reveal>
  );
}
