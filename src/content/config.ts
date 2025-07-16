import { z, defineCollection } from 'astro:content';
import { basename, extname } from 'node:path';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        blog: z.string().optional(),
        series: z.object({
            slug: z.string(),
            order: z.number(),
        }).optional(),
    }),
    // Keep slugs stable even when files are moved into subfolders
    slug: ({ id }) => basename(id, extname(id)),
});

export const collections = {
  'blog': blogCollection,
};
