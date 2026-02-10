import type { Plugin, ViteDevServer } from "vite";
import fs from "node:fs";
import path from "node:path";

const NOTES_DIR = path.resolve("src/content/notes");
const BLOG_DIR = path.resolve("src/content/blog");

// ── helpers ──────────────────────────────────────────────

function parseNote(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const fm = Object.fromEntries(
    match[1].split("\n").map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
  );
  return {
    title: fm.title ?? "",
    lastUpdated: fm.lastUpdated ?? null,
    body: match[2],
  };
}

function parsePost(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML-like parsing for blog frontmatter
  const fm: Record<string, string> = {};
  let seriesSlug: string | null = null;
  let seriesOrder: number | null = null;

  const lines = frontmatterStr.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("  ") && line.includes(":")) {
      // nested under series
      const [k, ...v] = line.trim().split(":");
      const key = k.trim();
      const val = v.join(":").trim();
      if (key === "slug") seriesSlug = val;
      if (key === "order") seriesOrder = parseInt(val, 10);
    } else if (line.includes(":") && !line.startsWith("series")) {
      const i = line.indexOf(":");
      const key = line.slice(0, i).trim();
      const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      fm[key] = val;
    }
  }

  return {
    title: fm.title ?? "",
    pubDate: fm.pubDate ?? null,
    blog: fm.blog ?? null,
    series: seriesSlug ? { slug: seriesSlug, order: seriesOrder ?? 1 } : null,
    topic: fm.topic ?? null,
    body,
  };
}

/** Map clean slug → file path for blog posts */
function buildPostSlugMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(BLOG_DIR)) return map;

  for (const dir of fs.readdirSync(BLOG_DIR)) {
    const dirPath = path.join(BLOG_DIR, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
      const cleanSlug = file.replace(/\.mdx?$/, "");
      map.set(cleanSlug, path.join(dirPath, file));
    }
  }
  return map;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function readBody(request: Request): Promise<unknown> {
  return request.json();
}

// ── plugin ───────────────────────────────────────────────

export default function editorApiPlugin(): Plugin {
  return {
    name: "editor-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/__editor/")) return next();

        // Build a proper Request from the IncomingMessage
        const method = req.method ?? "GET";
        const fullUrl = `http://localhost${url}`;

        let body: string | undefined;
        if (method === "PUT" || method === "POST") {
          body = await new Promise<string>((resolve) => {
            let data = "";
            req.on("data", (chunk: Buffer) => (data += chunk.toString()));
            req.on("end", () => resolve(data));
          });
        }

        try {
          const response = await handleRequest(fullUrl, method, body);
          res.writeHead(response.status, {
            "Content-Type": "application/json",
          });
          res.end(await response.text());
        } catch (e: any) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

async function handleRequest(
  urlStr: string,
  method: string,
  body?: string
): Promise<Response> {
  const url = new URL(urlStr);
  const pathname = url.pathname;

  // ── Notes ──────────────────────────────────────────
  if (pathname === "/__editor/notes" && method === "GET") {
    return listNotes();
  }
  if (pathname === "/__editor/notes" && method === "POST") {
    return createNote(JSON.parse(body!));
  }
  const noteMatch = pathname.match(/^\/__editor\/notes\/(.+)$/);
  if (noteMatch) {
    const slug = decodeURIComponent(noteMatch[1]);
    if (method === "GET") return getNote(slug);
    if (method === "PUT") return saveNote(slug, JSON.parse(body!));
    if (method === "DELETE") return deleteNote(slug);
  }

  // ── Posts ──────────────────────────────────────────
  if (pathname === "/__editor/posts" && method === "GET") {
    return listPosts();
  }
  if (pathname === "/__editor/posts" && method === "POST") {
    return createPost(JSON.parse(body!));
  }
  const postMatch = pathname.match(/^\/__editor\/posts\/(.+)$/);
  if (postMatch) {
    const slug = decodeURIComponent(postMatch[1]);
    if (method === "GET") return getPost(slug);
    if (method === "PUT") return savePost(slug, JSON.parse(body!));
  }

  return jsonResponse({ error: "Not found" }, 404);
}

// ── Notes handlers ───────────────────────────────────────

function listNotes(): Response {
  if (!fs.existsSync(NOTES_DIR)) return jsonResponse([]);
  const notes = fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, "");
      const data = parseNote(path.join(NOTES_DIR, f));
      return { slug, ...data };
    })
    .filter(Boolean);
  return jsonResponse(notes);
}

function getNote(slug: string): Response {
  const filePath =
    [path.join(NOTES_DIR, `${slug}.md`), path.join(NOTES_DIR, `${slug}.mdx`)]
      .find((p) => fs.existsSync(p)) ?? null;
  if (!filePath) return jsonResponse({ error: "Not found" }, 404);
  const data = parseNote(filePath);
  return jsonResponse({ slug, ...data });
}

function saveNote(
  slug: string,
  data: { title: string; body: string }
): Response {
  const filePath =
    [path.join(NOTES_DIR, `${slug}.md`), path.join(NOTES_DIR, `${slug}.mdx`)]
      .find((p) => fs.existsSync(p)) ?? path.join(NOTES_DIR, `${slug}.md`);

  const now = new Date().toISOString().slice(0, 10);
  const content = `---\ntitle: ${data.title}\nlastUpdated: ${now}\n---\n${data.body}`;
  fs.writeFileSync(filePath, content, "utf-8");
  return jsonResponse({ ok: true });
}

function createNote(data: { title: string; slug?: string }): Response {
  const slug =
    data.slug ??
    data.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  const filePath = path.join(NOTES_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    return jsonResponse({ error: "Note already exists" }, 409);
  }
  if (!fs.existsSync(NOTES_DIR)) fs.mkdirSync(NOTES_DIR, { recursive: true });
  const now = new Date().toISOString().slice(0, 10);
  const content = `---\ntitle: ${data.title}\nlastUpdated: ${now}\n---\n\n`;
  fs.writeFileSync(filePath, content, "utf-8");
  return jsonResponse({ slug });
}

function deleteNote(slug: string): Response {
  const filePath =
    [path.join(NOTES_DIR, `${slug}.md`), path.join(NOTES_DIR, `${slug}.mdx`)]
      .find((p) => fs.existsSync(p)) ?? null;
  if (!filePath) return jsonResponse({ error: "Not found" }, 404);
  fs.unlinkSync(filePath);
  return jsonResponse({ ok: true });
}

// ── Posts handlers ───────────────────────────────────────

function listPosts(): Response {
  const slugMap = buildPostSlugMap();
  const posts: unknown[] = [];
  for (const [slug, filePath] of slugMap) {
    const data = parsePost(filePath);
    if (data) posts.push({ slug, ...data });
  }
  return jsonResponse(posts);
}

function getPost(slug: string): Response {
  const slugMap = buildPostSlugMap();
  const filePath = slugMap.get(slug);
  if (!filePath) return jsonResponse({ error: "Not found" }, 404);
  const data = parsePost(filePath);
  return jsonResponse({ slug, ...data });
}

function savePost(
  slug: string,
  data: {
    title: string;
    pubDate: string;
    blog?: string | null;
    series?: { slug: string; order: number } | null;
    topic?: string | null;
    body: string;
  }
): Response {
  const slugMap = buildPostSlugMap();
  const filePath = slugMap.get(slug);
  if (!filePath) return jsonResponse({ error: "Not found" }, 404);

  let fm = `---\ntitle: "${data.title}"\npubDate: ${data.pubDate}`;
  if (data.blog) fm += `\nblog: ${data.blog}`;
  if (data.series) {
    fm += `\nseries:\n  slug: ${data.series.slug}\n  order: ${data.series.order}`;
  }
  if (data.topic) fm += `\ntopic: ${data.topic}`;
  fm += `\n---\n`;

  fs.writeFileSync(filePath, fm + data.body, "utf-8");
  return jsonResponse({ ok: true });
}

function createPost(data: {
  title: string;
  pubDate: string;
  slug?: string;
  blog?: string | null;
  series?: { slug: string; order: number } | null;
  topic?: string | null;
}): Response {
  const slug =
    data.slug ??
    data.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const date = new Date(data.pubDate);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dirPath = path.join(BLOG_DIR, `${yyyy}-${mm}`);
  const filePath = path.join(dirPath, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    return jsonResponse({ error: "Post already exists" }, 409);
  }
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  let fm = `---\ntitle: "${data.title}"\npubDate: ${data.pubDate}`;
  if (data.blog) fm += `\nblog: ${data.blog}`;
  if (data.series) {
    fm += `\nseries:\n  slug: ${data.series.slug}\n  order: ${data.series.order}`;
  }
  if (data.topic) fm += `\ntopic: ${data.topic}`;
  fm += `\n---\n\n`;

  fs.writeFileSync(filePath, fm, "utf-8");
  return jsonResponse({ slug });
}
