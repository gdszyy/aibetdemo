# 全局 Stores、Hooks、Utils、Constants 与 Libs 参考文档

> 本文档记录 `src/` 下全局共享的状态管理、Hooks、工具函数、常量与库模块。模块级私有代码（`_hooks/`、`_utils/` 等）不在此范围内。

---

## 1. Stores (`src/stores/`)

全局状态管理层，使用 Zustand。8 个 Store。

### 1.1 shared-socket-store.ts

WebSocket 连接管理 Store。多标签页共享（BroadcastChannel + Leader Election），仅 leader 标签页持有真实 WS 连接。

| 状态 | 说明 |
|------|------|
| `sharedSocket` | `SharedWebSocket` 全局实例 |
| `isConnected` | 是否已连接（每秒轮询更新） |
| `isLeader` | 当前标签页是否为 leader |
| `connectionError` | 连接错误信息 |
| `handlers` | `Map<number, Set<MessageHandler>>` 命令→处理器映射 |

| 方法 | 说明 |
|------|------|
| `connect(url)` | 连接 WS 并启动状态轮询（1s） |
| `disconnect()` | 断开连接并清理定时器 |
| `send(cmd, data?)` | 发送二进制消息 |
| `dispatchSimulatedMessage(msg)` | 模拟消息分发（测试/回放） |
| `on(cmd, handler)` | 监听指定 cmd，返回取消函数 |
| `off(cmd, handler?)` | 移除监听 |
| `subscribeGame(eventIds)` | 订阅比赛推送 |
| `unsubscribeGame(eventIds)` | 取消订阅 |

- 开发环境暴露 `window.__SOCKET_STORE__` 用于控制台调试

### 1.2 alive-store.ts

产品可用性状态。由 WS `CMD_ALIVE` 消息驱动更新。

| 状态 | 说明 |
|------|------|
| `aliveMap` | `Record<string, boolean>`，初始 `{ Live: true, PreMatch: true }` |

| 方法 | 说明 |
|------|------|
| `setAlive(product, alive)` | 更新指定产品的可用状态 |

### 1.3 ui-store.ts

全局 UI 开关状态。

| 状态 | 控制方法 |
|------|---------|
| `loginModalOpen` | `openLoginModal()` / `closeLoginModal()` |
| `betSlipDrawerOpen` | `openBetSlipDrawer()` / `closeBetSlipDrawer()` / `toggleBetSlipDrawer()` |
| `addAccountModalOpen` | `openAddAccountModal()` / `closeAddAccountModal()` |
| `languageModalOpen` | `openLanguageModal()` / `closeLanguageModal()` |
| `sidebarCollapsed` | `toggleSidebar()` / `setSidebarCollapsed(collapsed)` |

### 1.4 region-store.ts

区域管理 Store（持久化到 localStorage `app-region`）。

| 状态 | 说明 |
|------|------|
| `regionCode` | 当前区域代码（`RegionCode`） |
| `config` | 当前区域配置（`RegionConfig`：phoneCode, phonePattern, idType 等） |

| 方法 | 说明 |
|------|------|
| `setRegion(code)` | 按代码设置区域 |
| `setRegionFromPhone(phone)` | 从完整手机号推断区域（如 `"+5511987654321"`） |

- **SSR 安全**：`skipHydration: true`，延迟到 `useEffect` 水合，避免服务端/客户端不一致
- **仅持久化 `regionCode`**：config 在恢复时从 registry 重新计算
- **便捷 Hooks**：`useRegionConfig()`, `useRegionCode()`

### 1.5 session-store.ts

用户会话管理（类 next-auth 语义）。

| 状态 | 说明 |
|------|------|
| `data` | `Session \| null`（含 `user: LoginUser`、`accessToken`） |
| `status` | `Authenticated \| Unauthenticated \| Loading` |

| 方法 | 说明 |
|------|------|
| `initialize()` | localStorage 恢复缓存 → `CheckLogin` API → `GetProfile` 刷新 |
| `signIn(token)` | 存 token → 预获取 profile → `window.location.reload()` 全页面刷新 |
| `signOut()` | 清 localStorage → `window.location.reload()` 全页面刷新 |
| `refreshToken(token)` | 静默更新 localStorage 中的 token（后端 header 轮换） |
| `clearSession()` | 清空会话状态，**不重载页面**（token 过期/系统踢出） |
| `update()` | 获取最新 profile 并更新 Store（节流 2s，去重 pending promise） |

- **便捷 Hooks**：`useSession()`, `useUser()`, `useIsLogin()`
- **非 React 工具**：`getSessionToken()` 从 localStorage 同步读取

### 1.6 slip-settings-store.ts

投注设置 Store（持久化到 localStorage `slip-settings`）。

| 状态 | 说明 |
|------|------|
| `oddsFormat` | 赔率格式：`decimal` / `american` / `fractional` |
| `oddsChangePolicy` | 赔率变动策略（`OddsChangePolicy` 枚举） |
| `quickBuyAmounts` | 快速投注金额列表（默认 `[10, 50, 100]`），同时用于全部投注快捷金额 |
| `hasCustomizedQuickBuyAmounts` | 用户是否自定义过快速投注金额 |
| `quickBuyGuideDismissed` | 快速投注引导是否已关闭 |
| `isSettingsOpen` | 设置面板是否打开 |
| `focusedSettingsSection` | 当前聚焦的设置区域 |
| `settingsFocusRequestNonce` | 聚焦请求 nonce（触发滚动/高亮） |

- **便捷 Hook**：`useOddsFormat()`

### 1.7 app-info-store.ts

应用信息 Store（非持久化）。

| 状态 | 说明 |
|------|------|
| `appInfo` | `AppInfo \| null`，含 `match_status` 映射（状态码 → 状态文案） |

| 方法 | 说明 |
|------|------|
| `setAppInfo(appInfo)` | 设置应用信息 |

- **便捷 Hook**：`useMatchStatusStr(status, defaultStr)` — 根据状态码返回对应文案

### 1.8 timezone-store.ts

时区 Store（持久化到 localStorage `app-timezone` + Cookie `app-timezone` 365 天）。

| 状态 | 说明 |
|------|------|
| `timezone` | IANA 时区字符串，初始值由 `getBrowserTimezone()` 检测 |

| 方法 | 说明 |
|------|------|
| `setTimezone(tz)` | 设置时区并写入 Cookie |

---

## 2. Hooks (`src/hooks/`) — 21 个

### 2.1 use-wallet.ts（Zustand Store）

钱包与货币管理。虽然在 `hooks/` 目录，但本质是一个 Zustand Store。

| 状态 | 说明 |
|------|------|
| `currency` | 当前登录用户缓存的货币（`Currency \| null`）；初始从 localStorage 同步读取避免符号闪烁 |
| `totalBalance` | 总余额（主钱包 + 奖金） |
| `mainBalance` | 主钱包余额（可提现） |
| `sportBonus` | 体育奖金 |
| `casinoBonus` | 赌场奖金 |
| `freeSpin` | 免费旋转 |
| `freeSport` | 免费体育 |

| 方法 | 说明 |
|------|------|
| `dispatchCurrency()` | 根据登录状态和区域获取默认货币；未登录时回退到区域默认币种 |
| `setCurrency(currency)` | 手动设置登录用户货币缓存 |
| `dispatchBalance()` | 获取余额（节流 2s，去重 pending promise） |

- **便捷 Hooks**：`useCurrencyCode()` → `CurrencyCode`（登录用户优先，游客回退到 `regionConfig.currencyCode`），`useCurrencySymbol()` → 当前币种符号，`useCurrencyId()` → `number`

### 2.2 use-socket-listener.ts

双层事件系统的核心。

**WS 层**：`useSocketListener(cmd, callback)` — 监听指定 WS 命令，组件卸载自动取消订阅。

**应用层**（Observer 模式）：
- `EventObserver` 类 — `subscribe(event, listener)` / `notify(event, data)` / `clear()` / `clearEvent(event)` / `getListenerCount(event)`
- `globalEventObserver` — 全局单例实例
- `useEventObserver(event, handler)` — React Hook，监听应用级事件
- `useEventEmitter()` — 返回 `{ emit }` 函数，触发应用级事件

### 2.3 use-bet-observer.ts

WS 比赛事件监听与分发。将底层 WS 命令转发为 `globalEventObserver` 事件：

| WS 命令 | 分发事件 |
|---------|---------|
| `CMD_ODDS_CHANGE` | `OddsChangeEvent.getUpdateEventName(event_id)` |
| `CMD_LIVE_SCORE` | `LiveScoreEvent.getUpdateEventName(event_id)` |
| `CMD_FIXTURE_CHANGE` | `FixtureEvent.getUpdateEventName(event_id)` 或 `FixtureEvent.getUpdateEvent()` |
| `CMD_BET_CANCEL` | `BetCancelEvent.getUpdateEventName(event_id)` |
| `CMD_MATCH_STATUS` | `MatchStatusEvent.getUpdateEventName(sport_event_id)` |
| `CMD_ALIVE` | 更新 `aliveStore` + `AliveEvent.getUpdateEventName()` |
| `CMD_ORDER_PLACED_STATUS` | `OrderPlacedStatusEvent.getUpdateEventName()` |

### 2.4 use-media-query.ts

响应式断点检测。基于 `useSyncExternalStore` + `window.matchMedia`。

| Hook | 断点 | SSR 回退 |
|------|------|---------|
| `useMediaQuery(query)` | 自定义查询 | `false` |
| `useIsMobile()` | `max-width: 767px` | `false` |
| `useIsTablet()` | `768px ~ 1023px` | `false` |
| `useIsDesktop()` | `min-width: 1024px` | `false` |

### 2.5 use-infinite-scroll.ts

基于 IntersectionObserver 的无限滚动。

```typescript
const { sentinelRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin? });
// 将 sentinelRef 绑定到列表底部的哨兵元素
```

- 自动处理"首页未填满容器"的边界情况（onScroll 无法处理的场景）
- 默认 `rootMargin: '200px'`（提前 200px 触发）

### 2.6 use-wallet-sync.ts

钱包余额 SSE 同步。

- 监听 `sse:balance_update` 事件，直接更新 Wallet Store（绕过 API 节流）
- 页面可见性变化时调用 `dispatchBalance()` 刷新（用 `visibilitychange` 事件）
- 仅登录后激活

### 2.7 use-sse-connection.ts

SSE 连接生命周期管理。

- 登录后连接 `NEXT_PUBLIC_SSE_SERVICE`，登出后断开
- 将所有 SSE 消息路由到 `globalEventObserver`，事件名格式：`sse:{eventName}`
- 使用 `SSEClient`（支持多标签页一致性）

### 2.8 use-intl-formatter.ts

国际化格式化 Hook。自动注入当前 `useRegionIntlLocale()`、`useTimeZone()`、`useCurrencyCode()`。

| 返回方法 | 说明 |
|---------|------|
| `formatCurrency(value)` | 货币格式化 |
| `currencySymbol` | 当前货币符号（内部复用 `useCurrencySymbol()`） |
| `formatNumber(value)` | 数字格式化 |
| `formatDatetime(date)` | 日期+时间 |
| `formatFullDatetime(date)` | 完整日期时间 YYYY-MM-DD HH:mm:ss |
| `formatDate(date)` | 仅日期 |
| `formatRelativeDate(date)` | 相对日期（今天/明天） |
| `formatTime(date)` | 时间 |
| `formatShortTime(date)` | 短时间 HH:mm |
| `formatShortDate(date)` | 短日期 如 Jan 14 |
| `formatRelativeShortDate(date)` | 相对短日期 |
| `formatRelativeDatetime(date)` | 相对日期时间 |
| `formatRelativeFullDatetime(date)` | 相对完整日期时间 |
| `formatList(list)` | 列表格式化 |
| `formatCompactAmount(value)` | 紧凑金额（自动缩写：1M, 1B） |
| `decimalSeparator` | 当前 locale 的小数分隔符 |

### 2.9 use-logout.ts

登出流程 Hook。封装 API 调用 + 会话清空 + Toast + 确认弹窗。

```typescript
const { logout, logoutConfirmProps } = useLogout();
// logout(callback) 打开确认弹窗
// logoutConfirmProps 传给确认弹窗组件
```

### 2.10 use-analytics-tracker.ts

全局分析追踪 Hook。

- 页面加载时持久化 URL 归因参数（`ch`, `clickid`）
- 路由变化时发送 `HomePageView` 和 `PageLoadView` 事件（去重 1s 窗口）
- 会话参与追踪：10s 定时器 + 用户交互事件（pointerdown, keydown, scroll, touchstart），每天每渠道仅发送一次
- 忽略页面刷新（F5）

### 2.11 use-weak-network-detect.ts

弱网检测。使用 `ahooks` 的 `useNetwork`。

- 一次性检测：组件挂载时检测一次，显示 Toast
- 检测条件：离线 / saveData / 2G/slow-2G / 高 RTT(>=600ms) / 低 downlink(<1.0) 中满足 2 项以上
- 隐藏标签页不触发

### 2.12 use-detect-keyboard-open.ts

移动端虚拟键盘检测。通过 `window.visualViewport` 的 `resize` 事件判断。

```typescript
const isKeyboardOpen = useDetectKeyboardOpen(minKeyboardHeight?, defaultValue?);
```

### 2.13 use-text-overflow.ts

文本溢出检测。

```typescript
const { ref, check } = useTextOverflow<HTMLSpanElement>({ lines? });
// ref 绑定元素，check() 返回是否溢出
```

- 单行：比较 Range 宽度 + padding 与可用宽度
- 多行：比较 scrollHeight 与 clientHeight

### 2.14 use-scroll-fade-mask.ts

Embla 滚动淡出遮罩。

```typescript
const { canScrollPrev, canScrollNext, maskImage } = useScrollFadeMask(emblaApi, fadeWidth?);
```

- 根据滚动方向生成 `mask-image` CSS 渐变
- 默认淡出宽度 48px

### 2.15 use-kyc-state.ts

KYC 状态菜单过滤。

```typescript
const { getMenu } = useKycState();
const actualMenu = getMenu(originalMenu); // 未 KYC 时返回 KYC 菜单
```

- 对存款、提款、健康设置菜单，若用户未通过 KYC 则重定向到 KYC 页面

### 2.16 use-account-navigator.ts

账户页面路由导航。

```typescript
const navigator = useAccountNavigator(); // 返回 AccountNavigatorStrategy
navigator.open(UserCenterMenu.DEPOSIT, options?);
```

- 内部使用 `RouteAccountNavigator`，通过 `router.push()` 导航

### 2.17 use-password-setting-check.ts

密码设置状态查询。基于 React Query。

```typescript
const result = usePasswordSettingCheck();
// result[PasswordType.User]: PasswordSetupMode (Undefined/First/Reset)
// result[PasswordType.Wallet]: PasswordSetupMode
```

### 2.18 use-app-info.ts

应用信息初始化 Hook。

- 挂载时调用 `GetAppInfoInterface`，更新 `appInfoStore`
- 错误上报到 Sentry

### 2.19 use-query-cache-clear.ts

React Query 缓存清空。

```typescript
const { clearQueriesCache } = useQueryCacheClear();
```

### 2.20 use-currency-limit.ts

货币存取限额查询。基于 React Query（5min staleTime）。

```typescript
const { min, max } = useCurrencyLimit('deposit'); // 或 'withdraw'
```

- 默认值：min=5, max=50000

### 2.21 use-report-analytics.ts

分析事件上报。基于 React Query `useMutation`。

```typescript
const { mutate } = useReportAnalytics();
mutate(payload);
```

---

## 3. Utils (`src/utils/`)

纯工具函数层，无状态依赖。

### 3.1 common.ts

| 导出 | 说明 |
|------|------|
| `cn(...inputs)` | `clsx` + `tailwind-merge`（含项目自定义 token 注册） |
| `isNullish(value)` | 判断 `null \| undefined`，类型守卫 |
| `delay(ms)` | Promise 延迟 |

- `extendTailwindMerge` 注册了所有自定义 `text-*` font-size 和 text-color token，防止 merge 冲突

### 3.2 error.ts

错误体系与上报。

| 类 | 说明 |
|----|------|
| `AppError` | 基类。含 `level`, `extra`, `tags` |
| `ApiError` extends `AppError` | API 错误。含 `context: { url, method, status, statusText, code, traceId, params, response }` |
| `NetworkError` extends `ApiError` | 网络/HTTP 错误 |
| `ForbiddenError` extends `ApiError` | 业务禁止错误（默认 level: warning） |
| `ValidationError` extends `AppError` | Zod/Schema 校验错误。含 `context: { label, errors, data }` |

| 函数 | 说明 |
|------|------|
| `reportError(error, options?)` | 上报到 Sentry。自动去重（`_reported` 属性标记），AppError 自带 tags/extra |

### 3.3 intl-formatter.ts

国际化格式化函数集。基于 `Intl` API。

15+ 导出函数：`formatCurrency`, `formatNumber`, `formatDatetime`, `formatFullDatetime`, `formatDate`, `formatRelativeDate`, `formatTime`, `formatShortTime`, `formatShortDate`, `formatRelativeShortDate`, `formatRelativeDatetime`, `formatRelativeFullDatetime`, `formatList`, `formatCompactAmount`, `getCurrencySymbol`, `getDecimalSeparator`

- 所有函数接受 `locale` + `timezone` 参数，确保一致性
- 相对日期支持"今天"/"明天"本地化标签

### 3.4 odds-format.ts

赔率格式转换。

| 导出 | 说明 |
|------|------|
| `OddsFormat` | 类型：`'decimal' \| 'american' \| 'fractional'` |
| `MAX_DISPLAY_ODDS` | 最大显示赔率 `999999.99` |
| `decimalToAmerican(decimal)` | 十进制 → 美式（如 `1.50` → `"-200"`，`2.75` → `"+175"`） |
| `decimalToFractional(decimal)` | 十进制 → 分数式（如 `1.50` → `"1/2"`） |
| `formatOddsByFormat(odds, format)` | 按指定格式格式化赔率 |
| `getFullOddsByFormat(odds, format)` | Tooltip 用高精度格式化（decimal 最多 6 位小数） |
| `hasOddsExtraPrecision(odds)` | 判断原始赔率是否有超过 2 位的额外精度 |

### 3.5 specifier.ts

投注选项比较。

| 函数 | 说明 |
|------|------|
| `isSameLine(a, b)` | 判断两个 `OddsEntity` 是否同一盘口（eventId + marketId + productId + specifiers） |
| `isSameSelection(a, b)` | 判断是否同一选项（同一盘口 + outcome.id 相同） |

### 3.6 selection-limit.ts

投注选项数量限制检查。

| 函数 | 说明 |
|------|------|
| `checkParlaySelectionLimit(count)` | 串关模式限制检查 |
| `checkSingleSelectionLimit(count)` | 单关模式限制检查 |
| `checkSelectionLimit(count, betMode)` | 根据 betMode 自动选择检查 |

- 返回 `{ canAdd, shouldWarn, maxLimit }`

### 3.7 analytics.ts

分析归因与去重。

| 函数 | 说明 |
|------|------|
| `persistAnalyticsAttribution(searchParams)` | 从 URL 持久化归因参数（ch, clickid/ttclid/click_id） |
| `persistAnalyticsAttributionFromLocation()` | 从 `window.location` 捕获归因 |
| `readAnalyticsAttribution()` | 读取持久化的归因数据 |
| `getRegistrationAttributionPayload()` | 生成注册 API 所需的归因负载 |
| `buildAnalyticsPayload(event, context)` | 构建上报 API 负载 |
| `markPageAnalyticsEventSent(event, context)` | 页面级事件去重（1s 窗口，sessionStorage） |
| `markSessionEngagementSent(channel)` | 会话参与去重（每天每渠道一次） |
| `clearAnalyticsAfterRegistration()` | 注册后清空归因缓存并清理 URL 参数 |
| `isPageReload()` | 检测页面是否为刷新加载 |

### 3.8 sentry.ts

Sentry 敏感数据清理与事件过滤。

| 函数 | 说明 |
|------|------|
| `sanitizeForSentry(value, key?, depth?)` | 递归清理敏感字段（depth=4, array=10, string=300）。敏感 key 包含 authorization/token/password/phone/email/bank/card/kyc 等 |
| `sanitizeUrl(url)` | URL query 参数全部替换为 `[REDACTED]` |
| `sanitizeTags(tags)` | 标签中敏感 key 值替换 |
| `getSharedSentryOptions()` | 共享 Sentry 配置（`beforeSend` 过滤噪声事件、注入钱包扩展、浏览器扩展错误） |
| `shouldReportHttpStatus(status)` | 仅上报 5xx 和 429 |

- 过滤的噪声：`ResizeObserver loop`、`extension context invalidated`、`AbortError`、MetaMask 相关

### 3.9 fly-energy-ball-bezier.ts

能量球飞行动画。投注添加到购物车时的视觉反馈。

- 四阶段动画：pop（膨胀出现） → wait（悬停） → flight（贝塞尔曲线飞行） → burst（到达目标粒子爆炸）
- 尊重 `prefers-reduced-motion`
- `ACTIVE_FLIGHTS` Map 管理并发动画实例
- Portal 渲染，z-index=65

### 3.10 betslip-switch-feedback.ts

3D 翻牌动画。投注选项切换时的视觉反馈。

- 五阶段：slide-in → flip-in → hold → flip-out → slide-out
- 支持 `right` / `left` / `top` 方向
- `ACTIVE_FLIPS` Map 管理，同一 selectionId 复用/更新

### 3.11 dom.ts

DOM 工具函数。

| 函数 | 说明 |
|------|------|
| `prefersReducedMotion()` | 检测用户是否偏好减少动画 |
| `clamp(n, min, max)` | 数值钳制 |
| `getCenter(el)` | 获取元素中心点坐标 |
| `getPortalContainer(id?)` | 安全获取 Portal 容器元素（默认 `DomIdEnum.ModalContainer`） |

### 3.12 timezone.ts

时区工具。

| 函数 | 说明 |
|------|------|
| `getTimezoneOffsetMinutes(timezone)` | 获取 UTC 偏移分钟数 |
| `formatTimezoneDisplay(timezone)` | 格式化显示如 `(GMT+8) China Standard Time` |
| `getBrowserTimezone()` | 检测浏览器时区，自动将 `Etc/GMT-X` 转换为地理时区 |

### 3.13 url-params.ts

URL 查询参数更新。

```typescript
updateQueryParams(params, router, pathname, searchParams, method?)
```

- 非空值 set，空值 delete，保留未提及的参数
- 支持 `push` / `replace`（默认 replace）

### 3.14 verifies.ts

数据校验。

| 函数 | 说明 |
|------|------|
| `CPFVerify(raw)` | 巴西 CPF 号码校验（格式 + 校验位） |
| `pwdVerify(pwd)` | 密码强度校验：8-20 位，字母+数字+特殊字符。返回 `{ len, letter, number, specialChar, result }` |

### 3.15 time.ts

时间格式化。

| 导出 | 说明 |
|------|------|
| `DATE_FULL` | `'YYYY-MM-DD'` |
| `DATETIME_FULL` | `'YYYY-MM-DD HH:mm:ss'` |
| `DATE_MINUTE_FULL` | `'YYYY-MM-DD HH:mm'` |
| `TIME_FULL` | `'HH:mm:ss'` |
| `MINUTE_FULL` | `'HH:mm'` |
| `formatSeconds(seconds, format?)` | dayjs.duration 格式化秒数（默认 `mm:ss`） |
| `secondsToMinutes(seconds)` | 秒转分钟（补零 2 位） |

### 3.16 WebSocket (`websocket/`)

#### websocket/shared-web-socket.ts

多标签页共享 WS 核心实现。

- **Leader Election**：使用 `broadcast-channel` 库的 `createLeaderElection`，仅 leader 持有真实 WS 连接
- **BroadcastChannel**：leader 将收到的消息广播给所有标签页
- **心跳**：30s 发送 PING，60s 读超时
- **重连**：指数退避 500ms → 30s，最多 20 次
- **订阅协调**：30s 周期对账，200ms sync-response 窗口
- **消息类型**：message / connection / send / disconnect / game-subscribe / game-sync-request / game-sync-response

#### websocket/helper.ts

WS 消息编解码。

- **二进制协议格式**：`cmd(4字节 uint32 LE) + time(8字节 uint64 LE) + data(变长)`
- **IMessage 接口**：`{ cmd, time, data: Uint8Array, text?: string, json?: unknown }`
- `packMessage(cmd, time, data?)` — 编码
- `unpackMessage(binaryData)` — 解码，自动尝试 UTF-8 解码 + JSON 解析

#### websocket/ws-logger.ts

WS 日志记录器。

- 10000 条环形缓冲
- 开发环境默认启用
- `window.__WS_LOGGER__` 暴露到全局
- 方法：`log(msg)`, `dump(eventId?)`, `download(eventId?)`, `clear()`

### 3.17 SSE (`sse/`)

#### sse/sse-client.ts

SSE 客户端（基于 `@microsoft/fetch-event-source`）。

- **多标签页一致性**：活跃标签页持有连接，隐藏标签页通过 BroadcastChannel 接收消息
- **所有权切换**：标签页可见时发送 `takeover` 广播夺取连接
- **自动重连**：默认启用（`autoReconnect: true`）
- **认证**：Bearer token，401/403 时永久断开
- 状态：`_isDirectlyConnected`（本标签页直连）、`_logicalConnected`（任意标签页连接，UI 用）

---

## 4. Constants (`src/constants/`)

### 4.1 index.ts

全局常量。

| 导出 | 说明 |
|------|------|
| `StorageEnum` | localStorage key 枚举：`UserToken`, `UserInfo`, `PostLogin`, `PostLoginAutoOpenBetSlip`, `UserCurrency`, `AnalyticsAttribution` |
| `DomIdEnum` | DOM ID 枚举：`AppContainer`, `ModalContainer`, `ToastContainer` |
| `ERROR_CODE` | API 错误码：`TOKEN_EXPIRED_SILENT (1000)`, `TOKEN_EXPIRED_WITH_MESSAGE (1001)` |
| `INVARIANT_LOCALE` | 内部格式化用固定 locale `'en-US'`（保证一致输出，非面向用户） |
| `APP_NAME` | 应用名称（来自 `NEXT_PUBLIC_APP_NAME`，默认 `'GOTOBET'`） |

### 4.2 account-routes.ts

账户路由配置。

| 导出 | 说明 |
|------|------|
| `AccountRouteConfig` | 接口：`{ menu, path, titleKey, icon, kycRequired?, group }` |
| `ACCOUNT_ROUTES` | 路由配置数组（11 项）：Deposit, Withdraw, KYC, Transactions, Security, Gambling, Affiliate, Settings, Support, Notifications, FAQ |
| `ACCOUNT_PREFIXES` | 所有路由前缀数组 |
| `getAccountPath(menu)` | 菜单枚举 → 路由路径 |
| `getVisibleAccountRoutes(kycStatus?)` | 按 KYC 状态过滤可见路由（已验证用户隐藏 KYC 入口） |

- KYC 必需路由：Deposit, Withdraw, Gambling

### 4.3 query-keys.ts

类型安全的 React Query Key 生成器。

| 导出 | 说明 |
|------|------|
| `ModuleKeys` | 模块枚举：WITHDRAW, SECURITY_CENTER, MERCHANT, CART, ORDER, HEALTH_SETTING, MATCH_FOOTBALL, MATCH_BASKETBALL |
| `*Actions` | 各模块操作枚举 |
| `generateQueryKey<TModule, TAction, TParams>(module, action, params?)` | 生成 `[module, action, JSON.stringify(params)]` 三元组 |

- 模块与操作之间有类型映射约束（`ModuleActionMap`）

### 4.4 sports-config.ts

运动图标配置。

| 导出 | 说明 |
|------|------|
| `SPORT_ICON_MAP` | `Record<string, SportIconConfig>`，sport_id → `{ icon, activeIcon }` 映射（18 项运动） |
| `getSportConfig(name?, id?)` | 按 ID 查找运动图标配置 |

- 覆盖运动：足球、篮球、棒球、冰球、网球、橄榄球、乒乓球、板球、排球、CS:GO、Dota、MMA、羽毛球、飞镖、五人制足球、手球、斯诺克、澳式橄榄球

### 4.5 ui.ts

UI 布局常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `HEADER_HEIGHT_MOBILE` | 56 | 移动端导航栏高度 |
| `HEADER_HEIGHT_DESKTOP` | 72 | 桌面端导航栏高度 |
| `STICKY_TOP_CLASS` | `'top-14 lg:top-[calc(72px+var(--header-strip-height))]'` | 粘性定位 top 偏移 class |

### 4.6 user-center.ts

用户中心菜单枚举。

| 导出 | 说明 |
|------|------|
| `UserCenterMenu` | 12 项枚举：UNDEFINED(0), DEPOSIT(1), WITHDRAW(2), KYC(3), SECURITY_CENTER(4), AFFILIATE(5), TRANSACTION(6), HEALTH(7), SETTING(8), SUPPORT(9), NOTIFICATION(10), FAQ(11), LOGOUT(12) |
| `UserCenterSourceEnum` | 来源枚举：`PlaceBet` |
| `MENU_SUBTITLE_KEYS` | 菜单项副标题 i18n key 映射 |

### 4.7 security.ts

安全相关枚举。

| 导出 | 说明 |
|------|------|
| `PasswordType` | `User \| Wallet` |
| `PasswordSetupMode` | `Undefined \| First \| Reset` |

---

## 5. Libs (`src/libs/`)

第三方集成与跨模块库。

### 5.1 navigation.ts

路由判断工具。

| 导出 | 说明 |
|------|------|
| `SPORTS_PREFIXES` | `['/sports', '/matches', '/leagues', '/legal']` |
| `CASINO_PREFIXES` | `['/casino']` |
| `checkIsSportsActive(pathname)` | 判断体育页面是否激活（含首页，排除 `/sports-live`） |
| `checkIsSportsLiveActive(pathname)` | 判断实时体育页面是否激活 |
| `checkIsCasinoActive(pathname)` | 判断赌场页面是否激活 |
| `checkIsAccountRoute(pathname)` | 判断是否为账户路由 |
| `checkHasSidebar(pathname)` | 判断当前路由是否需要侧边栏 |
| `getSidebarType(pathname)` | 返回侧边栏类型：`'sports' \| 'casino' \| 'account'` |

### 5.2 event-constants.ts

事件总线常量。

**事件名工厂**：

| 对象 | 说明 |
|------|------|
| `BaseEvent` | 基础工厂：`getEventName(...args)` 用 `=>` 连接，`getUpdateEventName(target, key)`, `getUpdateEvent(target)` |
| `OddsChangeEvent` | 赔率变动事件 |
| `LiveScoreEvent` | 实时比分事件 |
| `FixtureEvent` | 赛程变动事件（支持全局广播和按 matchId） |
| `BetCancelEvent` | 投注取消事件 |
| `MatchStatusEvent` | 比赛状态变更事件 |
| `AliveEvent` | 可用性事件 |
| `OrderPlacedStatusEvent` | 下单状态事件 |

**WS CMD 常量**：

| 常量 | 值 | 说明 |
|------|-----|------|
| `CMD_PING / CMD_PONG` | 100 | 心跳 |
| `CMD_AUTH` | 110 | 认证 |
| `CMD_LANG` | 120 | 语言 |
| `CMD_ALIVE` | 10000 | 可用性 |
| `CMD_FIXTURE_CHANGE` | 10010 | 赛程变动 |
| `CMD_ODDS_CHANGE` | 10020 | 赔率变动 |
| `CMD_BET_CANCEL` | 10050 | 投注取消 |
| `CMD_MATCH_STATUS` | 10060 | 比赛状态 |
| `CMD_ORDER_PLACED_STATUS` | 10070 | 下单状态 |
| `CMD_SUBSCRIBE_GAME` | 10080 | 订阅比赛 |
| `CMD_UNSUBSCRIBE_GAME` | 10090 | 取消订阅 |
| `CMD_LIVE_SCORE` | 10100 | 实时比分 |

### 5.3 firebase.ts

Firebase 延迟初始化。

| 函数 | 说明 |
|------|------|
| `getFirebaseApp()` | 延迟初始化 Firebase App（仅生产环境 + 客户端） |
| `getFirebaseAnalytics()` | 延迟初始化 Firebase Analytics（仅生产环境 + 支持检测） |

### 5.4 open-telemetry.ts

OpenTelemetry 追踪。

| 函数 | 说明 |
|------|------|
| `generateTraceHeaders()` | 生成标准 `traceparent` header（`00-{traceId}-{spanId}-00`） |

- trace-id: 16 字节随机 hex，span-id: 8 字节随机 hex

### 5.5 account-navigator.ts

账户导航策略。

| 导出 | 说明 |
|------|------|
| `AccountNavigatorStrategy` | 接口：`open(menu, options?)`, `close()` |
| `RouteAccountNavigator` | 路由策略实现：通过 `router.push()` 导航 |
| `navigateToAccount(menu, options?)` | 非 React 上下文中的账户导航（直接 `window.location`） |
| `buildAccountUrl(menu, options?)` | 构建账户 URL（支持 `source` 和 `tab` 查询参数） |

### 5.6 image.ts

图片优化工具。

| 函数 | 说明 |
|------|------|
| `getOptimizedWidth(widthSize)` | Tailwind 宽度 size 转像素（`size * 4px`） |
