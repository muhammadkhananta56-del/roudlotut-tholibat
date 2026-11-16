"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Variant = "up" | "fade" | "wipe" | "scale";

/** Memunculkan konten saat masuk layar. Tanpa JavaScript atau dengan reduce motion, konten tetap terlihat penuh. */
export default function Reveal({ children, variant = "up", delay = 0, className = "" }: { children: ReactNode; variant?: Variant; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) return; // sudah terlihat saat dibuka
    el.dataset.rv = "pending";
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.dataset.rv = "in"; io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-rv-v={variant} style={delay ? ({ "--rv-delay": `${delay}ms` } as React.CSSProperties) : undefined} className={className}>
      {children}
    </div>
  );
}
