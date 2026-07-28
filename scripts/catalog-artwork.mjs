import { officialRawUrl, resolveCatalogBranch } from "./catalog-channel.mjs";

export const CATALOG_ARTWORK_DIRECTORY = "artwork/agent-covers";
export const CATALOG_ARTWORK_SIZE = 512;

export function catalogArtworkRelativePath(packageId) {
  return `${CATALOG_ARTWORK_DIRECTORY}/${packageId}.png`;
}

export function catalogArtworkUrl(packageId, branch = resolveCatalogBranch()) {
  return officialRawUrl(catalogArtworkRelativePath(packageId), branch);
}
