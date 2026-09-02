import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';

/**
 * Wrap a loader so warnings matching `ignore` are dropped.
 *
 * The notes collection is allowed to be empty, and glob() otherwise warns on
 * every content sync that its directory is missing (or holds no entries).
 * Filtering the warning rather than skipping load() keeps the dev-mode file
 * watcher registered, so the first note created shows up without restarting
 * the dev server. Pair this with getNotes() in src/utils/notes.ts, which
 * skips getCollection() for a collection that has no entries.
 */
function quiet(loader: Loader, ignore: RegExp[]): Loader {
  return {
    ...loader,
    load: (context) => {
      const logger = Object.create(context.logger) as typeof context.logger;
      logger.warn = (message: string) => {
        if (ignore.some((pattern) => pattern.test(message))) return;
        context.logger.warn(message);
      };

      return loader.load({ ...context, logger });
    },
  };
}

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
    loader: quiet(
        glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
        [/base directory .* does not exist/, /No files found matching/]
    ),
    schema: z.object({
        title: z.string(),
        lastUpdated: z.date().optional(),
    }),
});

export const collections = {
  'blog': blogCollection,
  'notes': notesCollection,
};
