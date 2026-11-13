"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Variant = "up" | "fade" | "wipe";

/**
 * Memunculkan konten saat masuk layar.
 * Tanpa JavaScript atau dengan reduce motion, konten tetap terlihat penuh.
 * Konten yang sudah terlihat saat halaman dibuka tidak disembunyikan sama sekali.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const alreadyVisible =
      rect.top < vh * 0.92 && rect.bottom > 0 && rect.left < vw && rect.right > 0;
    if (alreadyVisible) return;

    el.dataset.rv = "pending";
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.rv = "in";
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-rv-v={variant}
      style={delay ? ({ "--rv-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
