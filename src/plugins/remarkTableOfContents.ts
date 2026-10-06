import type { Root } from "mdast";
import type { VFile } from "vfile";
import { tocHeadingIndices } from "../utils/tableOfContents";

/** Keep eligibility in the Markdown pipeline; Astro supplies the final IDs. */
export default function remarkTableOfContents() {
  return (tree: Root, file: VFile) => {
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.tocHeadingIndices = tocHeadingIndices(tree);
  };
}
