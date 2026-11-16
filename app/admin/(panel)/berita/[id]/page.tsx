import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetNews, listCategories, one } from "@/lib/queries";
import { toLocalInput } from "@/lib/format";
import { publicUrl } from "@/lib/storage";
import NewsForm from "@/components/admin/NewsForm";
import { Flash, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Edit berita" };

export default async function EditNews({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const { id } = await params;
  const n = await adminGetNews(id);
  if (!n) notFound();
  const categories = await listCategories("news");
  return (
    <>
      <PageHeader title="Edit berita" />
      <Flash ok={one((await searchParams).ok)} />
      <NewsForm categories={categories} initial={{
        id: n.id, title: n.title, excerpt: n.excerpt, body: n.body, categoryId: n.category_id ?? "", status: n.status,
        publishedAt: toLocalInput(n.published_at), coverPath: n.cover_path ?? "", coverUrl: publicUrl(n.cover_path) ?? "", coverAlt: n.cover_alt,
      }} />
    </>
  );
}
