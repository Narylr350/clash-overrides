# Clash Smart Overrides

一个面向个人使用、默认省心的 Clash Script 覆写规则。

它会把原始订阅整理成更清晰的服务型分组，并让 `智能选择` 覆盖所有节点，避免未识别节点被浪费。

## 使用方法

在支持 Script Override / Script 覆写的客户端中填入：

https://raw.githubusercontent.com/Narylr350/clash-overrides/main/smart.js

适用客户端：

- Clash Party
- Clash Verge
- OpenClash（Meta 模式）
- Mihomo 内核客户端

不适用客户端：

- ClashMi 这类只读取 YAML 配置、不会执行 `function main(config)` Script Override 的客户端

这个仓库提供的是 **JS 覆写脚本**，不是普通 YAML 配置。
如果客户端会把 `smart.js` 当 YAML 直接读取，就会出现类似 `yaml: line 8: mapping values are not allowed in this context` 的报错，不能直接导入。

## 分组结构

### 日常常用入口

- `默认代理`
- `AIGC`
- `GitHub`
- `TikTok`
- `YouTube`
- `Pixiv`
- `X`
- `Google`
- `微软服务`
- `Telegram`
- `游戏服务`
- `广告拦截`
- `漏网之鱼`

### 支撑型自动组

- `智能选择`：覆盖所有节点
- `香港自动`
- `新加坡自动`
- `日本自动`
- `韩国自动`
- `美国自动`
- `台湾自动`
- `欧洲自动`
- `亚洲其他自动`
- `其他自动`

## 默认建议

- 日常代理：`默认代理 -> 智能选择`
- `默认代理` 是总默认入口，其他自动组和服务组都围绕它展开
- AI 服务：先调 `AIGC`
- `TikTok` / `YouTube` / `Pixiv` / `X` 提供独立入口，默认仍跟随 `默认代理`
- `漏网之鱼` 默认跟随 `默认代理`
- GitHub / Google：默认保持脚本分流
- 微软服务：默认 `DIRECT`
- 网站异常：先把 `广告拦截` 切到 `DIRECT`

## 说明

- `智能选择` 会包含所有节点，包括未归类节点
- `其他自动` 用来承接没有归入任何已知地区/区域的剩余节点
- AI 服务使用统一候选逻辑，`OpenAI / Claude / Gemini / Copilot` 只做少量专用偏置
- `TikTok / YouTube / Pixiv / X` 作为内容/推荐敏感服务提供独立入口，便于按地区单独调优
- `TikTok` 同时也是地区和环境检测都更敏感的服务，建议单独观察表现
- `Pixiv` 默认更偏日本地区顺序
- 该脚本是单文件个人覆写脚本，不做复杂的原配置增量合并

## 常见坑

- `smart.js` 是 JS 覆写脚本，不是普通 YAML 配置；只吃 YAML 的客户端不能直接导入
- ClashMi 会把 `smart.js` 当 YAML 读，不会执行 `function main(config)`，因此不兼容这类 Script Override 写法
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
