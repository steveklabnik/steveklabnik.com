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
- Blog posts live in `/src/content/blog/` as Markdown/MDX files
- Each post requires frontmatter with `title` and `pubDate` fields
- Posts are accessed via `/writing/[slug]` URLs
- The main writing page lists all posts chronologically

### Key Components
- `BaseLayout.astro` - Main layout wrapper with SEO meta tags
- `BlueskyPost.astro` - Renders embedded Bluesky posts
- Content collections defined in `/src/content/config.ts` provide type safety

### Deployment
- Configured for Vercel deployment with extensive redirects in `vercel.json`
- Static site generation with no server-side rendering
- RSS feed generated at `/feed.xml`

### Styling
- Tailwind CSS with Typography plugin for prose styling
- Global styles in `/src/styles/global.css`
- Design focuses on readability with minimal styling

## Development Workflow

When adding new blog posts:
1. Create a new `.md` or `.mdx` file in `/src/content/blog/`
2. Include required frontmatter (title, pubDate)
3. Use MDX for interactive components if needed

The site automatically handles URL generation based on filename.