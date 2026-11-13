// Bintang delapan titik (khatam): dua persegi yang diputar 45 derajat, ditambah lapisan dalam.
// Dipakai sebagai motif identitas pondok, bukan hiasan acak.
export default function StarMotif({
  className = "",
  strokeWidth = 1,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="17" y="17" width="66" height="66" />
      <rect x="17" y="17" width="66" height="66" transform="rotate(45 50 50)" />
      <rect x="31" y="31" width="38" height="38" />
      <rect x="31" y="31" width="38" height="38" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="8" />
    </svg>
  );
}
