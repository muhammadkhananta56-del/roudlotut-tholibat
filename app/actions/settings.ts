"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { ALL_FIELDS, getSettings } from "@/lib/settings";
import { isEmail, normalizeWhatsapp, safeHttpUrl } from "@/lib/contact";
import { removeObjects } from "@/lib/storage";
import { logActivity, refreshSite } from "@/lib/actions-util";
import type { FormState } from "@/lib/form-state";

const SITE_IMAGE = /^site\/[a-z0-9/_-]+\.webp$/;

export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const before = await getSettings();
  const errors: Record<string, string> = {};
  const values: Record<string, string> = {};

  for (const f of ALL_FIELDS) {
    const raw = fd.get(f.key);
    if (raw === null) continue; // bagian yang tidak dikirim tidak diubah
    const v = String(raw).replace(/\r\n/g, "\n").trim();
    if (f.type === "image") {
      if (v && !SITE_IMAGE.test(v)) errors[f.key] = "Berkas gambar tidak valid";
    } else if (v.length > f.max) {
      errors[f.key] = `Maksimal ${f.max} karakter`;
    } else if (f.type === "url" && v && !safeHttpUrl(v)) {
      errors[f.key] = "Harus berupa tautan http:// atau https://";
    } else if (f.type === "email" && v && !isEmail(v)) {
      errors[f.key] = "Format email tidak valid";
    } else if (f.key === "contact_whatsapp" && v && !normalizeWhatsapp(v)) {
      errors[f.key] = "Nomor tidak valid. Contoh: 081234567890";
    }
    values[f.key] = v;
  }
  if (Object.keys(errors).length) return { errors, message: "Periksa isian yang bertanda merah." };

  const sql = db();
  await sql.begin(async (tx) => {
    for (const [key, value] of Object.entries(values)) {
      await tx`insert into settings (key, value) values (${key}, ${value})
               on conflict (key) do update set value = excluded.value, updated_at = now()`;
    }
  });
  const stale = ALL_FIELDS.filter((f) => f.type === "image" && f.key in values && before[f.key] && before[f.key] !== values[f.key]).map((f) => before[f.key]);
  await removeObjects(stale);
  await logActivity(admin, "memperbarui", "pengaturan situs", "Konten website");
  refreshSite();
  redirect("/admin/pengaturan?ok=saved");
}
