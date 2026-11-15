# Clash Smart Overrides

一个面向个人使用、默认省心的 Clash Script 覆写规则。

它会把原始订阅整理成更清晰的服务型分组，并让 `智能选择` 覆盖所有真实节点，避免未识别节点被浪费。

## 使用方法

### Script Override 版本（推荐，能力完整）

在支持 Script Override / Script 覆写的客户端中填入：

https://raw.githubusercontent.com/Narylr350/clash-overrides/main/smart.js

### YAML 覆写版本（给 YAML-only 客户端）

在只读取 YAML、不能执行 `function main(config)` 的客户端中使用：

https://raw.githubusercontent.com/Narylr350/clash-overrides/main/smart.yaml

### ClashMi iOS 版本

ClashMi iOS 的 VPN 扩展内存和启动前网络访问更受限，建议使用不依赖远程 `rule-providers` 的专用 YAML：

https://raw.githubusercontent.com/Narylr350/clash-overrides/main/clashmi.yaml

适用客户端：

- Clash Party（`smart.js`）
- Clash Verge（`smart.js`）
- OpenClash（Meta 模式，可优先尝试 `smart.js`；只吃 YAML 的场景改用 `smart.yaml`）
- Mihomo 内核客户端
- ClashMi iOS（`clashmi.yaml`）

不适用场景：

- 把 `smart.js` 当普通 YAML 直接导入的客户端

机场私有订阅链接填在客户端的**订阅 / 配置导入**入口，本仓库的公共文件填在**覆写**入口，两者不能互相替代。
`smart.js` 是 JS 覆写脚本，不能在普通 YAML 订阅入口直接导入，否则可能出现 `yaml: line 8: mapping values are not allowed in this context`。

### 手机等新设备导入白月光

1. 在官网重新复制当前密钥对应的订阅链接，选择与客户端匹配的 Clash / Mihomo 格式。重置密钥后，其他设备保存的旧链接也要更新。
2. 首次导入优先使用手机蜂窝数据直连，避免连接正在代理的电脑热点；暂时关闭 VPN，并关闭客户端的“通过代理下载 / 更新订阅”。先在客户端的原生订阅入口添加机场链接，不经过第三方订阅转换。
3. 添加并选用本仓库的覆写：支持 Script Override 的客户端使用 `smart.js`；YAML-only 客户端使用 `smart.yaml`；ClashMi iOS 优先使用轻量 `clashmi.yaml`。新版 ClashMi 也支持 JS 覆写，但必须在覆写入口明确选择 JS 类型。
4. 启用 VPN 并使用规则模式。已有设备应先刷新并选用最新覆写，再更新机场订阅；客户端若独立提供订阅下载代理开关，仍保持关闭。

三个覆写入口均将已确认的订阅下载域名 `todust.cc` / `qinyues4.cc` 及其子域名设为 `DIRECT`，覆盖轮换的下载主机名；官网面板 `bygcloud.com` 不强制直连。这里不保存任何私有订阅链接，也不增加代理组或改写 DNS 服务器。

覆写只会在配置已经加载、请求确实经过内核且使用规则模式时影响订阅下载，不能解决首次尚未导入、全局模式或客户端自行指定代理下载的问题。白月光提示同设备、同软件 10 分钟内只能成功获取一次订阅；遇到 HTTP 429 应等待至少 10 分钟再试，不要连续点击导入。

## 分组结构

### 日常常用入口

- `默认代理`
- `智能选择`
- `漏网之鱼`
- `AIGC`
- `OpenAI`
- `Claude`
- `Gemini`
- `OpenCode`
- `Copilot`
- `开发`
- `GitHub`
- `Google`
- `YouTube`
- `TikTok`
- `Telegram`
- `X`
- `Pixiv`
- `海外游戏平台`
- `海外游戏`
- `Apple`
- `微软服务`
- `广告拦截`

### 支撑型自动组

地区自动组与 `国内直连` 默认设置 `hidden: true`，只隐藏独立入口，不删除分流目标或服务组中的地区选项。支持隐藏组的客户端默认显示 22 个覆写入口（不含客户端的 `GLOBAL`）；需要检查地区节点时可开启显示隐藏组。不支持隐藏组的客户端仍会显示完整列表。

- `智能选择`：覆盖所有真实节点，并排除订阅说明项
- `香港自动`
- `澳门自动`
- `新加坡自动`
- `日本自动`
- `韩国自动`
- `美国自动`
- `台湾自动`
- `欧洲自动`
- `亚洲其他自动`
- `北美自动`
- `南美自动`
- `非洲自动`
- `大洋洲自动`
- `其他自动`

## 默认建议

- 日常代理：`默认代理 -> 智能选择`
- `默认代理` 是总默认入口，其他自动组和服务组都围绕它展开
- AI 服务：先调 `AIGC`
- `TikTok` / `YouTube` / `Pixiv` / `X` 提供独立入口，默认仍跟随 `默认代理`
- `漏网之鱼` 默认跟随 `默认代理`
- 国内游戏服务：`games-cn` 规则集固定走 `国内直连`
- 海外游戏服务：Steam / Epic / Battle.net / Xbox / PlayStation / Nintendo / Riot / Ubisoft / GOG 等平台域名走 `海外游戏平台`，其他海外游戏域名走 `海外游戏`
- `海外游戏平台` 默认跟随 `默认代理`；`海外游戏` 默认 `DIRECT`，避免和本机/路由器游戏加速器抢路由
- 开发：覆盖 Minecraft 开发、Mod 平台、Gradle/Maven 仓库、PyPI 软件源及 Python 包下载，以及 jsdelivr、unpkg、cdnjs、esm.sh 等明确列出的开发 CDN
- 国内兜底：服务规则之后使用 `cn` 域名规则和 `GEOIP,CN` 直连，其余流量走 `漏网之鱼`；通用 CDN 清单包含海外服务，不作为国内直连依据
- JetBrains：安装包下载域名复用 `开发` 组，默认走代理以绕开中国 CDN 对浏览器请求返回 404 HTML 的兼容问题；不增加专用代理组
- GitHub / Apple / Google：默认保持脚本分流
- Apple：默认 `DIRECT` 优先，仍可手动切到代理地区
- 微软服务：默认 `DIRECT`
- 网站异常：先把 `广告拦截` 切到 `DIRECT`
- 本机与局域网：`localhost`、回环地址、链路本地地址及 RFC 1918 私网地址优先 `DIRECT`，避免 TUN 截获 SSH、局域网服务和本机代理监听地址

## 说明

- `智能选择` 会包含所有真实节点，包括未归类节点；订阅源里的流量、到期、官网、更新订阅等说明项会被排除
- `其他自动` 用来承接没有归入任何已知地区/区域的剩余节点
- AI 服务使用统一候选逻辑，`OpenAI / Claude / Gemini / OpenCode / Copilot` 只做少量专用偏置
- `TikTok / YouTube / Pixiv / X` 作为内容/推荐敏感服务提供独立入口，便于按地区单独调优
- `TikTok` 同时也是地区和环境检测都更敏感的服务，建议单独观察表现
- `Pixiv` 默认更偏日本地区顺序
- `开发` 和 `AIGC` 一样只保留默认代理、智能选择、地区自动组和 `DIRECT` 作为手动选项
- `smart.yaml` 不是 JS Script Override 的逐行翻译版，而是用 Mihomo 原生 `include-all` / `filter` / `url-test` 能力尽量逼近 `smart.js` 的使用体验
- `clashmi.yaml` 是 ClashMi iOS 专用轻量版本，不使用远程 `rule-providers` / `RULE-SET` / `PROCESS-NAME`，以降低 VPN 扩展启动失败风险
- `allow-lan` 只控制其他设备能否连接本机的代理监听端口，不决定设备自身能否访问局域网；本地监听地址直连后，代理程序发往互联网的连接仍按实际目标域名或 IP 分流
- `smart.js` 仍然是能力最完整的主版本；`smart.yaml` 的目标是给 YAML-only 客户端一个尽量接近的替代入口
- `smart.js` 替换订阅的流量规则时，会保留 DNS `nameserver-policy` 实际引用的 `rule-set`，避免出现 `not found rule-set`；不会恢复上游代理组或改写 DNS 服务器
- 地区节点名关键词和订阅说明排除关键词维护在 `regions.json`；修改后运行 `node scripts/build-regions.mjs` 生成 `smart.js` / `smart.yaml` 的匹配块
- `clashmi.yaml` 由 `smart.yaml` 生成；修改 `smart.yaml` 后运行 `node scripts/build-clashmi-yaml.mjs`
- `ruleset/` 保存 `smart.yaml` 里 `rule-providers` 的上游规则快照，客户端规则集合 URL 指向本仓库的快照地址
- `ruleset/sources.json` 保存真正的上游来源，GitHub Actions 会定时运行 `scripts/sync-rules.mjs`，发现快照变化时创建同步 PR，由人工确认后合并
- `ruleset/cdn.list` 仅保留为旧覆写的静态兼容快照，避免已下载的旧脚本刷新规则时返回 404；新覆写不再引用或自动同步它
- GeoIP / GeoSite / MMDB / ASN 外部数据库通过 `geodata-latest` Release 镜像，由 `scripts/sync-geodata.mjs` 定时更新 Release 资产
- 该脚本是单文件个人覆写脚本，不做复杂的原配置增量合并

## 外部资源镜像地址

客户端的外部资源可以改成这些地址：

- GeoIP 数据库：`https://github.com/Narylr350/clash-overrides/releases/download/geodata-latest/geoip-lite.dat`
- GeoSite 数据库：`https://github.com/Narylr350/clash-overrides/releases/download/geodata-latest/geosite.dat`
- MMDB 数据库：`https://github.com/Narylr350/clash-overrides/releases/download/geodata-latest/geoip.metadb`
- ASN 数据库：`https://github.com/Narylr350/clash-overrides/releases/download/geodata-latest/GeoLite2-ASN.mmdb`

## 常见坑

- `smart.js` 是 JS 覆写脚本，不是普通 YAML 配置；只吃 YAML 的客户端不能直接导入
- 新版 ClashMi 支持 JS 覆写，但普通 YAML 订阅入口不会执行 JS；需要在覆写入口选择 JS 类型。iOS 默认仍建议使用轻量 `clashmi.yaml`
- 网页端能用，不代表手机客户端一定没问题；手机客户端启动阶段常常会多打一批辅助请求
- ChatGPT Android 客户端除了主业务域名，还会访问一些启动探测 / 环境探测 / 订阅状态 / 远程配置链路
- 目前已专项收口到 `OpenAI` 组的 Android 相关域名包括：
  - `ab.chatgpt.com`
  - `ws.chatgpt.com`
  - `android.chat.openai.com`
  - `*.datadog.pool.ntp.org`
  - `api.revenuecat.com`
  - `prodregistryv2.org`
- `漏网之鱼` 继续保持通用国外网站兜底，不因为 OpenAI 手机端少量启动探测请求而整体锁到某个地区
- 如果 ChatGPT Android 只有启动阶段偶发报网络异常，优先怀疑专项规则没收口，而不是先改 `漏网之鱼` 的默认策略

## License

MIT
