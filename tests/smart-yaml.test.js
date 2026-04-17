const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const yamlPath = path.join(__dirname, "..", "smart.yaml");
assert.ok(fs.existsSync(yamlPath), "smart.yaml should exist");

const content = fs.readFileSync(yamlPath, "utf8");

function getGroupBlock(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(
    new RegExp(
      `- name: ${escaped}[\\s\\S]*?(?=\\n  - name: |\\nrule-providers:|\\nrules:|$)`
    )
  );
  return match ? match[0] : "";
}

function getListValues(block, key) {
  const listMatch = block.match(new RegExp(`${key}:\\n((?:\\s+- .+\\n)+)`));
  if (!listMatch) return [];
  return listMatch[1]
    .trimEnd()
    .split("\n")
    .map((line) => line.replace(/^\s+-\s*/, ""));
}

assert.ok(getGroupBlock("智能选择"), "智能选择 should exist");
assert.ok(getGroupBlock("欧洲自动"), "欧洲自动 should exist");
assert.ok(getGroupBlock("亚洲其他自动"), "亚洲其他自动 should exist");
assert.ok(getGroupBlock("其他自动"), "其他自动 should exist");

assert.deepEqual(getListValues(getGroupBlock("默认代理"), "proxies"), [
  "智能选择",
  "香港自动",
  "新加坡自动",
  "日本自动",
  "韩国自动",
  "美国自动",
  "台湾自动",
  "欧洲自动",
  "亚洲其他自动",
  "其他自动",
  "DIRECT"
]);

assert.ok(/adblock:\n/.test(content), "adblock provider should exist");
assert.ok(/ai:\n/.test(content), "ai provider should exist");
assert.ok(/google:\n/.test(content), "google provider should exist");
assert.ok(/microsoft:\n/.test(content), "microsoft provider should exist");
assert.ok(/github:\n/.test(content), "github provider should exist");
assert.ok(/telegram:\n/.test(content), "telegram provider should exist");
assert.ok(/games:\n/.test(content), "games provider should exist");
assert.ok(/games-cn:\n/.test(content), "games-cn provider should exist");
assert.ok(/cn:\n/.test(content), "cn provider should exist");
assert.ok(/tiktok:\n/.test(content), "tiktok provider should exist");
assert.ok(/youtube:\n/.test(content), "youtube provider should exist");
assert.ok(/pixiv:\n/.test(content), "pixiv provider should exist");
assert.ok(/x:\n/.test(content), "x provider should exist");
assert.ok(!/adblock_plus:\n/.test(content), "adblock_plus should not exist");

const rulesStart = content.indexOf("rules:\n");
assert.notEqual(rulesStart, -1, "rules section should exist");
const rules = content.slice(rulesStart);

assert.ok(rules.includes("DOMAIN-SUFFIX,ab.chatgpt.com,OpenAI"));
assert.ok(rules.includes("DOMAIN-SUFFIX,ws.chatgpt.com,OpenAI"));
assert.ok(rules.includes("DOMAIN-SUFFIX,android.chat.openai.com,OpenAI"));
assert.ok(rules.includes("DOMAIN-SUFFIX,api.revenuecat.com,OpenAI"));
assert.ok(rules.includes("DOMAIN-SUFFIX,prodregistryv2.org,OpenAI"));
assert.ok(rules.includes("DOMAIN-SUFFIX,datadog.pool.ntp.org,OpenAI"));
assert.ok(rules.includes("PROCESS-NAME,com.openai.chatgpt,OpenAI"));
assert.ok(rules.includes("DOMAIN-SUFFIX,tiktokv.com,TikTok"));
assert.ok(rules.includes("DOMAIN-SUFFIX,youtube.com,YouTube"));
assert.ok(rules.includes("DOMAIN-SUFFIX,pixiv.net,Pixiv"));
assert.ok(rules.includes("DOMAIN-SUFFIX,x.com,X"));

assert.ok(
  rules.indexOf("PROCESS-NAME,com.openai.chatgpt,OpenAI") < rules.indexOf("RULE-SET,ai,AIGC"),
  "ChatGPT Android process rule should be ahead of generic AI rules"
);
assert.ok(
  rules.indexOf("DOMAIN-SUFFIX,tiktokv.com,TikTok") < rules.indexOf("RULE-SET,tiktok,TikTok"),
  "explicit TikTok rules should be ahead of its ruleset"
);
assert.ok(
  rules.indexOf("DOMAIN-SUFFIX,youtube.com,YouTube") < rules.indexOf("RULE-SET,youtube,YouTube"),
  "explicit YouTube rules should be ahead of its ruleset"
);
assert.ok(
  rules.indexOf("DOMAIN-SUFFIX,pixiv.net,Pixiv") < rules.indexOf("RULE-SET,pixiv,Pixiv"),
  "explicit Pixiv rules should be ahead of its ruleset"
);
assert.ok(
  rules.indexOf("DOMAIN-SUFFIX,x.com,X") < rules.indexOf("RULE-SET,x,X"),
  "explicit X rules should be ahead of its ruleset"
);
assert.ok(
  rules.indexOf("DOMAIN-SUFFIX,github.com,GitHub") < rules.indexOf("RULE-SET,github,GitHub"),
  "explicit GitHub rules should be ahead of its ruleset"
);
assert.ok(rules.trimEnd().endsWith("- MATCH,漏网之鱼"), "last rule should be 漏网之鱼");

const readmePath = path.join(__dirname, "..", "README.md");
const readme = fs.readFileSync(readmePath, "utf8");

assert.match(readme, /smart\.js/, "README should still mention smart.js");
assert.match(readme, /smart\.yaml/, "README should mention smart.yaml");
assert.match(readme, /Script Override/, "README should explain the JS entrypoint");
assert.match(readme, /YAML-only|只读取 YAML|YAML 覆写/, "README should explain the YAML entrypoint");
assert.match(readme, /ClashMi/, "README should mention ClashMi in the YAML context");

console.log("PASS smart.yaml full regression checks");
