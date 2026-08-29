import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sardor Djamolov — Full-Stack / Software Engineer";

/**
 * The share card is the site's own type on the site's own paper — same ink,
 * same hairline, same wordmark. Latin throughout, in both locales, because
 * that is how the name is used professionally.
 */
export default async function OpengraphImage() {
  const fontsDir = join(
    process.cwd(),
    "node_modules",
    "geist",
    "dist",
    "fonts",
  );
  const [medium, mono] = await Promise.all([
    readFile(join(fontsDir, "geist-sans", "Geist-Medium.ttf")),
    readFile(join(fontsDir, "geist-mono", "GeistMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfaf8",
          color: "#14140f",
          padding: "72px 80px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontFamily: "GeistMono",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6d6d63",
          }}
        >
          <div style={{ width: 44, height: 2, background: "#c9c7bf" }} />
          Full-Stack / Software Engineer
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 118,
              lineHeight: 0.9,
              letterSpacing: "-0.045em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Sardor</span>
            <span style={{ color: "#3d3d36" }}>Djamolov</span>
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 30,
              letterSpacing: "-0.02em",
              color: "#3d3d36",
            }}
          >
            I build web &amp; mobile products from idea to production.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(20,20,15,0.14)",
            paddingTop: 26,
            fontFamily: "GeistMono",
            fontSize: 20,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6d6d63",
          }}
        >
          <span>Samarkand, Uzbekistan</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 10, height: 10, background: "#0f6b58" }} />
            {site.githubHandle}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, style: "normal", weight: 500 },
        { name: "GeistMono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
