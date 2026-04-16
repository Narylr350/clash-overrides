function main(config) {
  const proxies = config.proxies || [];

  // ===== 按地区筛节点 =====
  const filter = (regex) =>
    proxies
      .map(p => p.name)
      .filter(name => regex.test(name));

  const HK = filter(/HK|香港|Hong/i);
  const SG = filter(/SG|新加坡|Singapore/i);
  const JP = filter(/JP|日本|Japan/i);
  const KR = filter(/KR|韩国|Korea|首尔|Seoul/i);
  const US = filter(/US|美国|USA|United States/i);

  // ===== 构建代理组 =====
  config["proxy-groups"] = [

    // 🌍 默认出口
    {
      name: "PROXY",
      type: "select",
      proxies: ["AUTO", "HK AUTO", "SG AUTO", "JP AUTO", "KR AUTO", "US AUTO", "DIRECT"]
    },

    {
      name: "GLOBAL",
      type: "select",
      proxies: ["AUTO", "HK AUTO", "SG AUTO", "JP AUTO", "KR AUTO", "US AUTO", "DIRECT"]
    },

    // 🤖 AI
    {
      name: "AIGC",
      type: "select",
      proxies: ["SG AUTO", "JP AUTO", "US AUTO", "DIRECT"]
    },

    // 🌐 Google
    {
      name: "Google",
      type: "select",
      proxies: ["SG AUTO", "JP AUTO", "HK AUTO", "US AUTO", "DIRECT"]
    },

    // 📢 Telegram
    {
      name: "Telegram",
      type: "select",
      proxies: ["AUTO", "SG AUTO", "HK AUTO", "JP AUTO", "KR AUTO"]
    },

    // 🪟 Microsoft
    {
      name: "Microsoft",
      type: "select",
      proxies: ["DIRECT", "SG AUTO", "JP AUTO", "AUTO"]
    },

    // 🎮 游戏
    {
      name: "Game",
      type: "select",
      proxies: ["DIRECT", "AUTO", "HK AUTO", "SG AUTO"]
    },

    // ===== Smart 地区候选池 =====

    {
      name: "AUTO",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: [...HK, ...SG, ...JP, ...KR, ...US]
    },

    {
      name: "HK AUTO",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: HK
    },

    {
      name: "SG AUTO",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: SG
    },

    {
      name: "JP AUTO",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: JP
    },

    {
      name: "KR AUTO",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: KR
    },

    {
      name: "US AUTO",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: US
    }
  ];

  // ===== 规则（精简但够用）=====
  config.rules = [

    // 🤖 AI
    "DOMAIN-SUFFIX,openai.com,AIGC",
    "DOMAIN-SUFFIX,chatgpt.com,AIGC",
    "DOMAIN-SUFFIX,anthropic.com,AIGC",
    "DOMAIN-SUFFIX,claude.ai,AIGC",
    "DOMAIN-SUFFIX,perplexity.ai,AIGC",
    "DOMAIN-SUFFIX,poe.com,AIGC",
    "DOMAIN-SUFFIX,groq.com,AIGC",
    "DOMAIN-SUFFIX,replicate.com,AIGC",
    "DOMAIN-SUFFIX,huggingface.co,AIGC",
    "DOMAIN-SUFFIX,stability.ai,AIGC",

    // 🌐 Google
    "DOMAIN-SUFFIX,google.com,Google",
    "DOMAIN-SUFFIX,googleapis.com,Google",
    "DOMAIN-SUFFIX,gstatic.com,Google",

    // 📢 Telegram
    "DOMAIN-SUFFIX,telegram.org,Telegram",

    // 🪟 Microsoft
    "DOMAIN-SUFFIX,microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,live.com,Microsoft",
    "DOMAIN-SUFFIX,xbox.com,Microsoft",

    // 🎮 游戏（Steam）
    "DOMAIN-SUFFIX,steampowered.com,Game",

    // 🇨🇳 国内直连
    "GEOIP,CN,DIRECT",

    // 🌍 兜底
    "MATCH,PROXY"
  ];

  return config;
}
