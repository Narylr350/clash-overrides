const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const builder = await import("../scripts/build-regions.mjs");
  const rootDir = path.join(__dirname, "..");
  const source = await builder.loadRegionSource(rootDir);

  assert.ok(
    source.regions.find((region) => region.name === "欧洲自动")?.keywords.includes("united kingdom"),
    "region source should keep United Kingdom in the maintainable keyword list"
  );
  assert.ok(
    source.regions.find((region) => region.name === "北美自动")?.keywords.includes("canada"),
    "region source should keep Canada in the maintainable keyword list"
  );

  const generated = builder.buildGeneratedRegionContent(source);
  assert.match(generated.js, /const REGION_DEFS = \[/);
  assert.match(generated.js, /group: "北美自动"/);
  assert.match(generated.yaml, /- name: 北美自动/);
  assert.match(generated.yaml, /exclude-filter: '.+canada.+south\\s\*africa.+australia/);

  assert.deepEqual(
    await builder.checkGeneratedFiles(rootDir),
    [],
    "smart.js and smart.yaml generated region blocks should match regions.json"
  );

  assert.equal(fs.existsSync(path.join(rootDir, "regions.json")), true);
  console.log("PASS region generation checks");
})();
