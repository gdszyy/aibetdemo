# 业务模块全景参考

> `src/modules/` 下共 12 个业务模块。每个模块遵循 DDD 约定：`_` 前缀目录为模块私有，禁止跨模块导入；公开 API 通过模块根 `index.ts` 导出。

---

## 1. balance — 充值与提现

### 功能职责

管理用户资金的充值（deposit）和提现（withdraw）流程，包括优惠码应用、支付状态轮询、收款账户管理、密码验证等。

### 目录结构

```
balance/
├── deposit/
│   ├── _components/          # 充值相关 UI 组件
│   ├── _hooks/               # 充值 hooks
│   ├── home.tsx              # 充值主页
│   └── index.ts
└── withdraw/
    ├── _hooks/               # 提现 hooks
    ├── _utils/               # 提现工具函数
    ├── stores/
    │   └── use-withdraw-store.ts
    ├── add-account-modal.tsx  # 添加收款账户弹窗
    ├── enter-password-modal.tsx # 密码验证弹窗
    ├── fund-account.tsx       # 资金账户管理
    ├── home.tsx               # 提现主页
    ├── withdraw-form.tsx      # 提现表单
    └── index.ts
```

### 公开 API

无模块级 `index.ts`，页面通过路由直接引用子模块。

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 模块状态 | `useWithdrawStore` (Zustand) | 管理当前 Tab（提现/资金账户）、收款账户列表、银行类型列表 |
| 服务端状态 | React Query | 充值/提现接口数据 |

### 关键业务逻辑

- **充值流程**: 选择支付方式 → 输入金额 → 应用优惠码 → 发起充值 → 轮询支付状态
- **提现流程**: 选择收款账户 → 输入金额 → 密码验证 → 发起提现 → 轮询到账状态
- **收款账户管理**: 添加/管理银行卡等收款方式

### 模块依赖

- → `security-center`：提现时调用密码验证
- → `@/api/handlers/transfer-instrument`：收款账户 API
- → `@/hooks/use-wallet`：钱包余额

---

## 2. bet-slip — 投注单管理

### 功能职责

核心投注模块，管理用户的投注选项（购物车）、下注流程（单注/串关）、注单展示（未结算/已结算），以及跨 Tab 购物车同步。

### 目录结构

```
bet-slip/
├── _components/              # 共享组件 (底部抽屉, 清理监听器, 切换按钮, 空状态)
├── _constants/               # 常量定义
├── _hooks/
│   ├── use-bet-slip-subscription.ts  # WS 订阅投注状态
│   └── use-order-result-handler.ts   # 下注结果处理
├── _logic/
│   ├── cart-sync.ts          # 购物车同步 (OddsEntity ↔ CartItem 转换)
│   └── conflict.ts           # 冲突检测 (同赛事不可串关)
├── _utils/
├── cart/                     # 投注购物车
│   ├── _components/          # 购物车内部组件
│   ├── _constants/
│   ├── _hooks/
│   ├── cart.tsx              # 购物车主容器
│   ├── single.tsx            # 单注模式
│   ├── parlay.tsx            # 串关模式
│   ├── stake-input.tsx       # 金额输入
│   ├── stake-card.tsx        # 注单卡片
│   ├── quick-stake-button.tsx
│   ├── single-footer.tsx     # 单注底部操作栏
│   ├── parlay-footer.tsx     # 串关底部操作栏
│   └── single-stake-card.tsx
├── slip/                     # 投注面板
│   ├── bet-slip-panel.tsx    # 桌面端面板
│   ├── bet-slip-drawer.tsx   # 移动端抽屉
│   ├── slip-tabs.tsx         # Tab 切换 (购物车/未结算/已结算)
│   ├── slip-settings.tsx     # 投注设置
│   ├── slip-drawer-trigger.tsx
│   ├── selection-badge.tsx   # 选项徽章
│   └── context.ts
├── stores/
│   ├── bet-slip-store.ts     # 主 Store (persist localStorage)
│   ├── bet-cart-store.ts     # UI Store (投注模式: 单注/串关)
│   ├── slices/               # Zustand Slice 模式
│   │   ├── list-slice.ts     # 选项列表管理
│   │   ├── item-slice.ts     # 单个选项操作
│   │   ├── sync-slice.ts     # 同步逻辑
│   │   └── _types.ts
│   └── internal/             # 内部辅助 (生命周期, 监听器, 快照, API)
└── ticket/                   # 注单展示
    ├── open.tsx              # 未结算注单
    ├── settlement.tsx        # 已结算注单
    ├── ticket-card.tsx       # 注单卡片
    ├── ticket-container.tsx
    ├── ticket.tsx
    ├── parlay-leg.tsx        # 串关单腿
    ├── parlay-ticket.tsx     # 串关注单
    ├── ticket.types.ts       # 注单状态配置
    ├── ticket.utils.ts
    └── _hooks/
```

### 公开 API

```typescript
export { QuickStakeButton, type QuickStakeButtonProps } from './cart/quick-stake-button';
export { type OddsTrend, StakeCard, type StakeCardProps } from './cart/stake-card';
export { StakeInput, type StakeInputProps } from './cart/stake-input';
export { BetSlipDrawer, type BetSlipDrawerProps } from './slip/bet-slip-drawer';
export { BetSlipPanel, type BetSlipPanelProps } from './slip/bet-slip-panel';
export { SelectionBadge, type SelectionBadgeProps } from './slip/selection-badge';
export { SlipDrawerTrigger, type SlipDrawerTriggerProps } from './slip/slip-drawer-trigger';
export { SlipSettings, type SlipSettingsProps } from './slip/slip-settings';
export { SlipTabs, type SlipTabsProps, type SlipTabType } from './slip/slip-tabs';
export { ParlayLeg, type ParlayLegProps } from './ticket/parlay-leg';
export { ParlayTicket, type ParlayTicketProps } from './ticket/parlay-ticket';
export { type StatusConfig, TICKET_STATUS_CONFIG } from './ticket/ticket.types';
```

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 投注选项 | `useBetSlipStore` (Zustand + persist) | Slice 模式: ListSlice(列表) + ItemSlice(单项) + SyncSlice(同步)，persist 到 localStorage |
| UI 状态 | `useBetCartStore` (Zustand) | 投注模式切换 (Single/Parlay) |
| 注单数据 | React Query | 未结算/已结算注单查询 |

### 关键业务逻辑

- **冲突检测** (`conflict.ts`): 同一赛事的标准选项不可串关，冠军赛 (outright) 不参与冲突检测
- **购物车同步** (`cart-sync.ts`): `OddsEntity` ↔ `CartItem` 双向转换，跨 Tab 通过 BroadcastChannel 同步
- **OddsEntity 类型**: 投注选项的标准化数据结构，包含赛事、盘口、赔率、状态等完整信息
- **Slice 模式**: 复杂 Store 拆分为可组合的 slice，`ListSlice` 管理列表增删，`ItemSlice` 管理单项更新，`SyncSlice` 处理远端同步
- **持久化**: localStorage 持久化 selections、version、hasPendingSync

### 模块依赖

- → `match`：依赖 `OddsEntity` 类型定义 (`match/_constants/match.types`)
- → `@/api/models/cart`：`CartItem`、`BetType` 模型
- → `@/stores/shared-socket-store`：WS 连接，订阅投注状态更新
- → `@/libs/event-constants`：事件常量

---

## 3. casino — 赌场游戏

### 功能职责

赌场游戏大厅，包括游戏分类浏览、标签过滤、游戏详情展示（iframe 嵌入第三方游戏），以及赌场侧边栏导航。

### 目录结构

```
casino/
├── _components/
│   ├── casino-sidebar.tsx    # 赌场侧边栏
│   ├── filter-bar.tsx        # 过滤栏
│   ├── game-card.tsx         # 游戏卡片
│   └── game-section.tsx      # 游戏区块
├── _constants/
│   ├── category-config.ts    # 分类配置 (策略模式)
│   ├── filter-tags.ts        # 过滤标签
│   ├── mock-banners.ts       # Mock Banner 数据
│   └── sidebar-categories.ts # 侧边栏分类
├── _logic/
│   ├── api.ts                # Mock API 数据 (Banner)
│   └── index.ts
├── home/
│   └── casino-home.tsx       # 赌场首页 (URL 驱动过滤 ?tag_id=)
├── game/
│   ├── _hooks/               # useGameMessage 等
│   └── game-detail-page.tsx  # 游戏详情 (iframe 嵌入)
├── category/
│   └── category-page.tsx     # 分类页
└── index.ts
```

### 公开 API

```typescript
export { getTagIcon } from './_constants/filter-tags';
```

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 服务端状态 | React Query | query key: `['casino', 'lobbies']`, `['casino', 'tags']`, `['casino', 'games']` |
| URL 状态 | SearchParams | `?tag_id=` 驱动游戏过滤 |

### 关键业务逻辑

- **策略模式**: `category-config.ts` 映射分类 → 行为配置
- **URL 驱动过滤**: 首页通过 `?tag_id=` 参数过滤游戏，无需额外状态
- **iframe 嵌入**: 游戏详情页通过 iframe 加载第三方游戏，`useGameMessage` 处理 postMessage 通信
- **侧边栏分类**: 独立的赌场分类树，与体育侧边栏结构不同

### 模块依赖

- → `@/api/handlers/casino`：游戏大厅/标签/游戏列表 API (`gameFetcher`)
- → `@/components/banner-carousel`：Banner 轮播组件
- 无其他模块依赖（独立子系统）

---

## 4. docs — 法律文档

### 功能职责

展示平台法律文档（条款、隐私政策等）和体育规则文档。PDF 转文本格式展示。

### 目录结构

```
docs/
├── legal/
│   └── legal-doc-page.tsx     # 法律文档页
└── sports-rules/
    └── sports-rules-page.tsx  # 体育规则页
```

### 公开 API

无 `index.ts`，页面通过路由直接引用。

### 状态管理

无独立状态，纯展示组件。

### 关键业务逻辑

- 静态文档内容渲染
- PDF 转文本展示

### 模块依赖

- 无其他模块依赖（独立展示模块）

---

## 5. home — 主框架与导航

### 功能职责

应用主框架，包含全局初始化（WS 连接、Session、钱包同步）、导航栏、底部 Tab 栏、语言切换、时区显示、右侧栏等壳层组件，以及体育首页/Live 页面容器。

### 目录结构

```
home/
├── _components/
│   ├── app-initializer.tsx    # 全局初始化 (WS, session, wallet, region)
│   ├── app-logic-wrapper.tsx  # 应用逻辑包装器
│   ├── app-shell.tsx          # 应用外壳
│   ├── bottom-sheet.tsx       # 底部弹出层
│   ├── bottom-tab-bar.tsx     # 移动端底部导航
│   ├── language-modal.tsx     # 语言切换弹窗
│   ├── mobile-nav.tsx         # 移动端导航
│   ├── navigation-bar.tsx     # 顶部导航栏
│   ├── right-aside.tsx        # 右侧栏
│   └── timezone-display.tsx   # 时区显示
├── _constants/
│   ├── constants.ts
│   └── nav-menus.ts           # 导航菜单配置 (FIXED_NAV_ITEMS + lobbiesToNavItems)
├── _hooks/
│   └── use-kyc-tips.ts        # KYC 提示
├── _logic/
│   ├── api.ts                 # Mock Banner 数据
│   └── index.ts
├── home-page.tsx              # 体育热门页
├── live-page.tsx              # 体育 Live 页
└── sports-page.tsx            # 体育页面容器
```

### 公开 API

无 `index.ts`，通过路由布局和组件直接引用。

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 全局状态 | `uiStore` (Zustand) | loginModalOpen, betSlipDrawerOpen, sidebarCollapsed 等 |
| Session | `sessionStore` (Zustand) | 登录态、Token 管理 |

### 关键业务逻辑

- **AppInitializer**: 客户端全局初始化 — WS 连接建立、Session 恢复、钱包/货币同步、地区推断
- **导航菜单**: 固定项 (`FIXED_NAV_ITEMS`: Sport、Live) + 动态项 (`lobbiesToNavItems`: 从 Casino Lobby API 生成)。策略模式 `LOBBY_ICON_MAP` 映射 lobby_code → 图标
- **布局层级**: AppShell → NavBar → 内容区 → BottomTabBar（移动端）

### 模块依赖

- → `match`：体育页面容器引用 match 模块的列表组件
- → `casino`：导航菜单动态生成赌场 Lobby 入口
- → `@/stores/session-store`：Session 全局状态
- → `@/stores/ui-store`：UI 全局状态

---

## 6. marketing — 促销活动

### 功能职责

促销活动列表展示和详情页，包括优惠码管理、活动排序/筛选策略。

### 目录结构

```
marketing/
└── promotion/
    ├── _components/
    │   ├── promotion-card.tsx     # 活动卡片
    │   └── promotions-header.tsx  # 活动列表头部
    ├── _constants/
    │   ├── promotion-cards.ts     # 卡片配置
    │   └── promotion-data.ts      # 活动数据
    ├── _images/                   # 活动图片资源
    ├── _utils/
    │   └── campaign-time.ts       # 活动时间工具
    ├── promotions-list-page.tsx   # 活动列表页
    ├── promotion-detail-page.tsx  # 活动详情页
    ├── promotion-view.tsx         # 活动展示视图
    ├── hero-section.tsx           # 顶部大图区域
    ├── bonus-details-section.tsx  # 奖金详情
    ├── how-it-works-section.tsx   # 使用说明
    ├── promo-codes-section.tsx    # 优惠码区域
    ├── terms-section.tsx          # 条款条件
    ├── responsible-gaming-section.tsx # 负责任博彩
    └── index.ts
```

### 公开 API

无模块级 `index.ts`，`promotion/index.ts` 为子模块入口。

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 服务端状态 | React Query | 活动列表/详情查询 |

### 关键业务逻辑

- **活动展示**: 详情页分区渲染（Hero → 奖金详情 → 使用说明 → 优惠码 → 条款 → 负责任博彩）
- **策略模式**: `PromotionItem` 排序/筛选策略
- **活动时间**: `campaign-time.ts` 处理活动时间计算与展示

### 模块依赖

- 无其他模块依赖（独立展示模块）

---

## 7. match — 体育赛事核心

### 功能职责

体育赛事数据管理的核心模块，负责赛事列表展示、赔率显示与实时更新、赛事详情盘口、侧边栏分类树、WS 数据订阅与合并等。

### 目录结构

```
match/
├── _components/
│   ├── bet-btn-short-base.tsx     # 投注按钮 (短, 纯 UI)
│   ├── bet-btn-short.tsx          # 投注按钮 (短, 连接状态)
│   ├── bet-btn-standard-base.tsx  # 投注按钮 (标准, 纯 UI)
│   ├── bet-btn-standard.tsx       # 投注按钮 (标准, 连接状态)
│   ├── bet-item.tsx               # 投注项
│   ├── breadcrumb.tsx             # 面包屑
│   ├── card.tsx                   # 赛事卡片
│   ├── collapse-panel.tsx         # 折叠面板
│   ├── collapse-toggle-button.tsx
│   ├── list-item.tsx              # 列表项
│   ├── match-status-label.tsx     # 赛事状态标签
│   ├── no-data.tsx
│   ├── odds-columns.tsx           # 赔率列
│   ├── tournament-group-header.tsx # 联赛分组头
│   └── trend-bubble.tsx           # 赔率趋势气泡
├── _constants/
│   ├── constants.ts
│   ├── match.types.ts             # OddsEntity 类型定义
│   └── types.ts
├── _hooks/
│   ├── bet-actions.ts             # 投注操作
│   ├── bet-animation-utils.ts     # 投注动画工具
│   ├── use-breadcrumb.ts          # 面包屑 hook
│   ├── use-force-collapse.ts      # 强制折叠
│   ├── use-game-subscription.ts   # WS 赛事订阅
│   ├── use-live-status-suffix.ts  # Live 状态后缀
│   ├── use-match-observer.ts      # 赛事观察器
│   ├── use-match-row-count.ts     # 赛事行数
│   ├── use-match-status-observer.ts
│   ├── use-odds-change-observer.ts # 赔率变化观察器
│   ├── use-odds-display.ts        # 赔率显示格式
│   └── use-visible-markets.ts     # 可见盘口
├── _logic/
│   ├── match-cache-utils.ts       # 赛事缓存工具
│   ├── merge-match.ts             # 赛事数据智能合并 (timestamp 比较)
│   ├── merge-tournament.ts        # 联赛数据合并
│   ├── odds-change.ts             # OddsUpdateProcessor 类
│   └── odds-factory.ts            # OddsEntity 工厂函数
├── _utils/
│   ├── filter-utils.ts            # 过滤工具
│   ├── match-utils.ts             # 赛事通用工具
│   └── selection-validity.ts      # 选项有效性检查
├── detail/                        # 赛事详情 (盘口)
│   ├── card.tsx                   # 盘口卡片
│   ├── chips.tsx                  # 筛选标签
│   ├── filters.tsx                # 盘口过滤
│   ├── layout.tsx                 # 详情布局
│   ├── markets-skeleton.tsx
│   └── index.ts
├── home/                          # 赛事首页
│   ├── _components/
│   │   └── match-list-base.tsx    # 通用赛事列表 (DI 模式)
│   ├── hot-matches/               # 热门赛事
│   │   ├── filters.tsx
│   │   ├── index.ts
│   │   └── layout.tsx
│   ├── live-matches/              # Live 赛事
│   │   ├── index.ts
│   │   └── layout.tsx
│   └── match-filters/             # 赛事筛选
├── list/                          # 赛事列表
│   ├── collapse-context.tsx       # 折叠上下文
│   ├── match-list-content.tsx     # 列表内容
│   ├── tournament-shell.tsx       # 联赛壳层
│   ├── layout.tsx
│   ├── utils.ts
│   └── index.ts
├── outright/                      # 冠军赛
│   ├── card.tsx
│   └── outright-content.tsx
└── sidebar/                       # 体育侧边栏
    ├── service/
    │   ├── api.ts                 # 侧边栏 API
    │   ├── constants.ts
    │   ├── node.ts                # 树节点类 (BaseNode, SportNode, CategoryNode, TournamentNode)
    │   └── store.ts               # useTreeStore (Zustand)
    ├── sidebar.tsx
    ├── sport-item.tsx
    ├── category-item.tsx
    ├── tournament-item.tsx
    ├── league-placeholder.tsx
    ├── sports-context.tsx
    └── index.ts
```

### 公开 API

无模块级 `index.ts`。子模块通过各自 `index.ts` 导出：
- `detail/index.ts` — 赛事详情组件
- `list/index.ts` — 赛事列表组件
- `sidebar/index.ts` — 侧边栏组件
- `home/hot-matches/index.ts` — 热门赛事
- `home/live-matches/index.ts` — Live 赛事

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 侧边栏树 | `useTreeStore` (Zustand) | 树结构: RootNode → SportNode → CategoryNode → TournamentNode |
| 赛事数据 | React Query | 赛事列表/详情/盘口缓存 |
| 实时更新 | EventObserver + WS | 赔率变化、比分更新、赛事状态变更 |

### 关键业务逻辑

- **OddsEntity**: 投注选项的标准化类型，包含 eventId、marketId、outcome、lineStatus、timestamp 等字段
- **odds-factory.ts**: 工厂函数 `createOddsEntity()`，从赛事上下文构建标准化的 OddsEntity
- **OddsUpdateProcessor** (`odds-change.ts`): 处理 WS 推送的赔率变化，合并 outcomes、更新 MarketGroup
- **merge-match.ts**: 赛事数据智能合并，以 timestamp 为准，始终保留更新的数据
- **useGameSubscription**: WS 赛事数据订阅，mount 时订阅、unmount 时退订
- **useOddsChangeObserver**: 监听 EventObserver 赔率变化事件，更新 React Query 缓存
- **侧边栏树**: OOP 树节点类（BaseNode → SportNode/CategoryNode/TournamentNode），支持 clone、遍历、ancestors
- **MatchListBase**: DI 模式的通用列表容器，通过 `fetchFn`、`queryKeyPrefix` props 注入数据源
- **Base 组件模式**: `bet-btn-*-base.tsx` 为纯 UI，`bet-btn-*.tsx` 为连接状态的包装器

### 模块依赖

- → `@/api/models/market`：MarketGroup、MarketLine、OutcomeModel 模型
- → `@/api/models/match`：MatchWithMarkets、OddsEventEntity 模型
- → `@/api/models/ws`：OddsChangePayload、FixtureChangePayload、LiveScorePayload
- → `@/stores/shared-socket-store`：WS 连接、赛事订阅/退订
- → `@/libs/event-constants`：OddsChangeEvent、FixtureEvent、LiveScoreEvent
- ← `bet-slip`：bet-slip 依赖本模块的 OddsEntity 类型
- ← `match-info`：match-info 在赛事详情中作为 Tab 内容嵌入

---

## 8. match-info — 足球/篮球赛事详情

### 功能职责

按运动类型（足球/篮球）展示赛事详情信息，包括 Banner、概览、阵容、历史交锋、实时比分等 Tab 内容。与 match 模块的盘口 Tab 组合形成完整的赛事详情页。

### 目录结构

```
match-info/
├── components/                    # 跨运动共享组件
│   ├── MatchDetailTabs/           # 详情 Tab 切换
│   ├── MatchHistoricalFilter/     # 历史交锋过滤
│   ├── MatchHistoricalStat/       # 历史统计
│   ├── MatchJerseyWithNumber/     # 球衣号码
│   ├── MatchLineChart/            # 走势图表
│   ├── MatchLive/                 # 实时比分
│   └── MatchLiveWrapper/          # 实时比分包装器
├── football/
│   ├── detail/
│   │   ├── _components/           # 足球专属组件
│   │   ├── components/            # 足球详情组件
│   │   └── index.tsx              # 足球详情主入口
│   └── service/                   # 足球数据服务
├── basketball/
│   ├── detail/
│   │   ├── components/            # 篮球详情组件
│   │   └── index.tsx              # 篮球详情主入口
│   └── services/                  # 篮球数据服务
└── services/
    ├── common.ts                  # 通用数据服务
    └── detail.ts                  # 详情数据服务
```

### 公开 API

无 `index.ts`。足球/篮球详情通过各自 `detail/index.tsx` 导出。

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 服务端状态 | React Query | 赛事详情、阵容、历史交锋等数据 |

### 关键业务逻辑

- **运动分类详情**: 足球和篮球各有独立的详情页实现，共享组件层
- **Tab 组合**: 通过 `MatchDetailTabs` 组织概览/阵容/历史/实时等 Tab，match 模块的盘口作为 `marketTab` prop 传入
- **实时比分**: `MatchLive` 组件展示实时比分动态
- **走势图表**: `MatchLineChart` 展示赛事走势

### 模块依赖

- → `match`：作为 match 详情页的 Tab 内容嵌入，接收 `marketTab` prop
- → `@/api/handlers/match`：赛事详情 API
- → `services/`：数据获取和转换服务

---

## 9. security-center — 密码管理

### 功能职责

管理用户密码和钱包密码的设置、修改和重置。

### 目录结构

```
security-center/
├── _components/
│   ├── new-password-input/    # 新密码输入组件
│   └── passwords-forms.tsx    # 密码表单
└── security-center.tsx        # 安全中心主页
```

### 公开 API

无 `index.ts`，页面通过路由直接引用。

### 状态管理

无独立 Store，表单状态通过 React Hook Form 管理。

### 关键业务逻辑

- **登录密码管理**: 设置/修改用户登录密码
- **钱包密码管理**: 设置/修改提现钱包密码
- **密码验证**: 为 balance 模块的提现流程提供密码验证能力

### 模块依赖

- → `@/api/handlers/user`：密码相关 API (`userFetcher`)
- ← `balance`：balance 模块在提现时依赖密码验证

---

## 10. transaction — 交易记录

### 功能职责

展示用户各类交易记录，包括余额/奖金列表、交易历史、投注历史、转账订单，通过 PillTabs 切换，URL SearchParams 驱动过滤和分页。

### 目录结构

```
transaction/
├── _components/
│   ├── balance-overview.tsx    # 余额概览卡片
│   ├── empty.tsx              # 空状态
│   ├── pill-tabs.tsx          # 药丸标签页
│   └── sort-chips.tsx         # 排序筛选标签
├── _constants/
│   ├── balance-overview.ts
│   ├── index.ts               # TransactionTab 枚举
│   └── query-keys.ts
├── _hooks/
│   ├── use-page-pagination.ts     # 页码分页 hook
│   ├── use-paginated-query.ts     # 分页查询封装
│   ├── use-transaction-filters.ts # 筛选逻辑
│   ├── use-transaction-params.ts  # URL 参数管理
│   ├── use-transaction-queries.ts # 查询 hooks
│   └── use-transaction-title.ts   # 动态标题
├── _utils/
├── balance/                    # 奖金列表
│   ├── _components/
│   ├── balance-list.tsx
│   ├── balance-transfer-confirm-modal.tsx
│   └── index.ts
├── betHistory/                 # 投注历史
│   ├── bet-history.tsx
│   ├── bet-history-adapter.ts     # 数据适配器
│   ├── bet-history-item.tsx
│   ├── bet-history-sport-item.tsx
│   ├── bet-history-casino-item.tsx
│   ├── bet-history-detail-modal.tsx
│   ├── bet-history-types.ts
│   └── index.ts
├── transactions/               # 交易历史
│   ├── transactions.tsx
│   ├── transactions-list-item.tsx
│   ├── transactions-page.tsx      # 页码分页实现
│   ├── transactions-scroll.tsx    # 无限滚动实现
│   ├── transactions-shared.tsx    # 共享类型/常量
│   ├── transactions-shell.tsx     # 分页策略路由
│   └── index.ts
├── transferOrder/              # 转账订单
│   ├── transfer-order.tsx
│   ├── transfer-order-adapter.ts
│   └── transfer-order-types.ts
├── layout.tsx                  # 交易页面主布局 (PillTabs + BalanceOverview)
└── index.ts
```

### 公开 API

```typescript
export { Transaction } from './layout';
```

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| URL 状态 | SearchParams | Tab 切换、过滤条件、分页 (单一数据源) |
| 服务端状态 | React Query | 各类交易数据分页查询 |
| UI 状态 | useState | 余额钻取 (balanceDrilldown) 等临时状态 |

### 关键业务逻辑

- **URL 驱动**: Tab 和过滤条件全部由 URL SearchParams 管理，刷新可恢复
- **分页策略**: `transactions/` 采用策略模式，`PAGINATION_MODE` 切换 `'page'`(页码) / `'scroll'`(无限滚动)，共享类型定义在 `transactions-shared.tsx`
- **数据适配器**: `bet-history-adapter.ts`、`transfer-order-adapter.ts` 将后端数据转换为前端展示格式
- **动态标题**: `useTransactionTitle` 根据当前 Tab 动态更新页面标题
- **余额概览**: 顶部卡片展示主余额、赌场奖金、体育奖金等

### 模块依赖

- → `@/hooks/use-wallet`：钱包余额数据
- → `@/api/handlers/transaction`：交易记录 API (`GetTransferOrderListInterface`, `GetBetHistoryDetailInterface`)
- → `@/components/pagination`：分页组件

---

## 11. user — 用户认证

### 功能职责

用户登录认证（手机号 + 验证码）和 KYC 实名认证流程。桌面端 Modal 登录、移动端独立页面登录。

### 目录结构

```
user/
├── auth/
│   ├── _components/           # 认证内部组件
│   ├── _hooks/
│   │   ├── use-signin-form.ts # 登录表单逻辑 (校验, mutation)
│   │   └── use-phone-form.ts  # 手机号表单逻辑 (SMS, 地区, 倒计时)
│   ├── _images/               # 认证相关图片
│   ├── signin.tsx             # 桌面端登录 (Modal)
│   ├── h5-signin.tsx          # 移动端登录 (独立页面)
│   ├── phone-form.tsx         # 桌面端手机号表单
│   ├── h5-phone-form.tsx      # 移动端手机号表单 (Drawer 地区选择)
│   ├── auth.tsx               # 认证容器
│   ├── operation-bar.tsx      # 操作栏
│   └── text-field.tsx         # 输入字段
└── kyc/
    ├── _schemas/              # Zod 校验 Schema
    ├── home.tsx               # KYC 主页
    ├── kyc-form.tsx           # KYC 表单
    ├── kyc-step-chip.tsx      # 步骤标签
    ├── kyc-verify-result.tsx  # 验证结果
    └── index.ts
```

### 公开 API

无模块级 `index.ts`。`kyc/index.ts` 导出 KYC 子模块。

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 全局状态 | `sessionStore` (Zustand) | 登录态、Token 管理 |
| 表单状态 | React Hook Form + Zod | 登录表单、KYC 表单校验 |

### 关键业务逻辑

- **提取 hooks 模式**: `useSigninForm` (表单校验 + 登录 mutation) 和 `usePhoneForm` (SMS 发送 + 地区选择 + 倒计时) 被桌面/移动端共享
- **设备检测分流**: 桌面端检测到移动端 → 重定向 `/signin`；移动端检测到桌面端 → 重定向 `/` 并打开登录 Modal
- **KYC 流程**: Zod Schema 驱动的多步表单验证
- **地区选择**: 移动端使用 Drawer 组件，桌面端使用下拉选择

### 模块依赖

- → `@/stores/session-store`：登录态管理 (`signIn`/`signOut`)
- → `@/stores/ui-store`：`loginModalOpen` 控制
- → `@/api/handlers/auth`：登录/SMS API (`uofFetcher`)
- → `@/api/handlers/user`：KYC API (`userFetcher`)
- → `@/i18n/region/`：地区配置

---

## 12. user-center — 账户设置

### 功能职责

用户账户管理中心，包括负责任博彩设置（存款/损失限额、游戏时间）、消息通知（系统消息 + 公告）、客服支持（在线客服、VIP）、常见问题等。

### 目录结构

```
user-center/
├── _components/
│   ├── account-page-shell.tsx  # 账户页面壳层 (桌面: 渐变头 + 红色标题; 移动: 紧凑头)
│   └── account-sidebar.tsx     # 账户侧边栏
├── _constants/
│   └── constants.ts
├── _types/
│   └── index.ts
├── health-setting/             # 负责任博彩设置
│   ├── deposit-section.tsx     # 存款限额
│   ├── loss-section.tsx        # 损失限额
│   ├── gaming-schedule-section.tsx   # 游戏时间
│   ├── gaming-schedule-editor.tsx    # 时间编辑器
│   ├── limit-editor.tsx        # 限额编辑器
│   ├── menus.tsx               # 设置菜单
│   ├── setting-card.tsx        # 设置卡片
│   ├── password-confirm-modal.tsx    # 密码确认弹窗
│   ├── home.tsx
│   ├── use-health-setting.ts   # 设置逻辑 hook
│   ├── _utils.ts
│   └── index.ts
├── notification/               # 消息通知
│   ├── home.tsx                # 通知主页
│   ├── normal-messages.tsx     # 普通消息
│   ├── announcements.tsx       # 公告
│   ├── card.tsx                # 消息卡片
│   ├── content-container.tsx
│   ├── empty-state.tsx
│   ├── footer.tsx
│   ├── notification-skeleton.tsx
│   ├── use-unread-messages.ts  # 未读消息 hook + store
│   └── index.ts
├── support/                    # 客服支持
│   ├── home.tsx
│   ├── live-chat.tsx           # 在线客服
│   ├── online.tsx
│   ├── vip.tsx                 # VIP
│   └── index.ts
├── faq/                        # 常见问题
│   ├── faq.tsx
│   └── index.ts
└── index.ts
```

### 公开 API

```typescript
export { AccountPageShell } from './_components/account-page-shell';
export { FAQItem } from './faq/faq';
```

### 状态管理

| 类型 | 方案 | 说明 |
|------|------|------|
| 未读消息 | `useUnreadMessagesStore` (Zustand) | 跟踪消息和公告的未读状态 |
| 服务端状态 | React Query | 通知列表、健康设置等数据查询 |

### 关键业务逻辑

- **AccountPageShell**: 账户页面统一壳层，桌面端粉色渐变头部 + 红色标题 + 可选双栏布局；移动端紧凑头部 + 返回箭头
- **负责任博彩**: 存款限额、损失限额、游戏时间设置，修改需密码确认
- **消息通知**: 系统消息和公告双 Tab，`useUnreadMessagesStore` 追踪未读状态，`useUnreadMessages` hook 在登录状态变化时查询未读数
- **客服支持**: 在线客服集成、VIP 服务

### 模块依赖

- → `@/stores/session-store`：登录态检查 (`useIsLogin`)
- → `@/api/handlers/notification`：消息/公告 API
- → `@/api/handlers/user`：健康设置 API
- → `@/constants/account-routes`：账户路由配置

---

## 模块间依赖关系总览

```
                    ┌──────────┐
                    │   home   │
                    └────┬─────┘
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌──────────┐
         │ match  │ │ casino │ │ marketing│
         └───┬────┘ └────────┘ └──────────┘
             │
      ┌──────┼──────────┐
      ▼      ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│match-info│ │ bet-slip │ │ transaction  │
└──────────┘ └──────────┘ └──────────────┘
                              │
                              ▼
                         ┌─────────┐
                         │ balance │
                         └────┬────┘
                              ▼
                     ┌─────────────────┐
                     │ security-center │
                     └─────────────────┘

独立模块: docs, user, user-center (仅依赖全局 stores 和 API)
```

### 依赖明细

| 源模块 | 目标模块 | 依赖内容 |
|--------|----------|----------|
| `home` | `match` | 体育页面容器引用赛事列表 |
| `home` | `casino` | 导航菜单动态生成赌场 Lobby 入口 |
| `match` | `match-info` | 赛事详情页嵌入足球/篮球专项内容 |
| `bet-slip` | `match` | 依赖 `OddsEntity` 类型定义 |
| `transaction` | `balance` | 余额概览数据 (通过 `useWallet`) |
| `transaction` | `bet-slip` | 投注历史展示 (通过 API，非直接导入) |
| `balance` | `security-center` | 提现密码验证 |

### 共享依赖

所有模块共同依赖的全局资源：

- `@/api/` — API 客户端和模型定义
- `@/stores/` — 全局 Zustand stores (session, ui, shared-socket)
- `@/components/` — 共享 UI 组件
- `@/hooks/` — 全局 hooks (useWallet, useSocketListener, useEventObserver 等)
- `@/constants/` — 全局常量 (query-keys, account-routes)
- `@/i18n/` — 国际化
- `@/libs/` — 第三方集成 (navigation, event-constants)
