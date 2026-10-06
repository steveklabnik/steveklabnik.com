import { excerpt } from "./posts.ts";

/** Social/search summaries should read prose, not flattened code blocks. */
export function articleDescription(html: string): string {
  return excerpt(html.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, " "), 160);
}

interface ArticleMetadata {
  title: string;
  description: string;
  published: Date;
  canonical: URL;
  image: URL;
  site: URL;
}

export function articleStructuredData(article: ArticleMetadata) {
  const author = { "@type": "Person", name: "Steve Klabnik", url: article.site.href };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: article.canonical.href,
    mainEntityOfPage: { "@type": "WebPage", "@id": article.canonical.href },
    datePublished: article.published.toISOString(),
    author,
    publisher: author,
    image: [article.image.href],
    inLanguage: "en",
  };
}

/** Prevent titles or descriptions from terminating an inline JSON-LD script. */
export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
