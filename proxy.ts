import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lapisan pertama (cepat): cookie sesi harus ada dan valid sebelum halaman /admin dirender.
// Lapisan kedua: setiap halaman dan Server Action admin memanggil requireAdmin() yang
// memeriksa ulang ke database (akun yang dihapus langsung kehilangan akses).
// Pengunjung tanpa sesi melihat 404 di /admin, sehingga alamat login (/panel-akses) tidak terbuka.
async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("rt_admin")?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await hasValidSession(req);
  if (pathname === "/panel-akses") {
    return authed ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (!authed) return NextResponse.rewrite(new URL("/halaman-tidak-ada", req.url), { status: 404 });
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*", "/panel-akses"] };
