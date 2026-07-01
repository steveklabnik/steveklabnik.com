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
        topic: z.enum([
            "rust", "ruby-rails", "open-source", "life",
            "philosophy-politics", "rest-hypermedia", "ai-llms", "atproto", "technology"
        ]).optional(),
    }),
});

const notesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        lastUpdated: z.date().optional(),
    }),
});

export const collections = {
  'blog': blogCollection,
  'notes': notesCollection,
};