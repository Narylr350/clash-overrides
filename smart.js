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
  claude: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/robot.svg",
  google: icon("Google"),
  gemini: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/gem.svg",
  microsoft: icon("Microsoft"),
  apple: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/apple.svg",
  copilot: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/compass-drafting.svg",
  github: icon("GitHub"),
  tiktok: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/tiktok.svg",
  youtube: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/youtube.svg",
  pixiv: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/pixiv.svg",
  x: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/x-twitter.svg",
  telegram: icon("Telegram"),
  game: icon("Game"),
  dev: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/code.svg",
  auto: icon("Auto"),
  hk: icon("Hong_Kong"),
  sg: icon("Singapore"),
  jp: icon("Japan"),
  kr: icon("Korea"),
  us: icon("United_States"),
  tw: icon("Taiwan"),
  eu: icon("Global"),
  asiaOther: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-asia.svg",
  northAmerica: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-americas.svg",
  southAmerica: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-americas.svg",
  africa: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-africa.svg",
  oceania: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/earth-oceania.svg",
  other: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/shuffle.svg"
};

const SUBSCRIPTION_INFO_PATTERNS = [
  /(^|[\s._\-\[\]\(\)【】])(?:traffic|quota|expire|expires|expired|expiration|reset|subscription|sub\s*info|homepage|website|official\s*site|update\s*subscription)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
  /剩余流量|流量|套餐|到期|过期|有效期|重置|官网|网址|主页|更新订阅|刷新订阅|订阅信息|订阅链接/i
];

const REGION_DEFS = [
  {
    key: "hk",
    group: "香港自动",
    icon: ICON.hk,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:hk|hong\s*kong)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /香港/i
    ]
  },
  {
    key: "mo",
    group: "澳门自动",
    icon: ICON.hk,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:mo|macau|macao)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /澳门|澳門/i
    ]
  },
  {
    key: "sg",
    group: "新加坡自动",
    icon: ICON.sg,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:sg|singapore)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /新加坡/i
    ]
  },
  {
    key: "jp",
    group: "日本自动",
    icon: ICON.jp,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:jp|japan|tokyo|osaka)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /日本/i
    ]
  },
  {
    key: "kr",
    group: "韩国自动",
    icon: ICON.kr,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:kr|korea|south\s*korea|seoul)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /韩国|首尔/i
    ]
  },
  {
    key: "us",
    group: "美国自动",
    icon: ICON.us,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:us|usa|united\s*states|america|los\s*angeles|new\s*york)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /美国/i
    ]
  },
  {
    key: "tw",
    group: "台湾自动",
    icon: ICON.tw,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:tw|taiwan|taipei)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /台湾/i
    ]
  },
  {
    key: "eu",
    group: "欧洲自动",
    icon: ICON.eu,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:eu|europe|uk|united\s*kingdom|england|london|de|germany|deutschland|fr|france|nl|netherlands|it|italy|es|spain|ch|switzerland|se|sweden|pl|poland|ie|ireland|pt|portugal|at|austria|be|belgium|fi|finland|no|norway|dk|denmark|cz|czech|czechia|gr|greece|hu|hungary|ro|romania|ua|ukraine|ru|russia|moscow|mk|macedonia|north\s*macedonia|tr|turkey|turkiye|türkiye)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /英国|德国|法国|荷兰|意大利|西班牙|瑞士|瑞典|波兰|爱尔兰|葡萄牙|奥地利|比利时|芬兰|挪威|丹麦|捷克|希腊|匈牙利|罗马尼亚|乌克兰|俄罗斯|莫斯科|马其顿|北马其顿|土耳其|欧洲/i
    ]
  },
  {
    key: "asiaOther",
    group: "亚洲其他自动",
    icon: ICON.asiaOther,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:my|malaysia|th|thailand|vn|vietnam|id|indonesia|ph|philippines|in|india|kh|cambodia|la|laos|mm|myanmar|bd|bangladesh|pk|pakistan|np|nepal|lk|sri\s*lanka|ae|uae|united\s*arab\s*emirates|sa|saudi\s*arabia|il|israel|qa|qatar)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /马来|泰国|越南|印尼|印度尼西亚|菲律宾|印度|柬埔寨|老挝|缅甸|孟加拉|巴基斯坦|尼泊尔|斯里兰卡|阿联酋|沙特|以色列|卡塔尔|亚洲/i
    ]
  },
  {
    key: "northAmerica",
    group: "北美自动",
    icon: ICON.northAmerica,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:ca|canada|toronto|vancouver|montreal|mx|mexico|gl|greenland)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /加拿大|墨西哥|格陵兰|北美/i
    ]
  },
  {
    key: "southAmerica",
    group: "南美自动",
    icon: ICON.southAmerica,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:ar|argentina|br|brazil|cl|chile|co|colombia|pe|peru|uy|uruguay|ve|venezuela|bo|bolivia|ec|ecuador|py|paraguay|south\s*america)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /阿根廷|巴西|智利|哥伦比亚|秘鲁|乌拉圭|委内瑞拉|玻利维亚|厄瓜多尔|巴拉圭|南美/i
    ]
  },
  {
    key: "africa",
    group: "非洲自动",
    icon: ICON.africa,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:za|south\s*africa|eg|egypt|ng|nigeria|ke|kenya|ma|morocco|dz|algeria|tn|tunisia|gh|ghana|africa)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /南非|埃及|尼日利亚|肯尼亚|摩洛哥|阿尔及利亚|突尼斯|加纳|非洲/i
    ]
  },
  {
    key: "oceania",
    group: "大洋洲自动",
    icon: ICON.oceania,
    patterns: [
      /(^|[\s._\-\[\]\(\)【】])(?:au|australia|sydney|melbourne|nz|new\s*zealand|oceania)(?=$|[\s._\-\[\]\(\)【】]|\d)/i,
      /澳洲|澳大利亚|新西兰|大洋洲/i
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

function isSubscriptionInfoNode(name) {
  return matchesAny(name, SUBSCRIPTION_INFO_PATTERNS);
}

function collectNodeBuckets(proxies) {
  const all = uniq(proxies.map((proxy) => proxy.name).filter(Boolean)).filter(
    (name) => !isSubscriptionInfoNode(name)
  );
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

const LOW_FREQUENCY_REGION_OPTIONS = [
  "北美自动",
  "南美自动",
  "非洲自动",
  "大洋洲自动"
];

const DEFAULT_REGION_OPTIONS = [
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
  ...LOW_FREQUENCY_REGION_OPTIONS,
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
    "澳门自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    ...LOW_FREQUENCY_REGION_OPTIONS,
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
    "澳门自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    ...LOW_FREQUENCY_REGION_OPTIONS,
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
    "澳门自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动"
  ];

  const GITHUB_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
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
    "澳门自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动",
    "DIRECT"
  ];

  const TIKTOK_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动",
    "DIRECT"
  ];

  const YOUTUBE_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动",
    "DIRECT"
  ];

  const PIXIV_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动",
    "DIRECT"
  ];

  const X_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动",
    "DIRECT"
  ];

  const TELEGRAM_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
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
    "澳门自动",
    "韩国自动",
    "台湾自动",
    "欧洲自动",
    "亚洲其他自动",
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动"
  ];

  const APPLE_REGION_ORDER = [
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动"
  ];

  const GAME_REGION_ORDER = [
    "DIRECT",
    "默认代理",
    "智能选择",
    "香港自动",
    "澳门自动",
    "新加坡自动",
    "日本自动",
    "韩国自动",
    "台湾自动",
    "美国自动",
    "欧洲自动",
    "亚洲其他自动",
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动"
  ];

  const DEV_REGION_ORDER = [
    "默认代理",
    "GitHub",
    "微软服务",
    "Google",
    "游戏服务",
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
    ...LOW_FREQUENCY_REGION_OPTIONS,
    "其他自动",
    "DIRECT"
  ];

  config["proxy-groups"] = [
    buildSelectGroup("默认代理", ICON.proxy, DEFAULT_REGION_OPTIONS),
    buildSelectGroup("国内直连", ICON.china, ["DIRECT", "默认代理"]),
    buildSelectGroup("漏网之鱼", ICON.final, ["默认代理", ...DEFAULT_REGION_OPTIONS]),
    buildSelectGroup("广告拦截", ICON.adblock, ["REJECT", "DIRECT", "默认代理"]),
    buildSelectGroup("AIGC", ICON.ai, AI_REGION_ORDER),
    buildSelectGroup("OpenAI", ICON.openai, OPENAI_REGION_ORDER),
    buildSelectGroup("Claude", ICON.claude, OPENAI_REGION_ORDER),
    buildSelectGroup("Gemini", ICON.gemini, OPENAI_REGION_ORDER),
    buildSelectGroup("Copilot", ICON.copilot, COPILOT_REGION_ORDER),
    buildSelectGroup("GitHub", ICON.github, GITHUB_REGION_ORDER),
    buildSelectGroup("Apple", ICON.apple, APPLE_REGION_ORDER),
    buildSelectGroup("TikTok", ICON.tiktok, TIKTOK_REGION_ORDER),
    buildSelectGroup("YouTube", ICON.youtube, YOUTUBE_REGION_ORDER),
    buildSelectGroup("Pixiv", ICON.pixiv, PIXIV_REGION_ORDER),
    buildSelectGroup("X", ICON.x, X_REGION_ORDER),
    buildSelectGroup("Google", ICON.google, GOOGLE_REGION_ORDER),
    buildSelectGroup("微软服务", ICON.microsoft, MICROSOFT_REGION_ORDER),
    buildSelectGroup("Telegram", ICON.telegram, TELEGRAM_REGION_ORDER),
    buildSelectGroup("游戏服务", ICON.game, GAME_REGION_ORDER),
    buildSelectGroup("开发", ICON.dev, DEV_REGION_ORDER),
    buildUrlTestGroup("智能选择", ICON.auto, nodes.all),
    ...regionGroups
  ];

  config["rule-providers"] = {
    adblock: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/adblock.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/adblock.list",
      interval: 86400
    },
    ai: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/ai.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/ai.list",
      interval: 86400
    },
    google: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/google.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/google.list",
      interval: 86400
    },
    microsoft: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/microsoft.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/microsoft.list",
      interval: 86400
    },
    games: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/games.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/games.list",
      interval: 86400
    },
    "games-cn": {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/games-cn.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/games-cn.list",
      interval: 86400
    },
    cn: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/cn.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/cn.list",
      interval: 86400
    },
    github: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/github.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/github.list",
      interval: 86400
    },
    apple: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/apple.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/apple.list",
      interval: 86400
    },
    tiktok: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/tiktok.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/tiktok.list",
      interval: 86400
    },
    youtube: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/youtube.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/youtube.list",
      interval: 86400
    },
    pixiv: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/pixiv.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/pixiv.list",
      interval: 86400
    },
    x: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/x.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/x.list",
      interval: 86400
    },
    telegram: {
      type: "http",
      behavior: "classical",
      format: "text",
      path: "./ruleset/telegram.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/telegram.list",
      interval: 86400
    },
    cdn: {
      type: "http",
      behavior: "domain",
      format: "text",
      path: "./ruleset/cdn.list",
      url: "https://raw.githubusercontent.com/Narylr350/clash-overrides/main/ruleset/cdn.list",
      interval: 86400
    }
  };

  config.rules = [
    "DOMAIN-SUFFIX,bilibili.com,国内直连",
    "DOMAIN-SUFFIX,baidu.com,国内直连",
    "DOMAIN-SUFFIX,qq.com,国内直连",
    "DOMAIN-SUFFIX,mi.com,国内直连",
    "DOMAIN-SUFFIX,huawei.com,国内直连",

    "DOMAIN-SUFFIX,google.com,Google",
    "DOMAIN-SUFFIX,googleapis.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",
    "DOMAIN-SUFFIX,gstatic.com,Google",
    "DOMAIN-SUFFIX,googlezip.net,Google",

    "DOMAIN-SUFFIX,jsdelivr.net,开发",
    "DOMAIN-SUFFIX,unpkg.com,开发",
    "DOMAIN-SUFFIX,cdnjs.cloudflare.com,开发",
    "DOMAIN-SUFFIX,cdnjs.com,开发",
    "DOMAIN-SUFFIX,esm.sh,开发",
    "DOMAIN-SUFFIX,skypack.dev,开发",

    "DOMAIN-SUFFIX,minecraft.net,开发",
    "DOMAIN-SUFFIX,minecraftservices.com,开发",
    "DOMAIN-SUFFIX,minecraft-services.net,开发",
    "DOMAIN-SUFFIX,mojang.com,开发",
    "DOMAIN-SUFFIX,mojang.net,开发",
    "DOMAIN-SUFFIX,minecraftassets.com,开发",
    "DOMAIN-SUFFIX,download.minecraft.net,开发",
    "DOMAIN-SUFFIX,resources.download.minecraft.net,开发",
    "DOMAIN-SUFFIX,libraries.minecraft.net,开发",
    "DOMAIN-SUFFIX,textures.minecraft.net,开发",
    "DOMAIN-SUFFIX,launcher.mojang.com,开发",
    "DOMAIN-SUFFIX,launchermeta.mojang.com,开发",
    "DOMAIN-SUFFIX,piston-meta.mojang.com,开发",
    "DOMAIN-SUFFIX,piston-data.mojang.com,开发",
    "DOMAIN-SUFFIX,sessionserver.mojang.com,开发",
    "DOMAIN-SUFFIX,api.mojang.com,开发",
    "DOMAIN-SUFFIX,authserver.mojang.com,开发",
    "DOMAIN-SUFFIX,modrinth.com,开发",
    "DOMAIN-SUFFIX,cdn.modrinth.com,开发",
    "DOMAIN-SUFFIX,api.modrinth.com,开发",
    "DOMAIN-SUFFIX,curseforge.com,开发",
    "DOMAIN-SUFFIX,minecraft.curseforge.com,开发",
    "DOMAIN-SUFFIX,mediafilez.forgecdn.net,开发",
    "DOMAIN-SUFFIX,forgecdn.net,开发",
    "DOMAIN-SUFFIX,minecraftforge.net,开发",
    "DOMAIN-SUFFIX,files.minecraftforge.net,开发",
    "DOMAIN-SUFFIX,maven.minecraftforge.net,开发",
    "DOMAIN-SUFFIX,neoforged.net,开发",
    "DOMAIN-SUFFIX,maven.neoforged.net,开发",
    "DOMAIN-SUFFIX,fabricmc.net,开发",
    "DOMAIN-SUFFIX,maven.fabricmc.net,开发",
    "DOMAIN-SUFFIX,meta.fabricmc.net,开发",
    "DOMAIN-SUFFIX,quiltmc.org,开发",
    "DOMAIN-SUFFIX,maven.quiltmc.org,开发",
    "DOMAIN-SUFFIX,papermc.io,开发",
    "DOMAIN-SUFFIX,api.papermc.io,开发",
    "DOMAIN-SUFFIX,repo.papermc.io,开发",
    "DOMAIN-SUFFIX,maven.parchmentmc.org,开发",
    "DOMAIN-SUFFIX,spongepowered.org,开发",
    "DOMAIN-SUFFIX,repo.spongepowered.org,开发",
    "DOMAIN-SUFFIX,repo.maven.apache.org,开发",
    "DOMAIN-SUFFIX,repo1.maven.org,开发",
    "DOMAIN-SUFFIX,plugins.gradle.org,开发",
    "DOMAIN-SUFFIX,services.gradle.org,开发",
    "DOMAIN-SUFFIX,downloads.gradle.org,开发",
    "DOMAIN-SUFFIX,repo.gradle.org,开发",
    "DOMAIN-SUFFIX,jitpack.io,开发",

    "RULE-SET,adblock,广告拦截",

    "DOMAIN-SUFFIX,github.com,GitHub",
    "DOMAIN-SUFFIX,githubusercontent.com,GitHub",
    "DOMAIN-SUFFIX,raw.githubusercontent.com,GitHub",
    "DOMAIN-SUFFIX,githubassets.com,GitHub",
    "DOMAIN-SUFFIX,github.io,GitHub",

    "DOMAIN-SUFFIX,apple.com,Apple",
    "DOMAIN-SUFFIX,icloud.com,Apple",
    "DOMAIN-SUFFIX,mzstatic.com,Apple",
    "DOMAIN-SUFFIX,apple-dns.net,Apple",

    "DOMAIN-SUFFIX,openai.com,OpenAI",
    "DOMAIN-SUFFIX,chatgpt.com,OpenAI",
    "DOMAIN-SUFFIX,ab.chatgpt.com,OpenAI",
    "DOMAIN-SUFFIX,ws.chatgpt.com,OpenAI",
    "DOMAIN-SUFFIX,android.chat.openai.com,OpenAI",
    "DOMAIN-SUFFIX,oaistatic.com,OpenAI",
    "DOMAIN-SUFFIX,oaiusercontent.com,OpenAI",
    "DOMAIN-SUFFIX,api.revenuecat.com,OpenAI",
    "DOMAIN-SUFFIX,prodregistryv2.org,OpenAI",
    "DOMAIN-SUFFIX,datadog.pool.ntp.org,OpenAI",
    "PROCESS-NAME,com.openai.chatgpt,OpenAI",

    "DOMAIN-SUFFIX,anthropic.com,Claude",
    "DOMAIN-SUFFIX,claude.ai,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com,Claude",

    "DOMAIN-SUFFIX,gemini.google.com,Gemini",
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com,Gemini",
    "DOMAIN-SUFFIX,ai.google.dev,Gemini",

    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,sydney.bing.com,Copilot",

    "DOMAIN-SUFFIX,tiktokv.com,TikTok",
    "DOMAIN-SUFFIX,tiktokcdn.com,TikTok",
    "DOMAIN-SUFFIX,tiktok.com,TikTok",
    "DOMAIN-SUFFIX,youtube.com,YouTube",
    "DOMAIN-SUFFIX,youtu.be,YouTube",
    "DOMAIN-SUFFIX,googlevideo.com,YouTube",
    "DOMAIN-SUFFIX,ytimg.com,YouTube",
    "DOMAIN-SUFFIX,pixiv.net,Pixiv",
    "DOMAIN-SUFFIX,pximg.net,Pixiv",
    "DOMAIN-SUFFIX,x.com,X",
    "DOMAIN-SUFFIX,twimg.com,X",
    "DOMAIN-SUFFIX,twitter.com,X",

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
    "RULE-SET,games-cn,国内直连",
    "RULE-SET,games,游戏服务",
    "RULE-SET,cdn,国内直连",
    "RULE-SET,cn,国内直连",
    "GEOIP,CN,国内直连",
    "MATCH,漏网之鱼"
  ];

  return config;
}

if (typeof module !== "undefined") {
  module.exports = { main };
}
