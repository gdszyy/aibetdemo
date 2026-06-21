# 个人中心路由化 + Login 路由化

> 弹窗 → 独立路由页面 | 创建 2026-04-02 | 更新 2026-04-20

## 概览

| # | 事项 | P | 状态 |
|---|------|---|------|
| 1-6 | Route 基础设施 + 13 页面迁移 | P0 | ✅ |
| 7a | Transaction 分页改造 (Pagination + usePagePagination) | P1 | ✅ 已接入 |
| 7b | Transfer Order V2: cursor-based + Adapter + filters | P1 | ✅ |
| 7c | Bet History V2 + Detail Modal + Figma 对齐 | P1 | ✅ |
| 7d | Balance 卡片网格 + Transactions V2 | P1 | ⏳ sportBonus ✅; 其他 bonus 类型仍为 mock |
| 8-10 | 导航迁移 + Auth/KYC 守卫 | P0 | ✅ |
| 11 | LoginURLSync 弹窗 ↔ URL 同步 | P1 | ❌ |
| 12 | `/signin` H5 + H5 账户菜单 Figma 对齐 | P1 | ✅ |
| 13 | 清理旧弹窗代码 + Transaction V1 legacy | P1 | ✅ |

## 架构决策

- **路由**: `account/` 真实路由段, URL `/account/deposit` 等
- **导航**: `RouteAccountNavigator` — `useAccountNavigator` hook + `navigateToAccount` 静态函数
- **路由配置**: `ACCOUNT_ROUTES` 位��� `@/constants/account-routes.ts` — 策略模式
- **布局**: `AccountLayoutClient` (认证守卫, 固定侧边栏, RightAside)
- **移动端**: `/account` → `AccountMenuClient` (分组卡片菜单)

## 剩余 TODO

### #7d Balance bonus 类型扩展
sportBonus 已接入真实 API。其他 bonus 类型（casinoBonus 等）仍使用 mock 数据，待后端 API ready。

### #11 LoginURLSync
- 方案: `history.pushState('/signin')` 打开弹窗时，`popstate` 关闭弹窗
- 直接访问 `/signin` → 渲染独立页面（H5Signin 已实现）
