"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { db, isUuid } from "@/lib/db";
import { scheduleSchema } from "@/lib/validation";
import { str, zodErrors, type FormState } from "@/lib/form-state";
import { fromLocalInput } from "@/lib/format";
import { adminGetSchedule } from "@/lib/queries";
import { logActivity, refreshSite } from "@/lib/actions-util";

export async function saveScheduleAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const parsed = scheduleSchema.safeParse({
    title: str(fd, "title"),
    speaker: str(fd, "speaker"),
    location: str(fd, "location"),
    description: str(fd, "description"),
    startsAt: str(fd, "startsAt"),
    endsAt: str(fd, "endsAt"),
    status: str(fd, "status") || "scheduled",
    isPublished: fd.get("isPublished") === "on",
  });
  if (!parsed.success) return { errors: zodErrors(parsed.error) };
  const v = parsed.data;
  const startsAt = fromLocalInput(v.startsAt)!;
  const endsAt = v.endsAt ? fromLocalInput(v.endsAt) : null;
  const sql = db();

  try {
    if (id) {
      if (!isUuid(id) || !(await adminGetSchedule(id))) return { message: "Jadwal tidak ditemukan. Mungkin sudah dihapus." };
      await sql`update schedules set title = ${v.title}, speaker = ${v.speaker}, location = ${v.location},
        description = ${v.description}, starts_at = ${startsAt}, ends_at = ${endsAt}, status = ${v.status},
        is_published = ${v.isPublished}, updated_at = now() where id = ${id}`;
    } else {
      await sql`insert into schedules (title, speaker, location, description, starts_at, ends_at, status, is_published)
        values (${v.title}, ${v.speaker}, ${v.location}, ${v.description}, ${startsAt}, ${endsAt}, ${v.status}, ${v.isPublished})`;
    }
  } catch (e) {
    console.error("saveScheduleAction gagal", e);
    return { message: "Gagal menyimpan jadwal. Coba lagi." };
  }
  await logActivity(admin, id ? "mengubah" : "membuat", "jadwal pengajian", v.title);
  refreshSite();
  redirect("/admin/jadwal?ok=saved");
}

export async function setScheduleStatusAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status");
  if (isUuid(id) && ["scheduled", "done", "cancelled"].includes(status)) {
    const old = await adminGetSchedule(id);
    if (old) {
      await db()`update schedules set status = ${status}, updated_at = now() where id = ${id}`;
      await logActivity(admin, `menandai ${status === "done" ? "selesai" : status === "cancelled" ? "dibatalkan" : "terjadwal"}`, "jadwal pengajian", old.title);
      refreshSite();
    }
  }
  redirect("/admin/jadwal?ok=updated");
}

export async function deleteScheduleAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const old = isUuid(id) ? await adminGetSchedule(id) : null;
  if (old) {
    await db()`delete from schedules where id = ${id}`;
    await logActivity(admin, "menghapus", "jadwal pengajian", old.title);
    refreshSite();
  }
  redirect("/admin/jadwal?ok=deleted");
}
