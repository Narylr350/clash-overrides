const assert = require("node:assert/strict");
const { main } = require("../smart.js");

const LOCAL_DIRECT_RULES = [
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
    "智能选择 should include every real node, including unclassified names"
  );
}

{
  const result = main(
    makeConfig([
      "HK-01",
      "澳门 01",
      "Macau 02",
      "SG-01",
      "若节点不通请更新订阅",
      "JP-01",
      "KR-01",
      "US-01",
      "TW-01",
      "[HK]HongKong01-GPT优化",
      "[SG]Singapore01",
      "[JP]Tokyo01",
      "[US]Los Angeles01-GPT优化",
      "[TW]TaiPei01-GPT优化",
      "[RU]俄罗斯-Moscow",
      "[MK]马其顿-Macedonia",
      "剩余流量: 65.36 GB",
      "套餐到期: 2026-12-31",
      "官网: example.com",
      "DE-01",
      "United Kingdom 01",
      "United Kingdom 02",
      "Canada 01",
      "Mexico 01",
      "Brazil 01",
      "South Africa 01",
      "Australia 01",
      "澳大利亚",
      "尼日利亚",
      "剩余流量: 766.7 GB",
      "--------分割--------",
      "MY-01",
      "Plain-Relay"
    ])
  );

  assert.ok(getGroup(result, "欧洲自动"), "should expose 欧洲自动");
  assert.ok(getGroup(result, "澳门自动"), "should expose 澳门自动");
  assert.ok(getGroup(result, "亚洲其他自动"), "should expose 亚洲其他自动");
  assert.ok(getGroup(result, "北美自动"), "should expose 北美自动");
  assert.ok(getGroup(result, "南美自动"), "should expose 南美自动");
  assert.ok(getGroup(result, "非洲自动"), "should expose 非洲自动");
  assert.ok(getGroup(result, "大洋洲自动"), "should expose 大洋洲自动");
  assert.ok(getGroup(result, "其他自动"), "should expose 其他自动");
  assert.equal(getGroup(result, "英国自动"), undefined, "should remove 英国自动");
  assert.equal(getGroup(result, "德国自动"), undefined, "should remove 德国自动");
  assert.equal(getGroup(result, "全局代理"), undefined, "should remove 全局代理");

  assert.deepEqual(
    getGroup(result, "默认代理").proxies,
    [
      "智能选择",
      "香港自动",
      "澳门自动",
      "新加坡自动",
      "日本自动",
      "韩国自动",
      "美国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "默认代理 should become the total default proxy entry"
  );

  assert.deepEqual(
    getGroup(result, "漏网之鱼").proxies,
    [
      "默认代理",
      "智能选择",
      "香港自动",
      "澳门自动",
      "新加坡自动",
      "日本自动",
      "韩国自动",
      "美国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "漏网之鱼 should keep full manual options while following 默认代理 first"
  );

  assert.deepEqual(
    getGroup(result, "其他自动").proxies,
    ["Plain-Relay"],
    "其他自动 should collect leftover unclassified nodes"
  );

  for (const subscriptionInfoName of [
    "若节点不通请更新订阅",
    "剩余流量: 65.36 GB",
    "套餐到期: 2026-12-31",
    "官网: example.com",
    "剩余流量: 766.7 GB",
    "--------分割--------"
  ]) {
    assert.ok(
      !getGroup(result, "智能选择").proxies.includes(subscriptionInfoName),
      `智能选择 should exclude subscription metadata node ${subscriptionInfoName}`
    );
    assert.ok(
      !getGroup(result, "其他自动").proxies.includes(subscriptionInfoName),
      `其他自动 should exclude subscription metadata node ${subscriptionInfoName}`
    );
  }

  assert.ok(
    !getGroup(result, "新加坡自动").proxies.includes("若节点不通请更新订阅"),
    "新加坡自动 should not match unrelated Chinese text by the ambiguous single-character 新"
  );

  assert.deepEqual(
    getGroup(result, "欧洲自动").proxies,
    ["[RU]俄罗斯-Moscow", "[MK]马其顿-Macedonia", "DE-01", "United Kingdom 01", "United Kingdom 02"],
    "欧洲自动 should collect full United Kingdom and bracketed Europe node names"
  );

  assert.deepEqual(
    getGroup(result, "香港自动").proxies,
    ["HK-01", "[HK]HongKong01-GPT优化"],
    "香港自动 should collect bracketed HK/HongKong node names"
  );

  assert.ok(
    !getGroup(result, "欧洲自动").proxies.includes("剩余流量: 65.36 GB"),
    "欧洲自动 should not match traffic quota labels by the ambiguous GB unit"
  );

  assert.deepEqual(
    getGroup(result, "澳门自动").proxies,
    ["澳门 01", "Macau 02"],
    "澳门自动 should collect Macau nodes before the other fallback group"
  );

  assert.deepEqual(
    getGroup(result, "新加坡自动").proxies,
    ["SG-01", "[SG]Singapore01"],
    "新加坡自动 should collect bracketed SG/Singapore node names"
  );

  assert.deepEqual(
    getGroup(result, "日本自动").proxies,
    ["JP-01", "[JP]Tokyo01"],
    "日本自动 should collect bracketed JP/Tokyo node names"
  );

  assert.deepEqual(
    getGroup(result, "美国自动").proxies,
    ["US-01", "[US]Los Angeles01-GPT优化"],
    "美国自动 should collect bracketed US/Los Angeles node names"
  );

  assert.deepEqual(
    getGroup(result, "台湾自动").proxies,
    ["TW-01", "[TW]TaiPei01-GPT优化"],
    "台湾自动 should collect bracketed TW/Taipei node names"
  );

  assert.deepEqual(
    getGroup(result, "北美自动").proxies,
    ["Canada 01", "Mexico 01"],
    "北美自动 should collect low-frequency North America nodes after dedicated US nodes"
  );

  assert.deepEqual(
    getGroup(result, "南美自动").proxies,
    ["Brazil 01"],
    "南美自动 should collect low-frequency South America nodes"
  );

  assert.deepEqual(
    getGroup(result, "非洲自动").proxies,
    ["South Africa 01", "尼日利亚"],
    "非洲自动 should collect low-frequency Africa nodes"
  );

  assert.deepEqual(
    getGroup(result, "大洋洲自动").proxies,
    ["Australia 01", "澳大利亚"],
    "大洋洲自动 should collect low-frequency Oceania nodes"
  );

  assert.ok(
    !getGroup(result, "澳门自动").proxies.includes("澳大利亚"),
    "澳门自动 should not match Australia by the ambiguous single-character 澳"
  );

  assert.ok(
    !getGroup(result, "日本自动").proxies.includes("尼日利亚"),
    "日本自动 should not match Nigeria by the ambiguous single-character 日"
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
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "AIGC should follow 默认代理 first but still expose full manual options"
  );

  assert.deepEqual(
    getGroup(result, "OpenAI").proxies,
    [
      "AIGC",
      "默认代理",
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "OpenAI should keep full manual options after AIGC and 默认代理"
  );

  assert.deepEqual(
    getGroup(result, "Claude").proxies,
    [
      "AIGC",
      "默认代理",
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Claude should keep full manual options after AIGC and 默认代理"
  );

  assert.deepEqual(
    getGroup(result, "Gemini").proxies,
    [
      "AIGC",
      "默认代理",
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Gemini should keep full manual options after AIGC and 默认代理"
  );

  assert.deepEqual(
    getGroup(result, "OpenCode").proxies,
    [
      "AIGC",
      "默认代理",
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "OpenCode should keep full manual options after AIGC and 默认代理"
  );

  assert.deepEqual(
    getGroup(result, "Copilot").proxies,
    [
      "AIGC",
      "默认代理",
      "DIRECT",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动"
    ],
    "Copilot should keep DIRECT as a special case but still expose full manual options"
  );

  assert.deepEqual(
    getGroup(result, "GitHub").proxies,
    [
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "GitHub should follow 默认代理 first and keep manual region options"
  );

  assert.deepEqual(
    getGroup(result, "Apple").proxies,
    [
      "DIRECT",
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动"
    ],
    "Apple should stay direct-first but keep full manual options"
  );

  assert.deepEqual(
    getGroup(result, "Google").proxies,
    [
      "默认代理",
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Google should follow 默认代理 first and keep manual region options"
  );

  assert.deepEqual(
    getGroup(result, "Telegram").proxies,
    [
      "默认代理",
      "智能选择",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "日本自动",
      "韩国自动",
      "台湾自动",
      "美国自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Telegram should follow 默认代理 first and keep manual region options"
  );

  assert.deepEqual(
    getGroup(result, "微软服务").proxies,
    [
      "DIRECT",
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动"
    ],
    "Microsoft should stay direct-first but keep full manual options"
  );

  assert.equal(getGroup(result, "游戏服务"), undefined, "Game service aggregate should not exist");

  assert.deepEqual(
    getGroup(result, "海外游戏平台").proxies,
    [
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Game platform should target overseas platform traffic"
  );

  assert.deepEqual(
    getGroup(result, "海外游戏").proxies,
    [
      "DIRECT",
      "香港自动",
      "澳门自动",
      "新加坡自动",
      "日本自动",
      "韩国自动",
      "台湾自动",
      "美国自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "智能选择",
      "默认代理"
    ],
    "Overseas game should default to DIRECT to avoid fighting game accelerators"
  );

  assert.deepEqual(
    getGroup(result, "开发").proxies,
    [
      "默认代理",
      "智能选择",
      "新加坡自动",
      "日本自动",
      "美国自动",
      "香港自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Dev should keep a focused AIGC-like manual option list"
  );

  assert.deepEqual(
    getGroup(result, "TikTok").proxies,
    [
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "TikTok should prioritize stable overseas regions while keeping manual options"
  );

  assert.deepEqual(
    getGroup(result, "YouTube").proxies,
    [
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "YouTube should prioritize content-heavy overseas regions while keeping manual options"
  );

  assert.deepEqual(
    getGroup(result, "Pixiv").proxies,
    [
      "默认代理",
      "智能选择",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "美国自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "Pixiv should bias Japan first while keeping manual options"
  );

  assert.deepEqual(
    getGroup(result, "X").proxies,
    [
      "默认代理",
      "智能选择",
      "美国自动",
      "日本自动",
      "新加坡自动",
      "香港自动",
      "澳门自动",
      "韩国自动",
      "台湾自动",
      "欧洲自动",
      "亚洲其他自动",
      "北美自动",
      "南美自动",
      "非洲自动",
      "大洋洲自动",
      "其他自动",
      "DIRECT"
    ],
    "X should keep a general overseas priority order with manual options"
  );
}

{
  const result = main(makeConfig(["US-01"]));
  const providers = result["rule-providers"];
  const rules = result.rules;

  assert.deepEqual(
    rules.slice(0, LOCAL_DIRECT_RULES.length),
    LOCAL_DIRECT_RULES,
    "localhost, loopback, and private networks should always be direct before every service rule"
  );
  assert.ok(
    rules.indexOf("IP-CIDR,192.168.0.0/16,DIRECT,no-resolve") <
      rules.indexOf("RULE-SET,adblock,广告拦截"),
    "LAN direct rules should be evaluated before adblock and proxy rules"
  );
  assert.ok(
    !rules.includes("PROCESS-NAME,com.termux,DIRECT"),
    "Termux internet traffic should not be globally forced direct"
  );
  assert.ok(
    !rules.includes("IP-CIDR,0.0.0.0/8,DIRECT,no-resolve"),
    "invalid and adblock sinkhole addresses should not be broadly forced direct"
  );

  assert.equal(
    getGroup(result, "JetBrains 下载"),
    undefined,
    "JetBrains routing should reuse Dev instead of adding a dedicated group"
  );

  assert.ok(providers.adblock, "should keep adblock provider");
  assert.ok(providers.ai, "should keep ai provider");
  assert.ok(providers.google, "should keep google provider");
  assert.ok(providers.microsoft, "should keep microsoft provider");
  assert.ok(providers.github, "should keep github provider");
  assert.ok(providers.apple, "should keep apple provider");
  assert.ok(providers.telegram, "should keep telegram provider");
  assert.ok(providers.games, "should keep games provider");
  assert.ok(providers["games-cn"], "should keep games-cn provider");
  assert.ok(providers.cn, "should keep cn provider");
  assert.ok(providers.tiktok, "should keep tiktok provider");
  assert.ok(providers.youtube, "should keep youtube provider");
  assert.ok(providers.pixiv, "should keep pixiv provider");
  assert.ok(providers.x, "should keep x provider");
  assert.equal(providers.adblock_plus, undefined, "should remove duplicate adblock_plus provider");

  assert.equal(
    rules[LOCAL_DIRECT_RULES.length],
    "DOMAIN-SUFFIX,bilibili.com,国内直连",
    "explicit domestic rules should follow the local direct rules"
  );
  assert.ok(
    rules.indexOf("RULE-SET,games-cn,国内直连") >
      rules.indexOf("DOMAIN-SUFFIX,huawei.com,国内直连"),
    "domestic game rules should stay with explicit domestic direct rules"
  );
  assert.ok(
    rules.indexOf("RULE-SET,games-cn,国内直连") < rules.indexOf("RULE-SET,adblock,广告拦截") &&
      rules.indexOf("RULE-SET,adblock,广告拦截") < rules.indexOf("DOMAIN-SUFFIX,gemini.google.com,Gemini"),
    "adblock should stay after explicit direct exceptions and before ordinary service rules"
  );

  assert.equal(
    getGroup(result, "Claude").icon,
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/robot.svg",
    "Claude should use a distinct verified icon"
  );

  assert.equal(
    getGroup(result, "Gemini").icon,
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/gem.svg",
    "Gemini should use a distinct verified icon"
  );

  assert.equal(
    getGroup(result, "Copilot").icon,
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/compass-drafting.svg",
    "Copilot should use a distinct verified icon"
  );

  assert.equal(
    getGroup(result, "漏网之鱼").icon,
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/fish.svg",
    "漏网之鱼 should use a verified fish icon"
  );

  assert.equal(
    getGroup(result, "欧洲自动").icon,
    "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png",
    "Europe should use a working fallback icon"
  );

  assert.equal(
    getGroup(result, "亚洲其他自动").icon,
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-asia.svg",
    "Asia-other should use a distinct verified icon"
  );

  assert.equal(
    getGroup(result, "其他自动").icon,
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/shuffle.svg",
    "Other-auto should use a distinct verified icon"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,ab.chatgpt.com,OpenAI"),
    "OpenAI should explicitly cover ab.chatgpt.com for Android startup"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,ws.chatgpt.com,OpenAI"),
    "OpenAI should explicitly cover ws.chatgpt.com for Android startup"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,android.chat.openai.com,OpenAI"),
    "OpenAI should explicitly cover android.chat.openai.com for Android startup"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,api.revenuecat.com,OpenAI"),
    "OpenAI should explicitly cover api.revenuecat.com for Android startup"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,prodregistryv2.org,OpenAI"),
    "OpenAI should explicitly cover prodregistryv2.org for Android startup"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,datadog.pool.ntp.org,OpenAI"),
    "OpenAI should explicitly cover datadog.pool.ntp.org for Android startup"
  );

  assert.ok(
    rules.includes("PROCESS-NAME,com.openai.chatgpt,OpenAI"),
    "OpenAI should explicitly cover the ChatGPT Android package"
  );

  assert.ok(
    rules.indexOf("PROCESS-NAME,com.openai.chatgpt,OpenAI") < rules.indexOf("RULE-SET,ai,AIGC"),
    "ChatGPT Android process rule should stay ahead of generic AI rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,opencode.ai,OpenCode"),
    "OpenCode should explicitly cover opencode.ai"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,models.dev,OpenCode"),
    "OpenCode should explicitly cover models.dev"
  );

  assert.ok(
    rules.includes("DOMAIN,frontier.snssdk.com,国内直连"),
    "Douyin frontier should explicitly stay direct"
  );

  assert.ok(
    rules.indexOf("DOMAIN,frontier.snssdk.com,国内直连") <
      rules.indexOf("RULE-SET,adblock,广告拦截") &&
      rules.indexOf("DOMAIN,frontier.snssdk.com,国内直连") <
        rules.indexOf("RULE-SET,tiktok,TikTok"),
    "Douyin frontier should stay ahead of adblock and generic TikTok rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,tiktokv.com,TikTok"),
    "TikTok should explicitly cover tiktokv.com"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,youtube.com,YouTube"),
    "YouTube should explicitly cover youtube.com"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,pixiv.net,Pixiv"),
    "Pixiv should explicitly cover pixiv.net"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,x.com,X"),
    "X should explicitly cover x.com"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,apple.com,Apple"),
    "Apple should explicitly cover apple.com"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,icloud.com,Apple"),
    "Apple should explicitly cover icloud.com"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,googleapis.com,Google"),
    "Google APIs should explicitly route through Google before CDN rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,generativelanguage.googleapis.com,Gemini") &&
      rules.indexOf("DOMAIN-SUFFIX,generativelanguage.googleapis.com,Gemini") <
        rules.indexOf("DOMAIN-SUFFIX,googleapis.com,Google"),
    "Gemini API should stay ahead of generic Google API rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,gemini.google.com,Gemini") &&
      rules.indexOf("DOMAIN-SUFFIX,gemini.google.com,Gemini") <
        rules.indexOf("DOMAIN-SUFFIX,google.com,Google"),
    "Gemini web should stay ahead of generic Google rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,google.com,Google"),
    "Chrome Google service domains should explicitly route through Google before CDN rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,gstatic.com,Google") &&
      !rules.includes("DOMAIN-SUFFIX,gstatic.com,开发"),
    "Google static assets should route through Google instead of Dev"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,jsdelivr.net,开发") &&
      !rules.includes("DOMAIN-SUFFIX,jsdelivr.net,国内直连"),
    "common CDN domains should move to Dev"
  );

  for (const domain of [
    "download.jetbrains.com",
    "download-cdn.jetbrains.com",
    "download-cdn.clf.jetbrains.com.cn"
  ]) {
    const jetbrainsRule = `DOMAIN-SUFFIX,${domain},开发`;
    assert.ok(rules.includes(jetbrainsRule), `${domain} should reuse Dev's proxy-first routing`);
    assert.ok(
      rules.indexOf(jetbrainsRule) < rules.indexOf("RULE-SET,cdn,国内直连"),
      `${domain} should be handled before the generic CDN direct rules`
    );
  }

  assert.ok(
    rules.includes("RULE-SET,cdn,国内直连"),
    "generic CDN ruleset should stay direct for domestic CDN coverage"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,minecraft.net,开发"),
    "Dev should cover Minecraft services"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,libraries.minecraft.net,开发"),
    "Dev should cover Minecraft libraries"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,modrinth.com,开发"),
    "Dev should cover Modrinth"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,maven.fabricmc.net,开发"),
    "Dev should cover Fabric Maven"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,repo.maven.apache.org,开发"),
    "Dev should cover Maven Central"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,plugins.gradle.org,开发"),
    "Dev should cover Gradle plugins"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,minecraft.net,开发") < rules.indexOf("RULE-SET,games,海外游戏"),
    "explicit Dev rules should stay ahead of generic game rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,steampowered.com,海外游戏平台"),
    "Steam should route through Game Platform"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,epicgames.com,海外游戏平台"),
    "Epic Games should route through Game Platform"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,battle.net,海外游戏平台"),
    "Battle.net should route through Game Platform"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,xboxlive.com,海外游戏平台"),
    "Xbox Live should route through Game Platform"
  );

  assert.ok(
    rules.indexOf("RULE-SET,games-cn,国内直连") <
      rules.indexOf("DOMAIN-SUFFIX,steampowered.com,海外游戏平台"),
    "domestic game rules should stay direct before overseas platform rules"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,steampowered.com,海外游戏平台") <
      rules.indexOf("RULE-SET,games,海外游戏"),
    "game platform rules should stay ahead of generic overseas game rules"
  );

  assert.ok(
    !rules.includes("RULE-SET,games,游戏服务"),
    "generic overseas game rules should not target the legacy aggregate group"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,googleapis.com,Google") <
      rules.indexOf("RULE-SET,cdn,国内直连"),
    "explicit Google API rules should stay ahead of generic CDN direct rules"
  );

  assert.ok(
    rules.indexOf("RULE-SET,cn,国内直连") > rules.indexOf("RULE-SET,games,海外游戏"),
    "generic CN direct rules should stay behind specific service rules"
  );

  for (const specificRule of [
    "RULE-SET,adblock,广告拦截",
    "RULE-SET,ai,AIGC",
    "RULE-SET,google,Google",
    "RULE-SET,github,GitHub",
    "RULE-SET,apple,Apple",
    "RULE-SET,tiktok,TikTok",
    "RULE-SET,youtube,YouTube",
    "RULE-SET,pixiv,Pixiv",
    "RULE-SET,x,X",
    "RULE-SET,telegram,Telegram",
    "RULE-SET,microsoft,微软服务",
    "RULE-SET,games,海外游戏"
  ]) {
    assert.ok(
      rules.indexOf(specificRule) < rules.indexOf("RULE-SET,cdn,国内直连"),
      `${specificRule} should stay ahead of generic CDN direct rules`
    );
  }

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,tiktokv.com,TikTok") < rules.indexOf("RULE-SET,tiktok,TikTok"),
    "explicit TikTok domains should stay ahead of TikTok ruleset"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,youtube.com,YouTube") < rules.indexOf("RULE-SET,youtube,YouTube"),
    "explicit YouTube domains should stay ahead of YouTube ruleset"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,pixiv.net,Pixiv") < rules.indexOf("RULE-SET,pixiv,Pixiv"),
    "explicit Pixiv domains should stay ahead of Pixiv ruleset"
  );

  assert.ok(
    rules.indexOf("DOMAIN-SUFFIX,x.com,X") < rules.indexOf("RULE-SET,x,X"),
    "explicit X domains should stay ahead of X ruleset"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,claude.ai,Claude") &&
      rules.indexOf("DOMAIN-SUFFIX,claude.ai,Claude") < rules.indexOf("RULE-SET,ai,AIGC"),
    "explicit Claude domains should stay ahead of generic AI rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,opencode.ai,OpenCode") &&
      rules.indexOf("DOMAIN-SUFFIX,opencode.ai,OpenCode") < rules.indexOf("RULE-SET,ai,AIGC"),
    "explicit OpenCode domains should stay ahead of generic AI rules"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,github.com,GitHub") &&
      rules.indexOf("DOMAIN-SUFFIX,github.com,GitHub") < rules.indexOf("RULE-SET,github,GitHub"),
    "explicit GitHub domains should stay ahead of GitHub ruleset"
  );

  assert.ok(
    rules.includes("DOMAIN-SUFFIX,apple.com,Apple") &&
      rules.indexOf("DOMAIN-SUFFIX,apple.com,Apple") < rules.indexOf("RULE-SET,apple,Apple"),
    "explicit Apple domains should stay ahead of Apple ruleset"
  );

  assert.equal(rules[rules.length - 1], "MATCH,漏网之鱼", "last rule should stay as 漏网之鱼");
}

console.log("PASS smart.js regression checks");
