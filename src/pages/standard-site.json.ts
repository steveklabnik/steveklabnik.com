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
  isValidRkey,
} from "../data/standardSite";

export async function getStaticPaths() {
  return [{ params: {} }];
}

/**
 * Standard.site sync manifest: the desired state of Steve's
 * site.standard.* records, keyed by rkey. Consumed by
 * scripts/standard-site-sync.mjs, which diffs it against the PDS.
 */
export async function GET() {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");

  const documents: Record<string, object> = {};
  for (const post of sortByDateDesc(posts)) {
    const slug = postSlug(post.id);
    // Slugs double as record keys; anything outside the rkey alphabet
    // can't be synced. No current post trips this.
    if (!isValidRkey(slug)) continue;

    const { Content } = await render(post);
    const html = await container.renderToString(Content);

    documents[slug] = {
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
