const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

(async () => {
  const geodata = await import("../scripts/sync-geodata.mjs");

  assert.deepEqual(geodata.GEODATA_SOURCES, [
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
  ]);

  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "sync-geodata-"));
  const requestedUrls = [];
  const summary = await geodata.syncGeodata({
    rootDir,
    fetchImpl: async (url) => {
      requestedUrls.push(url);
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => Buffer.from(`binary from ${url}`)
      };
    }
  });

  assert.equal(requestedUrls.length, 4);
  assert.deepEqual(
    summary.map((item) => item.path),
    [
      "geodata/geoip-lite.dat",
      "geodata/geosite.dat",
      "geodata/geoip.metadb",
      "geodata/GeoLite2-ASN.mmdb"
    ]
  );
  assert.equal(
    fs.readFileSync(path.join(rootDir, "geodata", "geosite.dat"), "utf8"),
    "binary from https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat"
  );

  await assert.rejects(
    geodata.syncGeodata({
      rootDir,
      fetchImpl: async () => ({ ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer() })
    }),
    /Failed to download GeoIP database/
  );

  console.log("PASS geodata sync checks");
})();
