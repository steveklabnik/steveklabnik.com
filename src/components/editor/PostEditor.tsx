import { useState, useEffect, useCallback } from "react";
import ContentEditor from "./ContentEditor";
import { fetchPost, savePost, type PostData } from "./api";

const SERIES_OPTIONS = [
  { slug: "ai-musings", title: "AI musings" },
  { slug: "ai-field-reports", title: "AI Field Reports" },
  { slug: "deleuze-for-developers", title: "Deleuze for Developers" },
  { slug: "buck-rust", title: "Using Buck to Build Rust Projects" },
  { slug: "getting-started-with-claude-code", title: "Getting Started with Claude Code" },
];

interface Props {
  slug: string;
  onClose: () => void;
}

export default function PostEditor({ slug, onClose }: Props) {
  const [post, setPost] = useState<PostData | null>(null);
  const [pubDate, setPubDate] = useState("");
  const [blog, setBlog] = useState("");
  const [seriesSlug, setSeriesSlug] = useState("");
  const [seriesOrder, setSeriesOrder] = useState(1);

  useEffect(() => {
    fetchPost(slug).then((p) => {
      setPost(p);
      setPubDate(p.pubDate ?? "");
      setBlog(p.blog ?? "");
      setSeriesSlug(p.series?.slug ?? "");
      setSeriesOrder(p.series?.order ?? 1);
    });
  }, [slug]);

  const handleSave = useCallback(
    async (data: { title: string; body: string }) => {
      await savePost(slug, {
        title: data.title,
        pubDate,
        blog: blog || null,
        series: seriesSlug
          ? { slug: seriesSlug, order: seriesOrder }
          : null,
        body: data.body,
      });
    },
    [slug, pubDate, blog, seriesSlug, seriesOrder]
  );

  if (!post) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
        <div className="text-white text-lg">Loading…</div>
      </div>
    );
  }

  const extraFields = (
    <div className="flex items-center gap-4 flex-wrap">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Date:</span>
        <input
          type="date"
          value={pubDate}
          onChange={(e) => setPubDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Blog:</span>
        <input
          type="text"
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
          placeholder="(optional)"
          className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Series:</span>
        <select
          value={seriesSlug}
          onChange={(e) => setSeriesSlug(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">None</option>
          {SERIES_OPTIONS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      {seriesSlug && (
        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Order:</span>
          <input
            type="number"
            value={seriesOrder}
            onChange={(e) => setSeriesOrder(parseInt(e.target.value, 10) || 1)}
            min={1}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
          />
        </label>
      )}
    </div>
  );

  return (
    <ContentEditor
      title={post.title}
      body={post.body}
      onSave={handleSave}
      onClose={onClose}
      extraFields={extraFields}
    />
  );
}
