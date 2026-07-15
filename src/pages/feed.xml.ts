import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import type { APIContext } from "astro";
import { excerpt, postSlug, sortByDateDesc } from "../utils/posts";

export async function getStaticPaths() {
  return [{ params: {} }];
}

export async function GET(context: APIContext) {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");

  const items = await Promise.all(
    sortByDateDesc(posts).map(async (post) => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);

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
    description: "Steve Klabniks blog",
    // `site` is set in astro.config.mjs, so this is always defined
    site: context.site!,
    items,
  });
}
