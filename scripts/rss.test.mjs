import assert from "node:assert/strict";
import { test } from "node:test";
import rss from "@astrojs/rss";
import { rssContentAsCdata, withCdataContent } from "../src/utils/rss.ts";

test("real RSS serialization preserves HTML entities, Unicode and CDATA terminators", async () => {
  const content = '<p title="a & b">é &amp; &lt; &#123; &quot; \' ]]> end</p>';
  const original = await rss({
    title: "Test & title", description: "Full content", site: "https://example.com",
    items: [{ title: "Post", link: "/post/", content }],
  });
  const xml = await original.text();
  const converted = rssContentAsCdata(xml);
  assert.ok(converted.includes('<![CDATA[' + content.replaceAll("]]>", "]]]]><![CDATA[>") + ']]>'));
  assert.equal(
    converted.replace(/<content:encoded>[\s\S]*?<\/content:encoded>/g, ""),
    xml.replace(/<content:encoded>[\s\S]*?<\/content:encoded>/g, ""),
  );
  assert.ok(converted.length < xml.length);
});

test("multiple, empty and absent content elements leave other XML untouched", () => {
  assert.equal(rssContentAsCdata('<rss><description>&lt;p&gt;</description><content:encoded/>\n<content:encoded>&lt;p&gt;a&lt;/p&gt;</content:encoded><content:encoded>&amp;lt;</content:encoded></rss>'),
    '<rss><description>&lt;p&gt;</description><content:encoded/>\n<content:encoded><![CDATA[<p>a</p>]]></content:encoded><content:encoded><![CDATA[&lt;]]></content:encoded></rss>');
});

test("response metadata survives conversion", async () => {
  const converted = await withCdataContent(new Response("<rss/>", {
    headers: { "Content-Type": "application/xml" },
  }));
  assert.equal(converted.status, 200);
  assert.equal(converted.headers.get("Content-Type"), "application/xml");
  assert.equal(await converted.text(), "<rss/>");
});
