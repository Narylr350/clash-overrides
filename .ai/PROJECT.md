# Clash Smart Overrides 项目基线

## 1. Goal

长期维护个人 Clash/Mihomo 覆写脚本，让规则分流、代理组、上游规则快照和客户端兼容问题能被稳定修复、验证和交付。

## 2. Users and Scenarios

主要用户是仓库维护者本人。

使用场景包括：

- 日常订阅通过 `smart.js`、`smart.yaml` 或 `clashmi.yaml` 使用。
- 新服务、新 AI 工具、新游戏平台等需要新增专用分流。
- 客户端出现误判、直连/代理走错、规则顺序问题时进行修复。
- 上游规则或 geodata 需要同步并人工确认。

## 3. MVP

维护工作流的最小可用范围：

- 保持 `smart.js`、`smart.yaml`、`clashmi.yaml` 三个入口可用。
- 修改规则或代理组时同步相关测试。
- `smart.yaml` 变更后同步生成 `clashmi.yaml`。
- 地区匹配修改通过 `regions.json` 和 `scripts/build-regions.mjs` 管理。
- 上游规则快照和 geodata 继续由现有脚本/GitHub Actions 同步。

## 4. Inputs and Outputs

输入：

- 用户报告的问题、截图、日志、客户端行为。
- 新服务/域名/规则需求。
- `ruleset/sources.json` 中声明的上游规则来源。
- `regions.json` 中维护的地区关键词。

输出：

- 更新后的 `smart.js`、`smart.yaml`、`clashmi.yaml`。
- 更新后的 `ruleset/*.list` 或 geodata Release 资产。
- 对应测试、README 说明和提交。

## 5. Non-goals

当前不做：

- 不重构成大型配置生成框架。
- 不引入无必要依赖或 package 管理。
- 不把所有 Clash 客户端差异都抽象成通用兼容层。
- 不在 `.ai/PROJECT.md` 里维护长期任务看板。
- 不把旧聊天记录当作事实源；以仓库文件、测试和 Git 历史为准。

## 6. Tech Direction

采用现有轻量技术方向：

- 继续使用无依赖 Node.js 脚本维护生成、同步和测试。
- `smart.js` 是能力最完整的主版本。
- `smart.yaml` 是 YAML-only 客户端替代入口。
- `clashmi.yaml` 由 `smart.yaml` 生成，并移除 ClashMi 风险较高的 `rule-providers` / `RULE-SET` / `PROCESS-NAME`。
- GitHub Actions 继续负责上游规则同步 PR 和 geodata Release 发布。

## 7. Constraints and Working Rules

- 修改 `smart.yaml` 后必须运行 `node scripts\build-clashmi-yaml.mjs` 或 `--check` 确认派生文件一致。
- 修改地区关键词或订阅说明排除关键词后必须运行 `node scripts\build-regions.mjs` 或 `--check`。
- 规则顺序要优先避免宽泛规则抢走明确服务规则。
- `cdn` / `cn` / `GEOIP,CN` 属于宽泛国内兜底，默认靠后。
- `clashmi.yaml` 不依赖远程 `rule-providers`。
- 旧工作流文件未发现；本项目以 `.ai/PROJECT.md` 作为长期基线，以 Git commit 作为进度和交接事实。
- 完成任务并通过必要验证后，允许 AI 直接提交并推送到 GitHub；若工作区包含无关改动，必须只提交当前任务相关文件。
- 执行层 skill 可在 work 中使用：
  - `superpowers:systematic-debugging`：用于误判、客户端异常、测试失败排查。
  - `superpowers:test-driven-development`：用于新增规则行为或 bugfix 时先补回归测试。
  - `superpowers:verification-before-completion`：用于提交前验证。
- 不接入管理层或重流程 skill，避免和这个轻量工作流重叠。

## 8. Validation

常规验证命令：

```powershell
node tests\smart.test.js
node tests\smart-yaml.test.js
node scripts\build-clashmi-yaml.mjs --check
node tests\clashmi-yaml.test.js
node scripts\build-regions.mjs --check
node tests\build-regions.test.js
node tests\sync-rules.test.js
node tests\mirror-urls.test.js
node tests\sync-geodata.test.js
git diff --check
```

根据改动范围可以先跑相关子集，提交前需要跑足以证明本次变更的检查。

## 9. Seed Tasks

第一批可执行任务：

1. 收尾当前未提交的 `OpenCode` AI 分组变更：确认规则、测试和 README 后提交。
2. 给常见服务新增或修复分流时，优先补显式域名规则和顺序测试。
3. 继续观察 ClashMi 兼容问题，必要时增强 `build-clashmi-yaml.mjs` 的裁剪规则和测试。
4. 对规则误判案例建立最小回归测试，防止 `cdn` / `cn` / 广告规则再次抢走明确服务。
