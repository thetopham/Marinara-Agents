import { execFileSync } from "node:child_process";

export const DEFAULT_CATALOG_BRANCH = "main";
export const STAGING_CATALOG_BRANCH = "staging";
const SUPPORTED_CATALOG_BRANCHES = new Set([DEFAULT_CATALOG_BRANCH, STAGING_CATALOG_BRANCH]);
const RAW_REPOSITORY_ROOT = "https://raw.githubusercontent.com/Pasta-Devs/Marinara-Agents";

function supportedBranch(value) {
  const branch = value?.trim();
  return branch && SUPPORTED_CATALOG_BRANCHES.has(branch) ? branch : null;
}

export function resolveCatalogBranch(environment = process.env, cwd = process.cwd()) {
  const explicit = environment.MARINARA_AGENTS_CATALOG_BRANCH?.trim();
  if (explicit) {
    if (!SUPPORTED_CATALOG_BRANCHES.has(explicit)) {
      throw new Error(
        `MARINARA_AGENTS_CATALOG_BRANCH must be main or staging, received ${JSON.stringify(explicit)}`,
      );
    }
    return explicit;
  }

  for (const candidate of [environment.GITHUB_BASE_REF, environment.GITHUB_REF_NAME]) {
    const branch = supportedBranch(candidate);
    if (branch) return branch;
  }

  try {
    const branch = supportedBranch(
      execFileSync("git", ["symbolic-ref", "--short", "-q", "HEAD"], {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }),
    );
    if (branch) return branch;
  } catch {
    // Detached builds and source archives default to the published main channel.
  }

  return DEFAULT_CATALOG_BRANCH;
}

export function officialRawUrl(relativePath, branch = resolveCatalogBranch()) {
  if (!SUPPORTED_CATALOG_BRANCHES.has(branch)) {
    throw new Error(`Unsupported Marinara-Agents catalog branch: ${branch}`);
  }
  return `${RAW_REPOSITORY_ROOT}/${branch}/${relativePath.replace(/^\/+/, "")}`;
}

export function catalogArtifactUrl(artifactName, branch = resolveCatalogBranch()) {
  return officialRawUrl(`artifacts/${artifactName}`, branch);
}
