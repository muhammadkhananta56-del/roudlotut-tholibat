"use client";

import { useEffect, useRef } from "react";

/** Angka yang menghitung naik saat terlihat. Nilai akhir selalu sudah tertulis di HTML. */
export default function CountUp({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) => `${Math.round(n).toLocaleString("id-ID")}${suffix}`;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
          else el.textContent = format(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, suffix]);

  return (
    <span ref={ref}>
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
