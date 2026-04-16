function main(config) {
  const proxies = config.proxies || [];

  const pick = (re) =>
    proxies.map(p => p.name).filter(n => re.test(n));

  const uniq = (arr) => [...new Set(arr)].filter(Boolean);

  const HK = pick(/HK|香港|Hong/i);
  const SG = pick(/SG|新加坡|Singapore/i);
  const JP = pick(/JP|日本|Japan/i);
  const KR = pick(/KR|韩国|Korea|首尔|Seoul/i);
  const US = pick(/US|美国|USA/i);
  const TW = pick(/TW|台湾|Taiwan/i);
  const UK = pick(/UK|英国|London|GB/i);
  const DE = pick(/DE|德国|Germany/i);

  const ALL = uniq([...HK, ...SG, ...JP, ...KR, ...US, ...TW, ...UK, ...DE]);

  const icon = (n) =>
    `https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/${n}.png`;

  const ICON = {
    proxy: icon("Proxy"),
    global: icon("Global"),
    china: icon("China"),
    final: icon("Final"),
    ai: icon("AI"),
    openai: icon("ChatGPT"),
    google: icon("Google"),
    microsoft: icon("Microsoft"),
    github: icon("GitHub"),
    telegram: icon("Telegram"),
    game: icon("Game"),
    auto: icon("Auto"),
    hk: icon("Hong_Kong"),
    sg: icon("Singapore"),
    jp: icon("Japan"),
    kr: icon("Korea"),
    us: icon("United_States"),
    tw: icon("Taiwan"),
    uk: icon("United_Kingdom"),
    de: icon("Germany")
  };

  config["proxy-groups"] = [

    // ===== 核心 =====
    { name: "默认代理", type: "select", icon: ICON.proxy,
      proxies: ["智能选择","漏网之鱼","香港自动","新加坡自动","日本自动","韩国自动","美国自动","台湾自动","英国自动","德国自动","DIRECT"] },

    { name: "全局代理", type: "select", icon: ICON.global,
      proxies: ["智能选择","漏网之鱼","香港自动","新加坡自动","日本自动","韩国自动","美国自动","台湾自动","英国自动","德国自动","DIRECT"] },

    { name: "国内直连", type: "select", icon: ICON.china,
      proxies: ["DIRECT","智能选择","默认代理"] },

    { name: "漏网之鱼", type: "select", icon: ICON.final,
      proxies: ["智能选择","香港自动","新加坡自动","日本自动","韩国自动","美国自动","DIRECT"] },

    // ===== AI =====
    { name: "AIGC", type: "select", icon: ICON.ai,
      proxies: ["新加坡自动","日本自动","美国自动","DIRECT"] },

    { name: "OpenAI", type: "select", icon: ICON.openai,
      proxies: ["AIGC","新加坡自动","日本自动","美国自动","DIRECT"] },

    { name: "Claude", type: "select", icon: ICON.ai,
      proxies: ["AIGC","新加坡自动","日本自动","美国自动","DIRECT"] },

    { name: "Gemini", type: "select", icon: ICON.google,
      proxies: ["AIGC","新加坡自动","日本自动","美国自动","DIRECT"] },

    { name: "Copilot", type: "select", icon: ICON.microsoft,
      proxies: ["AIGC","DIRECT","新加坡自动","日本自动","智能选择"] },

    // ===== 常用 =====
    { name: "Google", type: "select", icon: ICON.google,
      proxies: ["新加坡自动","日本自动","香港自动","美国自动","DIRECT"] },

    { name: "微软服务", type: "select", icon: ICON.microsoft,
      proxies: ["DIRECT","智能选择","新加坡自动","日本自动"] },

    { name: "GitHub", type: "select", icon: ICON.github,
      proxies: ["智能选择","美国自动","日本自动","新加坡自动","DIRECT"] },

    { name: "Telegram", type: "select", icon: ICON.telegram,
      proxies: ["智能选择","新加坡自动","香港自动","日本自动","韩国自动"] },

    { name: "游戏服务", type: "select", icon: ICON.game,
      proxies: ["DIRECT","智能选择","香港自动","新加坡自动"] },

    // ===== Smart =====
    { name: "智能选择", type: "url-test", icon: ICON.auto,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: ALL },

    { name: "香港自动", type: "url-test", icon: ICON.hk,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: HK },

    { name: "新加坡自动", type: "url-test", icon: ICON.sg,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: SG },

    { name: "日本自动", type: "url-test", icon: ICON.jp,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: JP },

    { name: "韩国自动", type: "url-test", icon: ICON.kr,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: KR },

    { name: "美国自动", type: "url-test", icon: ICON.us,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: US },

    { name: "台湾自动", type: "url-test", icon: ICON.tw,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: TW },

    { name: "英国自动", type: "url-test", icon: ICON.uk,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: UK },

    { name: "德国自动", type: "url-test", icon: ICON.de,
      url: "http://www.gstatic.com/generate_204", interval: 300, proxies: DE }
  ];

  // ===== 规则 =====
  config["rule-providers"] = {
    ai: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/ai.list", interval: 86400 },

    google: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/google.list", interval: 86400 },

    microsoft: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/microsoft.list", interval: 86400 },

    "microsoft-cn": { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/microsoft-cn.list", interval: 86400 },

    games: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/games.list", interval: 86400 },

    "games-cn": { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/games-cn.list", interval: 86400 },

    github: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.list", interval: 86400 },

    cn: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/cn.list", interval: 86400 },

    proxy: { type: "http", behavior: "domain", format: "text",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/proxy.list", interval: 86400 }
  };

  config.rules = [

    // ===== 核心AI =====
    "DOMAIN-SUFFIX,openai.com,OpenAI",
    "DOMAIN-SUFFIX,chatgpt.com,OpenAI",
    "DOMAIN-SUFFIX,oaistatic.com,OpenAI",

    "DOMAIN-SUFFIX,anthropic.com,Claude",
    "DOMAIN-SUFFIX,claude.ai,Claude",

    "DOMAIN-SUFFIX,gemini.google.com,Gemini",
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com,Gemini",

    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,bing.com,Copilot",

    // ===== 规则集 =====
    "RULE-SET,ai,AIGC",
    "RULE-SET,google,Google",
    "RULE-SET,github,GitHub",

    "RULE-SET,microsoft-cn,国内直连",
    "RULE-SET,microsoft,微软服务",

    "RULE-SET,games-cn,国内直连",
    "RULE-SET,games,游戏服务",

    "RULE-SET,cn,国内直连",
    "GEOIP,CN,国内直连",

    "RULE-SET,proxy,漏网之鱼",
    "MATCH,漏网之鱼"
  ];

  return config;
}
