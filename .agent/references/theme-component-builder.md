# 主题落地手册：新增主题 / 新增多主题组件

> 目的：把「新增一套配色方案」与「做一个按主题发散的组件」两条高频流程，沉淀成可照着改的清单。
> 这是 Cowork 同名技能 `theme-component-builder`（引导问参数 → 直接改代码 → 跑 `theme:check`）的**仓库内副本**：装了技能就让它带着走，没装就照本手册手改。
> 配套：颜色链机制细节见 [`scheme-system.md`](./scheme-system.md)；分层设计与取舍见 [`../plans/theme-brand-mode-component-architecture.md`](../plans/theme-brand-mode-component-architecture.md)。

## 0. 心智模型：`scheme = brand × mode`

挂到 `<html>` 的 class（如 `betbus`）是**唯一真值**，由 `scheme-meta.ts` 的 `SCHEME_META` 映射成 `{ brand, mode }`。
所有派生逻辑**只认 `brand` / `mode`，绝不直接 switch `scheme` 名**——`gtb` 是唯一历史特例（brand=superbet、mode=light，但结构沿用 betbus、skin 用专属 `GTB_UI_STYLE`，在解析器/skin/gate 各处单独特判）。

当前 8 套 scheme：`gtb` `betbus` `match` `match-light` `superbet-light` `superbet-dark` `betano-light` `betano-dark`。
brand ∈ {`superbet` `betano` `betbus` `match`}，mode ∈ {`light` `dark`}。

随主题变的东西分四类，决定「新东西放哪」——这四个旋钮是全篇地基：

| 要随主题变的 | 旋钮 | 落点 | 组件怎么消费 |
|---|---|---|---|
| 通用颜色（底/字/边/主色） | 语义令牌 | `theme.css` 的 `:root.<scheme>` + `tokens.css @theme` | 语义工具类 `bg-surface-1` `text-content-primary` `bg-brand-primary-0` |
| 品牌专属颜色（语义令牌覆盖不到） | skin 表 | `brand-ui-skin.ts` 的 `--brand-*`（brand×mode 各一份） | `var(--brand-xxx, 兜底)` |
| 尺寸/圆角/宽高/间距 | profile.style | `component-profile.ts` 各 `*_PROFILE.style` 的 `--component-*` | `var(--component-xxx, 兜底)` |
| 布局/子组件/渲染哪棵子树 | profile 判别字段 | `ThemeComponentProfile` 加字段 + 每 brand 填值 | `match(p.<组>.profile)` + `data-*` 钩子 |

颜色靠三段式令牌链自动换肤（改 `<html>` class 即可，组件零改动）：`theme.css` 原始色变量 → `tokens.css @theme` 间接引用成 `--color-*` → 工具类 `bg-* / text-*`。机制详解见 `scheme-system.md` §1。

> **动手前先把上表读进脑子**：80% 的返工是「颜色塞错层」——通用色硬编码进了 skin、或尺寸写死没进 profile。

## 1. 先判定走哪支

- **A. 新增主题**：要多一套配色 / 新品牌 / 新明暗 / 复制某主题改色 → §2。
- **B. 新增/改造多主题组件**：要一个在不同主题下表现不同的组件，或给已有组件加主题差异 → §3。

两支可同时命中（如先加 brand 再为它做专属组件），按顺序做。

## 2. 分支 A：新增主题

目标：新增 scheme `<name>`（brand `<brand>`、mode `<mode>`），全链路登记一致并通过 `theme:check`。
**先判断 brand 是复用还是新建**——决定改 6 处还是 10 处。

### A1. 先定参数

scheme 名（全小写连字符，如 `aurora-dark`）、brand（复用现有还是全新）、mode（light/dark，决定 `color-scheme` 与是否触发 17 键校验）、参考来源（最接近的现有 scheme，以它为模板复制再改最省力）、是否设为默认（`DEFAULT_SCHEME`，通常否）。

### A2. 改动清单

| # | 文件 | 复用 brand | 新 brand | 改什么 |
|---|---|:--:|:--:|---|
| 1 | `theme-provider/theme-provider.tsx` | ✅ | ✅ | `SCHEMES` 数组加 `'<name>'` |
| 2 | `theme-provider/scheme-meta.ts` `SCHEME_META` | ✅ | ✅ | 加 `'<name>': { scheme, brand, mode }` |
| 3 | `assets/css/theme.css` | ✅ | ✅ | 新增 `:root.<name> { … }` 块（见 A3） |
| 4 | `theme-provider/brand-ui-skin.ts` skin 常量 | ⚠️ 缺该 mode 才加 | ✅ | 加 `<BRAND>_LIGHT_UI_STYLE` / `<BRAND>_UI_STYLE` |
| 5 | `docs/theme-reference-index.md` | ✅ | ✅ | Theme Index 表加一行（首列反引号包 scheme 名） |
| 6 | `theme-provider/scheme-meta.ts` `SchemeBrand` | — | ✅ | 联合类型加 `'<brand>'` |
| 7 | `theme-provider/component-profile.ts` | — | ✅ | 定义 `<BRAND>_PROFILE` 并加进 `BRAND_PROFILE_BASE` |
| 8 | `theme-provider/brand-ui-skin.ts` `getBrandUiSkin` | — | ✅ | 加 `if (brand === '<brand>')` 分支 |
| 9 | `scripts/check-theme-index.ts` `getSkinKey` | — | ✅ | 加 `if (brand === '<brand>')` 分支 |

- **复用 brand → 只改 1–5 共 5 类（含 #4 仅当该 brand 缺这个 mode 的 skin 才加）。** `getBrandUiSkin` 的三元 `mode==='light' ? X_LIGHT : X` 会自动选到，无需改函数。
- **新 brand → 1–9 全做。** #6/#7 漏填会被 tsc 兜底报错；**#9 漏填最危险**：新 brand 的 light skin 不会被 17 键校验，gate 形同虚设、还不报错。

### A3. `theme.css` 的 `:root.<name>` 块怎么填

**复制最接近的现有块**（同 brand 优先、其次同 mode），保留全部变量名、只换取值。块内分区（以 `:root.betbus` 为模板）：

- `color-scheme: light|dark` —— 跟 `<mode>` 一致，让原生控件/滚动条对。
- 主色环 `--brand-primary-0..5`（0=主色，1/2=最浅底，3=hover/浅，4=按下/深，5=最深）。
- 灰阶 `--filltext-ft-a..h`（a=最底→h=主文字，**dark 整体反转**）；`--neutral-black-a..h`（dark 下黑系反转成白系）。
- `--neutral-white-*` **保持不变**（品牌色块上的白字，深底上仍需白）。
- 语义表面层 `--surface-1/2/3` `--surface-shell` `--border-subtle/strong` `--content-primary/secondary/muted/inverse` `--on-brand`。
- 形状 `--style-radius-*`、阴影 `--style-*-shadow`；赔率/移动 dock `--odds-selected-*` `--mobile-dock-action-*`；功能色 `--func-win/lost/favorite/bonus/pending/void`（dark 提亮保可读）。

取值参考 `scheme-system.md` §4 的 betbus↔GTB 映射表；dark 提亮、light 压暗，文字对比≥AA。

### A4. light skin 的 17 个必填键

`mode==='light'` 的 scheme，其 skin 常量体内**必须显式出现**这 17 个键，否则 `theme:check` 退出码 1（防 light 主题忘了定义 match 卡/赔率底色而塌成深色）：

```
--brand-match-card-bg          --brand-odds-bg
--brand-match-card-border      --brand-odds-border
--brand-match-card-hover-bg    --brand-odds-hover-bg
--brand-match-card-shadow      --brand-odds-hover-border
--brand-match-divider          --brand-odds-name
--brand-match-muted            --brand-odds-value
--brand-match-team-text        --brand-odds-selected-bg
--brand-match-league-text      --brand-odds-selected-hover-bg
                               --brand-odds-selected-text
```

dark skin 不强制这 17 键（缺失会落全局令牌兜底），但实践中应与 light 字段对称便于对照。

### A5. 校验（gate，必跑）+ QA

```bash
pnpm theme:check   # 必须输出 "Theme index is aligned."
pnpm lint:ts       # tsc --noEmit
pnpm lint          # biome
```

`theme:check`（`scripts/check-theme-index.ts`）校验四源 scheme 集合一致（`SCHEMES` / `SCHEME_META` keys / `theme.css` 的 `:root.<x>{` 块 / 索引文档的反引号行）+ 每个 light skin 17 必填键。任一不齐 → 退出码 1，按报错补齐。

QA：切到 `?scheme=<name>`（dev/test 下 URL 加 query 强制方案）目检 shell（顶/侧/底栏）、match 卡、赔率按钮含选中态、投注单（桌面 + 移动 sheet）、弹层/抽屉（Portal 变量是否到位）、明暗层级与文字对比；相邻方案（betbus/gtb/对应明暗对手）无回归。

## 3. 分支 B：新增/改造多主题组件

目标：让组件在每个主题下按需呈现不同**配色/尺寸/布局/子结构**，默认零成本，只在需要发散处付费。
原则：**只认 brand/mode、组件只调一个 `useThemeComponentProfile()` hook、逐层加只加需要的**。

### B1. 决策树（从最便宜到最贵，能停就停）

```
1. 只换颜色？
   ├─ 通用色（底/字/边/主色） → 直接用语义工具类，零额外代码、自动换肤。            [A]
   └─ 品牌专属色（语义令牌覆盖不到） → skin 表加 brand×mode 键，var(--x, 兜底) 消费。 [A]
2. 还要换尺寸/圆角/间距？
   └─ component-profile.ts 各 *_PROFILE.style 加 '--component-myx'；按 mode 变进 MODE_PATCH。 [A]
3. 还要换布局/子组件/渲染哪棵子树？
   └─ ThemeComponentProfile 加判别字段 + 每 brand 填值，组件 match(profile) 分支渲染。  [B]
```

### B2. 情况 A：颜色 / 尺寸

通用色——直接写语义工具类，什么都不用加：

```tsx
<div className="bg-surface-1 text-content-primary border border-subtle rounded-[var(--style-radius-card)]" />
```

品牌专属色——语义令牌表达不了（某 brand 特有渐变/高光）。在 `brand-ui-skin.ts`（或组件本地 `*-skin.ts`）为**每个 brand×mode**加同名键，`var(--brand-xxx, 兜底)` 消费，**务必带兜底**避免漏填塌空。

尺寸——在 `component-profile.ts` 每个 `*_PROFILE.style` 加 `--component-*` 键；只在某 brand 的某 mode 要变时进 `BRAND_PROFILE_MODE_PATCH`：

```ts
// 各 *_PROFILE.style 内
'--component-mywidget-radius': '10px',
// 仅 betano 浅色要更大圆角（其余 brand/mode 不受影响）
const BRAND_PROFILE_MODE_PATCH = { betano: { light: { style: { '--component-mywidget-radius': '16px' } } } };
```

变量由顶层 `ThemeScope` 一次注入、后代继承，组件直接 `className="rounded-[var(--component-mywidget-radius,10px)]"`，**无需自注入 `style={{ ...profile.style }}`**。

### B3. 情况 B：布局 / 子组件 / 子树

**Step 1** — `component-profile.ts` 的 `ThemeComponentProfile` 接口加一组判别字段。接口是 **required**，必须在 `MATCH_PROFILE` / `SUPERBET_PROFILE` / `BETANO_PROFILE` 三份都补值（`BETBUS_PROFILE = ...MATCH_PROFILE` 会继承、`GTB_PROFILE = ...BETBUS_PROFILE` 再继承；要 betbus 专属再单独 override）。漏填 → **tsc 直接报错**，这是兜底别绕过。

```ts
export type MyWidgetProfile = 'match-stack' | 'superbet-hero' | 'betano-row';
export interface ThemeComponentProfile {
  // …既有 nav / matchCard / oddsButton / betSlip / homeRecommend / activityCards…
  myWidget: { profile: MyWidgetProfile; density: 'compact' | 'roomy' };
  style: ComponentProfileStyle;
}
```

**Step 2** — 组件用 ts-pattern 按 profile 分支渲染，并挂 `data-*` 作 CSS 状态钩子：

```tsx
'use client';
import { match } from 'ts-pattern';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';

export const MyWidget = () => {
  const p = useThemeComponentProfile();           // 只调一个 hook，A 的 style + B 的判别字段都在里面
  const body = match(p.myWidget.profile)
    .with('superbet-hero', () => <HeroLayout />)
    .with('betano-row',   () => <RowLayout />)
    .otherwise(()         => <StackLayout />);     // match-stack / betbus / gtb 兜底
  return (
    <section
      data-my-widget-profile={p.myWidget.profile}  // [data-my-widget-profile=betano-row] & {…}
      className="bg-surface-1 text-content-primary rounded-[var(--component-mywidget-radius,10px)]"
    >{body}</section>
  );
};
```

**Step 3（可选）** — 同品牌亮/暗结构也不同时，只在 `BRAND_PROFILE_MODE_PATCH` 填该 brand 的该 mode 块。

真实可参考用法：`src/modules/bet-slip/**`（`componentProfile.betSlip.desktopPlacement` 分支 + `data-bet-slip-profile`）、`src/modules/home/_components/smart-activity-cards/**`、`src/modules/match/_components/card.tsx`。

### B4. Portal 约束（最容易漏）

skin 的 `--brand-*` 与 profile 的 `--component-*` 由顶层 `ThemeScope` 注入、后代 CSS 继承。
**Portal（抽屉 / vaul 底部弹层 / sonner Toast）渲染到 `body`，脱离 ThemeScope 子树、拿不到继承变量。** 处理：(a) 给 Portal 容器再包一层 `ThemeScope`（推荐）；或 (b) 该 Portal 组件局部注入自身 skin（如 bet-slip 的 slip-skin）。

### B5. 校验 + QA

```bash
pnpm lint:ts   # 确认接口新字段在每个 brand 都补齐（漏填在此报错）
pnpm lint
```

QA：在所有 brand×mode 下切一遍（`?scheme=<scheme>`），确认布局分支正确、颜色随主题变、Portal 内变量到位、尺寸兜底生效。重点测 superbet/betano/match/betbus 四个 brand 各自结构分支 + 至少一个 light 一个 dark。

## 4. 易漏点速查

- 新 brand 漏改 `getSkinKey`（#9）→ light skin 不进 17 键校验，gate 静默失效。
- light skin 缺 17 必填键 → `theme:check` 退出码 1。
- 通用色硬编码进 skin、或尺寸写死没进 profile.style → 换肤/换尺寸失效。
- `--component-*` / `--brand-*` 没带兜底 → 某 profile/skin 漏填时塌成空值。
- Portal 组件没补 ThemeScope → 抽屉/弹层颜色不跟主题。
- 沙箱里 `node_modules` 是 Windows 安装、Linux 下符号链接断裂，`tsx`/`biome`/`tsc` 可能跑不起来 → 把改动文件清单交用户在本地跑那三条命令，别假装通过。
