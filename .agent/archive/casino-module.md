# Casino 模块 (已归档)

> Casino 游戏大厅 + 三方 iframe 嵌入 | 创建 2026-03-14 | 更新 2026-03-31

## 概览

| # | 事项 | P | 状态 |
|---|------|---|------|
| 1-4 | 路由组, 共享外壳, casino 模块, 导航接通 | P0 | ✅ |
| 5-11 | 侧边栏分类, API 模型+接口, Mock, 过滤栏, 首页, GameCard, 详情页 | P0-P1 | ✅ |
| 12-16 | 分类页, iframe 嵌入, `gameFetcher`, CSP, i18n | P0-P1 | ✅ |
| 16a | 接通游戏列表 API `tag_id` + `useQueries` | P0 | ✅ |
| 17 | 分类页供应商过滤 (CheckboxFilter) | P1 | ❌ |
| 18 | 分类页排序 (popular/newest) | P2 | ❌ |
| 19 | 移动端适配 | P2 | ❌ |
| 15d | 后端 CORS 配置游戏服务 | P0 | ⏳ 等待后端 |

## 架构

### 路由
```
(casino)/ → CasinoLayoutClient (侧边栏 + 内容, 无 BetSlip)
  casino/page.tsx → 重定向第一个 lobbyId
  casino/[lobbyId]/page.tsx → 大厅页
  casino/game/[gameCode]/page.tsx → 详情 + iframe
  casino/game/callback/page.tsx → 退出 callback 中间页
  casino/category/[slug]/page.tsx → 分类 L2
```

### 模块 `src/modules/casino/`
- `_components/`: casino-sidebar, filter-bar (URL 驱动), game-card (next/image), game-section (Embla 轮播)
- `_constants/`: sidebar-categories (13项), filter-tags (i18n + BadgeVariant), category-config (slug→titleKey)
- `home/casino-home.tsx`: banner + 过滤栏 + API tag 驱动分区
- `game/game-detail-page.tsx`: 封面图 ↔ iframe 条件渲染, `useGameMessage` postMessage 监听
- `category/category-page.tsx`: 网格 + 排序 + 分页

### 游戏供应商集成 (Rectangle Games — Seamless Wallet)

Rectangle 调用**我方后端** API 做钱包操作，前端只负责启动 + 展示。

**启动流程**: 详情页 mount → `POST /v1/games/launch { game_id, game_code, tag_name, return_url }` → 后端返回 `game_url` (含 session token) → 嵌入 iframe → 全屏切换可用

**退出机制**: 游戏结束 → 三方跳转 return_url (callback 中间页) → `postMessage({ type: 'GAME_CLOSED' })` → `useGameMessage` 收到 → iframe 卸载

**安全**: CSP `frame-src 'self' https:`, postMessage 仅接受 `event.origin === window.location.origin`

**余额同步**: 纯服务端 Seamless Wallet，NavBar 余额通过 SSE 实时推送更新，无需轮询。

### 大厅架构
- URL 驱动过滤: `?tag=slots` → searchParams → activeTag → filteredContent
- 策略模式: filter-tags 配置 i18n key + icon + badge
- 大厅视图 API 驱动: 遍历 tags[] 每个 tag 渲染 GameSection (`SECTION_GAME_LIMIT = 15`)

## 风险
| 风险 | 缓解 |
|------|------|
| 布局代码重复 | modular-architecture P3/P4 抽取共享外壳 |
| `X-Frame-Options: DENY` | iframe onError → 兜底 `window.location.href` |
| 跨域 Cookie | 确认三方 `SameSite=None; Secure` |
| GameCard `unoptimized` | 待 CDN 配置解决 → performance plan #2.1 |
