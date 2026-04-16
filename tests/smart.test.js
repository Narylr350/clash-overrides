const assert = require("node:assert/strict");
const { main } = require("../smart.js");

function makeConfig(proxyNames) {
  return {
    proxies: proxyNames.map((name) => ({ name }))
  };
}

function getGroup(result, name) {
  return result["proxy-groups"].find((group) => group.name === name);
}

assert.equal(typeof main, "function", "smart.js should export main for local tests");

{
  const result = main(makeConfig(["HK-01", "US-01", "Plain-Relay"]));
  assert.deepEqual(
    getGroup(result, "智能选择").proxies,
    ["HK-01", "US-01", "Plain-Relay"],
    "智能选择 should include every node, including unclassified names"
  );
}

{
  const result = main(
    makeConfig([
      "HK-01",
      "SG-01",
      "JP-01",
      "KR-01",
      "US-01",
      "TW-01",
      "DE-01",
      "MY-01",
      "Plain-Relay"
    ])
  );

  assert.ok(getGroup(result, "欧洲自动"), "should expose 欧洲自动");
  assert.ok(getGroup(result, "亚洲其他自动"), "should expose 亚洲其他自动");
  assert.ok(getGroup(result, "其他自动"), "should expose 其他自动");
  assert.equal(getGroup(result, "英国自动"), undefined, "should remove 英国自动");
  assert.equal(getGroup(result, "德国自动"), undefined, "should remove 德国自动");
  assert.equal(getGroup(result, "全局代理"), undefined, "should remove 全局代理");

  assert.deepEqual(
    getGroup(result, "默认代理").proxies,
    [
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
    ],
    "默认代理 should become the total default proxy entry"
  );

  assert.deepEqual(
    getGroup(result, "漏网之鱼").proxies,
    ["默认代理", "智能选择", "DIRECT"],
    "漏网之鱼 should follow 默认代理 first"
  );

  assert.deepEqual(
    getGroup(result, "其他自动").proxies,
    ["Plain-Relay"],
    "其他自动 should collect leftover unclassified nodes"
  );
}

{
  const result = main(
    makeConfig([
      "HK-01",
      "SG-01",
      "JP-01",
      "KR-01",
      "US-01",
      "TW-01",
      "DE-01",
      "MY-01",
      "Plain-Relay"
    ])
  );

  assert.deepEqual(
    getGroup(result, "AIGC").proxies,
    [
      "默认代理",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "欧洲自动",
      "香港自动",
      "韩国自动",
      "台湾自动",
      "亚洲其他自动",
      "其他自动",
      "智能选择"
    ],
    "AIGC should attach to 默认代理 before AI-specific lanes"
  );

  assert.deepEqual(
    getGroup(result, "OpenAI").proxies,
    ["AIGC", "默认代理", "新加坡自动", "日本自动", "美国自动", "欧洲自动", "智能选择"],
    "OpenAI should include 默认代理 after AIGC"
  );

  assert.deepEqual(
    getGroup(result, "Copilot").proxies,
    ["AIGC", "默认代理", "DIRECT", "美国自动", "日本自动", "新加坡自动", "智能选择"],
    "Copilot should keep DIRECT as a special case but still inherit 默认代理"
  );

  assert.deepEqual(
    getGroup(result, "GitHub").proxies,
    ["默认代理", "美国自动", "日本自动", "新加坡自动", "欧洲自动", "智能选择", "DIRECT"],
    "GitHub should follow 默认代理 before service-specific lanes"
  );

  assert.deepEqual(
    getGroup(result, "Google").proxies,
    ["默认代理", "新加坡自动", "日本自动", "美国自动", "香港自动", "欧洲自动", "智能选择", "DIRECT"],
    "Google should follow 默认代理 before service-specific lanes"
  );

  assert.deepEqual(
    getGroup(result, "微软服务").proxies,
    ["DIRECT", "默认代理", "美国自动", "日本自动", "新加坡自动", "欧洲自动", "智能选择"],
    "Microsoft should stay direct-first but inherit 默认代理 second"
  );
}

{
  const result = main(makeConfig(["US-01"]));
  const providers = result["rule-providers"];
  const rules = result.rules;

  assert.ok(providers.adblock, "should keep adblock provider");
  assert.ok(providers.ai, "should keep ai provider");
  assert.ok(providers.google, "should keep google provider");
  assert.ok(providers.microsoft, "should keep microsoft provider");
  assert.ok(providers.github, "should keep github provider");
  assert.ok(providers.telegram, "should keep telegram provider");
  assert.ok(providers.games, "should keep games provider");
  assert.ok(providers["games-cn"], "should keep games-cn provider");
  assert.ok(providers.cn, "should keep cn provider");
  assert.equal(providers.adblock_plus, undefined, "should remove duplicate adblock_plus provider");

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,claude.ai,Claude") < rules.indexOf("RULE-SET,ai,AIGC"),
    "explicit Claude domains should stay ahead of generic AI rules"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,github.com,GitHub") < rules.indexOf("RULE-SET,github,GitHub"),
    "explicit GitHub domains should stay ahead of GitHub ruleset"
  );

  assert.equal(rules[rules.length - 1], "MATCH,漏网之鱼", "last rule should stay as 漏网之鱼");
}

console.log("PASS smart.js regression checks");
