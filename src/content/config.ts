import { z, defineCollection } from 'astro:content';

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
});

export const collections = {
  'blog': blogCollection,
};