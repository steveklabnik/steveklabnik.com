/**
 * Standard.site (https://standard.site) configuration: AT Protocol lexicon
 * records that mirror this site's content into Steve's PDS.
 *
 * Both site.standard lexicons declare `key: "tid"`, so record keys must be
 * TIDs (13-char base32-sortable timestamps), not arbitrary strings. To keep
 * AT-URIs derivable at build time without a lookup table, each post's TID
 * is minted deterministically: the day comes from pubDate and the sub-day
 * microseconds and clock id are filled from a hash of the slug. The sync
 * script (scripts/standard-site-sync.mjs) reads /standard-site.json from
 * the built site and upserts these records to the PDS.
 */

export const DID = "did:plc:3danwc67lo7obz2fmdg6jxcr";

export const PUBLICATION_COLLECTION = "site.standard.publication";
export const DOCUMENT_COLLECTION = "site.standard.document";

const TID_ALPHABET = "234567abcdefghijklmnopqrstuvwxyz";
const MICROS_PER_DAY = 86_400_000_000n;

function fnv1a64(input: string): bigint {
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return hash;
}

/**
 * Deterministic TID for a post: 53 bits of microseconds since epoch
 * (pubDate's day + slug-hashed time-of-day) and a 10-bit slug-hashed
 * clock id. Same slug + pubDate always yields the same TID, and TIDs
 * still sort by publication day. Changing either mints a new record;
 * the sync script reports the old one as an orphan.
 */
export function documentTid(slug: string, pubDate: Date): string {
  const hash = fnv1a64(slug);
  const micros = BigInt(pubDate.getTime()) * 1000n + (hash % MICROS_PER_DAY);
  let value = (micros << 10n) | ((hash >> 40n) & 0x3ffn);
  let tid = "";
  for (let i = 0; i < 13; i++) {
    tid = TID_ALPHABET[Number(value & 31n)] + tid;
    value >>= 5n;
  }
  return tid;
}

// documentTid("publication", new Date("2026-07-15")), frozen as a literal
// because public/.well-known/site.standard.publication must contain the
// same AT-URI (the manifest endpoint asserts they match at build time).
export const PUBLICATION_RKEY = "3mqobmje6phqb";

export const PUBLICATION_AT_URI = `at://${DID}/${PUBLICATION_COLLECTION}/${PUBLICATION_RKEY}`;

export function documentAtUri(slug: string, pubDate: Date): string {
  return `at://${DID}/${DOCUMENT_COLLECTION}/${documentTid(slug, pubDate)}`;
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
