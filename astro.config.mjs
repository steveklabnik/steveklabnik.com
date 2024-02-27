import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: 'https://steveklabnik.com',
  integrations: [mdx()],
  adapter: vercel()
});
