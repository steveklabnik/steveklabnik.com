import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Steve Klabnik',
    description: 'Steve Klabnik\s blog',
    site: context.site,
    items: await pagesGlobToRssItems(
      import.meta.glob('./writing/*.{md,mdx}'),
    ),
  });
}
