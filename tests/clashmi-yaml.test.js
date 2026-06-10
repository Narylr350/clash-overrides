const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const builder = await import("../scripts/build-clashmi-yaml.mjs");
  const rootDir = path.join(__dirname, "..");
  const clashMiPath = path.join(rootDir, "clashmi.yaml");
  assert.ok(fs.existsSync(clashMiPath), "clashmi.yaml should exist");

  const content = fs.readFileSync(clashMiPath, "utf8");
  assert.doesNotMatch(content, /\nrule-providers:\n/, "ClashMi YAML should not use remote rule providers");
  assert.doesNotMatch(content, /^\s+- RULE-SET,/m, "ClashMi YAML should not depend on RULE-SET entries");
  assert.doesNotMatch(content, /^\s+- PROCESS-NAME,/m, "ClashMi iOS YAML should not include process rules");

  assert.match(content, /- name: 智能选择/, "ClashMi YAML should keep smart selection");
  assert.match(content, /- name: 开发/, "ClashMi YAML should keep Dev group");
  assert.match(content, /- name: Apple/, "ClashMi YAML should keep Apple group");
  assert.match(content, /DOMAIN-SUFFIX,apple\.com,Apple/, "ClashMi YAML should keep explicit Apple rules");
  assert.match(content, /DOMAIN-SUFFIX,googleapis\.com,Google/, "ClashMi YAML should keep explicit Google API rules");
  assert.match(content, /DOMAIN-SUFFIX,google\.com,Google/, "ClashMi YAML should keep explicit Chrome Google service rules");
  assert.match(content, /DOMAIN-SUFFIX,gstatic\.com,Google/, "ClashMi YAML should route Google static assets through Google");
  assert.match(content, /DOMAIN-SUFFIX,minecraft\.net,开发/, "ClashMi YAML should keep explicit Dev rules");
  assert.match(content, /DOMAIN-SUFFIX,jsdelivr\.net,开发/, "ClashMi YAML should route common CDNs through Dev");
  assert.match(content, /GEOIP,CN,国内直连/, "ClashMi YAML should keep lightweight CN fallback");
  assert.ok(content.trimEnd().endsWith("- MATCH,漏网之鱼"), "last rule should stay as 漏网之鱼");

  assert.deepEqual(
    await builder.checkGeneratedFile(rootDir),
    [],
    "clashmi.yaml should be generated from smart.yaml"
  );

  console.log("PASS ClashMi YAML compatibility checks");
})();
