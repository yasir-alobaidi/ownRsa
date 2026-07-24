import { ImageResponse } from "next/og";

// Required under output:"export" -- this route has no runtime params, so it
// pre-renders to a static PNG at build time like any other export page.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Texas Roadside Assist — 24/7 Roadside Assistance in Dallas";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#14171F",
          color: "#F6F5F1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 44 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 18,
              background: "#14171F",
              border: "6px solid #FF6A2C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#FF6A2C", display: "flex" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>TEXAS</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#FF6A2C", letterSpacing: 4 }}>
              ROADSIDE ASSIST
            </span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 950 }}>
          24/7 Roadside Assistance in Dallas
        </div>
        <div style={{ display: "flex", fontSize: 27, marginTop: 30, color: "#B7BDCC" }}>
          Towing · Battery · Tires · Lockouts · Fuel Delivery · Winching
        </div>
      </div>
    ),
    { ...size }
  );
}
