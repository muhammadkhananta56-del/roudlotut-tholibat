import { Fragment } from "react";

/**
 * Menampilkan isi berita dari teks biasa dengan aturan sederhana (aman, tanpa HTML mentah):
 *  - baris kosong memisahkan paragraf
 *  - "## Judul" menjadi subjudul
 *  - baris berawalan "- " menjadi daftar
 */
export default function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-rt">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3).trim()}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}</ul>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>{j > 0 && <br />}{l}</Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
