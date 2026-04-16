# Clash Smart Overrides

一个面向个人使用、默认省心的 Clash Script 覆写规则。

它会把原始订阅整理成更清晰的服务型分组，并让 `智能选择` 覆盖所有节点，避免未识别节点被浪费。

## 使用方法

在支持 Script 覆写的客户端中填入：

https://raw.githubusercontent.com/Narylr350/clash-overrides/main/smart.js

适用客户端：

- Clash Party
- Clash Verge
- OpenClash（Meta 模式）
- Mihomo 内核客户端

## 分组结构

### 日常常用入口

- `默认代理`
- `AIGC`
- `GitHub`
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

## 默认建议

- 日常代理：`默认代理 -> 智能选择`
- AI 服务：先调 `AIGC`
- GitHub / Google：默认保持脚本分流
- 微软服务：默认 `DIRECT`
- 网站异常：先把 `广告拦截` 切到 `DIRECT`

## 说明

- `智能选择` 会包含所有节点，包括未识别地区的节点
- AI 服务使用统一候选逻辑，`OpenAI / Claude / Gemini / Copilot` 只做少量专用偏置
- 该脚本是单文件个人覆写脚本，不做复杂的原配置增量合并

## License

MIT
