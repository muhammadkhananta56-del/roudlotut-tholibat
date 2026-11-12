export default function PhotoPlaceholder({
  label = "Foto belum tersedia",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-[var(--radius-card)] bg-gradient-to-br from-brand-700 to-brand-900 text-center text-sm font-medium text-gold-400 ${className}`}
    >
      <span className="px-4">{label}</span>
    </div>
  );
}
