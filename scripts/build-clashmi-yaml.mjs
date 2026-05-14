import fs from "node:fs/promises";
import path from "node:path";

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n");
}

export function buildClashMiYaml(source) {
  const normalized = normalizeNewlines(source);
  const withoutProviders = normalized.replace(
    /\nrule-providers:\n[\s\S]*?(?=\nrules:\n)/,
    "\n"
  );

  const lines = withoutProviders.split("\n");
  const result = [];
  for (const line of lines) {
    if (/^\s+- RULE-SET,/.test(line)) continue;
    if (/^\s+- PROCESS-NAME,/.test(line)) continue;
    result.push(line);
  }

  return `${result.join("\n").trimEnd()}\n`;
}

export async function checkGeneratedFile(rootDir = process.cwd()) {
  const smartYaml = await fs.readFile(path.join(rootDir, "smart.yaml"), "utf8");
  const expected = buildClashMiYaml(smartYaml);
  const actual = normalizeNewlines(await fs.readFile(path.join(rootDir, "clashmi.yaml"), "utf8"));
  return actual === expected ? [] : ["clashmi.yaml"];
}

async function writeGeneratedFile(rootDir) {
  const smartYaml = await fs.readFile(path.join(rootDir, "smart.yaml"), "utf8");
  await fs.writeFile(path.join(rootDir, "clashmi.yaml"), buildClashMiYaml(smartYaml), "utf8");
}

async function main() {
  const rootDir = process.cwd();
  if (process.argv.includes("--check")) {
    const mismatches = await checkGeneratedFile(rootDir);
    if (mismatches.length) {
      throw new Error(`Generated ClashMi file is stale: ${mismatches.join(", ")}`);
    }
    console.log("ClashMi YAML is up to date");
    return;
  }

  await writeGeneratedFile(rootDir);
  console.log("Generated clashmi.yaml");
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
