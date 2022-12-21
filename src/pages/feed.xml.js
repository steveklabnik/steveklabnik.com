import rss from '@astrojs/rss';

export const get = () => rss({
  title: 'Steve Klabnik',
  description: 'Steve Klabnik\'s blog',
  site: 'https://steveklabnik.com',
  items: import.meta.glob('./**/*.md'),
  customData: `<language>en-us</language>`,
});
