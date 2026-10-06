interface MarkdownNode {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
}

/** Indices refer to Astro's complete heading list, including quoted headings. */
export function tocHeadingIndices(tree: MarkdownNode): number[] {
  const words = (text: string) =>
    (text.match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu) ?? []).length;
  let proseWords = 0;
  let codeLines = 0;
  let headingIndex = 0;
  const sections: { index: number; depth: number; start: number; titleWords: number }[] = [];
  const text = (node: MarkdownNode): string =>
    node.type === "text" || node.type === "inlineCode"
      ? node.value ?? ""
      : (node.children ?? []).map(text).join(" ");

  function visit(node: MarkdownNode, quoted = false) {
    if (node.type === "code") {
      codeLines += (node.value ?? "").split("\n").length;
      return;
    }
    if (node.type === "heading") {
      const index = headingIndex++;
      if (!quoted && node.depth! >= 2) {
        sections.push({ index, depth: node.depth!, start: proseWords, titleWords: words(text(node)) });
      }
    }
    if (node.type === "text" || node.type === "inlineCode") {
      proseWords += words(node.value ?? "");
    }
    for (const child of node.children ?? []) {
      visit(child, quoted || node.type === "blockquote");
    }
  }
  visit(tree);

  if (proseWords < 1500 && codeLines < 100) return [];
  // A parent section includes its subsections. Skip empty/brief headings,
  // such as a closing summary, rather than padding out the navigation.
  const useful = sections.filter((section, index) => {
    const next = sections.slice(index + 1).find((other) => other.depth <= section.depth);
    return section.titleWords > 0 &&
      (next?.start ?? proseWords) - section.start - section.titleWords >= 50;
  });
  return useful.length >= 3 ? useful.map((section) => section.index) : [];
}
