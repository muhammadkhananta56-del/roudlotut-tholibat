"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation";
import { str, zodErrors, type FormState } from "@/lib/form-state";

// Hash pembanding supaya waktu respons sama baik email ada maupun tidak (mencegah user enumeration).
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("tidak-dipakai-sebagai-password", 12));
const MAX_FAILS_PER_ACCOUNT = 5;
const MAX_FAILS_PER_IP = 20;

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: str(fd, "email"), password: String(fd.get("password") ?? "") });
  if (!parsed.success) return { errors: zodErrors(parsed.error) };
  const { email, password } = parsed.data;

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
  const sql = db();

  await sql`delete from login_attempts where created_at < now() - interval '1 day'`;
  const [{ acc }] = await sql<{ acc: number }[]>`
    select count(*)::int as acc from login_attempts where key = ${`a:${email}`} and created_at > now() - interval '15 minutes'`;
  const [{ byIp }] = await sql<{ byIp: number }[]>`
    select count(*)::int as "byIp" from login_attempts where key = ${`i:${ip}`} and created_at > now() - interval '15 minutes'`;
  if (acc >= MAX_FAILS_PER_ACCOUNT || byIp >= MAX_FAILS_PER_IP) {
    return { message: "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit." };
  }

  const rows = await sql<{ id: string; password_hash: string }[]>`select id, password_hash from admins where email = ${email}`;
  const admin = rows[0];
  const ok = await bcrypt.compare(password, admin?.password_hash ?? (await getDummyHash()));
  if (!admin || !ok) {
    await sql`insert into login_attempts (key) values (${`a:${email}`}), (${`i:${ip}`})`;
    return { message: "Email atau password salah." };
  }

  await sql`delete from login_attempts where key = ${`a:${email}`}`;
  await sql`update admins set last_login_at = now() where id = ${admin.id}`;
  await createSession(admin.id);

  const next = str(fd, "next");
  redirect(next.startsWith("/admin") && !next.startsWith("//") && !next.includes("\\") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/panel-akses");
}
