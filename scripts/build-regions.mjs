import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ICON_URLS = {
  hk: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
  sg: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
  jp: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
  kr: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Korea.png",
  us: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
  tw: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
  eu: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png",
  asiaOther: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-asia.svg",
  northAmerica: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-americas.svg",
  southAmerica: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-americas.svg",
  africa: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-africa.svg",
  oceania: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-oceania.svg",
  other: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/shuffle.svg"
};

const TOKEN_BOUNDARY_PREFIX = "(^|[\\s._\\-\\[\\]\\(\\)【】])";
const TOKEN_BOUNDARY_SUFFIX = "(?=$|[\\s._\\-\\[\\]\\(\\)【】]|\\d)";

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function escapeRegex(value) {
  return value
    .replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&")
    .replace(/\s+/g, "\\s*");
}

function hasHan(value) {
  return /[\u3400-\u9fff]/.test(value);
}

function splitKeywords(keywords) {
  const normalized = unique(keywords.map((keyword) => keyword.trim().toLowerCase()));
  return {
    tokenKeywords: normalized.filter((keyword) => !hasHan(keyword)),
    looseKeywords: normalized.filter((keyword) => hasHan(keyword))
  };
}

function buildAlternation(keywords) {
  return keywords.map(escapeRegex).join("|");
}

function buildJsPatterns(keywords) {
  const { tokenKeywords, looseKeywords } = splitKeywords(keywords);
  const patterns = [];
  if (tokenKeywords.length) {
    patterns.push(
      `/${TOKEN_BOUNDARY_PREFIX}(?:${buildAlternation(tokenKeywords)})${TOKEN_BOUNDARY_SUFFIX}/i`
    );
  }
  if (looseKeywords.length) {
    patterns.push(`/${buildAlternation(looseKeywords)}/i`);
  }
  return patterns;
}

function buildJsPatternBlock(name, keywords) {
  const patterns = buildJsPatterns(keywords)
    .map((pattern) => `  ${pattern}`)
    .join(",\n");
  return [`const ${name} = [`, patterns, "];"].join("\n");
}

function buildYamlFilter(keywords) {
  const { tokenKeywords, looseKeywords } = splitKeywords(keywords);
  const parts = [];
  if (tokenKeywords.length) {
    parts.push(`${TOKEN_BOUNDARY_PREFIX}(?:${buildAlternation(tokenKeywords)})${TOKEN_BOUNDARY_SUFFIX}`);
  }
  if (looseKeywords.length) {
    parts.push(`(?:${buildAlternation(looseKeywords)})`);
  }
  return `(?i)(?:${parts.join("|")})`;
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line ? `${pad}${line}` : line))
    .join("\n");
}

function buildRegionDef(region) {
  const patterns = buildJsPatterns(region.keywords)
    .map((pattern) => `      ${pattern}`)
    .join(",\n");
  return [
    "  {",
    `    key: ${JSON.stringify(region.key)},`,
    `    group: ${JSON.stringify(region.name)},`,
    `    icon: ICON.${region.icon},`,
    "    patterns: [",
    patterns,
    "    ]",
    "  }"
  ].join("\n");
}

function buildOtherDef(other) {
  return [
    "  {",
    `    key: ${JSON.stringify(other.key)},`,
    `    group: ${JSON.stringify(other.name)},`,
    `    icon: ICON.${other.icon},`,
    "    patterns: []",
    "  }"
  ].join("\n");
}

function buildYamlGroup(region, source) {
  return [
    `  - name: ${region.name}`,
    "    type: url-test",
    `    icon: ${ICON_URLS[region.icon]}`,
    "    include-all: true",
    "    exclude-type: direct",
    `    filter: '${buildYamlFilter(region.keywords)}'`,
    `    exclude-filter: '${buildYamlFilter(source.subscriptionInfoKeywords)}'`,
    "    url: https://www.gstatic.com/generate_204",
    "    interval: 300"
  ].join("\n");
}

function buildYamlSmartGroup(source) {
  return [
    "  - name: 智能选择",
    "    type: url-test",
    "    icon: https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png",
    "    include-all: true",
    "    exclude-type: direct",
    `    exclude-filter: '${buildYamlFilter(source.subscriptionInfoKeywords)}'`,
    "    url: https://www.gstatic.com/generate_204",
    "    interval: 300"
  ].join("\n");
}

function buildYamlOtherGroup(source) {
  const allKeywords = [
    ...source.regions.flatMap((region) => region.keywords),
    ...source.subscriptionInfoKeywords
  ];
  return [
    `  - name: ${source.other.name}`,
    "    type: url-test",
    `    icon: ${ICON_URLS[source.other.icon]}`,
    "    include-all: true",
    "    exclude-type: direct",
    `    exclude-filter: '${buildYamlFilter(allKeywords)}'`,
    "    url: https://www.gstatic.com/generate_204",
    "    interval: 300"
  ].join("\n");
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n");
}

function extractSmartJsRegionBlock(content) {
  const match = content.match(/const REGION_DEFS = \[[\s\S]*?\n\];(?=\n\nfunction uniq)/);
  if (!match) throw new Error("Could not find REGION_DEFS block in smart.js");
  return match[0];
}

function extractSmartJsSubscriptionInfoBlock(content) {
  const match = content.match(/const SUBSCRIPTION_INFO_PATTERNS = \[[\s\S]*?\n\];(?=\n\nconst REGION_DEFS)/);
  if (!match) throw new Error("Could not find SUBSCRIPTION_INFO_PATTERNS block in smart.js");
  return match[0];
}

function extractLowFrequencyBlock(content) {
  const match = content.match(/const LOW_FREQUENCY_REGION_OPTIONS = \[[\s\S]*?\n\];/);
  if (!match) throw new Error("Could not find LOW_FREQUENCY_REGION_OPTIONS block in smart.js");
  return match[0];
}

function extractSmartYamlRegionBlock(content) {
  const match = content.match(/  - name: 香港自动[\s\S]*?\n  - name: 其他自动[\s\S]*?    interval: 300(?=\n\nrule-providers:)/);
  if (!match) throw new Error("Could not find region proxy-groups block in smart.yaml");
  return match[0];
}

function extractSmartYamlSmartGroup(content) {
  const match = content.match(/  - name: 智能选择[\s\S]*?    interval: 300(?=\n\n  - name: 香港自动)/);
  if (!match) throw new Error("Could not find 智能选择 proxy-group block in smart.yaml");
  return match[0];
}

export async function loadRegionSource(rootDir = process.cwd()) {
  const sourcePath = path.join(rootDir, "regions.json");
  const source = JSON.parse(await fs.readFile(sourcePath, "utf8"));
  if (!Array.isArray(source.regions) || !source.regions.length) {
    throw new Error("regions.json must define a non-empty regions array");
  }
  if (!Array.isArray(source.subscriptionInfoKeywords) || !source.subscriptionInfoKeywords.length) {
    throw new Error("regions.json must define a non-empty subscriptionInfoKeywords array");
  }
  if (!source.other?.name || !source.other?.icon || !source.other?.key) {
    throw new Error("regions.json must define other group metadata");
  }
  return source;
}

export function buildGeneratedRegionContent(source) {
  const subscriptionInfoJs = buildJsPatternBlock(
    "SUBSCRIPTION_INFO_PATTERNS",
    source.subscriptionInfoKeywords
  );
  const js = [
    "const REGION_DEFS = [",
    [...source.regions.map(buildRegionDef), buildOtherDef(source.other)].join(",\n"),
    "];"
  ].join("\n");

  const lowFrequencyJs = [
    "const LOW_FREQUENCY_REGION_OPTIONS = [",
    source.lowFrequencyRegionNames.map((name) => `  ${JSON.stringify(name)}`).join(",\n"),
    "];"
  ].join("\n");

  const yaml = [
    ...source.regions.map((region) => buildYamlGroup(region, source)),
    buildYamlOtherGroup(source)
  ].join("\n\n");

  return {
    subscriptionInfoJs,
    js,
    lowFrequencyJs,
    yamlSmart: buildYamlSmartGroup(source),
    yaml
  };
}

export async function checkGeneratedFiles(rootDir = process.cwd()) {
  const source = await loadRegionSource(rootDir);
  const generated = buildGeneratedRegionContent(source);
  const smartJs = normalizeNewlines(await fs.readFile(path.join(rootDir, "smart.js"), "utf8"));
  const smartYaml = normalizeNewlines(await fs.readFile(path.join(rootDir, "smart.yaml"), "utf8"));
  const mismatches = [];

  if (extractSmartJsRegionBlock(smartJs) !== generated.js) {
    mismatches.push("smart.js REGION_DEFS");
  }
  if (extractSmartJsSubscriptionInfoBlock(smartJs) !== generated.subscriptionInfoJs) {
    mismatches.push("smart.js SUBSCRIPTION_INFO_PATTERNS");
  }
  if (extractLowFrequencyBlock(smartJs) !== generated.lowFrequencyJs) {
    mismatches.push("smart.js LOW_FREQUENCY_REGION_OPTIONS");
  }
  if (extractSmartYamlRegionBlock(smartYaml) !== generated.yaml) {
    mismatches.push("smart.yaml region proxy-groups");
  }
  if (extractSmartYamlSmartGroup(smartYaml) !== generated.yamlSmart) {
    mismatches.push("smart.yaml 智能选择 proxy-group");
  }

  return mismatches;
}

async function writeGeneratedFiles(rootDir) {
  const source = await loadRegionSource(rootDir);
  const generated = buildGeneratedRegionContent(source);
  const smartJsPath = path.join(rootDir, "smart.js");
  const smartYamlPath = path.join(rootDir, "smart.yaml");
  let smartJs = normalizeNewlines(await fs.readFile(smartJsPath, "utf8"));
  let smartYaml = normalizeNewlines(await fs.readFile(smartYamlPath, "utf8"));

  smartJs = smartJs
    .replace(extractSmartJsSubscriptionInfoBlock(smartJs), generated.subscriptionInfoJs)
    .replace(extractSmartJsRegionBlock(smartJs), generated.js)
    .replace(extractLowFrequencyBlock(smartJs), generated.lowFrequencyJs);
  smartYaml = smartYaml.replace(extractSmartYamlRegionBlock(smartYaml), generated.yaml);
  smartYaml = smartYaml.replace(extractSmartYamlSmartGroup(smartYaml), generated.yamlSmart);

  await fs.writeFile(smartJsPath, `${smartJs.trimEnd()}\n`, "utf8");
  await fs.writeFile(smartYamlPath, `${smartYaml.trimEnd()}\n`, "utf8");
}

async function main() {
  const rootDir = process.cwd();
  if (process.argv.includes("--check")) {
    const mismatches = await checkGeneratedFiles(rootDir);
    if (mismatches.length) {
      throw new Error(`Generated region blocks are stale: ${mismatches.join(", ")}`);
    }
    console.log("Region generated blocks are up to date");
    return;
  }

  await writeGeneratedFiles(rootDir);
  console.log("Generated region blocks in smart.js and smart.yaml");
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
