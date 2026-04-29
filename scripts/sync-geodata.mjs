import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const GEODATA_SOURCES = [
  {
    name: "GeoIP database",
    file: "geoip-lite.dat",
    url: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat"
  },
  {
    name: "GeoSite database",
    file: "geosite.dat",
    url: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat"
  },
  {
    name: "MMDB database",
    file: "geoip.metadb",
    url: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb"
  },
  {
    name: "ASN database",
    file: "GeoLite2-ASN.mmdb",
    url: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb"
  }
];

function toDisplayPath(filePath) {
  return filePath.split(path.sep).join("/");
}

async function downloadBinary(source, fetchImpl) {
  const response = await fetchImpl(source.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${source.name}: HTTP ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function syncGeodata({
  rootDir = process.cwd(),
  outputDir = path.join(rootDir, "geodata"),
  fetchImpl = globalThis.fetch
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("No fetch implementation is available");
  }

  await fs.mkdir(outputDir, { recursive: true });

  const summary = [];
  for (const source of GEODATA_SOURCES) {
    const outputPath = path.join(outputDir, source.file);
    const buffer = await downloadBinary(source, fetchImpl);
    await fs.writeFile(outputPath, buffer);
    summary.push({
      name: source.name,
      path: toDisplayPath(path.relative(rootDir, outputPath)),
      bytes: buffer.byteLength
    });
  }
  return summary;
}

async function main() {
  const summary = await syncGeodata();
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
