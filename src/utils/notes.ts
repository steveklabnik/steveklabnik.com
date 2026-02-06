import type { CollectionEntry } from "astro:content";
import { extractWikiLinkSlugs } from "./wikilinks";

export { extractWikiLinkSlugs };

export interface Backlink {
  slug: string;
  title: string;
}

/**
 * Strip file extension from a content collection entry ID to get a URL slug.
 */
export function noteSlug(id: string): string {
  return id.replace(/\.mdx?$/, "");
}

/**
 * Build a map from note slug to the list of notes that link to it.
 */
export function buildBacklinks(
  allNotes: CollectionEntry<"notes">[]
): Map<string, Backlink[]> {
  const backlinks = new Map<string, Backlink[]>();

  for (const note of allNotes) {
    const targets = extractWikiLinkSlugs(note.body ?? "");
    for (const target of targets) {
      if (!backlinks.has(target)) {
        backlinks.set(target, []);
      }
      backlinks.get(target)!.push({
        slug: noteSlug(note.id),
        title: note.data.title,
      });
    }
  }

  return backlinks;
}
