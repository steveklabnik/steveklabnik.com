import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { formatDate, postSlug } from "../../utils/posts";
import { getTopicMetadata } from "../../utils/topics";
import { renderOgCard } from "../../utils/ogImage";

/**
 * Social cards: /og/writing/<slug>.png per post, plus /og/site.png as the
 * default for every other page. Post cards live under a `writing/` prefix so
 * a post can never collide with the site card.
 */
export async function getStaticPaths() {
  const posts = await getCollection("blog");

  return [
    {
      params: { slug: "site" },
      props: {
        title: "Steve Klabnik",
        meta: "Rust, Ruby, open source, and too much French philosophy",
      },
    },
    ...posts.map((post) => ({
      params: { slug: `writing/${postSlug(post.id)}` },
      props: {
        title: post.data.title,
        meta: [
          formatDate(post.data.pubDate),
          post.data.topic ? getTopicMetadata(post.data.topic)?.title : null,
        ]
          .filter(Boolean)
          .join(" · "),
      },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard(props as { title: string; meta: string });

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
