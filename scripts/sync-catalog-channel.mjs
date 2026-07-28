import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { catalogArtworkUrl } from "./catalog-artwork.mjs";
import { catalogArtifactUrl, resolveCatalogBranch } from "./catalog-channel.mjs";
import { readCatalogFamily, writeCatalogFamily } from "./catalog-lanes.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const branch = resolveCatalogBranch(process.env, repoRoot);
const { catalog } = await readCatalogFamily(repoRoot);

for (const entry of catalog.packages) {
  entry.iconUrl = catalogArtworkUrl(entry.manifest.id, branch);
  entry.artifact.url = catalogArtifactUrl(
    `${entry.manifest.id}-${entry.manifest.version}.zip`,
    branch,
  );
}

catalog.generatedAt = new Date().toISOString();
await writeCatalogFamily(repoRoot, catalog);
console.log(`Synchronized ${catalog.packages.length} catalog entries to the ${branch} channel.`);
