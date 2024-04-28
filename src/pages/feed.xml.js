import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  const posts = await pagesGlobToRssItems(import.meta.glob('../pages/writing/*.{md,mdx}'));
  const items = posts
    .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate))
    .map(({ pubDate, title, link }) => ({
      title,
      link,
      pubDate: new Date(pubDate),
    }));

  return rss({
    title: 'Steve Klabnik',
    description: 'Steve Klabnik\s blog',
    site: context.site,
    items,
  });
}
