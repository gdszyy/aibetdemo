# API 层、路由结构、国际化与 Mock 系统

## API 层 (src/api/)

### 核心架构 — client.ts

6 个 fetcher 实例，按服务域划分：

| Fetcher | 服务 | 职责 |
|---------|------|------|
| `uofFetcher` | `NEXT_PUBLIC_UOF_SERVICE` | 体育数据、认证 |
| `userFetcher` | `NEXT_PUBLIC_USER_SERVICE` | 用户资料、KYC |
| `paymentFetcher` | `NEXT_PUBLIC_PAYMENT_SERVICE` | 充值、提现 |
| `gameFetcher` | `NEXT_PUBLIC_GAME_SERVICE` | 赌场游戏 |
| `sportFetcher` | 体育统计服务 | 足球/篮球数据统计 |
| 基础 `fetcher` | — | 通用请求 |

**请求处理流程**：
1. 自动注入请求头：`Bearer token`、`X-Traceparent`（链路追踪）、`Accept-Language`、`X-Timezone`、`X-Source`
2. HTTP 方法映射：GET → URL query 参数，POST/PUT/PATCH/DELETE → JSON body
3. 响应处理管线：HTTP 状态检查 → JSON 解析 → `code` 校验 → 可选 Zod 验证 → Token 轮换

**错误处理**：

| 条件 | 行为 |
|------|------|
| `code === 0` | 成功 |
| `code === 700` | 服务端错误，上报 Sentry |
| `code === 1000 / 1001` | Token 过期，清除会话 + 弹出登录框 |
| HTTP 400-599 | 抛出 `NetworkError` |
| 非零 `code` | 抛出 `ApiError` / `ForbiddenError` |
| 页面卸载时的网络错误 | 自动抑制（不弹错误提示） |

### 库工具 (lib/)

| 文件 | 用途 |
|------|------|
| `types.ts` | `PromiseType`、`InterfaceRequest/Response`、`ScrollPageRequest/Response`、`ErrorReject` |
| `utils.ts` | `getFullUrl`、`getRejectError` |
| `validation.ts` | Zod 运行时验证；开发环境输出详细日志，生产环境报告 Sentry 但不中断 |
| `ssr-fetch.ts` | `ssrFetchList`（ISR 300s）、`fetchSportsLayoutData`、`queryWithoutError` |

### Handler (handlers/) — 19 个文件

**用户认证**：
- `passport.ts` — Login、SendSms、Logout、CheckNewUser、CheckLogin
- `user.ts` — GetProfile、Password 管理

**体育博彩**：
- `match.ts` — GetMatch + `normalizeMarketGroups`、PostLocalCart
- `matches.ts` — GetHotMatches、SearchMatches、Breadcrumb、MarketTabs、MatchRowBatchCount
- `tournament.ts` — GetTournamentMarkets、GetOutrightMarkets
- `menu.ts` — GetTopSports、GetMenuSports、GetMenuCategories、GetMenuTournaments

**足球**：
- `match-football.ts` — 6 个接口：ById、Trend、Lineup、Index（亚赔）、AnalysisVs（H2H）、AnalysisRecent

**篮球**：
- `match-basketball.ts` — 6 个接口：同上结构

**购物车/订单**：
- `cart.ts` — GetCart、PutCartItem（含版本控制）、SlipSettings
- `order.ts` — CreateOrder、GetOrderList

**财务**：
- `wallet.ts` — GetBalance
- `deposit.ts` — Create/GetDeposit
- `withdraw.ts` — Create/GetWithdraw
- `transaction.ts` — 8 个接口：BalanceList/Page、BetHistory/Page/Detail、Transactions、MainBalance、BonusWithdraw、TransferOrder、CasinoBetHistory

**赌场**：
- `casino.ts` — GetLobbies、GetTags、GetGames、LaunchGame

**账户**：
- `user-kyc.ts` — CreateKyc、WebKycUrl、KycEnabled、KycTips
- `transfer-instrument.ts` — 银行账户 CRUD
- `health-setting.ts` — RGConfig、3 个 Set 接口

**其他**：
- `currency.ts`、`promotion.ts`（6 个接口）、`merchant.ts`、`notification.ts`（7 个接口）、`support.ts`、`app.ts`、`analytics.ts`

### 数据模型 (models/) — 44 个文件

**核心模型**：
- `user.ts` — `UserSchema`（Zod 校验）
- `match.ts` — `MatchClock`、`PeriodScore`、`SportEventStatus`、`OddsEventEntity`
- `match-game.ts` — `Competitor`、`MatchEvent`、`TournamentGroup`、`HotMatchesResponse`
- `market.ts` — `OutcomeModel`、`MarketLine`、`MarketGroup`、`LineStatus`、`ProductEnum`
- `cart.ts` — `BetType`、`CartItem`、`OddsChangePolicy`
- `order.ts` — `OrderStatus`、`Order`

**财务模型**：
- `transaction.ts`（6.9KB）— 各种列表项类型
- `deposit.ts` — `DepositOrderStatus`、`Deposit`
- `withdraw.ts`

**赌场模型**：
- `casino.ts` — `CasinoLobby`（L1）、`CasinoTag`（L2）、`CasinoGame`（L3）、`GameLaunchResponse`

**足球模型**：12 个文件（match/analysis/index/injury/player/team/trend/coach/referee/venue）

**篮球模型**：10 个文件（同类结构）

---

## 路由结构

### 根布局

```
[locale]/layout.tsx (PWA, i18n, DialogProvider)
  → page.tsx (重定向到 /sports)
  → error.tsx / loading.tsx / not-found.tsx
```

### (main)/ 路由组

**体育 (sports)/**：

| 路由 | 说明 |
|------|------|
| `sports/` | 热门赛事首页 |
| `sports/[sport_id]` | 特定运动 |
| `sports/live` | 重定向到 `/{firstSportId}?status=Live` |
| `sports/promotions` | 体育促销 |
| `sports/rules` | 博彩规则 |
| `sports-live/` | 全量滚球赛事 |
| `leagues/[tournament_id]` | 联赛详情（含 outright） |
| `matches/[match_id]` | 赛事详情（动态 metadata） |

**赌场 (casino)/**：

| 路由 | 说明 |
|------|------|
| `casino/` | 大厅首页 |
| `casino/[lobbyId]` | 特定大厅 |
| `casino/category/[slug]` | 分类页 |
| `casino/game/[gameCode]` | 游戏启动（含 callback） |
| `casino/promotions` | 赌场促销 |

**账户 (account/)** — 14 个子路由：

| 路由 | 说明 |
|------|------|
| `deposit` | 充值 |
| `withdraw` | 提现 |
| `transactions` | 交易记录 |
| `kyc` | 身份验证 |
| `security` | 安全设置 |
| `notifications` | 通知中心 |
| `support` | 客服 |
| `faq` | 常见问题 |
| `affiliate` | 代理 |
| `settings` | 设置 |
| `gambling-games` | 负责任博彩 |
| 等 | — |

**法律 (legal/)**：`terms`、`privacy`、`responsible-gaming`、`aml-kyc`

### 独立路由

| 路由 | 说明 |
|------|------|
| `signin/` | H5 移动端登录 |
| `test/` | 测试页面（需生产安全守卫） |

---

## 国际化 (src/i18n/)

### locale/

| 文件 | 用途 |
|------|------|
| `config.ts` | 路由配置：支持 `pt`/`es`/`en`，默认 `pt` |
| `request.ts` | `getRequestConfig` — SSR 端国际化加载 |
| `navigation.ts` | 导出 `Link`、`redirect`、`useRouter`、`usePathname`（自动补全 locale 前缀） |
| `utils.ts` | `getClientLocale` — 客户端获取当前语言 |

> **重要**：内部导航必须从 `@/i18n` 导入 `Link`/`useRouter`/`redirect`，不要用 `next/link` 或 `next/navigation`（会丢失 locale 前缀）。

### i18nV2/

| 文件 | 用途 |
|------|------|
| `services/constant.ts` | `regionConfigs`：BR/MX 的 `intlLocale`、`supportLanguages`、`defaultLanguage`、`currencyCode`、`timezone`、`timezoneUTC` |
| `store.ts` | `useI18nStore`、`useRegionCode()`、`useRegionConfig()`、`useRegionIntlLocale()` |
| `services/effect.tsx` | 登录后从接口同步 region，写入 `CacheKey.I18nRegion`，再驱动地区和货币初始化 |

**使用规则**：
- 需要格式化日期/数字/金额时，优先取 `useRegionIntlLocale()`，不要直接用 `RegionCode`。
- `useCurrencyCode()` 会优先返回登录用户缓存币种，游客回退到 `regionConfig.currencyCode`。
- 语言切换写入 `CacheKey.NextLocale`（`NEXT_LOCALE_2`），`proxy.ts` 会按区域支持语言做校验并补默认语言。
- 时区展示优先用 `regionConfig.timezoneUTC`，实际格式化用 `regionConfig.timezone` 或 `useTimeZone()`。

### region/

| 文件 | 用途 |
|------|------|
| `constants.ts` | 地区注册表：BR（+55/CPF/BRL）、MX（+52/RFC/MXN） |
| `types.ts` | `RegionCode`、`RegionConfig` 类型定义 |

---

## Mock 系统

历史上的 `src/mocks` / MSW mock 体系已移除。当前仓库不再提供统一的开发期请求拦截层；如需临时模拟接口，请在具体测试方案或业务模块内按需实现替代方案。
