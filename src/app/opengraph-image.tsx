import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MUFASA® — Victor Oginga, Photography · Design · Film";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0C0A",
          color: "#ECE7DC",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: "0.08em", color: "#ECE7DC", opacity: 0.6 }}>
          <span>VICTOR OGINGA</span>
          <span>( CONTACT SHEET )</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 170, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
            <span>MUFASA</span>
            <span style={{ color: "#FF3B1F", fontSize: 60, marginTop: 24 }}>®</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 24, opacity: 0.8 }}>
            Photography · Design · Film
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: "0.08em", opacity: 0.5 }}>
          <span>{new URL(siteConfig.url).host}</span>
          <span style={{ color: "#FF3B1F" }}>*</span>
        </div>
      </div>
    ),
    size
  );
}
