import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { DISCIPLINE_LABEL } from "@/content/types";
import fs from "fs";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // embed the cover from /public as a data URL (no network fetch at build)
  let coverDataUrl: string | undefined;
  if (project) {
    try {
      const filePath = path.join(process.cwd(), "public", project.cover.src);
      const buf = fs.readFileSync(filePath);
      coverDataUrl = `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      coverDataUrl = undefined;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0D0C0A",
          color: "#ECE7DC",
        }}
      >
        <div
          style={{
            width: "46%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px",
          }}
        >
          <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.08em", opacity: 0.6 }}>
            MUFASA® — {project ? project.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · ") : "Work"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: project && project.title.length > 10 ? 84 : 110,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {project?.title ?? "Work"}
            <span style={{ color: "#FF3B1F" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.08em", opacity: 0.5 }}>
            VICTOR OGINGA — PHOTOGRAPHER · DESIGNER · FILMMAKER
          </div>
        </div>
        {coverDataUrl ? (
          <img
            src={coverDataUrl}
            width={648}
            height={630}
            style={{ objectFit: "cover", width: "54%", height: 630 }}
            alt=""
          />
        ) : (
          <div style={{ width: "54%", height: 630, background: "#2A2824" }} />
        )}
      </div>
    ),
    size
  );
}
