const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { main } = require("../smart.js");

const visibleNames = [
  "默认代理",
  "智能选择",
  "漏网之鱼",
  "AIGC",
  "OpenAI",
  "Claude",
  "Gemini",
  "OpenCode",
  "Copilot",
  "开发",
  "GitHub",
  "Google",
  "YouTube",
  "TikTok",
  "Telegram",
  "X",
  "Pixiv",
  "海外游戏平台",
  "海外游戏",
  "Apple",
  "微软服务",
  "广告拦截"
];
const root = path.join(__dirname, "..");
const regions = JSON.parse(fs.readFileSync(path.join(root, "regions.json"), "utf8"));
const hiddenNames = ["国内直连", ...regions.regions.map((region) => region.name), regions.other.name];
const expectedNames = [...visibleNames, ...hiddenNames];
const result = main({ proxies: [{ name: "HK-01" }, { name: "SG-01" }] });
const groups = result["proxy-groups"];

assert.deepEqual(groups.map((group) => group.name), expectedNames);
assert.deepEqual(groups.filter((group) => !group.hidden).map((group) => group.name), visibleNames);
assert.deepEqual(groups.filter((group) => group.hidden).map((group) => group.name), hiddenNames);
// 隐藏只影响独立入口，不能删掉地区候选或国内分流目标。
for (const name of hiddenNames.slice(1)) {
  assert.ok(groups.find((group) => group.name === "默认代理").proxies.includes(name));
}
assert.ok(result.rules.includes("GEOIP,CN,国内直连"));
for (const group of groups.filter((group) => group.type === "select")) {
  for (const candidate of group.proxies) {
    assert.ok(expectedNames.includes(candidate) || ["DIRECT", "REJECT"].includes(candidate),
      group.name + " references missing candidate " + candidate);
  }
}

for (const filename of ["smart.yaml", "clashmi.yaml"]) {
  const content = fs.readFileSync(path.join(root, filename), "utf8").replace(/\r\n/g, "\n");
  const section = content.split("proxy-groups:\n")[1].split(/\n(?:rule-providers|rules):/)[0];
  const blocks = [...section.matchAll(/  - name: ([^\n]+)\n[\s\S]*?(?=\n  - name: |$)/g)];
  assert.deepEqual(blocks.map((match) => match[1]), expectedNames, filename);
  assert.deepEqual(blocks.filter((match) => !/    hidden: true\n/.test(match[0])).map((match) => match[1]), visibleNames, filename);
  assert.deepEqual(blocks.filter((match) => /    hidden: true\n/.test(match[0])).map((match) => match[1]), hiddenNames, filename);
  const defaultGroup = blocks.find((match) => match[1] === "默认代理")[0];
  for (const name of hiddenNames.slice(1)) {
    assert.ok(defaultGroup.includes("      - " + name), filename);
  }
}

console.log("Proxy group usability tests passed");
