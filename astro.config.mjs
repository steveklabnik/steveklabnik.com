import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.ts";
import editorApiPlugin from "./src/plugins/viteEditorApi.ts";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://steveklabnik.com",
  // Astro 7 defaults to JSX-style whitespace stripping, which deletes the
  // space between adjacent inline elements (nav links, dates) in rendered
  // text. Keep the old whitespace-collapsing behavior instead.
  compressHTML: true,
  integrations: [mdx(), react()],
  server: {
    host: true,
    port: 4321,
  },
  markdown: {
    // Astro 7 renders markdown with Sätteri by default, which doesn't run
    // remark plugins; keep the unified/remark pipeline for remarkWikiLinks.
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkWikiLinks],
    }),
  },
  vite: {
    plugins: [tailwindcss(), editorApiPlugin()],
  },
});
