import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import paths from "./legacy-images.json" with { type: "json" };

/** Preserve hotlinks and cached feed images without duplicating source assets. */
export async function copyLegacyImages(output, root = new URL("../", import.meta.url)) {
  for (const [legacyPath, assetPath] of Object.entries(paths)) {
    // URL encodes spaces while retaining historical filename case.
    const destination = new URL(legacyPath, output);
    await mkdir(dirname(fileURLToPath(destination)), { recursive: true });
    await copyFile(new URL(assetPath, root), destination);
  }
}

export default function legacyImages() {
  return {
    name: "legacy-images",
    hooks: {
      "astro:build:done": async ({ dir }) => copyLegacyImages(dir),
    },
  };
}
