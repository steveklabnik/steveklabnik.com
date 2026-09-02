import type { CollectionEntry } from "astro:content";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx/container-renderer";
import { loadRenderers } from "astro:container";
import { excerpt } from "./posts";

let rendered: Promise<Map<string, string>> | null = null;

/**
 * Rendered HTML for every blog post, keyed by entry id, rendered once per
 * build.
 *
 * The feed (full content), the standard.site manifest (content plus an
 * excerpt) and every post page (its meta description) all need the rendered
 * body, and the Container API is the only way to get it outside a component
 * render. Rendering the collection once and sharing the result keeps that to
 * a single pass — which also means BlueskyPost's build-time engagement fetch
 * happens once, so the counts in feed.xml and standard-site.json agree.
 */
export function renderedPosts(): Promise<Map<string, string>> {
  rendered ??= (async () => {
    const renderers = await loadRenderers([getMDXRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const posts = await getCollection("blog");

    const html = new Map<string, string>();
    for (const post of posts) {
      const { Content } = await render(post);
      html.set(post.id, await container.renderToString(Content));
    }
    return html;
  })();

  return rendered;
}

/** Rendered HTML for one post. */
export async function postHtml(
  entry: CollectionEntry<"blog">,
): Promise<string> {
  const html = (await renderedPosts()).get(entry.id);
  if (html === undefined) {
    throw new Error(`no rendered HTML for ${entry.id}`);
  }
  return html;
}

/**
 * A post's description for `<meta name="description">` and og:description:
 * the frontmatter `description` when set, otherwise the opening of the post
 * itself. Capped short, because that's where search results and social cards
 * truncate.
 */
export async function postDescription(
  entry: CollectionEntry<"blog">,
): Promise<string> {
  return entry.data.description ?? excerpt(await postHtml(entry), 160);
}
