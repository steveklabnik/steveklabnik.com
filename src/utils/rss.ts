// Each subscription carries recent full articles; the website keeps the archive.
export const RSS_ITEM_LIMIT = 20;

/**
 * Keep full HTML in RSS without expanding every HTML delimiter into an XML
 * entity. Decoding exactly one layer preserves the original HTML (including
 * its own entities); splitting CDATA terminators keeps arbitrary posts valid.
 * Only content:encoded text emitted by @astrojs/rss is changed.
 */
export function rssContentAsCdata(xml: string): string {
  const entities: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  };
  return xml.replace(
    /<content:encoded>([\s\S]*?)<\/content:encoded>/g,
    (_, encoded: string) => {
      const html = encoded.replace(
        /&(amp|lt|gt|quot|apos);/g,
        (_, entity: string) => entities[entity],
      );
      return `<content:encoded><![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded>`;
    },
  );
}

export async function withCdataContent(response: Response): Promise<Response> {
  return new Response(rssContentAsCdata(await response.text()), {
    status: response.status,
    headers: response.headers,
  });
}
