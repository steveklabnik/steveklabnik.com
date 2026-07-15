import { readFile } from "node:fs/promises";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import { excerpt, htmlToText, postSlug, sortByDateDesc } from "../utils/posts";
import {
  DID,
  DOCUMENT_COLLECTION,
  PUBLICATION_AT_URI,
  PUBLICATION_RECORD,
  PUBLICATION_RKEY,
  documentTid,
} from "../data/standardSite";

export async function getStaticPaths() {
  return [{ params: {} }];
}

/**
 * Standard.site sync manifest: the desired state of Steve's
 * site.standard.* records, keyed by rkey (TIDs — the lexicons require
 * them). Consumed by scripts/standard-site-sync.mjs, which diffs it
 * against the PDS.
 */
export async function GET() {
  // The static verification endpoint can't be generated (Astro ignores
  // dot-directories under src/pages), so fail the build if it drifts
  // from the configured publication AT-URI.
  const wellKnown = await readFile(
    "public/.well-known/site.standard.publication",
    "utf8",
  );
  if (wellKnown.trim() !== PUBLICATION_AT_URI) {
    throw new Error(
      `public/.well-known/site.standard.publication (${wellKnown.trim()}) ` +
        `doesn't match PUBLICATION_AT_URI (${PUBLICATION_AT_URI})`,
    );
  }

  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");

  const documents: Record<string, object> = {};
  const slugForTid: Record<string, string> = {};
  for (const post of sortByDateDesc(posts)) {
    const slug = postSlug(post.id);
    const tid = documentTid(slug, post.data.pubDate);
    // The slug hash fills the TID's sub-day bits, so a collision needs
    // two same-day posts with colliding hashes — but a silent overwrite
    // would desync a record, so check anyway.
    if (slugForTid[tid]) {
      throw new Error(`TID collision: ${slug} vs ${slugForTid[tid]} (${tid})`);
    }
    slugForTid[tid] = slug;

    const { Content } = await render(post);
    const html = await container.renderToString(Content);

    documents[tid] = {
      $type: DOCUMENT_COLLECTION,
      site: PUBLICATION_AT_URI,
      path: `/writing/${slug}/`,
      title: post.data.title,
      description: post.data.description ?? excerpt(html),
      textContent: htmlToText(html),
      ...(post.data.topic ? { tags: [post.data.topic] } : {}),
      publishedAt: post.data.pubDate.toISOString(),
    };
  }

  return Response.json({
    did: DID,
    publication: { rkey: PUBLICATION_RKEY, value: PUBLICATION_RECORD },
    documents,
  });
}
