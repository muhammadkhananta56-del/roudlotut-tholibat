import type { ReactNode } from "react";
import StarMotif from "@/components/motif/StarMotif";

export default function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string; external?: boolean };
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-card bg-cream-50 px-6 py-12 text-center">
      <StarMotif className="mb-4 h-14 w-14 text-brand-700/55" strokeWidth={1.2} />
      <h2 className="font-display text-2xl font-bold text-brand-900">{title}</h2>
      {children && <div className="mt-2 text-ink-500">{children}</div>}
      {action && (
        <a
          href={action.href}
          {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-6 inline-flex min-h-12 items-center rounded-button bg-brand-700 px-6 font-semibold text-white transition hover:bg-brand-900 active:translate-y-px"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
