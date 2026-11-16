import { notFound } from "next/navigation";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetGallery, listCategories } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import GalleryEditForm from "@/components/admin/GalleryEditForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Edit foto" };

export default async function EditPhoto({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const g = await adminGetGallery((await params).id);
  if (!g) notFound();
  const cats = await listCategories("gallery");
  return (
    <>
      <PageHeader title="Edit foto" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="panel overflow-hidden self-start"><Image src={publicUrl(g.path)!} alt={g.title || "Foto galeri"} width={g.width} height={g.height} unoptimized className="h-auto w-full" /></div>
        <div className="panel p-6"><GalleryEditForm id={g.id} categories={cats} initial={{ title: g.title, description: g.description, categoryId: g.category_id ?? "", showOnHome: g.show_on_home }} /></div>
      </div>
    </>
  );
}
