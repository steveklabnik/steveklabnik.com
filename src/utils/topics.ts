import { topics } from '../data/topics.ts';
import type { CollectionEntry } from 'astro:content';

export interface TopicMetadata {
  title: string;
  description: string;
}

export interface TopicWithPosts extends TopicMetadata {
  slug: string;
  posts: CollectionEntry<'blog'>[];
  postCount: number;
  latestPost: CollectionEntry<'blog'>;
}

/**
 * Gets metadata for a topic from the config file
 */
export function getTopicMetadata(slug: string): TopicMetadata | null {
  return topics[slug] || null;
}

/**
 * Groups all posts by their topic
 */
export function getPostsByTopic(
  allPosts: CollectionEntry<'blog'>[]
): Map<string, CollectionEntry<'blog'>[]> {
  const topicMap = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of allPosts) {
    const topic = post.data.topic;
    if (!topic) continue;
    if (!topicMap.has(topic)) {
      topicMap.set(topic, []);
    }
    topicMap.get(topic)!.push(post);
  }

  // Sort posts within each topic by date (newest first)
  topicMap.forEach((posts) => {
    posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  });

  return topicMap;
}

/**
 * Gets all topics with their metadata and posts
 */
export function getAllTopicsWithMetadata(
  topicData: Map<string, CollectionEntry<'blog'>[]>
): TopicWithPosts[] {
  const allTopics: TopicWithPosts[] = [];

  for (const [slug, metadata] of Object.entries(topics)) {
    const posts = topicData.get(slug) || [];
    if (posts.length === 0) continue;
    allTopics.push({
      slug,
      ...metadata,
      posts,
      postCount: posts.length,
      latestPost: posts[0],
    });
  }

  return allTopics;
}

/**
 * Returns topics with recent activity, sorted by most recent post.
 * Useful for the "what I've been thinking about" homepage section.
 */
export function getRecentTopics(
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 6
): TopicWithPosts[] {
  const topicData = getPostsByTopic(allPosts);
  const allTopics = getAllTopicsWithMetadata(topicData);

  // Sort by most recent post date
  allTopics.sort(
    (a, b) => b.latestPost.data.pubDate.getTime() - a.latestPost.data.pubDate.getTime()
  );

  return allTopics.slice(0, limit);
}
