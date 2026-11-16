import { requireAdmin } from "@/lib/auth/dal";
import { listCategories, one } from "@/lib/queries";
import { addCategoryAction, deleteCategoryAction, renameCategoryAction } from "@/app/actions/categories";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import SubmitButton from "@/components/admin/SubmitButton";
import { Flash, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Kategori" };

export default async function Categories({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const [news, gallery] = await Promise.all([listCategories("news"), listCategories("gallery")]);
  const groups = [{ kind: "news", title: "Kategori berita", items: news }, { kind: "gallery", title: "Kategori galeri", items: gallery }];
  return (
    <>
      <PageHeader title="Kategori" description="Menghapus kategori tidak menghapus isinya; berita atau foto menjadi ‘tanpa kategori’." />
      <Flash ok={one(sp.ok)} err={one(sp.err)} />
      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => (
          <section key={g.kind} className="panel p-5" aria-labelledby={`h-${g.kind}`}>
            <h2 id={`h-${g.kind}`} className="text-xl">{g.title}</h2>
            <ul className="mt-4 divide-y divide-sage-200">
              {g.items.length === 0 && <li className="py-3 text-ink-600">Belum ada kategori.</li>}
              {g.items.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-2 py-3">
                  <form action={renameCategoryAction} className="flex min-w-0 flex-1 gap-2">
                    <input type="hidden" name="id" value={c.id} /><input type="hidden" name="kind" value={g.kind} />
                    <label className="sr-only" htmlFor={`n-${c.id}`}>Nama kategori</label>
                    <input id={`n-${c.id}`} name="name" defaultValue={c.name} className="field min-w-0" maxLength={60} required />
                    <SubmitButton className="abtn abtn-outline" pendingText="…">Ubah</SubmitButton>
                  </form>
                  <ConfirmDelete action={deleteCategoryAction} id={c.id} extra={{ kind: g.kind }} title={c.name} message="Isi kategori ini akan menjadi ‘tanpa kategori’." iconOnly />
                </li>
              ))}
            </ul>
            <form action={addCategoryAction} className="mt-5 flex gap-2 border-t border-sage-200 pt-5">
              <input type="hidden" name="kind" value={g.kind} />
              <label className="sr-only" htmlFor={`add-${g.kind}`}>Kategori baru</label>
              <input id={`add-${g.kind}`} name="name" placeholder="Kategori baru" className="field" maxLength={60} required />
              <SubmitButton className="abtn abtn-primary" pendingText="…">Tambah</SubmitButton>
            </form>
          </section>
        ))}
      </div>
    </>
  );
}
