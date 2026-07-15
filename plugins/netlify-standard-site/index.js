/**
 * Runs after a successful production deploy: syncs standard.site records to
 * the PDS so they always match the live site (see
 * scripts/standard-site-sync.mjs). onSuccess fires after the deploy is
 * live, which is the ordering the records need — they should only ever
 * describe pages that are actually up.
 *
 * The sync auto-prunes invalid-key records and small numbers of orphans
 * (a deleted or renamed post). It deliberately never passes --prune, so a
 * manifest-generation bug that orphans everything can't mass-delete
 * records from CI — that case warns in the log and waits for a manual
 * `npm run sync:standard-site -- --prune`.
 */
import { execFileSync } from "node:child_process";

export const onSuccess = ({ utils, constants }) => {
  if (process.env.CONTEXT !== "production") {
    console.log(
      `Skipping standard.site sync (context: ${process.env.CONTEXT ?? "unknown"}).`,
    );
    return;
  }

  if (!process.env.STANDARD_SITE_APP_PASSWORD) {
    utils.status.show({
      title: "standard.site sync skipped",
      summary:
        "STANDARD_SITE_APP_PASSWORD is not set in the Netlify environment, " +
        "so PDS records were not updated for this deploy.",
    });
    return;
  }

  try {
    execFileSync(
      "node",
      [
        "scripts/standard-site-sync.mjs",
        "--source",
        `${constants.PUBLISH_DIR}/standard-site.json`,
      ],
      { stdio: "inherit" },
    );
  } catch (error) {
    // The deploy is already live; fail the plugin so the miss is visible
    // in the build log without rolling anything back.
    utils.build.failPlugin("standard.site sync failed", { error });
  }
};
