import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { createPost } from "./api";
import { slugify } from "../../utils/wikilinks";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ open, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [pubDate, setPubDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [slugOverride, setSlugOverride] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const slug = slugOverride || slugify(title);

  async function handleCreate() {
    if (!title.trim() || !pubDate) return;
    setCreating(true);
    setError("");
    try {
      const result = await createPost({
        title: title.trim(),
        pubDate,
        slug: slug || undefined,
      });
      window.location.href = `/writing/${result.slug}/`;
    } catch (e: any) {
      setError(e.message);
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
          <DialogTitle className="text-lg font-semibold mb-4">
            New Blog Post
          </DialogTitle>

          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />

          <label className="block text-sm text-gray-600 mb-1">
            Publication Date
          </label>
          <input
            type="date"
            value={pubDate}
            onChange={(e) => setPubDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <label className="block text-sm text-gray-600 mb-1">
            Slug (optional override)
          </label>
          <input
            type="text"
            value={slugOverride}
            onChange={(e) => setSlugOverride(e.target.value)}
            placeholder={slugify(title) || "auto-generated"}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {slug && (
            <p className="text-xs text-gray-500 mb-4">
              File:{" "}
              <code className="bg-gray-100 px-1 rounded">
                src/content/blog/{pubDate.slice(0, 7)}/{slug}.md
              </code>
            </p>
          )}

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim() || !pubDate || creating}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
