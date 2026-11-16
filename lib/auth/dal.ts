import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db, isUuid } from "@/lib/db";
import { readSession } from "@/lib/auth/session";

export type Admin = { id: string; email: string; name: string };

export const getAdmin = cache(async (): Promise<Admin | null> => {
  const id = await readSession();
  if (!id || !isUuid(id)) return null;
  const rows = await db()<Admin[]>`select id, email, name from admins where id = ${id}`;
  return rows[0] ?? null;
});

/** Wajib dipanggil di setiap halaman admin dan setiap Server Action admin. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/panel-akses");
  return admin;
}
