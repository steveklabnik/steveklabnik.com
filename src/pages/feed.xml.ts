import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { excerpt, postSlug, sortByDateDesc } from "../utils/posts";
import { postHtml } from "../utils/rendered";

export async function getStaticPaths() {
  return [{ params: {} }];
}

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");

  const items = await Promise.all(
    sortByDateDesc(posts).map(async (post) => {
      const content = await postHtml(post);

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description ?? excerpt(content),
        link: `/writing/${postSlug(post.id)}/`,
        content,
      };
    }),
  );

  return rss({
    title: "Steve Klabnik",
    description: "Steve Klabnik's blog",
    // `site` is set in astro.config.mjs, so this is always defined
    site: context.site!,
    items,
  });
}
