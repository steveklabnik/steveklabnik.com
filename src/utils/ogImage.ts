import { createRequire } from "node:module";
import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

/**
 * Build-time social card rendering.
 *
 * Posts have no artwork, so og:image is generated: title, date and topic set
 * in Literata on the light theme's palette. satori lays the card out as SVG
 * and resvg rasterizes it, because every consumer that isn't standard.site
 * (Slack, Mastodon, Discord, search previews) wants a PNG.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Light theme, from src/styles/global.css.
const BG = "#faf5ff";
const TEXT = "#1e293b";
const SECONDARY = "#475569";
const ACCENT = "#6525c4";

// satori can't read woff2, and the variable Literata build trips up its
// opentype fork, so the card uses the static @fontsource weights. Resolved
// through node rather than a relative path, so the build's cwd doesn't
// matter.
const require = createRequire(import.meta.url);
const FONT_FILES = {
  400: "@fontsource/literata/files/literata-latin-400-normal.woff",
  700: "@fontsource/literata/files/literata-latin-700-normal.woff",
} as const;

type Font = { name: string; data: Buffer; weight: 400 | 700; style: "normal" };

let fonts: Promise<Font[]> | null = null;

function loadFonts(): Promise<Font[]> {
  fonts ??= Promise.all(
    Object.entries(FONT_FILES).map(async ([weight, specifier]) => ({
      name: "Literata",
      data: await readFile(require.resolve(specifier)),
      weight: Number(weight) as 400 | 700,
      style: "normal" as const,
    })),
  );

  return fonts;
}

/**
 * Minimal element factory: satori consumes React-shaped objects but doesn't
 * need React itself, so the tree is built by hand and asserted into the
 * ReactNode its signature asks for.
 */
function h(style: Record<string, unknown>, children?: unknown): ReactNode {
  return {
    type: "div",
    props: { style: { display: "flex", ...style }, children },
  } as unknown as ReactNode;
}

/**
 * Title size, stepped down by length so the longest titles (~80 characters)
 * still fit the card in three lines without measuring text.
 */
function titleSize(title: string): number {
  if (title.length <= 32) return 76;
  if (title.length <= 56) return 62;
  return 50;
}

export async function renderOgCard({
  title,
  meta,
}: {
  title: string;
  meta: string;
}): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await satori(
    h(
      {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: BG,
        fontFamily: "Literata",
      },
      [
        h({ height: 16, background: ACCENT }),
        h(
          {
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between",
            padding: "56px 72px 64px",
          },
          [
            h(
              {
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 4,
                color: ACCENT,
              },
              "STEVEKLABNIK.COM",
            ),
            h(
              {
                fontSize: titleSize(title),
                fontWeight: 700,
                lineHeight: 1.15,
                color: TEXT,
              },
              title,
            ),
            h({ fontSize: 28, color: SECONDARY }, meta),
          ],
        ),
      ],
    ),
    { width: OG_WIDTH, height: OG_HEIGHT, fonts: await loadFonts() },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_WIDTH },
  })
    .render()
    .asPng();

  // resvg hands back a Buffer, whose ArrayBufferLike backing store doesn't
  // satisfy BodyInit. Copy into a plainly ArrayBuffer-backed view so the
  // endpoint can return it directly.
  const bytes = new Uint8Array(png.byteLength);
  bytes.set(png);

  return bytes;
}
