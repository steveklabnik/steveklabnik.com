import assert from "node:assert/strict";
import test from "node:test";
import { tocHeadingIndices } from "./tableOfContents.ts";

const prose = (length: number) => ({ type: "paragraph", children: [
  { type: "text", value: "word ".repeat(length) },
] });
const heading = (depth = 2) => ({ type: "heading", depth, children: [
  { type: "text", value: "Section" },
] });
const section = (length: number, depth = 2) => [heading(depth), prose(length)];
const tree = (children: Parameters<typeof tocHeadingIndices>[0]["children"]) => ({ type: "root", children });

test("requires both length and three substantial sections", () => {
  assert.deepEqual(tocHeadingIndices(tree([...section(499), ...section(499), ...section(499)])), [0, 1, 2]);
  assert.deepEqual(tocHeadingIndices(tree([...section(498), ...section(498), ...section(498)])), []);
  assert.deepEqual(tocHeadingIndices(tree([...section(1000), ...section(1000)])), []);
});

test("counts code lines separately from prose and accepts the 100-line boundary", () => {
  const sections = [...section(50), ...section(50), ...section(50)];
  assert.deepEqual(tocHeadingIndices(tree([...sections, { type: "code", value: "code\n".repeat(99) + "code" }])), [0, 1, 2]);
  assert.deepEqual(tocHeadingIndices(tree([...sections, { type: "code", value: "code\n".repeat(98) + "code" }])), []);
  assert.deepEqual(tocHeadingIndices(tree([heading(), { type: "code", value: "word ".repeat(2000) }])), []);
});

test("excludes quoted headings while retaining Astro's complete heading indices", () => {
  assert.deepEqual(tocHeadingIndices(tree([
    heading(1), { type: "blockquote", children: section(60) },
    ...section(500), ...section(500), ...section(500),
  ])), [2, 3, 4]);
});

test("skips brief closing sections and includes nested sections in their parent", () => {
  assert.deepEqual(tocHeadingIndices(tree([
    heading(), ...section(500, 3), ...section(500), ...section(500), ...section(10),
  ])), [0, 1, 2, 3]);
});

test("ignores imports, HTML and component attributes for length", () => {
  assert.deepEqual(tocHeadingIndices(tree([
    ...section(50), ...section(50), ...section(50),
    { type: "html", value: "word ".repeat(2000) },
    { type: "mdxjsEsm", value: "word ".repeat(2000) },
  ])), []);
});
