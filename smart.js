function main(config) {
  const proxies = config.proxies || [];

  const pick = (re) => proxies.map(p => p.name).filter(n => re.test(n));

  const HK = pick(/HK|香港|Hong/i);
  const SG = pick(/SG|新加坡|Singapore/i);
  const JP = pick(/JP|日本|Japan/i);
  const KR = pick(/KR|韩国|Korea|首尔|Seoul/i);
  const US = pick(/US|美国|USA|United States/i);

  config["proxy-groups"] = [
    { name: "PROXY", type: "select", proxies: ["AUTO", "HK AUTO", "SG AUTO", "JP AUTO", "KR AUTO", "US AUTO", "DIRECT"] },
    { name: "GLOBAL", type: "select", proxies: ["AUTO", "HK AUTO", "SG AUTO", "JP AUTO", "KR AUTO", "US AUTO", "DIRECT"] },

    { name: "AIGC", type: "select", proxies: ["SG AUTO", "JP AUTO", "US AUTO", "DIRECT"] },
    { name: "Google", type: "select", proxies: ["SG AUTO", "JP AUTO", "HK AUTO", "US AUTO", "DIRECT"] },
    { name: "Microsoft", type: "select", proxies: ["DIRECT", "SG AUTO", "JP AUTO", "AUTO"] },
    { name: "Game", type: "select", proxies: ["DIRECT", "AUTO", "HK AUTO", "SG AUTO"] },

    { name: "AUTO", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, proxies: [...HK, ...SG, ...JP, ...KR, ...US] },
    { name: "HK AUTO", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, proxies: HK },
    { name: "SG AUTO", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, proxies: SG },
    { name: "JP AUTO", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, proxies: JP },
    { name: "KR AUTO", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, proxies: KR },
    { name: "US AUTO", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, proxies: US }
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
    "RULE-SET,ai,AIGC",
    "RULE-SET,google,Google",
    "RULE-SET,microsoft-cn,DIRECT",
    "RULE-SET,microsoft,Microsoft",
    "RULE-SET,games-cn,DIRECT",
    "RULE-SET,games,Game",
    "RULE-SET,cn,DIRECT",
    "RULE-SET,proxy,PROXY",
    "GEOIP,CN,DIRECT",
    "MATCH,PROXY"
  ];

  return config;
}
