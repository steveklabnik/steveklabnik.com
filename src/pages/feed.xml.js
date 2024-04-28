import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await await getCollection("blog")
  const items = posts
    .sort((a, b) => b.data.pubDate - a.data.pubDate)
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/writing/${post.slug}/`,
    }));

  return rss({
    title: 'Steve Klabnik',
    description: 'Steve Klabnik\s blog',
    site: context.site,
    items,
  });
}
