"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StarMotif from "@/components/motif/StarMotif";

type Program = { slug: string; name: string };

// Warna kartu dibedakan agar pengunjung bisa membedakan program saat menggeser.
// Semua pasangan warna teks dan latar sudah dicek di atas 4,5:1.
const tones = [
  { card: "bg-brand-700 text-white", link: "text-white", star: "text-white/20" },
  { card: "bg-cream-100 text-brand-900", link: "text-brand-900", star: "text-brand-700/20" },
  { card: "bg-brand-900 text-white", link: "text-gold-400", star: "text-gold-400/25" },
  { card: "bg-gold-400 text-brand-900", link: "text-brand-900", star: "text-brand-900/20" },
  { card: "bg-brand-700 text-white", link: "text-white", star: "text-white/20" },
];

export default function ProgramCarousel({ programs }: { programs: Program[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const left = track.scrollLeft;
      const p = max > 0 ? left / max : 1;
      if (barRef.current) barRef.current.style.transform = `scaleX(${(0.2 + 0.8 * p).toFixed(3)})`;
      if (prevRef.current) prevRef.current.disabled = left <= 2;
      if (nextRef.current) nextRef.current.disabled = max <= 2 || left >= max - 2;
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector("li");
    const step = (first ? first.getBoundingClientRect().width : 320) + 20;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  }

  const btn =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-700 text-brand-700 transition hover:bg-brand-700 hover:text-white active:translate-y-px disabled:border-ink-500/40 disabled:text-ink-500/60 disabled:hover:bg-transparent disabled:hover:text-ink-500/60";

  return (
    <div>
      <ul
        ref={trackRef}
        aria-label="Daftar program pendidikan"
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-4 px-4 pb-3 sm:scroll-pl-6 sm:px-6 lg:scroll-pl-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
      >
        {programs.map((p, i) => {
          const tone = tones[i % tones.length];
          return (
            <li key={p.slug} className="shrink-0 basis-[78%] snap-start sm:basis-[22rem]">
              <Link
                href={`/program/${p.slug}`}
                className={`group relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-card p-7 transition-transform duration-300 hover:-translate-y-1 ${tone.card}`}
              >
                <StarMotif
                  className={`pointer-events-none absolute -right-12 -top-12 h-56 w-56 transition-transform duration-700 group-hover:rotate-45 ${tone.star}`}
                  strokeWidth={1}
                />
                <span className="relative text-sm font-medium opacity-90">Program pendidikan</span>
                <span className="relative">
                  <span className="block font-display text-3xl font-bold leading-tight">{p.name}</span>
                  <span className={`mt-5 inline-block font-semibold underline decoration-2 underline-offset-4 ${tone.link}`}>
                    Lihat program
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mx-auto mt-6 flex max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div className="h-1 flex-1 overflow-hidden rounded bg-brand-700/15" aria-hidden="true">
          <div
            ref={barRef}
            className="h-full origin-left rounded bg-brand-700 transition-transform duration-200"
            style={{ transform: "scaleX(0.2)" }}
          />
        </div>
        <div className="flex gap-3">
          <button type="button" ref={prevRef} onClick={() => scrollByCard(-1)} className={btn} aria-label="Program sebelumnya">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" ref={nextRef} onClick={() => scrollByCard(1)} className={btn} aria-label="Program berikutnya">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
