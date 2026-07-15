import type { CollectionEntry } from "astro:content";

/**
 * Blog entry ids include their date folder (e.g. "2020-01/some-post");
 * URLs don't. Strip the prefix to get the slug used in /writing/ links.
 */
export function postSlug(id: string): string {
  return id.replace(/^\d{4}-\d{2}\//, "");
}

/**
 * The site-wide date format ("Jan 5, 2026"). UTC, because pubDate and
 * lastUpdated parse as UTC midnight.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Plain-text rendering of post HTML: tags stripped, entities decoded. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Plain-text excerpt of rendered post HTML, for feed readers and record
 * descriptions that show summaries instead of the full content.
 */
export function excerpt(html: string, maxLength = 280): string {
  const text = htmlToText(html);
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLength)) + "…";
}

/** Returns a copy of the posts sorted newest first. */
export function sortByDateDesc(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}
