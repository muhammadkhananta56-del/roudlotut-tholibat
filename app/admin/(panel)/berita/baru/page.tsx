import { requireAdmin } from "@/lib/auth/dal";
import { listCategories } from "@/lib/queries";
import NewsForm from "@/components/admin/NewsForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Berita baru" };

export default async function NewNews() {
  await requireAdmin();
  const categories = await listCategories("news");
  return (
    <>
      <PageHeader title="Berita baru" />
      <NewsForm categories={categories} initial={{ id: "", title: "", excerpt: "", body: "", categoryId: "", status: "draft", publishedAt: "", coverPath: "", coverUrl: "", coverAlt: "" }} />
    </>
  );
}
