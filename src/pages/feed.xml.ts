import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import type { APIContext } from "astro";

export async function getStaticPaths() {
  return [{ params: {} }];
}

export async function GET(context: APIContext) {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");

  const items = await Promise.all(
    posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(async (post) => {
        const { Content } = await render(post);

        return {
          title: post.data.title,
          pubDate: post.data.pubDate,
          description: post.data.description,
          link: `/writing/${post.slug.replace(/^\d{4}-\d{2}\//, '')}/`,
          content: await container.renderToString(Content),
        };
      }),
  );

  return rss({
    title: "Steve Klabnik",
    description: "Steve Klabniks blog",
    site: context.site,
    items,
  });
}
