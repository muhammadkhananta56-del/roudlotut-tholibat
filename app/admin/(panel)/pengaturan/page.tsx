import { requireAdmin } from "@/lib/auth/dal";
import { ALL_FIELDS, SETTING_GROUPS, getSettings } from "@/lib/settings";
import { publicUrl } from "@/lib/storage";
import { one } from "@/lib/queries";
import SettingsForm from "@/components/admin/SettingsForm";
import { Flash, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Pengaturan situs" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const st = await getSettings();
  const values: Record<string, string> = {};
  const imageUrls: Record<string, string> = {};
  for (const f of ALL_FIELDS) {
    values[f.key] = st[f.key] ?? "";
    if (f.type === "image") imageUrls[f.key] = publicUrl(st[f.key]) ?? "";
  }
  return (
    <>
      <PageHeader title="Pengaturan situs" description="Isi profil, sejarah, visi misi, kontak, dan foto utama. Bagian yang dikosongkan tidak ditampilkan di website." />
      <Flash ok={one((await searchParams).ok)} />
      <SettingsForm groups={SETTING_GROUPS} values={values} imageUrls={imageUrls} />
    </>
  );
}
