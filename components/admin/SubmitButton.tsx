"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText = "Menyimpan…", className = "abtn abtn-primary" }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} aria-busy={pending}>
      {pending && <span className="spinner" aria-hidden />}
      {pending ? pendingText : children}
    </button>
  );
}
