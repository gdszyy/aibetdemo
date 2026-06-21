# 性能优化 Plan

> 全项目性能审计与优化 | 创建 2026-03-22 | 更新 2026-04-20
>
> **维护规则**：已完成项直接删除。

## 概览

| # | 事项 | 优��级 | 状态 |
|---|------|--------|------|
| **内存泄漏** | | | |
| 1.2 | bet-slip lifecycle subscribe 未保存 unsubscribe | P2 | ❌ |
| 1.3 | SharedWebSocket `destroy()` 未被调用 | P2 | ❌ |
| 1.4 | Player ID Set 无界增长 | P2 | ❌ |
| **图片优化** | | | |
| 2.1 | GameCard + GameDetailPage `unoptimized` — 禁用了 Next.js 图片优化 (3 处) | P1 | ❌ |
| 2.4 | `images.remotePatterns` 通配符 `*` | P2 | ❌ |
| 2.7 | GameDetailPage `relatedGames` 无上限 | P2 | ❌ |
| **重渲染优化** | | | |
| 3.4 | BetSlip Footer 过大（parlay 396行 / single 367行） | P2 | ❌ |
| 3.5 | cart/stake-input (383) + slip/slip-settings (620) 超标 | P2 | ❌ |
| **网络请求** | | | |
| 4.1 | transaction 余额查询 staleTime: 0（SSE 已推送）— 2 处 | P1 | ❌ |
| 4.3 | notification/vip-support staleTime: 0 — 4 处 | P2 | ❌ |
| **计算开销** | | | |
| 5.1 | specifier `.split('|')` 内层循环无缓存 | P2 | ❌ |
| 5.2 | WS player hydration 同步阻塞 | P2 | ❌ |
| **CSS/渲染** | | | |
| 6.1 | NavigationBar `backdrop-blur-[15px]` 滚动 GPU 开销（应用 token `backdrop-blur-overlay-1`） | P2 | ❌ |
| 6.2 | ConditionalTooltip 200+ observers | P1 | ❌ |
| 6.3 | BorderBeam `blur(14px)` WS burst | P2 | ⏳ viewport guard |
