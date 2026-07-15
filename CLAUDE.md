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

### Standard.site (AT Protocol)
- The site publishes [standard.site](https://standard.site) lexicon records (`site.standard.publication` + one `site.standard.document` per post) to Steve's PDS
- Config (DID, AT-URI helpers, publication record) lives in `src/data/standardSite.ts`; the lexicons require TID record keys, so document rkeys are TIDs minted deterministically from pubDate + a slug hash — AT-URIs still derive at build time with no lookup table. Changing a post's slug or pubDate mints a new record (the old one shows up as an orphan)
- The build emits a sync manifest at `/standard-site.json` (`src/pages/standard-site.json.ts`) with the desired state of every record
- Sync runs **automatically after every production deploy** via a local Netlify build plugin (`plugins/netlify-standard-site/`, `onSuccess` hook); it needs `STANDARD_SITE_APP_PASSWORD` (a Bluesky app password) set in the Netlify environment, and skips deploy previews/branch deploys
- `npm run sync:standard-site` (`scripts/standard-site-sync.mjs`) is the same sync run manually: `--dry-run` needs no auth; `--prune` deletes records for removed posts (deliberately never passed in CI)
- Verification: `public/.well-known/site.standard.publication` returns the publication AT-URI, and each post page gets a `<link rel="site.standard.document">` tag via `BaseLayout`

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
