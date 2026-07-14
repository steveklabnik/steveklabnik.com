import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string().optional(),
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
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
    schema: z.object({
        title: z.string(),
        lastUpdated: z.date().optional(),
    }),
});

export const collections = {
  'blog': blogCollection,
  'notes': notesCollection,
};
