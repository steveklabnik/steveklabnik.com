# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server at http://localhost:4321
- `npm start` - Alias for npm run dev
- `npm run build` - Build the production site to ./dist/
- `npm run preview` - Preview the production build locally

## Architecture

This is an Astro static site for steveklabnik.com with the following structure:

### Content System
- Content collections are defined in `src/content.config.ts` (Content Layer API with `glob()` loaders)
- Blog posts live in `/src/content/blog/YYYY-MM/` subdirectories as Markdown/MDX files
- Each post requires frontmatter with `title` and `pubDate`; optional fields: `description` (used for the RSS item summary, otherwise auto-excerpted), `topic` (one of the values enumerated in the schema), and `series` (`slug` + `order`)
- Posts are accessed via `/writing/[slug]` URLs — the `YYYY-MM/` prefix of the entry id is stripped when generating URLs
- Series metadata lives in `src/data/series.ts`; topic metadata in `src/utils/topics.ts`
- A `notes` collection (`/src/content/notes/`, may not exist yet) powers `/notes/` — interconnected pages with `[[wikilink]]` syntax and backlinks
- `remarkWikiLinks` (`src/plugins/remarkWikiLinks.ts`) resolves `[[wikilinks]]`; Astro is configured with `markdown.processor: unified(...)` to keep the remark pipeline (Astro 7's default Sätteri pipeline doesn't run remark plugins)
- `compressHTML: true` is set deliberately — the Astro 7 default ('jsx') deletes the space between adjacent inline elements in rendered text

### Key Components
- `BaseLayout.astro` - Main layout wrapper with SEO meta tags
- `BlueskyPost.astro` - Renders embedded Bluesky posts
- `src/components/editor/` - A dev-only in-browser content editor (React), backed by the `editor-api` Vite plugin (`src/plugins/viteEditorApi.ts`) serving `/__editor/*` endpoints in `npm run dev`

### Deployment
- Deployed on Netlify (`netlify.toml`); redirects for legacy URLs live in `public/_redirects`
- Static site generation with no server-side rendering
- RSS feed generated at `/feed.xml` (`src/pages/feed.xml.ts`, renders full post content via the Container API)

### Styling
- Tailwind CSS 4 via `@tailwindcss/vite`; global styles and theme variables in `/src/styles/global.css`
- Legacy JS config (`tailwind.config.js`) is bridged in with `@config` and holds the typography plugin customizations
- Typography plugin for prose styling; class-based dark mode

## Development Workflow

When adding new blog posts:
1. Create a new `.md` or `.mdx` file in `/src/content/blog/YYYY-MM/` (current year-month)
2. Include required frontmatter (title, pubDate)
3. Use MDX for interactive components if needed

The site automatically handles URL generation based on filename.

One-off maintenance scripts live in `scripts/` (e.g. `assign-topics.mjs`).
