function main(config) {
  const proxies = config.proxies || [];

  const pick = (re) => proxies.map(p => p.name).filter(n => re.test(n));
  const uniq = (arr) => [...new Set(arr)].filter(Boolean);

  const HK = pick(/HK|香港|Hong/i);
  const SG = pick(/SG|新加坡|Singapore/i);
  const JP = pick(/JP|日本|Japan/i);
  const KR = pick(/KR|韩国|Korea|首尔|Seoul/i);
  const US = pick(/US|美国|USA|United States/i);
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
    {
      name: "默认代理",
      type: "select",
      icon: ICON.proxy,
      proxies: [
        "智能选择",
        "漏网之鱼",
        "香港自动",
        "新加坡自动",
        "日本自动",
        "韩国自动",
        "美国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "DIRECT"
      ]
    },
    {
      name: "全局代理",
      type: "select",
      icon: ICON.global,
      proxies: [
        "智能选择",
        "漏网之鱼",
        "香港自动",
        "新加坡自动",
        "日本自动",
        "韩国自动",
        "美国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "DIRECT"
      ]
    },
    {
      name: "国内直连",
      type: "select",
      icon: ICON.china,
      proxies: ["DIRECT", "智能选择", "默认代理"]
    },
    {
      name: "漏网之鱼",
      type: "select",
      icon: ICON.final,
      proxies: [
        "智能选择",
        "香港自动",
        "新加坡自动",
        "日本自动",
        "韩国自动",
        "美国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "DIRECT"
      ]
    },

    {
      name: "AIGC",
      type: "select",
      icon: ICON.ai,
      proxies: [
        "新加坡自动",
        "日本自动",
        "美国自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "智能选择",
        "DIRECT"
      ]
    },
    {
      name: "OpenAI",
      type: "select",
      icon: ICON.openai,
      proxies: [
        "AIGC",
        "新加坡自动",
        "日本自动",
        "美国自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "智能选择",
        "DIRECT"
      ]
    },
    {
      name: "Claude",
      type: "select",
      icon: ICON.ai,
      proxies: [
        "AIGC",
        "新加坡自动",
        "日本自动",
        "美国自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "智能选择",
        "DIRECT"
      ]
    },
    {
      name: "Gemini",
      type: "select",
      icon: ICON.google,
      proxies: [
        "AIGC",
        "新加坡自动",
        "日本自动",
        "美国自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "智能选择",
        "DIRECT"
      ]
    },
    {
      name: "Copilot",
      type: "select",
      icon: ICON.microsoft,
      proxies: [
        "AIGC",
        "DIRECT",
        "新加坡自动",
        "日本自动",
        "美国自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "智能选择"
      ]
    },

    {
      name: "Google",
      type: "select",
      icon: ICON.google,
      proxies: [
        "新加坡自动",
        "日本自动",
        "香港自动",
        "美国自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "智能选择",
        "DIRECT"
      ]
    },
    {
      name: "微软服务",
      type: "select",
      icon: ICON.microsoft,
      proxies: [
        "DIRECT",
        "智能选择",
        "新加坡自动",
        "日本自动",
        "美国自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动"
      ]
    },
    {
      name: "GitHub",
      type: "select",
      icon: ICON.github,
      proxies: [
        "智能选择",
        "美国自动",
        "日本自动",
        "新加坡自动",
        "香港自动",
        "韩国自动",
        "台湾自动",
        "英国自动",
        "德国自动",
        "DIRECT"
      ]
    },
    {
      name: "Telegram",
      type: "select",
      icon: ICON.telegram,
      proxies: [
        "智能选择",
        "新加坡自动",
        "香港自动",
        "日本自动",
        "韩国自动",
        "台湾自动",
        "美国自动",
        "英国自动",
        "德国自动",
        "DIRECT"
      ]
    },
    {
      name: "游戏服务",
      type: "select",
      icon: ICON.game,
      proxies: [
        "DIRECT",
        "智能选择",
        "香港自动",
        "新加坡自动",
        "日本自动",
        "韩国自动",
        "台湾自动",
        "美国自动"
      ]
    },

    {
      name: "智能选择",
      type: "url-test",
      icon: ICON.auto,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: ALL.length ? ALL : ["DIRECT"]
    },
    {
      name: "香港自动",
      type: "url-test",
      icon: ICON.hk,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: HK.length ? HK : ["DIRECT"]
    },
    {
      name: "新加坡自动",
      type: "url-test",
      icon: ICON.sg,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: SG.length ? SG : ["DIRECT"]
    },
    {
      name: "日本自动",
      type: "url-test",
      icon: ICON.jp,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: JP.length ? JP : ["DIRECT"]
    },
    {
      name: "韩国自动",
      type: "url-test",
      icon: ICON.kr,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: KR.length ? KR : ["DIRECT"]
    },
    {
      name: "美国自动",
      type: "url-test",
      icon: ICON.us,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: US.length ? US : ["DIRECT"]
    },
    {
      name: "台湾自动",
      type: "url-test",
      icon: ICON.tw,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: TW.length ? TW : ["DIRECT"]
    },
    {
      name: "英国自动",
      type: "url-test",
      icon: ICON.uk,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: UK.length ? UK : ["DIRECT"]
    },
    {
      name: "德国自动",
      type: "url-test",
      icon: ICON.de,
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: DE.length ? DE : ["DIRECT"]
    }
  ];

  config["rule-providers"] = {
    adblock: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/adblock.list",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising.list",
      interval: 86400
    },
    adblock_plus: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/adblock_plus.list",
      url: "https://raw.githubusercontent.com/zzzt27/clash-AdsBlock/main/oisd_small.txt",
      interval: 86400
    },
    ai: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/ai.list",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/domain/ai.list",
      interval: 86400
    },
    google: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/google.list",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/domain/google.list",
      interval: 86400
    },
    microsoft: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/microsoft.list",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/domain/microsoft.list",
      interval: 86400
    },
    games: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/games.list",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/domain/games.list",
      interval: 86400
    },
    "games-cn": {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/games-cn.list",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/domain/games-cn.list",
      interval: 86400
    },
    cn: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/cn.list",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/domain/cn.list",
      interval: 86400
    },
    github: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/github.list",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.list",
      interval: 86400
    },
    telegram: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/telegram.list",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.list",
      interval: 86400
    }
  };

  config.rules = [
    // ===== 白名单（防误杀）=====
    "DOMAIN-SUFFIX,bilibili.com,国内直连",
    "DOMAIN-SUFFIX,baidu.com,国内直连",
    "DOMAIN-SUFFIX,qq.com,国内直连",
    "DOMAIN-SUFFIX,mi.com,国内直连",
    "DOMAIN-SUFFIX,huawei.com,国内直连",

    // ===== 广告拦截 =====
    "RULE-SET,adblock,REJECT",
    "RULE-SET,adblock_plus,REJECT",

    // ===== GitHub 手工优先 =====
    "DOMAIN-SUFFIX,github.com,GitHub",
    "DOMAIN-SUFFIX,githubusercontent.com,GitHub",
    "DOMAIN-SUFFIX,raw.githubusercontent.com,GitHub",
    "DOMAIN-SUFFIX,githubassets.com,GitHub",
    "DOMAIN-SUFFIX,github.io,GitHub",

    // ===== 核心 AI =====
    "DOMAIN-SUFFIX,openai.com,OpenAI",
    "DOMAIN-SUFFIX,chatgpt.com,OpenAI",
    "DOMAIN-SUFFIX,oaistatic.com,OpenAI",
    "DOMAIN-SUFFIX,oaiusercontent.com,OpenAI",

    "DOMAIN-SUFFIX,anthropic.com,Claude",
    "DOMAIN-SUFFIX,claude.ai,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com,Claude",

    "DOMAIN-SUFFIX,gemini.google.com,Gemini",
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com,Gemini",
    "DOMAIN-SUFFIX,ai.google.dev,Gemini",

    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,sydney.bing.com,Copilot",

    // ===== 规则集 =====
    "RULE-SET,ai,AIGC",
    "RULE-SET,google,Google",
    "RULE-SET,github,GitHub",
    "RULE-SET,telegram,Telegram",

    "RULE-SET,microsoft,微软服务",

    "RULE-SET,games-cn,国内直连",
    "RULE-SET,games,游戏服务",

    "RULE-SET,cn,国内直连",
    "GEOIP,CN,国内直连",

    "MATCH,漏网之鱼"
  ];

  return config;
}
