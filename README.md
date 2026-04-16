# Clash Smart Overrides

一个基于 Script 的 Clash 覆写规则，用来优化分流和自动选择节点。

特点：

- 自动分流（AI / Google / GitHub / Microsoft / 游戏）
- Smart 自动测速选择节点
- 广告拦截（可手动开关）
- 常见国家节点自动归类（HK / SG / JP / US 等）

---

## 使用方法

在支持 Script 覆写的客户端中填入：


https://raw.githubusercontent.com/Narylr350/clash-overrides/main/smart.js


适用客户端：

- Clash Party
- Clash Verge
- OpenClash（Meta 模式）
- Mihomo 内核客户端

---

## 基本说明

### 1. 默认代理

一般保持：


默认代理 → 智能选择


---

### 2. 广告拦截

在代理组中切换：

- `REJECT`：开启去广告
- `DIRECT`：关闭去广告

---

### 3. 微软服务

默认：


微软服务 → DIRECT


如果遇到异常可以手动切换节点。

---

### 4. AI 使用

常用 AI 已单独分组：

- OpenAI
- Claude
- Gemini
- Copilot

一般使用：


AIGC 或 新加坡 / 日本节点


---

## 注意

- 广告拦截只对域名级广告有效
- 部分网站异常时可关闭广告拦截排查
- Smart 测速使用 HTTPS，避免测速失败

---

## License

MIT
