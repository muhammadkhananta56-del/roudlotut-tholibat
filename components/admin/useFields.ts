"use client";

import { useState } from "react";

type El = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Isian terkontrol: nilai tetap ada saat validasi server gagal (React 19 mereset form setelah aksi). */
export function useFields<T extends Record<string, string>>(initial: T) {
  const [f, setF] = useState(initial);
  const bind = (k: keyof T & string, errors?: Record<string, string>) => ({
    id: k, name: k, value: f[k],
    onChange: (e: React.ChangeEvent<El>) => setF((p) => ({ ...p, [k]: e.target.value })),
    "aria-invalid": errors?.[k] ? (true as const) : undefined,
    "aria-describedby": errors?.[k] ? `${k}-err` : undefined,
  });
  return { f, setF, bind };
}
