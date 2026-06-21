# 常用任务

## 新增 API
1. `src/api/models/` 定义 Model → 2. `src/api/handlers/*.ts` 定义 Interface → 3. 在 `src/modules/` 中使用

## 新增图标
1. 从设计稿导出 SVG → 2. 放入 `src/assets/icons2/`（kebab-case，模块前缀）→ 3. `pnpm icon2:build` → 4. `import { Name } from '@/components/icons2/Name'`
> 另见：`.agent/references/icon-conventions.md`

## 新增页面 / 路由
每个新的 `page.tsx` **必须** 导出 `generateMetadata`：
```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('namespace');
    return { title: t('pageTitle') };
}
```
动态路由：接受 `params`，从数据/i18n 解析标题 — 禁止直接用 slug。

## 新增模块
1. `src/modules/` 创建文件夹含 `_components/`、`_hooks/`、`_logic/`、`_constants/` → 2. `src/app/[locale]/` 创建路由

## 响应式适配
- `useIsMobile()` < 768px / `useIsTablet()` 768-1024px / `useIsDesktop()` >= 1024px
- 桌面端：Sidebar(200↔60px) + Content + BetSlipPanel(308px)
- 移动端：单栏 + BottomTabBar

## Mock
项目内的 `src/mocks` / MSW 体系已移除，如仍需模拟接口，请优先评估使用测试桩、E2E fixtures 或局部业务假数据的替代方案。
