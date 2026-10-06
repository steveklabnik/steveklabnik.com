import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import paths from "./legacy-images.json" with { type: "json" };
import { copyLegacyImages } from "./legacy-images.mjs";

test("all 25 original paths preserve source bytes, spaces, case and animated GIF", async () => {
  const directory = await mkdtemp(join(tmpdir(), "legacy images "));
  const output = pathToFileURL(directory + "/");
  try {
    assert.equal(Object.keys(paths).length, 25);
    assert.equal(paths["img/2020-06-08/Untitled 1.png"], "src/assets/img/2020-06-08/untitled-1.png");
    assert.equal(paths["img/2012-10-12/KmCWp.jpg"], "src/assets/img/2012-10-12/kmcwp.jpg");
    await copyLegacyImages(output);
    for (const [legacyPath, assetPath] of Object.entries(paths)) {
      assert.deepEqual(await readFile(new URL(legacyPath, output)),
        await readFile(new URL("../" + assetPath, import.meta.url)), legacyPath);
    }
    const gif = await readFile(new URL("img/2012-10-12/tumblr_lpqekrWMCt1qh3e7yo1_400.gif", output));
    assert.match(gif.subarray(0, 6).toString(), /^GIF8[79]a$/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
