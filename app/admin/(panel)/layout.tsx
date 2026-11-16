import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/dal";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <AdminNav name={admin.name} />
      <div className="lg:pl-64"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div></div>
    </>
  );
}
