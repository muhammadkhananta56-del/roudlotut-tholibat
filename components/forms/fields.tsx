import type { ReactNode } from "react";

const control =
  "min-h-12 w-full rounded-input border bg-white px-4 py-2.5 text-base text-ink-900 placeholder:text-ink-500/80";

function borderFor(error?: string) {
  return error ? "border-danger border-2" : "border-ink-500/80";
}

function Shell({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-brand-900">
        {label}
        {required ? <span className="text-danger"> *</span> : <span className="font-normal text-ink-500"> (opsional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-ink-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  id,
  name,
  label,
  type = "text",
  error,
  hint,
  required,
  autoComplete,
  inputMode,
  max,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  max?: string;
}) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        max={max}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${borderFor(error)}`}
      />
    </Shell>
  );
}

export function TextArea({
  id,
  name,
  label,
  error,
  hint,
  required,
  rows = 4,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${borderFor(error)}`}
      />
    </Shell>
  );
}

export function SelectField({
  id,
  name,
  label,
  options,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <Shell id={id} label={label} error={error} required={required}>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error)}
        className={`${control} ${borderFor(error)}`}
      >
        <option value="" disabled>
          Pilih salah satu
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Shell>
  );
}

export function RadioField({
  id,
  name,
  legend,
  options,
  error,
}: {
  id: string;
  name: string;
  legend: string;
  options: string[];
  error?: string;
}) {
  return (
    <fieldset
      className="space-y-1.5"
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="text-sm font-semibold text-brand-900">
        {legend}
        <span className="text-danger"> *</span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o, i) => (
          <label
            key={o}
            htmlFor={`${id}-${i}`}
            className={`inline-flex min-h-12 items-center gap-3 rounded-input border bg-white px-4 text-base has-[:checked]:border-brand-700 has-[:checked]:bg-cream-50 ${
              error ? "border-danger border-2" : "border-ink-500/80"
            }`}
          >
            <input
              id={`${id}-${i}`}
              type="radio"
              name={name}
              value={o}
              className="h-5 w-5 accent-brand-700"
            />
            {o}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
