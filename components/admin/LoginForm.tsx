"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import SubmitButton from "@/components/admin/SubmitButton";
import Field from "@/components/admin/Field";

export default function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(loginAction, null);
  const e = state?.errors;
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state?.message && <p role="alert" className="rounded-md border border-danger-600/40 bg-danger-100 px-4 py-3 text-sm font-medium text-danger-600">{state.message}</p>}
      <Field label="Email" name="email" error={e?.email}>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" aria-invalid={e?.email ? true : undefined} />
      </Field>
      <Field label="Password" name="password" error={e?.password}>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" aria-invalid={e?.password ? true : undefined} />
      </Field>
      <SubmitButton className="abtn abtn-primary w-full" pendingText="Memeriksa…">Masuk</SubmitButton>
    </form>
  );
}
