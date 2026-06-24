---
trigger: always_on
description: 前端架构 — 核心机制、样式令牌、状态管理、响应式模式
---

# 前端架构

## 1. 系统架构

```
UI 层 (React 19) → 状态层 (Zustand + React Query + URL Params) → 数据层 (API + WS + SSE) → 持久层 (localStorage + IndexedDB + Cookies)
```

数据流：`WS Binary → SharedWebSocket (Leader Tab) → BroadcastChannel → useSocketListener → EventObserver → React Query / Zustand → UI`

## 2. 状态管理

| 类别 | 方案 | 位置 |
|------|------|------|
| 服务端状态 | React Query | 所有 API 数据优先使用 |
| 全局状态 | Zustand | `src/stores/`（session, appInfo, slipSettings, timezone, alive, ui, sharedSocket, region） |
| 模块状态 | Zustand | `src/modules/*/stores/` |
| URL 状态 | URLSearchParams | 筛选、视图模式 |
| 持久化 | localStorage / IndexedDB (Dexie) | — |

### 关键 Store

- **Match 模型**：`event_id` 作为主标识符，`event_id_type` 用于事件识别，`sport_code: SportCode` 枚举用于运动类型。`odds_timestamp` 用于新鲜度守卫。`live_market_total` 用于卡片 "+N 个市场"。URL 参数保持 `[match_id]`。
- **sessionStore**：`signIn`/`signOut` → 重载。`refreshToken` → 静默更新。`clearSession` → 不重载。`update()` → 节流 2s。Hooks：`useSession`、`useUser`、`useIsLogin`；工具函数：`getSessionToken()`。
- **uiStore**：loginModalOpen、betSlipDrawerOpen、addAccountModalOpen、languageModalOpen、sidebarCollapsed（用户中心弹窗字段已移除 — 账户现为路由化）
- **regionStore**（持久化）：`regionCode`、`config`（区域配置）。`setRegion(code)`、`setRegionFromPhone(phone)`（从电话号推断区域）。Hooks：`useRegionConfig()`、`useRegionCode()`。
- **slipSettingsStore**（持久化）：赔率格式、赔率变化策略、快速投注金额（同时用于全部投注快捷金额）。
- **timezoneStore**（持久化）：`timezone`（IANA 时区），自动检测浏览器时区，持久化到 Cookie。
- **walletStore**（`useWallet`）：各类余额（mainBalance、sportBonus、casinoBonus、freeSpin 等）+ 货币缓存。当前币种优先通过 `useCurrencyCode()` / `useCurrencySymbol()` 获取，`currencyCode` 仅作兼容存储。`dispatchBalance()` 节流 2s。
- **sharedSocketStore**：WebSocket 连接状态、消息处理器、订阅管理。

## 3. 设计模式

优先使用已建立的模式（同时考虑 OOP 原则）：

- **受控组件**：父组件拥有状态，通过 props 传递。不要让兄弟组件各自从 hooks 独立获取。
- **策略模式**：配置对象映射 type → behavior（如 `SPORT_ITEM_STYLES`、`STATUS_CONFIG`、`ACCOUNT_ROUTES`、`CATEGORY_CONFIG`）。
- **观察者模式**：`globalEventObserver.subscribe`。优先于轮询/prop drilling。
- **工厂模式**：集中化对象构建。示例：`odds-factory.ts`。
- **共享校验**：提取纯函数。示例：`isSelectionInvalid()`。
- **DataLoader 模式**：N+1 → 自动批处理。`src/api/loaders/` — match（批量计数）+ player（批量名称），50ms 窗口 + React Query 缓存。
- **Slice 模式**：复杂 Zustand store 拆分为可组合的 slices（`ListSlice & ItemSlice & SyncSlice`）。
- **分页策略**：`TransactionsV2` 路由切换 `PAGINATION_MODE: 'page' | 'scroll'` — 共享类型/常量在 `*-shared.tsx`，独立实现在 `*-page.tsx` / `*-scroll.tsx`。
- **无限滚动**：`useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })` 位于 `src/hooks/use-infinite-scroll.ts` — 基于 IntersectionObserver 的哨兵 ref。将 `ref={sentinelRef}` 附加到列表末尾的 `<div />`。用于投注单票据、交易列表、通知、侧边栏项。
- **适配器模式**：`bet-history-adapter.ts`、`transfer-order-adapter.ts` — API 响应适配。

## 4. 关键机制

> 子系统详情（Casino 游戏详情、Sentry、SSE、游戏订阅、OddsUpdateProcessor、移动端 Sport Strip、促销、WS 观察器、购物车同步、投注单异常、其他组件）：`.agent/references/frontend-subsystem-details.md` — 处理对应模块时阅读。

### 投注单动画工具
- `src/utils/betslip-switch-feedback.ts` — 投注单选择反馈的 3D 翻牌动画
- `src/utils/fly-energy-ball-bezier.ts` — 贝塞尔曲线能量球飞行动画（源 → 目标元素）+ 粒子爆炸
- `src/utils/dom.ts` — 共享 DOM 辅助函数：`prefersReducedMotion()`、`clamp()`、`getCenter()`、`getPortalContainer()`
- 所有动画尊重 `prefers-reduced-motion` 并使用基于 Portal 的 DOM 渲染

### Carousel 组件
- Embla 滚动状态统一通过 `useCarousel(emblaApi)` 获取（`canScrollPrev`、`canScrollNext`、`selectedIndex`、`snapCount`、`scrollPrev`、`scrollNext`、`scrollTo` 等）。业务组件基本不要直接写 `emblaApi.on(...)` 监听。
- 左右渐变遮罩使用 `CarouselMask`。
- 左右按钮使用 `CarouselNavButton`。
- 橙色进度条使用 `CarouselProgress`；灰色进度条使用 `CarouselProgress2`。
- 新增轮播时先组合这些共享组件，再补少量业务布局样式。

### 布局层级
`app/layout.tsx`（根：CSS、字体、providers、portals、ToastProvider）→ `[locale]/layout.tsx`（NextIntlClientProvider、AppShell、NavBar、TimezoneSynchronizer、CartCleanupListener）→ `(main)/layout.tsx`（MainShell：侧边栏 padding、BottomTabBar、LanguageModal）→ `(sports)/` | `(casino)/` | `account/` | `legal/`

- `SportsLayoutClient`：侧边栏 + 内容 + 桌面右侧面板（BetSlipPanel + RightAside，sticky `top-[72px]`）
- `CasinoLayoutClient`：侧边栏 + 内容（无 BetSlip）
- `AccountLayoutClient`：AccountSidebar（固定）+ 内容 + RightAside。认证守卫 → `/` 未登录。KYC 守卫 → `/account/kyc` 对 `kycRequired` 路由。移动端：无侧边栏（`/account` 卡片菜单）
- `MainShell`：移动端 `/account` 隐藏 footer + bottom padding（`hideShellChrome`）
- `AppInitializer`（仅客户端，`ssr: false`）：WS 连接、会话初始化、钱包/货币同步、区域推断

### 错误边界
- **`global-error.tsx`**（根）：替换整个 `<html>/<body>`。仅内联样式。无 React 上下文 — 从 URL 路径提取 locale 用于 "返回首页"。
- **`ModuleErrorBoundary`**：Class 组件包裹易崩溃模块（Sidebar、BetSlipPanel、比赛卡片）。

### SSR 数据获取
- `ssrFetchList<T>()` 位于 `api/lib/ssr-fetch.ts` — 自动 `Number(json.code)`、`Accept-Language`、ISR 300s、空数组兜底。
- `fetchSportsLayoutData(locale)` — 并行获取 `allSports` + `topSports`。体育和法律布局共享。
- `generateMetadata`：使用 `getTranslations()` 获取 i18n 回退标题 — 禁止硬编码英文。

### 窗口滚动架构（重要）

**应用使用原生 window scroll — 不是自定义 div 滚动容器。**

**规则**：禁止将页面内容包裹在 `overflow-y-auto` / `overflow-hidden` + `h-screen` 中。Window scroll 实现：浏览器滚动恢复、Next.js 自动滚动到顶部、移动端地址栏自动隐藏、IntersectionObserver 默认、键盘/无障碍、锚点导航。

**三栏布局**：Sidebar `sticky top-0 h-screen` | NavBar `sticky top-0` 在内容列 | BetSlip `sticky top-[72px] h-[calc(100vh-72px)]` | 内容：自然流 + `@container`。

**`overflow-x: clip` vs `overflow-x: hidden`**：`html`/`body`/`#__root-dom-app-container` 使用 `overflow-x: clip`（不是 `hidden`）。`clip` 防止水平滚动但不创建新的堆叠上下文，保证 `position: sticky` 正常工作。禁止在根元素上改回 `overflow-x: hidden`。

**滚动到顶部**：`(main)/template.tsx` 重新挂载 `ScrollToTopOnNav`。跳过 popstate（前进/后退）和同路由去重。

### ANJ 印章（监管合规）
- **脚本**：ANJ（法国国家博彩监管局）合规印章通过 `next/script` 在 `app/layout.tsx` 中加载
- **挂载**：`AnjSealMount` 客户端组件在 `FooterComplianceStrip` 中 — 挂载时调用 `window.anj_<uuid>.init()`。与其他合规徽章（Gamstop、GambleAware、18+ 等）一起渲染
- **范围**：仅 `(main)/` 路由（不包括 `legal/`）

### 移动端缩放锁定
`MobileZoomLock`（`src/components/mobile-zoom-lock.tsx`）— 阻止触屏设备的双指缩放和双击缩放。挂载在 `root-providers.tsx`。处理：
- `gesturestart/change/end`（Safari WebKit 专属事件）→ `preventDefault`
- `touchmove` + `touches.length > 1` → 阻止双指
- `touchend` 双击检测（300ms 阈值）→ 阻止缩放
Viewport 同时设置 `minimumScale: 1`、`maximumScale: 1`、`userScalable: false`、`viewportFit: 'cover'`。

### 侧边栏架构
`@/components/sidebar/` — 4 层：`sidebar-primitives.tsx`（Radix Sheet + Tooltip + context）→ `sidebar-group.tsx` → `sidebar-item.tsx` → `sidebar-shell.tsx`。Cookie 持久化 `sidebar_state`（7 天）。移动端 → Sheet 弹窗；桌面端 → 固定宽度过渡（60/200px）。用于体育、赌场和账户侧边栏。

### 账户路由
- **真实路由段**：`account/`（不是路由组 — URL 为 `/account/deposit`、`/account/kyc` 等）
- **布局**：`AccountLayoutClient`（认证守卫 + KYC 守卫，固定侧边栏 `top-[72px]` 宽度切换 60/200px，RightAside）。KYC 守卫读取 `ACCOUNT_ROUTES.kycRequired` 并将未验证用户重定向到 `/account/kyc`。
- **路由配置**：`ACCOUNT_ROUTES` 位于 `@/constants/account-routes.ts` — 策略模式：`AccountRouteConfig[]` 含 `menu`、`path`、`titleKey`、`icon`、`kycRequired`、`group`
- **页面壳**：`AccountPageShell` — 桌面端：粉色渐变头部 + 红色标题 + 可选双栏布局。移动端：紧凑头部 + 返回箭头 + 居中标题 + 全高 min-h。移动端所有账户路由隐藏 NavigationBar。
- **侧边栏**：`AccountSidebar` 包裹 `SidebarShell`，菜单项来自 `ACCOUNT_ROUTES`，红色左边框激活指示器，登出按钮
- **移动端**：`/account` 渲染 `AccountMenuClient`（按类别分组的卡片菜单 + 充值/提现 CTA）；桌面端重定向到 `/account/deposit`
- **导航辅助**：`checkIsAccountRoute()`、`checkHasSidebar()`、`getSidebarType()` 位于 `libs/navigation.ts`；`ACCOUNT_PREFIXES` 派生自路由；`getAccountPath(menu)` 用于构建路径
- **分页**：`Pagination` 组件位于 `@/components/pagination.tsx`；`usePagePagination<T>()` hook 位于 `transaction/_hooks/`
- **API**：`GetTransferOrderListInterface`（基于页码）、`GetBetHistoryDetailInterface` 位于 `api/handlers/transaction.ts`

### 认证 / 登录
- **桌面端**：弹窗登录（`signin.tsx` + `phone-form.tsx`）。检测移动端 → 重定向到 `/signin`。
- **移动端**：独立 `/signin` 路由（`app/[locale]/signin/`）含 `H5Signin` + `H5PhoneForm`（全屏页面，Drawer 式区域选择器）。检测桌面端 → 重定向到 `/` 并打开登录弹窗。
- **提取的 hooks**：`useSigninForm()`（表单校验、登录 mutation）、`usePhoneForm()`（短信流程、区域、倒计时）— 桌面端和移动端变体共享
- **Drawer 组件**：`@/components/drawer/drawer.tsx` — Vaul 包装器，方向感知（上/下/左/右）。用于 H5 区域选择器。

### WebSocket
- 核心：`src/utils/websocket/` — BroadcastChannel + Leader Election（仅 Leader 标签页连接）
- 心跳 30s，指数退避重连（500ms → 30s，最大 20 次），二进制协议 `packMessage`/`unpackMessage`
- Store：`shared-socket-store.ts`。Hook：`useSocketListener(cmd, handler)`
- 日志：`ws-logger.ts` 缓冲 10000 条日志，开发环境暴露 `window.__WS_LOGGER__`

### SSE（服务端推送事件）
- `@microsoft/fetch-event-source` 带 `Authorization: Bearer`。多标签页通过 `BroadcastChannel` + 可见性切换
- `use-sse-connection.ts`：登录后连接，路由到 `globalEventObserver` 作为 `sse:{eventName}`
- `use-wallet-sync.ts`：`sse:balance_update` → Zustand store + 标签页获焦时 refetch

### 事件总线
```typescript
globalEventObserver.subscribe(event, callback); // 返回取消订阅函数
globalEventObserver.notify(event, data);
useEventObserver(event, handler); // React hook
useEventEmitter(); // 返回 emit 函数
```

### 市场数据模型
- **MarketGroup**（视觉分组）：字段 `specifiers: MarketLine[]`
- **MarketLine**（单条投注线）：`market_id + specifier_value`，outcomes 数组 + `display_name` + `product`（产品 ID 字符串）+ `product_raw`（原始产品字符串用于购物车/订单）
- **标准化**：`normalizeMarketGroups()` 在所有 API 边界调用。`display_name` 默认为 `market.name`。
- **复合键**：Group ID `market_id:variant_id:name`（`getMarketGroupId()`），基础键 `variant_id:market_id`（`getMarketKey()`）。辅助函数位于 `api/models/market.ts`。
- **市场配置**：已移除独立 store。市场模板/配置数据现由比赛详情组件内联处理。

### 体育路由
- `/sports` → `HotMatches`，`/sports-live` → `LiveMatches`，`/sports/live` → 重定向到 `/{firstSportId}?status=Live`
- `SportsPage` 共享容器：BannerCarousel + MatchFilter（仅移动端，热门页）+ 类型特定列表
- **比赛详情移动端/桌面端分离**：桌面端 → `MatchView`（运动信息）+ `Markets` 并排。移动端 → `Markets` 作为 `marketTab: FunctionComponent` prop 传入 `MatchView`，作为 tab 渲染在运动特定详情页（足球/篮球）中，与 overview/historical/lineup 并列。默认激活 tab 为 `'market'`。
- `MatchListBase`：通用面板，DI 模式（`fetchFn`、`queryKeyPrefix` props）

## 5. 样式与设计令牌

Tailwind CSS v4，`@theme` 位于 `src/assets/css/tailwind.css`。`cn()` 用于 class 合并。禁止裸写 `text-[14px]` 或 `bg-[#xxx]` — 使用项目令牌。

> **完整令牌表**（字体、圆角、背景模糊、颜色、渐变、Z-Index、Toast）：`.agent/references/design-tokens.md` — 编写/审查样式时阅读。
>
> **多主题 / 多配色**（`scheme = brand × mode`：新增一套配色方案、做按主题发散结构的组件）：`.agent/references/theme-component-builder.md`（落地手册：A 新增主题 / B 新增组件两支、改动清单、`theme:check` 闸门）+ `.agent/references/scheme-system.md`（颜色链机制） — 接主题或改 `theme.css`/`brand-ui-skin.ts`/`component-profile.ts` 时阅读。

**快速参考**：`text-body-sm/md/lg`（14px 400/500/700），`text-title-sm/md/lg`（16/18/20px bold），`rounded-xs`(4) `rounded-sm`(8) `rounded-md`(16) `rounded-lg`(20)。Z-index：Modal 60、Toast 70、Header 40、Overlay 50。

**重要**：新的 `text-*` 令牌 → 必须在 `src/utils/common.ts` 的 `extendTailwindMerge()` 中注册。

### 图标与 Logo
- 缺少图标时，从设计稿导出 SVG 放入 `src/assets/icons2/`，执行 `pnpm icon2:build` 生成 `src/components/icons2/` 组件，再从 `@/components/icons2/...` 导入。
- `pnpm icon2:preview` 可预览所有 icon2 图标。
- 单色 icon2 用 `className` 控制颜色，例如 `<UserOutlined className="text-red-400" />`。
- 多色 icon2 传完整颜色数组，例如 `<UserOutlined colors={['#f00', '#080']} />`。不要遗漏某一层颜色。
- 方向箭头使用共享 `Arrow` / `DoubleArrow` 组件，并通过 `direction="up" | "down" | "left" | "right"` 传方向。
- 各种 logo 必须使用 `Logo` 组件渲染。不要手动引用 `assets/images/*logo*` 或 `assets/icons/*logo*`。
- 图标资源已调整：`assets/images/GOTOBET.svg` 对应 `assets/icons/logo-invert.svg`；`assets/images/logo-long.svg` 已移除。新代码不要再引用旧路径。

### CSS 变量迁移
- 不要使用已移除的别名变量。若旧变量只是指向另一个变量，直接使用被指向的变量或设计令牌。
- `--fanc-*` 是拼写错误，全部改为 `--func-*`。
- `--match-paused-bg`、`--match-paused-text` 已移除，使用对应业务状态的现有令牌或明确设计色。
- `--feedback-*` 系列已移除，不要再新增引用：
  `--feedback-success-bg`、`--feedback-success-text`、`--feedback-warning-bg`、`--feedback-warning-text`、`--feedback-error-bg`、`--feedback-error-text`。
- 以下别名变量已移除，新代码直接使用目标变量或现有令牌：`--brand-red`、`--text-dark`、`--text-match`、`--text-notselected`、`--text-white`、`--surface-panel`、`--card-rbg`、`--card-rbd`、`--mini-sbg`、`--mini-sbd`、`--icon-dark`、`--icon-blue`、`--icon-white`、`--guide-a`、`--guide-b`、`--guide-c`、`--gradient-game-button`、`--background`、`--foreground`。
- Figma Backdrop Blur 变量已移除：`--backdrop-blur-header`、`--backdrop-blur-dialog`、`--backdrop-blur-overlay-1`、`--backdrop-blur-overlay-2`。需要模糊时使用当前 Tailwind/设计令牌。

### 样式属性约束
- 不要新增 `aria-*`。如果只是为了 CSS 选择器或状态样式，使用 `data-*`。
- 修改 `src/components/` 全局组件前，先检查复用页面、状态组合和桌面/移动端差异；共享组件改动不能只满足单页局部需求。

## 6. 环境变量

| 变量 | 用途 |
|------|------|
| `NEXT_PUBLIC_APP_NAME` | 品牌名 → `@/constants` 中的 `APP_NAME` |
| `NEXT_PUBLIC_SITE_URL` | `metadataBase` / OG URLs |
| `NEXT_PUBLIC_*_SERVICE` | API 端点（UOF、User、Payment、Game、Sport、WS、SSE） |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry（仅生产环境） |
| `NEXT_PUBLIC_FIREBASE_*` / `GA_MEASUREMENT_ID` | 分析（仅生产环境） |

模式：`.env` = 占位符，`.env.development` = 开发值，`.env.production.local`（gitignored）= 密钥。禁止直接使用 `process.env.NEXT_PUBLIC_*` — 通过 `@/constants` 访问。

## 7. 国际化

- **语言**：pt（默认）、es、en。通过 `global.d.ts` IntlMessages 实现类型安全；语言偏好由 `CacheKey.NextLocale`（`NEXT_LOCALE_2`）和 `[locale]` 路由共同决定，`proxy.ts` 会按区域默认语言补齐。
- **存储**：`CacheKey.NextLocale`（`NEXT_LOCALE_2`）、`CacheKey.I18nRegion`（`i18n-region-2`）、`app-timezone`。TimezoneSynchronizer 确保 SSR/CSR 一致性。
- **区域**：`src/i18nV2/` — `regionConfigs`（`intlLocale`、`supportLanguages`、`defaultLanguage`、`currencyCode`、`timezone`、`timezoneUTC`）+ `useRegionCode()` / `useRegionConfig()` / `useRegionIntlLocale()`；不要再直接把 `RegionCode` 塞给 `Intl`。
- **格式化**：`useIntlFormatter()` 来自 `@/hooks/use-intl-formatter` — 自动注入当前 `locale`、`timezone`、`currency`；需要单独币种时用 `useCurrencyCode()` / `useCurrencySymbol()`。日期、时间、金额格式统一走这条链路，禁止再依赖已移除的 `getIntlLocale()`。
- **common 快捷方式**：通用文案优先使用 `useCommonTranslations()`（`@/hooks/use-translations`），不要在业务里重复写 `useTranslations('common')`。

### 导航导入（next-intl）

```typescript
// ✅ 带区域感知（push/replace/back 自动添加 locale 前缀）
import { Link, useRouter, usePathname, redirect } from '@/i18n';

// ❌ 丢失 locale 前缀
import Link from 'next/link';
import { useRouter, usePathname, redirect } from 'next/navigation';
```

**来自 `next/navigation`（非区域敏感）**：`useSearchParams`、`useParams`、`useSelectedLayoutSegment`、`notFound`

**`router.refresh()` 例外**：仅调用 `refresh()` 时可以使用 `next/navigation` 的 `useRouter`。

**`window.location` 规则**：
| 用法 | 正确？ |
|------|--------|
| 内部路由（`/sports`、`/casino/123`） | ❌ 使用 `@/i18n` 的 `router.push()` |
| 外部 URL（支付、KYC、游戏启动） | ✅ `window.location.href = url` |
| 协议（`tel:`、`mailto:`） | ✅ |
| 全页面重载 | ✅ `window.location.reload()` |
| 语言切换 | ✅ `window.location.assign(origin/lang/path)` |
| 无 React 上下文（`global-error.tsx`） | ✅ 从 `pathname.split('/')[1]` 提取 locale |

## 8. 响应式设计

| 设备 | 断点 | Hook | 布局 |
|------|------|------|------|
| 移动端 | < 768px | `useIsMobile()` | 单栏 + BottomTabBar |
| 平板 | 768-1024px | `useIsTablet()` | 单栏 + BottomTabBar |
| 桌面端 | >= 1024px | `useIsDesktop()` | Sidebar(200↔60px) + Content + BetSlip(308px) |

CSS：`--bottom-bar-height: 56px`、`env(safe-area-inset-bottom)`、`--min-touch-target: 44px`。规则：条件渲染优先于 CSS hidden、SSR 安全、处理安全区域。

### Tailwind 响应式规则
- Tailwind 默认是 mobile-first。基础 class 是移动端/默认样式，`md:` 覆盖 768px 及以上，`max-md:` 覆盖 768px 以下。
- 项目只使用 `md` 作为响应式断点：允许基础样式、`md:*`、`max-md:*`。不要写 `sm:*`、`lg:*`、`xl:*`、`2xl:*`。
- 优先用 `max-md:*` 表达“仅移动端”差异，用基础样式 + `md:*` 表达“移动端默认、桌面增强”。
- 不要随意添加 arbitrary breakpoint（如 `min-[900px]:*`、`max-[1023px]:*`）。确需使用时，先确认这是设计系统级需求。
- Desktop/mobile 模式从 user-agent 判断。开发或测试手机模式时，UA 必须包含 `mobile` 字符串；不要用 viewport 宽度硬编码业务模式。

### PWA
Serwist（`@serwist/next` v9.5.7），开发时禁用。运行时：`NetworkFirst` 用于 API（60s TTL）+ `defaultCache`。Manifest：`standalone`，主题色 `#E80104`。Viewport：`maximumScale: 1, userScalable: false`。

## 9. 测试与 Mock

- **Playwright**：可用于浏览器自动化和 QA。配置：`playwright.config.ts`。
