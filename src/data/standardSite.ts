/**
 * Standard.site (https://standard.site) configuration: AT Protocol lexicon
 * records that mirror this site's content into Steve's PDS.
 *
 * The publication record lives at a fixed "self" rkey, and each blog post's
 * document record uses the post slug as its rkey, so every AT-URI is
 * derivable at build time without a lookup table. The sync script
 * (scripts/standard-site-sync.mjs) reads /standard-site.json from the built
 * site and upserts these records to the PDS.
 */

export const DID = "did:plc:3danwc67lo7obz2fmdg6jxcr";

export const PUBLICATION_COLLECTION = "site.standard.publication";
export const DOCUMENT_COLLECTION = "site.standard.document";

export const PUBLICATION_RKEY = "self";

export const PUBLICATION_AT_URI = `at://${DID}/${PUBLICATION_COLLECTION}/${PUBLICATION_RKEY}`;

export function documentAtUri(slug: string): string {
  return `at://${DID}/${DOCUMENT_COLLECTION}/${slug}`;
}

/**
 * Record keys allow a subset of characters; post slugs are used as rkeys
 * directly, so anything outside this alphabet can't get a document record.
 * https://atproto.com/specs/record-key
 */
export function isValidRkey(slug: string): boolean {
  return /^[A-Za-z0-9._~-]{1,512}$/.test(slug) && slug !== "." && slug !== "..";
}

/**
 * The site.standard.publication record value. The `icon` blob is added by
 * the sync script (blobs have to be uploaded, not declared), so it isn't
 * part of the build-time value. Colors mirror the light theme in global.css.
 */
export const PUBLICATION_RECORD = {
  $type: PUBLICATION_COLLECTION,
  url: "https://steveklabnik.com",
  name: "Steve Klabnik",
  description: "Steve Klabnik's personal website and blog",
  basicTheme: {
    $type: "site.standard.theme.basic",
    // --color-bg #faf5ff
    background: { $type: "site.standard.theme.color#rgb", r: 250, g: 245, b: 255 },
    // --color-text #1e293b
    foreground: { $type: "site.standard.theme.color#rgb", r: 30, g: 41, b: 59 },
    // --color-accent #6525c4
    accent: { $type: "site.standard.theme.color#rgb", r: 101, g: 37, b: 196 },
    accentForeground: { $type: "site.standard.theme.color#rgb", r: 255, g: 255, b: 255 },
  },
  preferences: {
    showInDiscover: true,
  },
};
