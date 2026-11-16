import "server-only";

/** Menunggu hasil query paling lama `ms`. Bila gagal atau lewat batas, kembalikan daftar kosong agar halaman tidak menggantung. */
export async function withTimeout<T>(work: PromiseLike<readonly T[]>, ms: number, label: string): Promise<T[]> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<T[]>((resolve) => {
    timer = setTimeout(() => { console.error(`[timeout] ${label} melebihi ${ms} ms`); resolve([]); }, ms);
  });
  const run = Promise.resolve(work).then((r) => [...r], (e) => { console.error(`[error] ${label}:`, e); return [] as T[]; });
  try {
    return await Promise.race([run, limit]);
  } finally {
    clearTimeout(timer);
  }
}
