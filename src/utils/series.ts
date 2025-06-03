import { series } from '../data/series.ts';
import type { CollectionEntry } from 'astro:content';

export interface SeriesNavigation {
  prev: CollectionEntry<'blog'> | null;
  next: CollectionEntry<'blog'> | null;
  current: number;
  total: number;
  slug: string;
}

export interface SeriesMetadata {
  title: string;
  description?: string;
  coverImage?: string;
}

export interface SeriesWithPosts extends SeriesMetadata {
  slug: string;
  posts: CollectionEntry<'blog'>[];
  postCount: number;
  latestPost: CollectionEntry<'blog'>;
  firstPost: CollectionEntry<'blog'>;
}

/**
 * Builds a Map of series data from all posts
 */
export function buildSeriesData(allPosts: CollectionEntry<'blog'>[]): Map<string, CollectionEntry<'blog'>[]> {
  const seriesMap = new Map<string, CollectionEntry<'blog'>[]>();
  
  // Filter posts that belong to a series
  const seriesPosts = allPosts.filter(post => post.data.series?.slug);
  
  // Group posts by series slug
  seriesPosts.forEach(post => {
    const slug = post.data.series!.slug;
    if (!seriesMap.has(slug)) {
      seriesMap.set(slug, []);
    }
    seriesMap.get(slug)!.push(post);
  });
  
  // Sort posts within each series by order
  seriesMap.forEach((posts) => {
    posts.sort((a, b) => {
      const orderA = a.data.series?.order || 0;
      const orderB = b.data.series?.order || 0;
      return orderA - orderB;
    });
  });
  
  return seriesMap;
}

/**
 * Gets navigation data for a post within its series
 */
export function getSeriesNavigation(
  currentPost: CollectionEntry<'blog'>,
  seriesData: Map<string, CollectionEntry<'blog'>[]>
): SeriesNavigation | null {
  const seriesSlug = currentPost.data.series?.slug;
  if (!seriesSlug || !seriesData.has(seriesSlug)) {
    return null;
  }
  
  const seriesPosts = seriesData.get(seriesSlug)!;
  const currentIndex = seriesPosts.findIndex(post => post.id === currentPost.id);
  
  if (currentIndex === -1) {
    return null;
  }
  
  return {
    prev: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
    current: currentIndex + 1,
    total: seriesPosts.length,
    slug: seriesSlug
  };
}

/**
 * Gets metadata for a series from the config file
 */
export function getSeriesMetadata(slug: string): SeriesMetadata | null {
  return series[slug] || null;
}

/**
 * Gets all series with their metadata and posts
 */
export function getAllSeriesWithMetadata(
  seriesData: Map<string, CollectionEntry<'blog'>[]>
): SeriesWithPosts[] {
  const allSeries: SeriesWithPosts[] = [];
  
  seriesData.forEach((posts, slug) => {
    const metadata = getSeriesMetadata(slug);
    if (metadata) {
      allSeries.push({
        slug,
        ...metadata,
        posts,
        postCount: posts.length,
        latestPost: posts[posts.length - 1],
        firstPost: posts[0]
      });
    }
  });
  
  return allSeries;
}