import { BookMarked, BookOpen, GraduationCap, Mic, Sparkles } from "lucide-react";

/** Ikon dipilih dari kata pada nama program; program baru yang ditambah admin memakai ikon buku. */
function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("tahfidz") || n.includes("hafal")) return <BookMarked size={24} aria-hidden />;
  if (n.includes("diniyah") || n.includes("madrasah")) return <GraduationCap size={24} aria-hidden />;
  if (n.includes("khitobah") || n.includes("pidato")) return <Mic size={24} aria-hidden />;
  if (n.includes("sholawat") || n.includes("diba") || n.includes("hadroh")) return <Sparkles size={24} aria-hidden />;
  return <BookOpen size={24} aria-hidden />;
}

export default function ProgramCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="pcard flex h-full flex-col rounded-[var(--radius-media)] border border-gold-500/35 bg-ivory-50/[0.06] p-6 sm:p-7">
      <span className="pic flex h-16 w-14 items-center justify-center rounded-t-full rounded-b-md border border-gold-300/50 bg-ivory-50/10 text-gold-300">
        {iconFor(name)}
      </span>
      <h3 className="mt-6 text-2xl">{name}</h3>
      {desc && <p className="mt-3 text-ivory-50/80">{desc}</p>}
    </div>
  );
}
