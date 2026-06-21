# Champion Handicap 路由实现计划

## 概览

| 任务项 | 状态 | 优先级 |
|--------|------|--------|
| Figma 设计分析 | ✅ 完成 | 高 |
| 多语言配置（en/es/pt） | ✅ 完成 | 高 |
| 模块结构创建 | ✅ 完成 | 高 |
| 页面组件实现（一比一还原） | 🔧 进行中 | 高 |
| 设计令牌应用 | 🔧 进行中 | 高 |
| API 层集成（activityFetcher + vip handler/model） | ✅ 完成 | 高 |
| 活动加入状态查询（useChampionHandicapInfo） | ✅ 完成 | 高 |
| Join Now 未登录拦截（openLoginModal） | ✅ 完成 | 高 |
| 共享返回按钮提取（PromotionBackButton） | ✅ 完成 | 中 |
| Join Now 已登录调用接口（JoinChampionHandicapInterface） | ✅ 完成 | 高 |
| 验证和测试 | ❌ 未开始 | 中 |

---

## 当前模块结构（2026-05-06，已更新）

```
src/modules/marketing/promotion/champion-handicap/
├── index.tsx                    ← ChampionHandicapView（页面入口，调用 useChampionHandicapInfo）
├── hero-section.tsx             ← 接收 isJoin / isJoining / onJoin props，处理登录拦截和加入动作
├── steps-section.tsx
├── calculation-section.tsx
├── terms-section.tsx
├── _constants/
│   └── data.ts                  ← 静态数据（rewards、steps、tables、terms）+ 图片导出
├── _components/
│   ├── calculation-table.tsx
│   └── section-title.tsx
└── _hooks/
    └── use-champion-handicap-info.ts  ← useQuery（GetChampionHandicapInfoInterface）+ useMutation（JoinChampionHandicapInterface，onSuccess invalidate，onError Toast）

src/api/
├── handlers/vip.ts              ← activityFetcher 调用：VIP + 冠军盘接口
├── models/vip.ts                ← VIP/冠军盘类型定义
└── client.ts                    ← activityFetcher（NEXT_PUBLIC_ACTIVITY_SERVICE）
```

**外部依赖：**
- `src/modules/marketing/promotion/_images/` — Hero 背景图、奖杯图
- `src/modules/marketing/promotion/_components/promotion-back-button.tsx` — 共用返回按钮（已从 first-deposit-bonus 提取）
- `src/modules/marketing/promotion/_constants/promotion-cards.ts` — 促销列表卡片配置
- `src/modules/marketing/promotion/detail/index.tsx` — slug `champion-handicap` 注册入口
- `src/stores/session-store.ts` — `useUser()` 获取当前用户 uid
- `src/stores/ui-store.ts` — `openLoginModal()` 触发登录弹窗

---

## 待修复问题（CR 结果，2026-05-06 更新）

> 已完成：步骤卡右上角装饰图渲染 ✅、`step.image` 数据清理 ✅、计算表 tooltip ✅、模块重组到 `champion-handicap/` 子目录 ✅、`align-stretch` 修正 ✅、CSS 变量 `--ch-green` / `--ch-green-bg` 在根容器定义 ✅、`PromotionBackButton` 提取 ✅、登录拦截 ✅、活动加入状态查询 ✅、Join Now 已登录调用接口 ✅（useMutation + onSuccess invalidate + onError Toast）、API URL 路径修正 ✅（`/worldCupChampion/info|join`，环境变量补 `/h5`）

### P0 — 必须修复

| # | 位置 | 问题 |
|---|------|------|
| 1 | `src/components/icons/promo-clock.tsx` | **图标内容错误**：`promo-clock.svg` 已从 git 恢复为原始时钟，但 `promo-clock.tsx` 未重新构建。修复：`npx @svgr/cli --config-file .svgrrc.json --out-dir src/components/icons src/assets/icons/promo-clock.svg` |
| 2 | `src/api/handlers/vip.ts:48` | **字段名 typo**：`rewradType` 应为 `rewardType`，需与后端 API 协议核实后修正 |
| 3 | `champion-handicap/index.tsx` | **`ChampionHandicapInfoSection` 未挂载**：活动时间/参与条件等信息卡片缺失。修复：在 `<ChampionHandicapHeroSection />` 后加入该 Section |

### P1 — 视觉 / 架构

| # | 位置 | 问题 |
|---|------|------|
| 4 | `champion-handicap-hero-section.tsx` | `font-poppins` 用法违规（规则禁止手动 Poppins），多处裸 hex（`#006847`、`#1E293B`）和裸字号（`text-[16px]`、`text-[10px]`、`text-[40px]`、`text-[66px]`）。`#006847` 无对应令牌，应在 `champion-handicap` 模块作用域内定义 CSS 变量 `--ch-green: #006847` |
| 5 | `champion-handicap-steps-section.tsx` | 同上：`text-[#64748B]`（→ `text-filltext-ft-f`）、`bg-[#F0FDF4]`/`text-[#006847]`/`border-[#006847]`（→ `--ch-green`） |
| 6 | `champion-handicap-terms-section.tsx` | `bg-[#006847]`（→ `--ch-green`） |
| 7 | `champion-handicap-calculation-table.tsx` | `rightValueStyle = { color: '#006847' }`（→ `--ch-green`） |
| 8 | `champion-handicap-hero-section.tsx` | 两个 CTA 按钮（Join Now / Go to Bet）无 `onClick` 逻辑，未使用共享 `Button` 组件 |
| 9 | `champion-handicap-hero-section.tsx` | 内联 TODO 注释应移至此计划文件而非留在组件代码中 |
| 10 | `champion-handicap-steps-section.tsx` | 标题使用 `<div>` 而非语义化 `<h2>` |

### 绿色令牌策略（因 `#006847` 无项目级令牌）
在 `champion-handicap/index.tsx` 根容器或对应 CSS 文件中定义局部变量：
```css
/* champion-handicap 模块专属颜色 */
--ch-green: #006847;
--ch-green-bg: #F0FDF4;
```
然后用 `text-[--ch-green]`、`bg-[--ch-green-bg]`、`border-[--ch-green]` 替换所有裸 hex。

## 背景

### 路由层级关系

新增 `/casino/promotions/champion-handicap` 详情页内容，沿用现有动态路由 `/casino/promotions/[slug]`：

```
src/app/[locale]/(main)/(casino)/casino/promotions/
├── page.tsx                 # /en/casino/promotions
└── [slug]/                  # /en/casino/promotions/first-deposit-bonus
│   └── page.tsx
```

**关键点**：
- 两者都在 `(casino)` 路由组下
- 都属于 `casino/promotions/` 路径
- 都由 `[slug]/page.tsx` 导出 `promotion-detail-page` 承载
- 不新增 `champion-handicap/page.tsx`，只在 `PROMOTION_PAGES` 中注册 slug
- URL 结构清晰：`/casino/promotions/champion-handicap`

### 设计要求

**一比一还原 Figma 设计**：
- 桌面设计链接：https://www.figma.com/design/bnINV7AJU1oB8MatpAkAIV/Goto-web?node-id=9771-522084&m=dev
- 移动端设计链接：https://www.figma.com/design/bnINV7AJU1oB8MatpAkAIV/Goto-web?node-id=9775-532108&m=dev
- 目标：墨西哥冠军盘页面样式
- 要求：像素级精确对齐，包括间距、颜色、字体、圆角、阴影等

## Figma 转实现文档

# 📦 Champion Handicap 促销详情页

> 当前计划面向可执行开发。Figma 的固定画板宽高只作为视觉参考，代码实现需转为响应式布局；间距、颜色、字体、圆角、阴影等设计属性按 Figma dev mode 与项目 Tailwind v4 令牌逐项映射。

## 0. 现有模块复用与命名约定

- `src/modules/marketing/promotion/promotion-view.tsx` 已内联实现移动端返回按钮；当前模块内没有独立 `MobileBackButton` 组件。
- Champion Handicap 不应再复制一份返回按钮逻辑，应先提取 promotion 模块私有组件：`src/modules/marketing/promotion/_components/promotion-back-button.tsx`。
- 文件命名遵循当前 promotion 模块主流风格：`kebab-case.tsx`，例如 `promotion-view.tsx`、`hero-section.tsx`、`how-it-works-section.tsx`、`terms-section.tsx`。
- 当前临时文件 `championHandicapView.tsx` 命名不符合模块现有风格，正式实现时应改为 `champion-handicap-view.tsx`，并同步更新 `promotion-detail-page.tsx` 的导入。
- 页面级 section 组件优先放在 `src/modules/marketing/promotion/` 根目录，延续现有 `hero-section.tsx`、`bonus-details-section.tsx`、`how-it-works-section.tsx` 模式；跨页面可复用的小组件放入 `_components/`。
- 现有 section 组件通常直接读取 `useTranslations('promotion')` 和模块内 constants，不通过页面层传入大量 props；Champion Handicap 也应优先保持这种风格，只在内部小组件需要渲染单项数据时传 props。
- 现有促销列表入口来自 `_constants/promotion-cards.ts`，新增详情页时也必须同步新增列表卡片配置，否则只能直达 URL，无法从 `/casino/promotions` 进入。

## 1. 页面结构（Layout）

```text
PromotionDetailPage / champion-handicap
└── ChampionHandicapView
    ├── PromotionBackButton                  # reused from _components, mobile only
    ├── ChampionHandicapHeroSection          # Flex: mobile column / desktop row
    │   ├── HeroContent
    │   │   ├── Badge
    │   │   ├── Title
    │   │   ├── Subtitle / Description
    │   │   └── CTA Button
    │   └── HeroVisual
    │       └── Optimized Image
    ├── ChampionHandicapInfoSection          # Grid: campaign info cards
    ├── ChampionHandicapRewardsSection       # Grid / table-like reward cards
    ├── ChampionHandicapStepsSection         # Flex / Grid: how to join
    ├── ChampionHandicapTermsSection         # Accordion or stacked rules
    └── ResponsibleGamingSection             # Shared section if design includes it
```

- 页面根容器：`relative flex flex-col items-center w-full overflow-x-hidden`。
- 主内容容器：使用 `max-w-(--main-content-max-width) mx-auto w-full px-4 md:px-8`。
- Hero 区域：
  - 移动端：`flex-col`，视觉图在上，文案在下。
  - 桌面端：`md:flex-row`，文案左侧，视觉图右侧。
- 内容区：
  - 移动端：单列纵向堆叠。
  - 桌面端：信息卡、奖励卡、步骤卡使用 `grid`，按 Figma 列数映射到响应式列。
- Header / Footer：
  - 页面自身不新增全局 Header / Footer，继承 `(main)/(casino)` 路由布局。
  - 移动端保留促销详情页返回按钮模式。

## 2. 组件拆分（Component Breakdown）

### `PromotionBackButton`

- 文件位置：`src/modules/marketing/promotion/_components/promotion-back-button.tsx`。
- 功能描述：促销详情页移动端固定返回按钮，从现有 `PromotionView` 内联按钮提取，供 `PromotionView` 与 `ChampionHandicapView` 复用。
- Props 设计：

```typescript
interface PromotionBackButtonProps {
  className?: string;
}
```

- 是否可复用：是，promotion 模块内复用。
- 实现要求：
  - 内部使用 `useIsDesktop()` 控制桌面端不渲染。
  - 内部使用 `useRouter()` from `@/i18n`，点击执行 `router.back()`。
  - 样式保留现有促销详情页按钮：`group/back fixed left-4 top-[calc(3.5rem+1.5rem)] z-10 flex items-center justify-center size-10 rounded-full bg-neutral-white-h shadow-sm cursor-pointer`。
  - 图标继续使用 `ArrowLeft`，hover 状态保持 `group-hover/back:text-filltext-ft-g`。

### `ChampionHandicapView`

- 文件位置：`src/modules/marketing/promotion/champion-handicap-view.tsx`。
- 功能描述：页面编排组件，组合 Champion Handicap 各区块，不承载复杂 UI 细节。
- Props 设计：

```typescript
interface ChampionHandicapViewProps {}
```

- 是否可复用：否，页面级组件。

### `ChampionHandicapHeroSection`

- 文件位置：`src/modules/marketing/promotion/champion-handicap-hero-section.tsx`。
- 功能描述：展示活动主视觉、标题、说明、活动标签和主 CTA。
- Props 设计：

```typescript
interface ChampionHandicapHeroSectionProps {}
```

- 是否可复用：否，页面专用 section。
- 实现要求：组件内部读取 `useTranslations('promotion')` 和 `CHAMPION_HANDICAP_HERO_IMAGE`，保持与现有 `HeroSection` 一致。

### `ChampionHandicapInfoSection`

- 文件位置：`src/modules/marketing/promotion/champion-handicap-info-section.tsx`。
- 功能描述：展示活动时间、参与条件、适用范围、奖励入口等核心信息。
- Props 设计：

```typescript
interface ChampionHandicapInfoItem {
  id: string;
  label: string;
  value: string;
  description?: string;
}

interface ChampionHandicapInfoSectionProps {
  items?: ChampionHandicapInfoItem[];
}
```

- 是否可复用：是，可复用于其他促销信息卡片区。
- 实现要求：默认从 `CHAMPION_HANDICAP_INFO_ITEMS` 读取配置；只有抽成通用小组件时才显式传入 `items`。

### `ChampionHandicapRewardsSection`

- 文件位置：`src/modules/marketing/promotion/champion-handicap-rewards-section.tsx`。
- 功能描述：展示 Champion Handicap 的奖励规则、档位或权益说明。
- Props 设计：

```typescript
interface ChampionHandicapReward {
  id: string;
  title: string;
  value: string;
  description: string;
  highlighted?: boolean;
}

interface ChampionHandicapRewardsSectionProps {
  rewards?: ChampionHandicapReward[];
}
```

- 是否可复用：是，可复用为促销奖励卡片。
- 实现要求：默认从 `CHAMPION_HANDICAP_REWARDS` 读取配置，标题和文案来自 `promotion.championHandicap`。

### `ChampionHandicapStepsSection`

- 文件位置：`src/modules/marketing/promotion/champion-handicap-steps-section.tsx`。
- 功能描述：展示参与流程，例如进入页面、选择赛事、投注、满足条件、领取奖励。
- Props 设计：

```typescript
interface ChampionHandicapStep {
  id: string;
  title: string;
  description: string;
  image?: StaticImageData;
}

interface ChampionHandicapStepsSectionProps {
  steps?: ChampionHandicapStep[];
}
```

- 是否可复用：是，可参考现有 `HowItWorksSection` 的表现方式。
- 实现要求：默认从 `CHAMPION_HANDICAP_STEPS` 读取配置，布局和动效参考 `how-it-works-section.tsx`。

### `ChampionHandicapTermsSection`

- 文件位置：`src/modules/marketing/promotion/champion-handicap-terms-section.tsx`。
- 功能描述：展示活动规则、限制条件、提款要求等长文本。
- Props 设计：

```typescript
interface ChampionHandicapTermGroup {
  id: string;
  title: string;
  items: string[];
}

interface ChampionHandicapTermsSectionProps {
  groups?: ChampionHandicapTermGroup[];
}
```

- 是否可复用：是，可作为促销规则组件。
- 实现要求：优先复用现有 `Collapsible` 组件，规则配置参考 `RULES_CONFIG` 的结构。

### `ChampionHandicapPromotionCard`

- 文件位置：不单独建组件，优先在 `src/modules/marketing/promotion/_constants/promotion-cards.ts` 新增 `CHAMPION_HANDICAP_PROMOTION` 配置。
- 功能描述：让 Champion Handicap 出现在 `/casino/promotions` 列表中。
- 配置字段：

```typescript
const CHAMPION_HANDICAP_PROMOTION: PromotionItem = {
  id: 'champion-handicap',
  titleKey: 'list.cards.championHandicap.title',
  descriptionKey: 'list.cards.championHandicap.description',
  backgroundImage: ChampionHandicapCardBg,
  foregroundImage: ChampionHandicapCardFg,
  priority: 90,
  category: 'casino',
  slug: 'champion-handicap',
};
```

- 是否可复用：不适用，属于列表配置。

## 3. 交互逻辑（Interactions）

- hover：
  - CTA 使用现有 `Button` 的 hover / active 状态。
  - 卡片 hover 如 Figma 有状态，则使用 `transition-colors`、`shadow` 或背景色令牌实现。
  - 图标使用 `currentColor`，颜色类放在共同父级，保证图标和文字同步变色。
- click：
  - 移动端返回按钮：复用 `PromotionBackButton`，内部调用 `router.back()`。
  - CTA 未登录：调用 `openLoginModal()`。
  - CTA 已登录：跳转到活动指定入口，优先使用项目已有导航 hook；如果跳转站内路由，使用 `@/i18n` 导出的 `Link` / `useRouter`。
  - 规则区如果 Figma 是折叠样式：点击标题展开 / 收起。
- loading：
  - 如果活动状态来自接口，Hero 中活动时间或 CTA 区域展示 skeleton。
  - skeleton 参考现有 `HeroValiditySkeleton` 风格，不新增复杂状态系统。
- disabled：
  - 活动未开始、已结束或接口状态不可参与时禁用 CTA。
  - disabled 视觉必须匹配 Figma：颜色、透明度、cursor、阴影都单独检查。
- 空状态：
  - 奖励、步骤、规则配置为空时不渲染对应 section。
  - 不写硬编码兜底文案；所有展示文案来自 i18n。

## 4. 响应式策略（Responsive）

- 移动端优先实现，桌面端通过视口媒体查询断点增强。
- 推荐断点：
  - 默认（< 768px）：移动端单列布局。
  - `md:`（≥ 768px）：PC 端，Hero 切换为左右布局，内容卡片切换为多列，增加 section padding、卡片间距。
- 不使用容器查询（`@lg`、`@5xl` 等），统一使用 `md:` 视口媒体查询区分移动/PC。
- 不直接照搬 Figma 固定宽高：
  - Figma 的间距、颜色、阴影、字体、圆角映射为项目令牌。
  - Figma 的容器宽度转为 `max-w-(--main-content-max-width)`、`flex-1`、`grid-cols-*`。
- 图片策略：
  - 使用 Next.js `<Image>`，设置明确 `width` / `height`。
  - 从 Figma 导出 2x 或 4x，优先 WebP / PNG，放在 `src/modules/marketing/promotion/_images/`。
  - Hero 图设置 `priority`，下方装饰图不设置 `priority`。

## 5. 实现步骤（Step-by-step TODO）

1. 使用 Figma dev mode 分别检查桌面节点 `9771-522084` 和移动端节点 `9775-532108`，记录布局层级、字体、颜色、圆角、阴影、间距、图片资源。
2. 从 Figma 导出资源：Hero 图、促销列表卡片背景 / 前景图、装饰图、步骤图标；命名为 `champion-handicap-*`，放入 `src/modules/marketing/promotion/_images/`，并更新 `_images/index.ts` 导出。
3. 补充 i18n 文案：在 `src/assets/locales/{en,es,pt}/promotion.ts` 的 `promotion` 命名空间下新增 `championHandicap`，覆盖 `metadata`、`hero`、`info`、`rewards`、`steps`、`terms`、`cta`。
4. 补充促销列表文案：在 `list.cards.championHandicap.title` 和 `list.cards.championHandicap.description` 增加三语言文案。
5. 新增静态配置：创建 `src/modules/marketing/promotion/_constants/champion-handicap-data.ts`，定义图片、信息卡、奖励档位、步骤、规则配置。
6. 新增促销列表配置：在 `_constants/promotion-cards.ts` 增加 `CHAMPION_HANDICAP_PROMOTION`，并把它加入 `getPromotionsByCategory()` 的 `cards` 数组。
7. 提取返回按钮：从 `promotion-view.tsx` 中提取 `PromotionBackButton` 到 `_components/promotion-back-button.tsx`，再让 `PromotionView` 与 `ChampionHandicapView` 共同复用。
8. 统一文件命名：将临时 `championHandicapView.tsx` 改为 `champion-handicap-view.tsx`，并同步更新 `promotion-detail-page.tsx` 导入。
9. 完善详情页映射：在 `PROMOTION_PAGES` 中绑定 `champion-handicap` 到 `ChampionHandicapView`，继续使用现有 `/casino/promotions/[slug]`，不新增独立 route 目录。
10. 完善 metadata：如设计或 SEO 需要 description，将 `PROMOTION_PAGES` 扩展为同时支持 `titleKey` / `descriptionKey`，并从 `promotion.championHandicap.metadata` 读取。
11. 实现 `ChampionHandicapView`：只负责组合 section，并复用 `PromotionBackButton`。
12. 实现 `ChampionHandicapHeroSection`：使用 `Button`、`next/image`、`motion`，CTA 处理登录和跳转。
13. 明确 CTA 去向：实现前确认按钮是跳转投注页、活动赛事页、充值页还是登录后留在当前页；站内跳转必须使用 `@/i18n` 导航。
14. 实现 `ChampionHandicapInfoSection`、`ChampionHandicapRewardsSection`、`ChampionHandicapStepsSection`、`ChampionHandicapTermsSection`：优先复用现有促销页样式模式，样式使用 Tailwind v4 设计令牌。
15. 对照 Figma 校验：逐项检查字体、颜色、圆角、阴影、间距、hover、active、disabled。
16. 验证多语言路由：测试 `/en/casino/promotions/champion-handicap`、`/es/casino/promotions/champion-handicap`、`/pt/casino/promotions/champion-handicap`。
17. 验证列表入口：测试 `/en/casino/promotions`、`/es/casino/promotions`、`/pt/casino/promotions` 中 Champion Handicap 卡片展示与跳转。
18. 运行检查：执行 `pnpm lint:ts`，必要时运行 `pnpm build` 做生产构建验证。

## 参考资料

- Figma 桌面设计：https://www.figma.com/design/bnINV7AJU1oB8MatpAkAIV/Goto-web?node-id=9771-522084&m=dev
- Figma 移动端设计：https://www.figma.com/design/bnINV7AJU1oB8MatpAkAIV/Goto-web?node-id=9775-532108&m=dev
- Figma 工作流：`.agent/references/figma.md`
- 设计令牌：`.agent/references/design-tokens.md`
- 图标约定：`.agent/references/icon-conventions.md`
- 参考模块：`@/modules/marketing/promotion/`
