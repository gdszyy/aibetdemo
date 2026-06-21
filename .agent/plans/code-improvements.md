# 代码质量改进

> 代码质量改进 | 创建 2026-03-18 | 更新 2026-04-20
>
> **维护规则**：已完成项直接删除。**纯样式项** → [`style-improvements.md`](style-improvements.md)

## 概览

| # | 事项 | 优先��� | 状态 |
|---|------|--------|------|
| **赔率处理** | | | |
| 4 | `OddsUpdateProcessor` 测试覆盖 | P1 | ❌ |
| 9 | 提取共享 player hydration hook（2 处 98% 重复） | P1 | ❌ |
| **WS 赛事订阅** | | | |
| 21 | `useGameSubscription` eventIds 引用稳定化 | P1 | ❌ |
| 22 | unsubscribe 即时通知 | P1 | ❌ |
| 23 | 重连时清空 `serverGameSubs` | P2 | ❌ |
| 24 | `doReconciliation` 取消 pending debounce | P3 | ❌ |
| **组件复用** | | | |
| 30 | 提取 `ConfirmModal` 共享组件（3 处重复） | P1 | ❌ |
| 60 | `ConditionalTooltip` cloneElement → Radix `Slot` | P2 | ❌ |
| **宽度感知 odds 列** | | | |
| 70 | `getMarketColumnWidth` 移至 `_utils/` | P1 | ❌ |
| 71 | `useVisibleMarkets` 死代码 | P1 | ❌ |
| 72 | N 个冗余 `useSize(rowRef)` → 提升至父容器 | P2 | ❌ |
| 73-75 | ts-pattern 过度工程 / 不可达 fallback / 魔法数字 | P2-P3 | ❌ |
| **其他** | | | |
| 41 | Analytics mutation 缺 error 回调 | P1 | ❌ |
| 77 | `getCampaignStatus()` UTC-6 时区不一致 | P2 | ❌ |
| **侧边栏** | | | |
| 130 | `sport-item.tsx` 338 行 → 拆分 CollapsedView / ComingSoonView / ExpandedView | P1 | ❌ |
| 131 | `sport-item.tsx` `refetch()` 缺 `.catch()` | P1 | ❌ |
| **认证** | | | |
| 120 | H5 error modal 重复 → 共享 `ErrorModal` | P2 | ❌ |
| **投注单** | | | |
| 100 | `cart/stake-input.tsx` 383 行 → 提取 `useValueAnimation` | P2 | ❌ |
| 110 | `slip/slip-settings.tsx` 620 行 → 拆分子组件 | P1 | ❌ |
| 112 | `slip/slip-settings.tsx` `updateMutation` 缺 `onError`（乐观 UI 不回滚） | P0 | ❌ |
| 113 | `slip/slip-settings.tsx` `aria-label="Back"` 硬编码 → `t()` | P0 | ❌ |
| 114 | `slip/slip-settings.tsx` `'cart-settings'` 魔法字符串 → query-keys 常量 | P1 | ❌ |
| 115 | `slip/slip-settings.tsx` 移动端 tooltip 3 个 useState → 合并为一个对象 | P2 | ❌ |
