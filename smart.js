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

  const icon = (name) =>
    `https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/${name}.png`;

  config["proxy-groups"] = [
    {
      name: "🚀 默认代理",
      type: "select",
      icon: icon("Proxy"),
      proxies: [
        "♻️ 智能选择",
        "🐟 漏网之鱼",
        "🇭🇰 香港自动",
        "🇸🇬 新加坡自动",
        "🇯🇵 日本自动",
        "🇰🇷 韩国自动",
        "🇺🇸 美国自动",
        "🇹🇼 台湾自动",
        "🇬🇧 英国自动",
        "🇩🇪 德国自动",
        "DIRECT"
      ]
    },

    {
      name: "🌐 全局代理",
      type: "select",
      icon: icon("Global"),
      proxies: [
        "♻️ 智能选择",
        "🐟 漏网之鱼",
        "🇭🇰 香港自动",
        "🇸🇬 新加坡自动",
        "🇯🇵 日本自动",
        "🇰🇷 韩国自动",
        "🇺🇸 美国自动",
        "🇹🇼 台湾自动",
        "🇬🇧 英国自动",
        "🇩🇪 德国自动",
        "DIRECT"
      ]
    },

    {
      name: "🏠 国内直连",
      type: "select",
      icon: icon("China"),
      proxies: ["DIRECT", "♻️ 智能选择", "🚀 默认代理"]
    },

    {
      name: "🐟 漏网之鱼",
      type: "select",
      icon: icon("Final"),
      proxies: [
        "♻️ 智能选择",
        "🇭🇰 香港自动",
        "🇸🇬 新加坡自动",
        "🇯🇵 日本自动",
        "🇰🇷 韩国自动",
        "🇺🇸 美国自动",
        "🇹🇼 台湾自动",
        "🇬🇧 英国自动",
        "🇩🇪 德国自动",
        "DIRECT"
      ]
    },

    {
      name: "🤖 AIGC",
      type: "select",
      icon: icon("AI"),
      proxies: [
        "🇸🇬 新加坡自动",
        "🇯🇵 日本自动",
        "🇺🇸 美国自动",
        "🇬🇧 英国自动",
        "DIRECT"
      ]
    },

    {
      name: "🧠 OpenAI",
      type: "select",
      icon: icon("ChatGPT"),
      proxies: ["🤖 AIGC", "🇸🇬 新加坡自动", "🇯🇵 日本自动", "🇺🇸 美国自动", "DIRECT"]
    },

    {
      name: "🪶 Claude",
      type: "select",
      icon: icon("Claude"),
      proxies: ["🤖 AIGC", "🇸🇬 新加坡自动", "🇯🇵 日本自动", "🇺🇸 美国自动", "DIRECT"]
    },

    {
      name: "💎 Gemini",
      type: "select",
      icon: icon("Google"),
      proxies: ["🤖 AIGC", "🇸🇬 新加坡自动", "🇯🇵 日本自动", "🇺🇸 美国自动", "DIRECT"]
    },

    {
      name: "🌀 Copilot",
      type: "select",
      icon: icon("Microsoft"),
      proxies: ["🤖 AIGC", "DIRECT", "🇸🇬 新加坡自动", "🇯🇵 日本自动", "♻️ 智能选择"]
    },

    {
      name: "🔎 Perplexity",
      type: "select",
      icon: icon("Search"),
      proxies: ["🤖 AIGC", "🇸🇬 新加坡自动", "🇯🇵 日本自动", "🇺🇸 美国自动", "DIRECT"]
    },

    {
      name: "📚 Poe",
      type: "select",
      icon: icon("Book"),
      proxies: ["🤖 AIGC", "🇸🇬 新加坡自动", "🇯🇵 日本自动", "🇺🇸 美国自动", "DIRECT"]
    },

    {
      name: "⚡ xAI",
      type: "select",
      icon: icon("X"),
      proxies: ["🤖 AIGC", "🇺🇸 美国自动", "🇯🇵 日本自动", "🇸🇬 新加坡自动", "DIRECT"]
    },

    {
      name: "🤗 HuggingFace",
      type: "select",
      icon: icon("Bot"),
      proxies: ["🤖 AIGC", "🇺🇸 美国自动", "🇯🇵 日本自动", "DIRECT"]
    },

    {
      name: "🎨 Stability",
      type: "select",
      icon: icon("Color"),
      proxies: ["🤖 AIGC", "🇺🇸 美国自动", "🇯🇵 日本自动", "DIRECT"]
    },

    {
      name: "🧪 Replicate",
      type: "select",
      icon: icon("Laboratory"),
      proxies: ["🤖 AIGC", "🇺🇸 美国自动", "🇯🇵 日本自动", "DIRECT"]
    },

    {
      name: "🌍 Google",
      type: "select",
      icon: icon("Google"),
      proxies: ["🇸🇬 新加坡自动", "🇯🇵 日本自动", "🇭🇰 香港自动", "🇺🇸 美国自动", "DIRECT"]
    },

    {
      name: "🪟 微软服务",
      type: "select",
      icon: icon("Microsoft"),
      proxies: ["DIRECT", "♻️ 智能选择", "🇸🇬 新加坡自动", "🇯🇵 日本自动"]
    },

    {
      name: "🐙 GitHub",
      type: "select",
      icon: icon("GitHub"),
      proxies: ["♻️ 智能选择", "🇺🇸 美国自动", "🇯🇵 日本自动", "🇸🇬 新加坡自动", "DIRECT"]
    },

    {
      name: "📢 Telegram",
      type: "select",
      icon: icon("Telegram"),
      proxies: ["♻️ 智能选择", "🇸🇬 新加坡自动", "🇭🇰 香港自动", "🇯🇵 日本自动", "🇰🇷 韩国自动"]
    },

    {
      name: "🎮 游戏服务",
      type: "select",
      icon: icon("Game"),
      proxies: ["DIRECT", "♻️ 智能选择", "🇭🇰 香港自动", "🇸🇬 新加坡自动"]
    },

    {
      name: "♻️ 智能选择",
      type: "url-test",
      icon: icon("Auto"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: ALL.length ? ALL : ["DIRECT"]
    },

    {
      name: "🇭🇰 香港自动",
      type: "url-test",
      icon: icon("Hong_Kong"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: HK.length ? HK : ["DIRECT"]
    },
    {
      name: "🇸🇬 新加坡自动",
      type: "url-test",
      icon: icon("Singapore"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: SG.length ? SG : ["DIRECT"]
    },
    {
      name: "🇯🇵 日本自动",
      type: "url-test",
      icon: icon("Japan"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: JP.length ? JP : ["DIRECT"]
    },
    {
      name: "🇰🇷 韩国自动",
      type: "url-test",
      icon: icon("Korea"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: KR.length ? KR : ["DIRECT"]
    },
    {
      name: "🇺🇸 美国自动",
      type: "url-test",
      icon: icon("United_States"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: US.length ? US : ["DIRECT"]
    },
    {
      name: "🇹🇼 台湾自动",
      type: "url-test",
      icon: icon("Taiwan"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: TW.length ? TW : ["DIRECT"]
    },
    {
      name: "🇬🇧 英国自动",
      type: "url-test",
      icon: icon("United_Kingdom"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: UK.length ? UK : ["DIRECT"]
    },
    {
      name: "🇩🇪 德国自动",
      type: "url-test",
      icon: icon("Germany"),
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: DE.length ? DE : ["DIRECT"]
    }
  ];

  config["rule-providers"] = {
    ai: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/ai.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/ai.list",
      interval: 86400
    },
    google: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/google.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/google.list",
      interval: 86400
    },
    microsoft: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/microsoft.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/microsoft.list",
      interval: 86400
    },
    "microsoft-cn": {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/microsoft-cn.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/microsoft-cn.list",
      interval: 86400
    },
    games: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/games.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/games.list",
      interval: 86400
    },
    "games-cn": {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/games-cn.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/games-cn.list",
      interval: 86400
    },
    github: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/github.txt",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.list",
      interval: 86400
    },
    telegram: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/telegram.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/telegram.list",
      interval: 86400
    },
    cn: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/cn.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/cn.list",
      interval: 86400
    },
    proxy: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/proxy.txt",
      url: "https://raw.githubusercontent.com/QuixoticHeart/rule-set/main/meta/domain/proxy.list",
      interval: 86400
    }
  };

  config.rules = [
    "DOMAIN-SUFFIX,openai.com,🧠 OpenAI",
    "DOMAIN-SUFFIX,chatgpt.com,🧠 OpenAI",
    "DOMAIN-SUFFIX,oaistatic.com,🧠 OpenAI",
    "DOMAIN-SUFFIX,oaiusercontent.com,🧠 OpenAI",

    "DOMAIN-SUFFIX,anthropic.com,🪶 Claude",
    "DOMAIN-SUFFIX,claude.ai,🪶 Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com,🪶 Claude",

    "DOMAIN-SUFFIX,gemini.google.com,💎 Gemini",
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com,💎 Gemini",
    "DOMAIN-SUFFIX,ai.google.dev,💎 Gemini",

    "DOMAIN-SUFFIX,copilot.microsoft.com,🌀 Copilot",
    "DOMAIN-SUFFIX,bing.com,🌀 Copilot",
    "DOMAIN-SUFFIX,sydney.bing.com,🌀 Copilot",

    "DOMAIN-SUFFIX,perplexity.ai,🔎 Perplexity",
    "DOMAIN-SUFFIX,poe.com,📚 Poe",
    "DOMAIN-SUFFIX,x.ai,⚡ xAI",
    "DOMAIN-SUFFIX,grok.com,⚡ xAI",
    "DOMAIN-SUFFIX,huggingface.co,🤗 HuggingFace",
    "DOMAIN-SUFFIX,stability.ai,🎨 Stability",
    "DOMAIN-SUFFIX,replicate.com,🧪 Replicate",

    "RULE-SET,ai,🤖 AIGC",
    "RULE-SET,google,🌍 Google",
    "RULE-SET,github,🐙 GitHub",
    "RULE-SET,telegram,📢 Telegram",

    "RULE-SET,microsoft-cn,🏠 国内直连",
    "RULE-SET,microsoft,🪟 微软服务",

    "RULE-SET,games-cn,🏠 国内直连",
    "RULE-SET,games,🎮 游戏服务",

    "RULE-SET,cn,🏠 国内直连",
    "GEOIP,CN,🏠 国内直连",

    "RULE-SET,proxy,🐟 漏网之鱼",
    "MATCH,🐟 漏网之鱼"
  ];

  return config;
}
