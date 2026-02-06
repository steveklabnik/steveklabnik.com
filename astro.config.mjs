import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.ts";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://steveklabnik.com",
  integrations: [mdx(), react()],
  server: {
    host: true,
    port: 4321,
  },
  markdown: {
    remarkPlugins: [remarkWikiLinks],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
