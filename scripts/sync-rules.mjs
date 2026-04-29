import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function stripYamlScalar(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function toDisplayPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function resolveProviderPath(rootDir, providerPath) {
  const cleaned = providerPath.replace(/^\.\//, "");
  const absolutePath = path.resolve(rootDir, cleaned);
  const relativePath = path.relative(rootDir, absolutePath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    path.isAbsolute(providerPath)
  ) {
    throw new Error(`Refusing to write outside repository: ${providerPath}`);
  }

  return {
    absolutePath,
    displayPath: toDisplayPath(relativePath)
  };
}

export function parseRuleProviders(yaml) {
  const providers = [];
  const lines = yaml.split(/\r?\n/);
  let inProviders = false;
  let current = null;

  for (const line of lines) {
    if (!inProviders) {
      if (line === "rule-providers:") {
        inProviders = true;
      }
      continue;
    }

    if (/^\S/.test(line)) {
      break;
    }

    const providerMatch = line.match(/^  ([^:\s][^:]*):\s*$/);
    if (providerMatch) {
      if (current?.path && current?.url) {
        providers.push(current);
      }
      current = { name: providerMatch[1] };
      continue;
    }

    if (!current) {
      continue;
    }

    const valueMatch = line.match(/^    (path|url):\s*(.+?)\s*$/);
    if (valueMatch) {
      current[valueMatch[1]] = stripYamlScalar(valueMatch[2]);
    }
  }

  if (current?.path && current?.url) {
    providers.push(current);
  }

  return providers;
}

async function downloadText(provider, fetchImpl) {
  const response = await fetchImpl(provider.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${provider.name}: HTTP ${response.status}`);
  }
  return response.text();
}

export async function loadRuleProviderSources({
  rootDir = process.cwd(),
  sourcesPath = path.join(rootDir, "ruleset", "sources.json"),
  yamlPath = path.join(rootDir, "smart.yaml")
} = {}) {
  try {
    const manifest = JSON.parse(await fs.readFile(sourcesPath, "utf8"));
    if (!Array.isArray(manifest)) {
      throw new Error(`Rule source manifest must be an array: ${sourcesPath}`);
    }
    return manifest.map((source) => {
      if (!source.name || !source.path || !source.url) {
        throw new Error(`Rule source entries must include name, path, and url: ${sourcesPath}`);
      }
      return {
        name: source.name,
        path: source.path,
        url: source.url
      };
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const yaml = await fs.readFile(yamlPath, "utf8");
  return parseRuleProviders(yaml);
}

export async function syncRuleProviders({
  rootDir = process.cwd(),
  yamlPath = path.join(rootDir, "smart.yaml"),
  sourcesPath = path.join(rootDir, "ruleset", "sources.json"),
  fetchImpl = globalThis.fetch
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("No fetch implementation is available");
  }

  const providers = await loadRuleProviderSources({ rootDir, sourcesPath, yamlPath });
  if (!providers.length) {
    throw new Error(`No rule provider sources found in ${sourcesPath} or ${yamlPath}`);
  }

  const summary = [];
  for (const provider of providers) {
    const { absolutePath, displayPath } = resolveProviderPath(rootDir, provider.path);
    const text = await downloadText(provider, fetchImpl);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, text, "utf8");
    summary.push({
      name: provider.name,
      path: displayPath,
      bytes: Buffer.byteLength(text, "utf8")
    });
  }

  return summary;
}

async function main() {
  const summary = await syncRuleProviders();
  for (const item of summary) {
    console.log(`${item.name}: wrote ${item.bytes} bytes to ${item.path}`);
  }
}

const isCli = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isCli) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
