import { requireAdmin } from "@/lib/auth/dal";
import ScheduleForm from "@/components/admin/ScheduleForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Jadwal baru" };

export default async function NewSchedule() {
  await requireAdmin();
  return (<><PageHeader title="Jadwal pengajian baru" /><ScheduleForm initial={{ id: "", title: "", speaker: "", location: "", description: "", startsAt: "", endsAt: "", status: "scheduled", isPublished: true }} /></>);
}
