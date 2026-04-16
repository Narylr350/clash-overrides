const TEST_URL = "https://www.gstatic.com/generate_204";
const TEST_INTERVAL = 300;

const icon = (name) =>
  `https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/${name}.png`;

const ICON = {
  proxy: icon("Proxy"),
  china: icon("China"),
  final: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/fish.svg",
  adblock: icon("Advertising"),
  ai: icon("AI"),
  openai: icon("ChatGPT"),
  claude: icon("AI"),
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
  eu: icon("Global"),
  asiaOther: icon("Auto"),
  other: icon("Proxy")
};

const REGION_DEFS = [
  {
    key: "hk",
    group: "香港自动",
    icon: ICON.hk,
    patterns: [/\bHK\b/i, /香港/i, /Hong(?:\s*Kong)?/i]
  },
  {
    key: "sg",
    group: "新加坡自动",
    icon: ICON.sg,
    patterns: [/\bSG\b/i, /新加坡/i, /Singapore/i]
  },
  {
    key: "jp",
    group: "日本自动",
    icon: ICON.jp,
    patterns: [/\bJP\b/i, /日本/i, /Japan/i]
  },
  {
    key: "kr",
    group: "韩国自动",
    icon: ICON.kr,
    patterns: [/\bKR\b/i, /韩国/i, /Korea/i, /首尔/i, /Seoul/i]
  },
  {
    key: "us",
    group: "美国自动",
    icon: ICON.us,
    patterns: [/\bUS\b/i, /美国/i, /USA/i, /United States/i]
  },
  {
    key: "tw",
    group: "台湾自动",
    icon: ICON.tw,
    patterns: [/\bTW\b/i, /台湾/i, /Taiwan/i]
  },
  {
    key: "eu",
    group: "欧洲自动",
    icon: ICON.eu,
    patterns: [
      /\b(?:UK|GB|DE|FR|NL|EU)\b/i,
      /英国/i,
      /London/i,
      /德国/i,
      /Germany/i,
      /France/i,
      /Netherlands/i,
      /Europe/i
    ]
  },
  {
    key: "asiaOther",
    group: "亚洲其他自动",
    icon: ICON.asiaOther,
    patterns: [
      /\b(?:MY|TH|VN|ID|PH|IN)\b/i,
      /Malaysia/i,
      /马来/i,
      /Thailand/i,
      /泰国/i,
      /Vietnam/i,
      /越南/i,
      /Indonesia/i,
      /印尼/i,
      /Philippines/i,
      /菲律宾/i,
      /India/i,
      /印度/i
    ]
  },
  {
    key: "other",
    group: "其他自动",
    icon: ICON.other,
    patterns: []
  }
];

function uniq(arr) {
  return [...new Set(arr)].filter(Boolean);
}

function matchesAny(name, patterns) {
  return patterns.some((pattern) => pattern.test(name));
}

function collectNodeBuckets(proxies) {
  const all = uniq(proxies.map((proxy) => proxy.name).filter(Boolean));
  const buckets = {};
  const classified = new Set();
  const classifiedDefs = REGION_DEFS.filter((def) => def.patterns.length);

  for (const def of REGION_DEFS) {
    buckets[def.key] = [];
  }

  for (const name of all) {
    for (const def of classifiedDefs) {
      if (matchesAny(name, def.patterns)) {
        buckets[def.key].push(name);
        classified.add(name);
        break;
      }
    }
  }

  buckets.other = all.filter((name) => !classified.has(name));

  return {
    all,
    unclassified: buckets.other,
    ...buckets
  };
}

function withFallback(nodes) {
  return nodes.length ? nodes : ["DIRECT"];
}

function buildUrlTestGroup(name, iconUrl, nodes) {
  return {
    name,
    type: "url-test",
    icon: iconUrl,
    url: TEST_URL,
    interval: TEST_INTERVAL,
    proxies: withFallback(nodes)
  };
}

function buildSelectGroup(name, iconUrl, proxies) {
  return {
    name,
    type: "select",
    icon: iconUrl,
    proxies
  };
}

const DEFAULT_REGION_OPTIONS = [
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
];

function main(config) {
  config = config || {};
  const proxies = Array.isArray(config.proxies) ? config.proxies : [];
  const nodes = collectNodeBuckets(proxies);
  const regionGroups = REGION_DEFS.map((def) =>
    buildUrlTestGroup(def.group, def.icon, nodes[def.key] || [])
  );

  const AI_REGION_ORDER = [
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
    "其他自动",
    "DIRECT"
  ];

  const OPENAI_REGION_ORDER = [
    "AIGC",
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
    "其他自动",
    "DIRECT"
  ];

  const COPILOT_REGION_ORDER = [
    "AIGC",
    "默认代理",
    "DIRECT",
    "智能选择",
    "美国自动",
    "日本自动",
    "新加坡自动",
    "香港自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    "其他自动"
  ];

  const GITHUB_REGION_ORDER = [
    "默认代理",
    "智能选择",
    "美国自动",
    "日本自动",
    "新加坡自动",
    "香港自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    "其他自动",
    "DIRECT"
  ];

  const GOOGLE_REGION_ORDER = [
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
    "其他自动",
    "DIRECT"
  ];

  const TELEGRAM_REGION_ORDER = [
    "默认代理",
    "智能选择",
    "新加坡自动",
    "香港自动",
    "日本自动",
    "韩国自动",
    "台湾自动",
    "美国自动",
    "欧洲自动",
    "亚洲其他自动",
    "其他自动",
    "DIRECT"
  ];

  const MICROSOFT_REGION_ORDER = [
    "DIRECT",
    "默认代理",
    "智能选择",
    "美国自动",
    "日本自动",
    "新加坡自动",
    "香港自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    "其他自动"
  ];

  const GAME_REGION_ORDER = [
    "DIRECT",
    "默认代理",
    "智能选择",
    "香港自动",
    "新加坡自动",
    "日本自动",
    "韩国自动",
    "台湾自动",
    "美国自动",
    "欧洲自动",
    "亚洲其他自动",
    "其他自动"
  ];

  config["proxy-groups"] = [
    buildSelectGroup("默认代理", ICON.proxy, DEFAULT_REGION_OPTIONS),
    buildSelectGroup("国内直连", ICON.china, ["DIRECT", "默认代理"]),
    buildSelectGroup("漏网之鱼", ICON.final, ["默认代理", ...DEFAULT_REGION_OPTIONS]),
    buildSelectGroup("广告拦截", ICON.adblock, ["REJECT", "DIRECT", "默认代理"]),
    buildSelectGroup("AIGC", ICON.ai, AI_REGION_ORDER),
    buildSelectGroup("OpenAI", ICON.openai, OPENAI_REGION_ORDER),
    buildSelectGroup("Claude", ICON.claude, OPENAI_REGION_ORDER),
    buildSelectGroup("Gemini", ICON.google, OPENAI_REGION_ORDER),
    buildSelectGroup("Copilot", ICON.microsoft, COPILOT_REGION_ORDER),
    buildSelectGroup("GitHub", ICON.github, GITHUB_REGION_ORDER),
    buildSelectGroup("Google", ICON.google, GOOGLE_REGION_ORDER),
    buildSelectGroup("微软服务", ICON.microsoft, MICROSOFT_REGION_ORDER),
    buildSelectGroup("Telegram", ICON.telegram, TELEGRAM_REGION_ORDER),
    buildSelectGroup("游戏服务", ICON.game, GAME_REGION_ORDER),
    buildUrlTestGroup("智能选择", ICON.auto, nodes.all),
    ...regionGroups
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
    "DOMAIN-SUFFIX,bilibili.com,国内直连",
    "DOMAIN-SUFFIX,baidu.com,国内直连",
    "DOMAIN-SUFFIX,qq.com,国内直连",
    "DOMAIN-SUFFIX,mi.com,国内直连",
    "DOMAIN-SUFFIX,huawei.com,国内直连",

    "RULE-SET,adblock,广告拦截",

    "DOMAIN-SUFFIX,github.com,GitHub",
    "DOMAIN-SUFFIX,githubusercontent.com,GitHub",
    "DOMAIN-SUFFIX,raw.githubusercontent.com,GitHub",
    "DOMAIN-SUFFIX,githubassets.com,GitHub",
    "DOMAIN-SUFFIX,github.io,GitHub",

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

if (typeof module !== "undefined") {
  module.exports = { main };
}
