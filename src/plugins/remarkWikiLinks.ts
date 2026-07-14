import { findAndReplace } from "mdast-util-find-and-replace";
import fs from "node:fs";
import path from "node:path";
import type { Root } from "mdast";
import { slugify, wikiLinkRegex } from "../utils/wikilinks";

function getExistingNoteSlugs(): Set<string> {
  const notesDir = path.resolve("src/content/notes");
  const slugs = new Set<string>();

  if (!fs.existsSync(notesDir)) {
    return slugs;
  }

  for (const file of fs.readdirSync(notesDir)) {
    if (file.endsWith(".md") || file.endsWith(".mdx")) {
      slugs.add(file.replace(/\.mdx?$/, ""));
    }
  }

  return slugs;
}

export default function remarkWikiLinks() {
  return (tree: Root) => {
    // Read per document rather than at plugin init, so notes created or
    // deleted while the dev server runs are reflected without a restart.
    const existingSlugs = getExistingNoteSlugs();
    findAndReplace(tree, [
      [
        wikiLinkRegex,
        (_match: string, target: string, displayText?: string) => {
          const slug = slugify(target);
          const text = displayText?.trim() || target.trim();
          const exists = existingSlugs.has(slug);

          return {
            type: "link" as const,
            url: `/notes/${slug}`,
            data: {
              hProperties: exists
                ? {}
                : { class: "wikilink-missing" },
            },
            children: [{ type: "text" as const, value: text }],
          };
        },
      ],
    ]);
  };
}
