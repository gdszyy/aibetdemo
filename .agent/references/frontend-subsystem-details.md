# 前端子系统详情

各专门子系统的详细架构。处理对应模块时阅读。

## Casino 游戏详情
- **启动**：`LaunchGameInterface()` → `game_url` → `window.location.href`。预加载：`GameCard` 将 URL 存入 sessionStorage → 详情页消费（零延迟）。兜底：直接 URL 访问时走 API 调用。
- **封面**：模糊背景 + 清晰前景双 Image。响应式 `aspect-2/3` / `md:aspect-video` + `max-h` 约束。
- **相关游戏**：`GameSection`（Embla 轮播）。调用者应 `.slice()` 限制大数据集。
- **返回导航**：确定性 `router.push('/casino/${lobbyId}')`，禁止 `router.back()`。相关游戏卡片使用 `router.replace` 避免历史堆叠。
- **游戏 iframe**：`LaunchGameInterface()` → `game_url` → 全屏 `<iframe>` 叠加层（z-55，低于 Modal z-60）。退出：关闭按钮 + `Modal` 确认，或游戏回调页通过 `postMessage({ type: 'GAME_CLOSED' })`。CSP `frame-src 'self' https:` 允许所有 HTTPS 游戏供应商。`useGameMessage` hook 验证 `event.origin === window.location.origin`。

## Sentry 集成
- 仅生产环境。`sanitizeForSentry()` 编辑敏感 key。`beforeSend` 丢弃 ResizeObserver、扩展错误、AbortError、`ForbiddenError`。`thirdPartyErrorFilterIntegration` 使用 `applicationKey: 'match-pc-client'`（必须在 `next.config.ts` + `instrumentation-client.ts` 之间保持同步）。
- 错误类：`AppError` → `ApiError` / `NetworkError` / `ForbiddenError` / `ValidationError`。HTTP：仅 5xx + 429 上报。

## SSE（服务端推送事件）
- `@microsoft/fetch-event-source` + `Authorization: Bearer`。多标签页通过 `BroadcastChannel` + 基于可见性的所有权切换。
- `use-sse-connection.ts`：登录后连接，路由到 `globalEventObserver` 作为 `sse:{eventName}`。
- `use-wallet-sync.ts`：`sse:balance_update` → Zustand store + 标签页获焦时 refetch。

## 游戏订阅（WS）
- 命令：`CMD_SUBSCRIBE_GAME`（10080）、`CMD_UNSUBSCRIBE_GAME`（10090）。SharedWebSocket 追踪 `serverGameSubs` + `localGameSubs`，每 30s 协调一次。
- `useGameSubscription(eventIds)`：挂载时订阅，卸载时取消。`useBetSlipSubscription()`：从购物车提取 eventIds。

## OddsUpdateProcessor 与 MarketHydrator（OOP）
- **`OddsUpdateProcessor`**（`match/_logic/odds-change.ts`）：`collectMissingPlayerIds()`、`classifyIncomingMarkets()`、`mergeOutcomes()`、`updateMarkets()`（列表：仅更新）、`generateMarkets()`（详情：完整 CRUD）。
- **`MarketHydrator`**：`hydratePlayerOutcomeNames()` — 用球员数据重渲染。
- **市场模板引擎**：已移除（曾为 `template-engine.ts` 包装 marketConfigStore）。模板查找现内联处理。
- **球员补水**：检测 `sr:player:*` → `PostPlayerBatchInterface` 批量查询 → 补水 → 更新缓存。

## 移动端 Sport Strip（MatchFilter）
- **仅移动端**（`md:hidden`），显示在热门比赛页面。桌面端使用侧边栏做体育导航。
- `match/home/match-filters/filters.tsx`：Embla 轮播的 `FilterItem` 卡片 — Figma 多色图标 + 直播计数徽章。
- `home-strip-icon.tsx`：多色 SVG 作为 `StaticImageData`（Next.js Image）导入，**不**通过 SVGR 管线。未映射运动回退到 `SPORT_ICON_MAP` 单色图标。
- `useSportLiveCounts`：通过 `SearchMatchesInterface({ status: Live })` 获取每运动直播赛事计数，游标分页，每运动独立缓存（`useQueries`）。徽章显示计数（上限 "99+"）。
- `useLiveStatusSuffix`：从 `/sports-live` 导航时追加 `?status=Live` 保持直播上下文。

## 促销页面
双路由：`/sports/promotions/[slug]` + `/casino/promotions/[slug]`。通过重导出模式共享模块：`export { default, generateMetadata } from '@/modules/marketing/promotion/...'`。

## WS 观察器
- **详情**（4 个 hooks）：`useMatchItemObserver`（OddsChange + 球员补水）、`useDetailMatchStatusObserver`、`useMatchItemFixtureObserver`。`mergeMatchData` 在 refetch 时保留 WS 更新鲜的数据。
- **列表**（1 个 hook）：`useMatchObserver` — 全部 4 个事件 + 批量球员补水。缓存工具：`updateEventWithOdds` 等。`isMatchFinished` → `removeQueries`。
- **冠军赛**：`useSeasonObserver`（OddsChange CRUD）。无 MatchStatus/Fixture。

## 购物车同步（bet-slip）
完整同步 + 版本控制。流程：listSlice action → 乐观更新 → syncToServer（300ms debounce）→ PUT {version, items}。版本冲突（200001）→ fetchLatest。Store：Zustand Slices + `stores/internal/`。跨标签页：BroadcastChannel。

## 投注单异常类型
1. **锁定**（`isOutcomeLocked`）→ "清除异常"  2. **无效**（`isSelectionInvalid()`）→ "清除异常"  3. **冲突**（串关，同 eventId）→ 贪心清除  4. **不合规**（串关，冠军赛）→ 清除  5. **不可用**（WS 断连）→ 自动恢复
- 共享：`isSelectionInvalid()` 位于 `match/_utils/selection-validity.ts`。StakeCard 使用 `STAKE_CARD_SURFACE_STRATEGIES`。

## 投注动画系统
- **能量球**（`utils/fly-energy-ball-bezier.ts`）："+1" 球从点击点飞向目标（投注单卡片/徽章）。3 阶段：弹出（缩放弹跳）→ 等待（rAF 追踪源点）→ 贝塞尔飞行（X/Y 分解独立缓动）。取消时：6 粒子爆炸。尊重 `prefers-reduced-motion`。
- **翻牌反馈**（`utils/betslip-switch-feedback.ts`）：同线切换结果时的 3D 翻牌。滑入 → 翻转（交换标签）→ 保持 → 滑出。放置：right（桌面端）、left、top（移动端）。通过 Map 管理活跃翻牌。
- **动画工具**（`match/_hooks/bet-animation-utils.ts`）：目标 DOM 查询（`resolveEnergyBallTarget`、`resolveSelectionCardEl`），微动画（呼吸发光、卡片入场高亮、slip 滚动到顶部）。
- **编排器**（`match/_hooks/bet-actions.ts` → `executeBetClick`）：3 种流程：新增选择 → 能量球；切换线 → 翻牌；移除 → 取消（爆炸）。接受 `triggerEl` 作为动画起点。

## Drawer 组件
- `@/components/drawer/drawer.tsx`：Vaul 包装器。组合组件：`Drawer`、`DrawerTrigger`、`DrawerOverlay`、`DrawerContent`、`DrawerHeader/Footer/Title/Description/Close`。方向感知（上/下/左/右）。用于 H5 电话表单（区域选择器）。

## Border Beam 效果
- `BorderBeam`：锥形渐变旋转光束环绕父元素边框（GPU 优化，60fps）。
- `BorderBeamSvg`：三层 SVG 光束，交错虚线动画 + 呼吸脉冲。
- `BorderBeamPath`：基于 CSS `offset-path` 的光束沿边框周线运动。用于 `TrendBubble` 的赔率变化视觉反馈。

## 其他组件
- **StickyBlurHeader**：CSS 容器查询 `w-[100cqi]` 实现全宽模糊。用于详情/列表/赌场布局。
- **NavBar**：Locale layout 级别，`sticky top-0 backdrop-blur`。紧凑模式：通过 `@container` 查询仅图标标签。`lobbiesToNavItems()` 用于赌场导航。在 `/signin` 和 `/account`（移动端）隐藏。
- **Footer**：`FooterSiteMap`（4 列）+ `FooterComplianceStrip`（mask-image 徽章）。FooterSlot context 在路由 `@container` 中渲染。
- **Embla Carousel**：`useScrollFadeMask` + `WheelGesturesPlugin` 实现带淡出的水平滚动。
- **Match Detail**：`Chips`（render prop + resetKey）、`Filters`（自动滚动选中标签）、`BetItem`（响应式折叠面板）。
