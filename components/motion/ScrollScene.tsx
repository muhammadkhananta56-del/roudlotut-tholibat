"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Menulis progres scroll (0-1) ke variabel CSS --p. Berhenti total bila reduce motion aktif. */
export default function ScrollScene({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty("--p", Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight || 1))).toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
