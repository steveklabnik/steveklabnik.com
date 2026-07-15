#!/usr/bin/env node
/**
 * Syncs standard.site (https://standard.site) records to the PDS.
 *
 * Reads the manifest the site build emits at /standard-site.json (the
 * desired state of the site.standard.publication and site.standard.document
 * records) and diffs it against what's in the repo, then creates/updates
 * whatever changed. Run it after deploying, so records always describe
 * pages that are actually live.
 *
 * Usage:
 *   node scripts/standard-site-sync.mjs --dry-run     # diff only, no auth needed
 *   STANDARD_SITE_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx \
 *   node scripts/standard-site-sync.mjs               # apply changes
 *
 * Flags:
 *   --source <url|file>  Manifest location. Defaults to the live site;
 *                        pass dist/standard-site.json to sync a local build.
 *   --dry-run            Print the plan without writing to the PDS.
 *   --prune              Delete records for posts no longer in the manifest.
 */

import { readFile } from "node:fs/promises";

const SITE = "https://steveklabnik.com";
const IDENTIFIER = process.env.STANDARD_SITE_IDENTIFIER ?? "steveklabnik.com";
const ICON_URL = `${SITE}/icon-512.png`;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const prune = args.includes("--prune");
const sourceIdx = args.indexOf("--source");
const source =
  sourceIdx !== -1 ? args[sourceIdx + 1] : `${SITE}/standard-site.json`;

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function loadManifest() {
  if (/^https?:\/\//.test(source)) return fetchJson(source);
  return JSON.parse(await readFile(source, "utf8"));
}

async function resolvePds(did) {
  const doc = await fetchJson(`https://plc.directory/${did}`);
  const pds = doc.service?.find((s) => s.id === "#atproto_pds")?.serviceEndpoint;
  if (!pds) throw new Error(`No PDS endpoint in DID document for ${did}`);
  return pds;
}

async function listRecords(pds, did, collection) {
  const records = new Map();
  let cursor;
  do {
    const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set("repo", did);
    url.searchParams.set("collection", collection);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);
    const page = await fetchJson(url);
    for (const record of page.records) {
      records.set(record.uri.split("/").pop(), record.value);
    }
    cursor = page.records.length > 0 ? page.cursor : undefined;
  } while (cursor);
  return records;
}

/** JSON.stringify with sorted keys, for order-insensitive comparison. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

const changed = (a, b) => canonical(a) !== canonical(b);

async function createSession(pds) {
  const password = process.env.STANDARD_SITE_APP_PASSWORD;
  if (!password) {
    throw new Error(
      "STANDARD_SITE_APP_PASSWORD is not set. Create an app password at " +
        "https://bsky.app/settings/app-passwords (no chat access needed), " +
        "or use --dry-run to preview without writing.",
    );
  }
  return fetchJson(`${pds}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: IDENTIFIER, password }),
  });
}

async function main() {
  const manifest = await loadManifest();
  const { did } = manifest;
  const pds = await resolvePds(did);
  console.log(`Repo ${did} on ${pds}`);

  // Reads are public, so the whole plan is computed without auth.
  const existingDocs = await listRecords(pds, did, "site.standard.document");
  const existingPubs = await listRecords(pds, did, "site.standard.publication");
  const existingPub = existingPubs.get(manifest.publication.rkey);

  const publicationValue = { ...manifest.publication.value };
  // Blobs are uploaded, not declared, so the manifest has no icon; keep
  // whatever icon the live record already carries.
  if (existingPub?.icon) publicationValue.icon = existingPub.icon;

  const plan = [];
  if (!existingPub) {
    plan.push({ action: "create", collection: "site.standard.publication", rkey: manifest.publication.rkey, value: publicationValue, uploadIcon: true });
  } else if (changed(publicationValue, existingPub)) {
    plan.push({ action: "update", collection: "site.standard.publication", rkey: manifest.publication.rkey, value: publicationValue });
  }

  for (const [rkey, value] of Object.entries(manifest.documents)) {
    const existing = existingDocs.get(rkey);
    if (!existing) {
      plan.push({ action: "create", collection: "site.standard.document", rkey, value });
    } else if (changed(value, existing)) {
      plan.push({ action: "update", collection: "site.standard.document", rkey, value });
    }
  }

  const orphans = [
    ...[...existingDocs.keys()]
      .filter((rkey) => !(rkey in manifest.documents))
      .map((rkey) => ({ collection: "site.standard.document", rkey })),
    ...[...existingPubs.keys()]
      .filter((rkey) => rkey !== manifest.publication.rkey)
      .map((rkey) => ({ collection: "site.standard.publication", rkey })),
  ];
  if (prune) {
    for (const orphan of orphans) {
      plan.push({ action: "delete", ...orphan });
    }
  }

  const total = Object.keys(manifest.documents).length;
  // +1 for the publication record; deletes aren't part of the desired set.
  const unchanged = total + 1 - plan.filter((op) => op.action !== "delete").length;
  console.log(`${total} documents in manifest; ${unchanged} records unchanged`);
  for (const op of plan) {
    console.log(`  ${op.action} ${op.collection}/${op.rkey}`);
  }
  if (orphans.length > 0 && !prune) {
    console.log(
      `  ${orphans.length} record(s) on the PDS but not in the manifest (use --prune to delete): ` +
        orphans.map((o) => `${o.collection}/${o.rkey}`).join(", "),
    );
  }
  if (plan.length === 0) {
    console.log("Nothing to do.");
    return;
  }
  if (dryRun) {
    console.log("Dry run; no changes made.");
    return;
  }

  const session = await createSession(pds);
  const authed = { Authorization: `Bearer ${session.accessJwt}` };

  for (const op of plan) {
    if (op.action === "delete") {
      await fetchJson(`${pds}/xrpc/com.atproto.repo.deleteRecord`, {
        method: "POST",
        headers: { ...authed, "Content-Type": "application/json" },
        body: JSON.stringify({ repo: did, collection: op.collection, rkey: op.rkey }),
      });
    } else {
      if (op.uploadIcon) {
        const icon = await fetch(ICON_URL);
        if (icon.ok) {
          const upload = await fetchJson(`${pds}/xrpc/com.atproto.repo.uploadBlob`, {
            method: "POST",
            headers: { ...authed, "Content-Type": icon.headers.get("content-type") ?? "image/png" },
            body: await icon.arrayBuffer(),
          });
          op.value.icon = upload.blob;
        } else {
          console.warn(`Could not fetch ${ICON_URL} (${icon.status}); creating publication without an icon.`);
        }
      }
      await fetchJson(`${pds}/xrpc/com.atproto.repo.putRecord`, {
        method: "POST",
        headers: { ...authed, "Content-Type": "application/json" },
        body: JSON.stringify({ repo: did, collection: op.collection, rkey: op.rkey, record: op.value }),
      });
    }
    console.log(`  done: ${op.action} ${op.collection}/${op.rkey}`);
  }
  console.log(`Applied ${plan.length} change(s).`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
