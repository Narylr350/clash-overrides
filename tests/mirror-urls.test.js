const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { main } = require("../smart.js");

const REPO_RAW_BASE =
  "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset";

const expectedProviders = [
  "adblock",
  "ai",
  "google",
  "microsoft",
  "games",
  "games-cn",
  "cn",
  "github",
  "apple",
  "tiktok",
  "youtube",
  "pixiv",
  "x",
  "telegram"
];

const config = main({ proxies: [{ name: "HK-01" }] });
for (const name of expectedProviders) {
  assert.equal(
    config["rule-providers"][name].url,
    `${REPO_RAW_BASE}/${name}.list`,
    `${name} provider in smart.js should use the repository mirror`
  );
}

const yaml = fs.readFileSync(path.join(__dirname, "..", "smart.yaml"), "utf8");
for (const name of expectedProviders) {
  assert.match(
    yaml,
    new RegExp(`url: ${REPO_RAW_BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/${name}\\.list`),
    `${name} provider in smart.yaml should use the repository mirror`
  );
}

const sources = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "ruleset", "sources.json"), "utf8")
);
assert.deepEqual(
  sources.map((source) => source.name),
  expectedProviders,
  "upstream source manifest should list every mirrored provider"
);
for (const source of sources) {
  assert.match(source.url, /^https:\/\/raw\.githubusercontent\.com\//);
  assert.doesNotMatch(source.url, /Narylr350\/clash-overrides/);
}

console.log("PASS mirror URL checks");
