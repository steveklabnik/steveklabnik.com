import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://steveklabnik.com",
  integrations: [mdx(), react()],
  server: {
    host: true,
    port: 4321,
  },
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
