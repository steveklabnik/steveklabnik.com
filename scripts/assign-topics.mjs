#!/usr/bin/env node
/**
 * Bulk-assign `topic` frontmatter to all blog posts.
 * Run once: node scripts/assign-topics.mjs
 * Then review the git diff and commit.
 */

import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve("src/content/blog");

// ── Classification rules (checked in order — first match wins) ──────

function classify(slug, title, seriesSlug) {
  const t = title.toLowerCase();
  const s = slug.toLowerCase();

  // AI & LLMs — check series first
  if (seriesSlug === "ai-musings" || seriesSlug === "ai-field-reports" ||
      seriesSlug === "getting-started-with-claude-code") return "ai-llms";
  if (/\b(ai|llm|claude|agentic|large language model)\b/i.test(title)) return "ai-llms";
  if (s.includes("ai-discourse") || s.includes("tale-of-two-claudes") ||
      s.includes("gas-town")) return "ai-llms";

  // Philosophy & Politics — check series first
  if (seriesSlug === "deleuze-for-developers") return "philosophy-politics";
  if (/\b(deleuze|foucault|marx|anarchis|capitalism|protological|leftist)\b/i.test(title)) return "philosophy-politics";
  if (t.includes("philosophy") || t.includes("political")) return "philosophy-politics";
  if (s.includes("anti-capitalism") || s.includes("show-solidarity") ||
      s.includes("transmuting-philosophy")) return "philosophy-politics";

  // REST & Hypermedia
  if (/\b(rest|http|hypermedia|hateoas|hateos)\b/i.test(title) &&
      !t.includes("hackety") && !t.includes("resque")) return "rest-hypermedia";
  if (t.includes("api ontology") || t.includes("profile link relation")) return "rest-hypermedia";
  if (s.includes("hypermedia") || s.includes("rest-is-over")) return "rest-hypermedia";
  if (s.includes("rel-attribute")) return "rest-hypermedia";

  // Rust — check series
  if (seriesSlug === "buck-rust") return "rust";
  if (/\b(rust|cargo|borrow.check|webassembly|wasm)\b/i.test(title)) return "rust";
  if (t.includes("rue") && t.includes("birth")) return "rust";
  if (s.includes("rust") && !s.includes("trust")) return "rust";
  if (s.includes("buck") && (s.includes("crates") || s.includes("updating-buck"))) return "rust";
  if (t.includes("memory safety")) return "rust";
  if (t.includes("cxx debate")) return "rust";
  if (s.includes("pointers-in-rust") || s.includes("structure-literals") ||
      s.includes("fire-mario") || s.includes("macros-in-rust")) return "rust";
  if (s.includes("out-parameters") || s.includes("string-vs-str")) return "rust";
  if (t.includes("ada") && s.includes("learning-ada")) return "rust"; // Rust-adjacent language exploration

  // Ruby & Rails
  if (/\b(ruby|rails|sinatra|draper|resque|cancan|devise|activerecord|active.record|turbolinks|rubygems|rubinius|shoes|hackety)\b/i.test(title)) return "ruby-rails";
  if (t.includes("chruby") || t.includes("puma on heroku")) return "ruby-rails";
  if (t.includes("factory_girl") || t.includes("metadown") || t.includes("redcarpet")) return "ruby-rails";
  if (s.includes("rails") || s.includes("ruby")) return "ruby-rails";
  if (s.includes("resque") || s.includes("draper") || s.includes("hackety") ||
      s.includes("shoes-4")) return "ruby-rails";
  if (s.includes("storeengine") || s.includes("authlogic")) return "ruby-rails";
  if (t.includes("travis build matrix")) return "ruby-rails";
  if (t.includes("ember") && !t.includes("remember")) return "ruby-rails"; // Ember.js era was Ruby-adjacent

  // Open Source & Community
  if (/\b(open.source|community|contribut|conference|gardener|documentation|docs team)\b/i.test(title)) return "open-source";
  if (t.includes("matz is nice") || t.includes("culture war")) return "open-source";
  if (s.includes("rstat") || s.includes("issue2pr") || s.includes("announcing-rust-contributors")) return "open-source";
  if (s.includes("announcing-security") || s.includes("security-release")) return "open-source";
  if (t.includes("docember") || t.includes("maintenance policy")) return "open-source";
  if (t.includes("semver") || t.includes("language strangeness budget")) return "open-source";
  if (s.includes("vimgan") || s.includes("requeststore")) return "open-source";
  if (t.includes("new beginnings") && s.includes("2013")) return "open-source";
  if (t.includes("announcing emoji")) return "open-source";

  // Life — personal posts
  if (/\b(year.in.review|burnout|eulogy|birthday|joining|first day|quitting|deleting|killing my)\b/i.test(title)) return "life";
  if (t.includes("goals for") || t.includes("thank u, next") || t.includes("thankfulness")) return "life";
  if (t.includes("hope") && s.includes("hope")) return "life";
  if (s.includes("closure") && !s.includes("companion")) return "life";
  if (t.includes("sad day for rust") || t.includes("happy day for rust")) return "life";
  if (t.includes("finale") || t.includes("outgrown me")) return "life";
  if (t.includes("hit by a car") || t.includes("hardest decision") ||
      t.includes("cell phone") || t.includes("taste in music")) return "life";
  if (s.includes("sf") && t === "SF") return "life";
  if (t.includes("writeonly on twitter") || t.includes("twitter ghosts")) return "life";
  if (s.includes("blip-in-time") || s.includes("break-with-the-past")) return "life";
  if (t.includes("next iteration of my blog")) return "life";
  if (s.includes("porting-steveklabnik") || s.includes("rewriting-my-website") ||
      s.includes("ten-years-of-ru")) return "life";
  if (t.includes("0b100000") || s.includes("2-sup-5")) return "life";
  if (s.includes("cards-for-dad")) return "life";
  if (t.includes("partnering with balanced")) return "life";
  if (s.includes("cloudflare") || s.includes("oxide-computer")) return "life";
  if (s.includes("i-m-writing")) return "life";
  if (t.includes("interconnected") || t.includes("new blog: words")) return "life";
  if (t.includes("saturday") || t.includes("self improvement")) return "life";

  // Technology — catch-all for remaining tech posts
  return "technology";
}

// ── Main ────────────────────────────────────────────────────────────

function extractSeriesSlug(frontmatterStr) {
  const lines = frontmatterStr.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("series:")) {
      // Look for slug in next lines (indented)
      for (let j = i + 1; j < lines.length; j++) {
        const match = lines[j].match(/^\s+slug:\s*(.+)/);
        if (match) return match[1].trim().replace(/^["']|["']$/g, "");
        if (!lines[j].startsWith("  ")) break;
      }
    }
  }
  return null;
}

let total = 0;
let assigned = 0;
let skipped = 0;
const topicCounts = {};

for (const dir of fs.readdirSync(BLOG_DIR).sort()) {
  const dirPath = path.join(BLOG_DIR, dir);
  if (!fs.statSync(dirPath).isDirectory()) continue;

  for (const file of fs.readdirSync(dirPath).sort()) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
    total++;

    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      console.warn(`SKIP (no frontmatter): ${dir}/${file}`);
      skipped++;
      continue;
    }

    const frontmatter = match[1];
    const body = match[2];

    // Skip if already has topic
    if (/^topic:/m.test(frontmatter)) {
      console.log(`ALREADY: ${dir}/${file}`);
      // Still count it
      const existingTopic = frontmatter.match(/^topic:\s*(.+)/m)?.[1]?.trim();
      if (existingTopic) {
        topicCounts[existingTopic] = (topicCounts[existingTopic] || 0) + 1;
      }
      continue;
    }

    // Extract title
    const titleMatch = frontmatter.match(/^title:\s*"?([^"\n]*)"?/m);
    const title = titleMatch ? titleMatch[1] : file.replace(/\.mdx?$/, "");

    // Extract series slug if present
    const seriesSlug = extractSeriesSlug(frontmatter);

    const slug = file.replace(/\.mdx?$/, "");
    const topic = classify(slug, title, seriesSlug);

    topicCounts[topic] = (topicCounts[topic] || 0) + 1;

    // Insert topic line after the last frontmatter field (before closing ---)
    const newFrontmatter = frontmatter + `\ntopic: ${topic}`;
    const newContent = `---\n${newFrontmatter}\n---\n${body}`;

    fs.writeFileSync(filePath, newContent, "utf-8");
    assigned++;
    console.log(`${topic.padEnd(22)} ${dir}/${file}`);
  }
}

console.log("\n── Summary ──");
console.log(`Total: ${total}, Assigned: ${assigned}, Skipped: ${skipped}`);
console.log("\nTopic counts:");
for (const [topic, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${topic.padEnd(22)} ${count}`);
}
