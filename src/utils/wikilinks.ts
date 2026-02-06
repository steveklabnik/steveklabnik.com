/**
 * Shared wiki link utilities — used by both server-side (remark plugin, Vite API)
 * and client-side (React editor) code. No Node.js imports allowed here.
 */

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

/** Match [[target]] or [[target|display text]] */
export const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Extract wiki link target slugs from raw markdown body.
 */
export function extractWikiLinkSlugs(body: string): string[] {
  const regex = new RegExp(wikiLinkRegex.source, wikiLinkRegex.flags);
  const slugs: string[] = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    slugs.push(slugify(match[1]));
  }
  return slugs;
}
