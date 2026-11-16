import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Dasbor Admin", template: "%s | Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-ivory-50">{children}</div>;
}
