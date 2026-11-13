import { agendaParts, formatTime } from "@/lib/format";
import type { AgendaItem } from "@/lib/data/agenda";

export default function AgendaRow({ item }: { item: AgendaItem }) {
  const { day, month, weekday } = agendaParts(item.startsAt);
  const start = formatTime(item.startsAt);
  const end = item.endsAt ? formatTime(item.endsAt) : "";
  return (
    <li className="flex gap-5 border-b border-brand-700/15 py-5 last:border-b-0">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-card bg-brand-700 text-white">
        <span className="font-display text-2xl font-bold leading-none">{day}</span>
        <span className="mt-1 text-xs">{month}</span>
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="text-lg font-bold text-brand-900">{item.title}</h3>
        <p className="text-sm text-ink-500">
          {weekday}
          {start ? `, ${start}${end ? ` sampai ${end}` : ""} WIB` : ""}
          {item.location ? `. ${item.location}` : ""}
        </p>
        {item.description && <p className="text-ink-500">{item.description}</p>}
        <p className="text-sm font-semibold text-brand-700">Status: {item.status}</p>
      </div>
    </li>
  );
}
