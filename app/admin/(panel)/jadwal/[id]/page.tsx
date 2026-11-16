import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetSchedule } from "@/lib/queries";
import { toLocalInput } from "@/lib/format";
import ScheduleForm from "@/components/admin/ScheduleForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Edit jadwal" };

export default async function EditSchedule({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const s = await adminGetSchedule((await params).id);
  if (!s) notFound();
  return (
    <>
      <PageHeader title="Edit jadwal pengajian" />
      <ScheduleForm initial={{ id: s.id, title: s.title, speaker: s.speaker, location: s.location, description: s.description, startsAt: toLocalInput(s.starts_at), endsAt: toLocalInput(s.ends_at), status: s.status, isPublished: s.is_published }} />
    </>
  );
}
