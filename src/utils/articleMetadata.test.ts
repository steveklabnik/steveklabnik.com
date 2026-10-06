import test from "node:test";
import assert from "node:assert/strict";
import { articleDescription, articleStructuredData, serializeStructuredData } from "./articleMetadata.ts";

test("automatic descriptions skip multiline code blocks but retain inline code", () => {
  const html = '<p>Here is Rust code:</p><pre class="astro-code"><code>fn foo() {\nbody elided\n}</code></pre><p>Rust calls <code>x</code> a parameter.</p>';
  assert.equal(articleDescription(html), 'Here is Rust code: Rust calls x a parameter.');
  assert.ok(articleDescription('<p>' + 'word '.repeat(80) + '</p>').length <= 160);
});

test("structured data uses factual publication date, author and absolute URLs", () => {
  const data = articleStructuredData({title:'A post',description:'A summary',published:new Date('2026-09-21'),canonical:new URL('https://steveklabnik.com/writing/a-post/'),image:new URL('https://steveklabnik.com/og/writing/a-post.png'),site:new URL('https://steveklabnik.com/')});
  assert.equal(data['@type'], 'BlogPosting');
  assert.equal(data.datePublished, '2026-09-21T00:00:00.000Z');
  assert.equal(data.author.name, 'Steve Klabnik');
  assert.equal(data.mainEntityOfPage['@id'], data.url);
  assert.ok(!('dateModified' in data));
  assert.deepEqual(JSON.parse(serializeStructuredData(data)),data);
});

test("inline JSON remains valid and cannot close its script element", () => {
  const data = {headline: '</script><script>alert("test")</script>',description:'Quotes " and & symbols'};
  const json = serializeStructuredData(data);
  assert.ok(!json.includes('<'));
  assert.deepEqual(JSON.parse(json),data);
});
