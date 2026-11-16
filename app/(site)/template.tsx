// Template dibuat ulang pada setiap navigasi, sehingga transisi halaman halus (hanya fade dan geser 10px).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
