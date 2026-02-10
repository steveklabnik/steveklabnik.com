// ── Types ────────────────────────────────────────────────

export interface NoteData {
  slug: string;
  title: string;
  lastUpdated: string | null;
  body: string;
}

export interface PostData {
  slug: string;
  title: string;
  pubDate: string | null;
  blog: string | null;
  series: { slug: string; order: number } | null;
  topic: string | null;
  body: string;
}

// ── Notes ────────────────────────────────────────────────

export async function fetchNoteList(): Promise<NoteData[]> {
  const res = await fetch("/__editor/notes");
  return res.json();
}

export async function fetchNote(slug: string): Promise<NoteData> {
  const res = await fetch(`/__editor/notes/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Note not found");
  return res.json();
}

export async function saveNote(
  slug: string,
  data: { title: string; body: string }
): Promise<void> {
  const res = await fetch(`/__editor/notes/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Save failed");
}

export async function createNote(
  title: string,
  slug?: string
): Promise<{ slug: string }> {
  const res = await fetch("/__editor/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, slug }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Create failed");
  }
  return res.json();
}

export async function deleteNote(slug: string): Promise<void> {
  const res = await fetch(`/__editor/notes/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
}

// ── Posts ────────────────────────────────────────────────

export async function fetchPostList(): Promise<PostData[]> {
  const res = await fetch("/__editor/posts");
  return res.json();
}

export async function fetchPost(slug: string): Promise<PostData> {
  const res = await fetch(`/__editor/posts/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function savePost(
  slug: string,
  data: {
    title: string;
    pubDate: string;
    blog?: string | null;
    series?: { slug: string; order: number } | null;
    topic?: string | null;
    body: string;
  }
): Promise<void> {
  const res = await fetch(`/__editor/posts/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Save failed");
}

export async function createPost(data: {
  title: string;
  pubDate: string;
  slug?: string;
  blog?: string | null;
  series?: { slug: string; order: number } | null;
  topic?: string | null;
}): Promise<{ slug: string }> {
  const res = await fetch("/__editor/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.error ?? "Create failed");
  }
  return res.json();
}
