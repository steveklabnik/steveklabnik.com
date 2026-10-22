import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { excerpt, postSlug, sortByDateDesc } from "../../../utils/posts";
import { postHtml } from "../../../utils/rendered";
import { RSS_ITEM_LIMIT, withCdataContent } from "../../../utils/rss";
import { getPostsByTopic, getTopicMetadata } from "../../../utils/topics";

/**
 * Per-topic feeds, so someone who wants the Rust posts isn't signing up for
 * fifteen years of everything else. Includes the latest 20 posts within
 * this topic, rather than filtering the main feed's latest 20 posts.
 */
export async function getStaticPaths() {
  const allPosts = await getCollection("blog");

  return [...getPostsByTopic(allPosts).entries()].map(([slug, posts]) => ({
    params: { slug },
    props: { slug, posts },
  }));
}

export async function GET(context: APIContext) {
  const { slug, posts } = context.props as {
    slug: string;
    posts: Awaited<ReturnType<typeof getCollection<"blog">>>;
  };
  const metadata = getTopicMetadata(slug);

  const items = await Promise.all(
    sortByDateDesc(posts).slice(0, RSS_ITEM_LIMIT).map(async (post) => {
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

  return withCdataContent(await rss({
    title: `Steve Klabnik — ${metadata?.title ?? slug}`,
    description:
      metadata?.description ?? `Steve Klabnik's posts about ${slug}`,
    // `site` is set in astro.config.mjs, so this is always defined
    site: context.site!,
    customData: "<ttl>15</ttl>",
    items,
  }));
}
