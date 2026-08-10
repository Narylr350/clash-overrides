const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const builder = await import("../scripts/build-clashmi-yaml.mjs");
  const rootDir = path.join(__dirname, "..");
  const clashMiPath = path.join(rootDir, "clashmi.yaml");
  assert.ok(fs.existsSync(clashMiPath), "clashmi.yaml should exist");

  const content = fs.readFileSync(clashMiPath, "utf8");
  const localDirectRules = [
    "DOMAIN,localhost,DIRECT",
    "DOMAIN-SUFFIX,localhost,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,169.254.0.0/16,DIRECT,no-resolve",
    "IP-CIDR6,::1/128,DIRECT,no-resolve",
    "IP-CIDR6,fc00::/7,DIRECT,no-resolve",
    "IP-CIDR6,fe80::/10,DIRECT,no-resolve"
  ];
  const ruleLines = content
    .slice(content.indexOf("rules:\n"))
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));

  assert.deepEqual(
    ruleLines.slice(0, localDirectRules.length),
    localDirectRules,
    "ClashMi should preserve localhost, loopback, and private-network direct rules first"
  );
  assert.ok(
    !ruleLines.includes("PROCESS-NAME,com.termux,DIRECT"),
    "ClashMi should not force all Termux internet traffic direct"
  );
  assert.ok(
    !ruleLines.includes("IP-CIDR,0.0.0.0/8,DIRECT,no-resolve"),
    "ClashMi should not bypass invalid and adblock sinkhole addresses"
  );

  assert.doesNotMatch(content, /\nrule-providers:\n/, "ClashMi YAML should not use remote rule providers");
  assert.doesNotMatch(content, /^\s+- RULE-SET,/m, "ClashMi YAML should not depend on RULE-SET entries");
  assert.doesNotMatch(content, /^\s+- PROCESS-NAME,/m, "ClashMi iOS YAML should not include process rules");

  assert.match(content, /- name: 智能选择/, "ClashMi YAML should keep smart selection");
  assert.match(content, /- name: 开发/, "ClashMi YAML should keep Dev group");
  assert.doesNotMatch(content, /- name: 游戏服务/, "ClashMi YAML should not keep Game Service aggregate group");
  assert.match(content, /- name: 海外游戏平台/, "ClashMi YAML should keep Overseas Game Platform group");
  assert.match(content, /- name: 海外游戏/, "ClashMi YAML should keep Overseas Game group");
  assert.match(content, /- name: Apple/, "ClashMi YAML should keep Apple group");
  assert.match(content, /DOMAIN-SUFFIX,apple\.com,Apple/, "ClashMi YAML should keep explicit Apple rules");
  assert.ok(
    content.indexOf("DOMAIN-SUFFIX,generativelanguage.googleapis.com,Gemini") <
      content.indexOf("DOMAIN-SUFFIX,googleapis.com,Google"),
    "ClashMi YAML should keep Gemini API ahead of generic Google API rules"
  );
  assert.match(content, /DOMAIN-SUFFIX,googleapis\.com,Google/, "ClashMi YAML should keep explicit Google API rules");
  assert.match(content, /DOMAIN-SUFFIX,google\.com,Google/, "ClashMi YAML should keep explicit Chrome Google service rules");
  assert.match(content, /DOMAIN-SUFFIX,gstatic\.com,Google/, "ClashMi YAML should route Google static assets through Google");
  assert.match(content, /DOMAIN-SUFFIX,minecraft\.net,开发/, "ClashMi YAML should keep explicit Dev rules");
  assert.match(content, /DOMAIN-SUFFIX,steampowered\.com,海外游戏平台/, "ClashMi YAML should keep explicit game platform rules");
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
