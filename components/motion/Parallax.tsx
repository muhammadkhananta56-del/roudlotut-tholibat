"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Parallax sangat halus untuk gambar (maksimum ±`range` px). Hanya aktif saat elemen terlihat,
 * memakai transform saja, dan dimatikan oleh reduce motion. Anak diberi class "parallax-img".
 */
export default function Parallax({ children, range = 22, className = "" }: { children: ReactNode; range?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--py", `${(Math.max(-1, Math.min(1, p)) * -range).toFixed(1)}px`);
    };
    const onScroll = () => { if (visible && !frame) frame = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [range]);
  return <div ref={ref} className={`overflow-hidden ${className}`}>{children}</div>;
}
