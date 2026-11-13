export default function PendingNotice({
  label,
  needs,
}: {
  label: string;
  needs?: string[];
}) {
  return (
    <div className="rounded-card border border-dashed border-brand-700/45 bg-cream-50 p-6">
      <p className="font-semibold text-brand-900">{label}</p>
      <p className="mt-1 text-sm text-ink-500">
        Bagian ini menunggu data resmi dari pihak pondok.
      </p>
      {needs && needs.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-500">
          {needs.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
