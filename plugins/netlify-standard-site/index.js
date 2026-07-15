/**
 * Runs after a successful production deploy: syncs standard.site records to
 * the PDS so they always match the live site (see
 * scripts/standard-site-sync.mjs). onSuccess fires after the deploy is
 * live, which is the ordering the records need — they should only ever
 * describe pages that are actually up.
 *
 * Deliberately does not pass --prune: a manifest-generation bug would turn
 * every record into an orphan and mass-delete them. Removing records for
 * deleted posts stays a manual `npm run sync:standard-site -- --prune`.
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
