# 模块化架构 — 可插拔多团队协作

> 可插拔评分：3/10 → 目标 8/10

## 概览

| # | 事项 | 状态 |
|---|------|------|
| 1 | P1: 公共 API 治理（跨模块私有 import → 公共位置） | ⏳ (4/7 完成, ~41 跨模块私有 import 剩余, 主要 bet-slip→match) |
| 1a | P1: MatchListBase 解耦 hot-matches Filters | ❌ |
| 2 | P2: Store 解耦（拆分 useUIStore → Shell + Sports） | ❌ |
| 3 | P3: Home 模块拆分（shell vs sports-home） | ❌ |
| 4 | P4: Layout 依赖倒置（Shell slots） | ❌ |
| 4a | P4: 提取共享 Layout 组件 | ❌ (RightAside 仍在 `home/_components/`, 3 处跨模块 import) |
| 5 | P5: pnpm 分包 | ❌ |
| 6 | P6: Shell 独立构建验证 | ❌ |

## 6 个关键耦合点

1. **根 Layout → Sports**: `CartCleanupListener`, `AppShell` 直接 import
2. **Sports Layout = 编排器**: 直接 import BetSlipPanel, Sidebar, NavigationBar 等
3. **UI Store 已瘦身**: user-center modal 字段已移除 (52 行), 但仍混合 shell + sports 状态
4. **Home 模块身份模糊**: 既含 shell 组件 (NavBar, AppShell) 又含 sports 组件 (HotMatches)
5. **~41 跨模块私有 import** (2026-04-15 审计): 主要 bet-slip→match/_constants/match.types + match/_utils, app routes→home/_components, balance→security-center
6. **共享 Hooks 混入 Sports**: `use-bet-observer`, `use-market-config` 在通用 hooks 目录

## 目标架构

```
packages/shared/ ← 类型、工具、UI、API | shell/ ← 布局、认证、钱包 | sports/ ← 赛事、注单 | app/ ← 路由组合层
依赖方向：app → sports, shell → shared（严格单向，禁止互相 import）
```

## P1 操作清单

1. `getSportConfig` → `@/constants/sports-config.ts` ✅
2. `OddsFormat` → `@/utils/odds-format.ts` ✅ (在 utils 而非 constants，可接受)
3. `UserCenterMenu/SourceEnum` → `@/constants/user-center.ts` ✅
4. `isSelectionInvalid` → ❌ **仍在 `match/_utils/selection-validity.ts`**，`bet-slip/_utils` 跨模块 import
5. `checkSelectionLimit` → `@/utils/selection-limit.ts` ✅
6. `isSameSpecifier` → `@/utils/specifier.ts` ✅
7. MatchListBase: Filters 作为 render prop 注入 ❌ (未开始)

当前跨模块私有 import: **~41 处** (2026-04-15 审计, 大幅减少; 主要来源: bet-slip→match ~20处, app routes→modules ~15处, 其余零散)

## P2-P4 概要

- **P2**: 拆 `useUIStore` (52行) → `useShellUIStore` (loginModalOpen, languageModalOpen, sidebarCollapsed) + `useSportsUIStore` (betSlipDrawerOpen). user-center 字段已移除。
- **P3**: 创建 `src/modules/shell/` ← NavBar, AppShell, BottomTabBar, RightAside; sports 首页保留在 `match/home/`
- **P4**: Layout slots 化，Shell 不感知 sports/bet-slip; `CartCleanupListener` 迁入 sports layout
- **P4a**: 提取 `LayoutSidebar` + `LayoutRightAside` 到 `@/components/layout/`

## P5-P6 (远期)

pnpm monorepo 分包 → 各包独立构建验证。Monorepo vs Fork 按团队需求决定（解耦质量是前提）。
