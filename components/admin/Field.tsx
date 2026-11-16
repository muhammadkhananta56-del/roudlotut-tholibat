export default function Field({ label, name, error, hint, children, required }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}{required && <span className="text-danger-600" aria-hidden> *</span>}</label>
      {children}
      {hint && !error && <p className="hint" id={`${name}-hint`}>{hint}</p>}
      {error && <p className="err" id={`${name}-err`} role="alert">{error}</p>}
    </div>
  );
}
