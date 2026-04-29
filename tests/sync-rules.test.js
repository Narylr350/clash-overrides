const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

(async () => {
  const syncRules = await import("../scripts/sync-rules.mjs");

  const yaml = [
    "rule-providers:",
    "  adblock:",
    "    type: http",
    "    behavior: classical",
    "    format: text",
    "    path: ./ruleset/adblock.list",
    "    url: https://example.test/adblock.list",
    "  ai:",
    "    type: http",
    "    behavior: domain",
    "    format: text",
    "    path: ./ruleset/ai.list",
    "    url: https://example.test/ai.list",
    "rules:",
    "  - RULE-SET,ai,AIGC",
    ""
  ].join("\n");

  assert.deepEqual(syncRules.parseRuleProviders(yaml), [
    {
      name: "adblock",
      path: "./ruleset/adblock.list",
      url: "https://example.test/adblock.list"
    },
    {
      name: "ai",
      path: "./ruleset/ai.list",
      url: "https://example.test/ai.list"
    }
  ]);

  const manifestPath = path.join(os.tmpdir(), `rule-sources-${Date.now()}.json`);
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      [
        {
          name: "adblock",
          path: "./ruleset/adblock.list",
          url: "https://upstream.example.test/adblock.list"
        }
      ],
      null,
      2
    )
  );
  assert.deepEqual(await syncRules.loadRuleProviderSources({ sourcesPath: manifestPath }), [
    {
      name: "adblock",
      path: "./ruleset/adblock.list",
      url: "https://upstream.example.test/adblock.list"
    }
  ]);

  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "sync-rules-"));
  const yamlPath = path.join(rootDir, "smart.yaml");
  fs.writeFileSync(yamlPath, yaml);
  const sourcesPath = path.join(rootDir, "ruleset", "sources.json");
  fs.mkdirSync(path.dirname(sourcesPath), { recursive: true });
  fs.writeFileSync(
    sourcesPath,
    JSON.stringify([
      {
        name: "adblock",
        path: "./ruleset/adblock.list",
        url: "https://upstream.example.test/adblock.list"
      },
      {
        name: "ai",
        path: "./ruleset/ai.list",
        url: "https://upstream.example.test/ai.list"
      }
    ])
  );

  const requestedUrls = [];
  const summary = await syncRules.syncRuleProviders({
    rootDir,
    yamlPath,
    sourcesPath,
    fetchImpl: async (url) => {
      requestedUrls.push(url);
      return {
        ok: true,
        status: 200,
        text: async () => `content from ${url}\n`
      };
    }
  });

  assert.deepEqual(requestedUrls, [
    "https://upstream.example.test/adblock.list",
    "https://upstream.example.test/ai.list"
  ]);
  assert.deepEqual(summary, [
    { name: "adblock", path: "ruleset/adblock.list", bytes: 56 },
    { name: "ai", path: "ruleset/ai.list", bytes: 51 }
  ]);
  assert.equal(
    fs.readFileSync(path.join(rootDir, "ruleset", "adblock.list"), "utf8"),
    "content from https://upstream.example.test/adblock.list\n"
  );
  assert.equal(
    fs.readFileSync(path.join(rootDir, "ruleset", "ai.list"), "utf8"),
    "content from https://upstream.example.test/ai.list\n"
  );

  await assert.rejects(
    syncRules.syncRuleProviders({
      rootDir,
      yamlPath,
      sourcesPath,
      fetchImpl: async () => ({ ok: false, status: 503, text: async () => "" })
    }),
    /Failed to download adblock/
  );

  console.log("PASS sync rules checks");
})();
