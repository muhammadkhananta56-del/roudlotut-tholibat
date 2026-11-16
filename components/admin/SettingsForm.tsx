"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/app/actions/settings";
import SubmitButton from "@/components/admin/SubmitButton";
import Field from "@/components/admin/Field";
import ImageUploader from "@/components/admin/ImageUploader";
import { useFields } from "@/components/admin/useFields";
import type { SettingGroup } from "@/lib/settings";

export default function SettingsForm({ groups, values, imageUrls }: { groups: SettingGroup[]; values: Record<string, string>; imageUrls: Record<string, string> }) {
  const [state, action] = useActionState(saveSettingsAction, null);
  const { bind } = useFields(values);
  const e = state?.errors;
  return (
    <form action={action} className="max-w-3xl space-y-10 pb-28" noValidate>
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="panel space-y-6 p-6" aria-labelledby={`h-${g.id}`}>
          <div><h2 id={`h-${g.id}`} className="text-2xl">{g.title}</h2>{g.description && <p className="mt-1 text-ink-600">{g.description}</p>}</div>
          {g.fields.map((f) =>
            f.type === "image" ? (
              <div key={f.key}>
                <p className="label">{f.label}</p>
                <ImageUploader name={f.key} folder="site" initialPath={values[f.key] || null} initialUrl={imageUrls[f.key] || null} aspect={f.key === "logo" ? "aspect-square max-w-48" : "aspect-[4/3]"} />
                {f.help && <p className="hint">{f.help}</p>}
                {e?.[f.key] && <p className="err">{e[f.key]}</p>}
              </div>
            ) : (
              <Field key={f.key} label={f.label} name={f.key} error={e?.[f.key]} hint={f.help}>
                {f.type === "textarea" ? (
                  <textarea {...bind(f.key, e)} rows={f.rows ?? 3} className="field" maxLength={f.max} placeholder={f.placeholder} />
                ) : (
                  <input {...bind(f.key, e)} type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} className="field" maxLength={f.max} placeholder={f.placeholder} />
                )}
              </Field>
            ),
          )}
        </section>
      ))}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-sage-200 bg-ivory-50/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <SubmitButton>Simpan semua perubahan</SubmitButton>
          {state?.message && <p role="alert" className="err m-0">{state.message}</p>}
        </div>
      </div>
    </form>
  );
}
