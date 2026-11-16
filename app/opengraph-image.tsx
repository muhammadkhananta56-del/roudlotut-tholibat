import { ImageResponse } from "next/og";

export const alt = "PP. ROUDLOTUT THOLIBAT, Yayasan Pondok Pesantren";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#35443a",
          color: "#f5f1e9",
          padding: "0 90px",
          position: "relative",
        }}
      >
        <svg
          width="560"
          height="560"
          viewBox="0 0 100 100"
          style={{ position: "absolute", right: -60, top: 35 }}
          fill="none"
          stroke="#d6c59b"
          strokeOpacity="0.45"
          strokeWidth="0.8"
        >
          <rect x="17" y="17" width="66" height="66" />
          <rect x="17" y="17" width="66" height="66" transform="rotate(45 50 50)" />
          <rect x="31" y="31" width="38" height="38" />
          <rect x="31" y="31" width="38" height="38" transform="rotate(45 50 50)" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#d6c59b", letterSpacing: 8 }}>YAYASAN PONDOK PESANTREN</div>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.02, marginTop: 24 }}>PP. ROUDLOTUT</div>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.02, color: "#e6cf9b" }}>THOLIBAT</div>
        </div>
      </div>
    ),
    size
  );
}
