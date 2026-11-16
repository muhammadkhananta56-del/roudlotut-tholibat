import { Clock, MapPin, UserRound } from "lucide-react";
import { dayParts, fmtTime, toValidDate } from "@/lib/format";
import type { ScheduleRow as Row } from "@/lib/queries";

export default function ScheduleRow({ item, muted = false }: { item: Row; muted?: boolean }) {
  if (!toValidDate(item.starts_at)) return null; // data jadwal rusak tidak boleh menjatuhkan seluruh halaman
  const d = dayParts(item.starts_at);
  const cancelled = item.status === "cancelled";
  return (
    <article className={`grid grid-cols-[4.5rem_1fr] gap-5 border-t border-sage-300 py-6 sm:grid-cols-[6rem_1fr] sm:gap-8 ${muted ? "opacity-75" : ""}`}>
      <div className="text-center">
        <p className="font-display text-4xl font-semibold leading-none text-forest-900 sm:text-5xl">{d.day}</p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gold-700">{d.month}</p>
        <p className="text-xs text-ink-400">{d.year}</p>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className={`text-xl sm:text-2xl ${cancelled ? "line-through decoration-1" : ""}`}>{item.title}</h3>
          {cancelled && <span className="rounded bg-danger-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-danger-600">Dibatalkan</span>}
          {item.status === "done" && <span className="rounded bg-sage-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-forest-800">Selesai</span>}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem] text-ink-600">
          <li className="flex items-center gap-2"><Clock size={16} className="text-gold-700" aria-hidden />{d.weekday}, {fmtTime(item.starts_at)}{item.ends_at ? ` sampai ${fmtTime(item.ends_at)}` : ""} WIB</li>
          {item.speaker && <li className="flex items-center gap-2"><UserRound size={16} className="text-gold-700" aria-hidden />{item.speaker}</li>}
          {item.location && <li className="flex items-center gap-2"><MapPin size={16} className="text-gold-700" aria-hidden />{item.location}</li>}
        </ul>
        {item.description && <p className="mt-3 max-w-2xl text-ink-600">{item.description}</p>}
      </div>
    </article>
  );
}
