# 多主题组件架构设计（brand × mode 两维 · A/B 两类变体）

> 目的：把现有「配色方案 = 品牌(brand) × 明暗(mode)」的体系，升级为一套能让**单个组件**在每个主题下同时呈现**不同配色**（情况 A）和**不同结构/子组件**（情况 B）的统一架构。
>
> 本文是设计方案，不含落地代码。它建立在 `.agent/references/scheme-system.md`（颜色令牌链）之上，补齐其未覆盖的 `brand×mode` 模型与 `component-profile` / `skin` 结构层。
>
> **一句话结论**：当前架构里 _颜色_ 已经是 `f(brand, mode)`，但 _结构_ 只是 `f(brand)`（`mode` 被携带却不参与布局）。要兼容「A/B × 两维」，核心只需一处改造——把结构解析器从 `f(brand)+塞mode` 升级为 `f(brand, mode)`，并顺手把散落各处的 CSS 变量注入收敛到一个 `ThemeScope`。

---

## 1. 术语与设计空间

| 名词 | 含义 | 取值 |
|------|------|------|
| `scheme` | 挂到 `<html>` 的 class，唯一真值 | gtb / betbus / match / match-light / superbet-light·dark / betano-light·dark（8 套） |
| `brand` | 主题（视觉品牌） | superbet / betano / betbus / match |
| `mode` | 明暗 | light / dark |
| 情况 A | 同一结构，**只换配色 / 尺寸** | —— |
| 情况 B | **换布局 / 子组件 / 子树** | —— |

核心关系：**`scheme = brand × mode`**（由 `scheme-meta.ts` 的 `SCHEME_META` 映射，gtb 为历史特例）。所有派生逻辑都应只认 `brand` / `mode`，**不要直接 switch `scheme` 名**。

设计空间是一张 2×2 的网格，目标是四格全部可表达：

```
            沿 brand            沿 mode(亮暗)
情况A 换色   ✅                  ✅
情况B 换构   ✅                  ❌ ← 唯一缺口
```

---

## 2. 现状盘点

### 2.1 三段式颜色链（已成熟，保留）

```
原始色变量 (theme.css :root / :root.<scheme>)
      ↓  @theme 间接引用
--color-* (tokens.css: --color-surface-1: var(--surface-1) ...)
      ↓  工具类
bg-surface-1 / text-content-primary / ...  (组件)
```

切 scheme → `<html class="betano-dark">` → 对应 `:root.betano-dark{}` 覆盖块生效 → 全站颜色类自动换肤，**零组件改动**。这是情况 A 沿 brand×mode 已经免费拿到的能力。

### 2.2 结构层 `component-profile.ts`（需升级）

`ThemeComponentProfile` 按 **brand** 各存一份（`MATCH_PROFILE` / `SUPERBET_PROFILE` / `BETANO_PROFILE` / `BETBUS_PROFILE` / `GTB_PROFILE`），每份描述各组件组（nav / matchCard / marketCard / oddsButton / betSlip / homeRecommend / activityCards）的：

- `profile` 判别字符串（如 `'match-board' | 'superbet-promo-card' | 'betano-ticket-row'`）→ 组件据此**分支渲染不同子树**；
- 布局枚举（`density` / `headerTreatment` / `desktopListLayout` / `selectionInfoOrder` / `mobileFlow` …）；
- `style`：一张 `--component-*` 尺寸变量表（圆角 / 宽高 / 间距）。

解析器现状：

```ts
const withMode = (p, mode) => ({ ...p, mode });   // ← 只塞 mode，不改任何结构字段
getThemeComponentProfile(meta) = withMode(BRAND_PROFILE[meta.brand], meta.mode)
```

**问题 1（缺口）**：`profile`、布局枚举、`style` 全是 brand 决定，`mode` 不参与。所以 `superbet-light` 与 `superbet-dark` 结构必然完全一致，无法做到「同品牌、暗色换个布局」。

### 2.3 颜色 skin 层（JS 注入，已是两维但分散）

语义令牌覆盖不到的、品牌专属的颜色，用 JS skin 表承载，已按 brand×mode 各存 light/dark：

| 文件 | 选择器 | 作用域 |
|------|--------|--------|
| `theme-provider/brand-ui-skin.ts` | `getBrandUiSkin` / `useBrandUiSkin` | 全局 `--brand-*`（nav/侧栏/卡片/赔率色） |
| `bet-slip/_utils/slip-skin.ts` | `getBetSlipSkin` | 投注单 `--slip-*` |
| `home/.../smart-activity-cards/card-skin.ts` | `getSmartActivityCardSkin` | 活动卡 |
| `home/.../super-odds/recommend-card/skin.ts` | `getRecommendCardSkin` / `getRecommendSectionSkin` | 推荐卡 |

**问题 2（散落）**：`componentProfile.style`（以及各 skin 的 `style`）目前被 **30+ 个组件各自 `style={{ ...componentProfile.style }}` 重复注入**（nav、sidebar、card、bet-item、bet-slip、super-odds、smart-activity…）。没有统一挂载点，新组件必须「记得」自注入，否则 `var(--component-*)` 取不到值。容易漏、容易不一致。

---

## 3. 目标架构

三项改造：①结构解析器升维 ②统一注入 ③明确 A/B 契约。前两项是底层一次性改动，第三项是面向新组件的规范。

### 3.1 改造一：结构解析器升维到 `f(brand, mode)`

保持「brand 基底」为默认（多数品牌亮暗共用结构、零成本），叠加「可选 mode 补丁」深合并：

```ts
// 基底：每 brand 一份（= 现有 *_PROFILE，去掉 withMode）
const BRAND_PROFILE_BASE: Record<SchemeBrand, ThemeComponentProfile> = {
  match: MATCH_PROFILE, superbet: SUPERBET_PROFILE,
  betano: BETANO_PROFILE, betbus: BETBUS_PROFILE,
};

// 补丁：仅在「某 brand 的某 mode 结构/尺寸要变」时填；不填 = 沿用基底
const BRAND_PROFILE_MODE_PATCH:
  Partial<Record<SchemeBrand, Partial<Record<SchemeMode, DeepPartial<ThemeComponentProfile>>>>> = {
  // 例：betano 浅色把投注单从抽屉换成右栏（结构按 mode 变）
  // betano: { light: { betSlip: { desktopPlacement: 'right-rail-panel' },
  //                    style: { '--component-slip-desktop-radius': '12px' } } },
};

export const resolveThemeProfile = (meta: SchemeMeta): ThemeComponentProfile =>
  deepMerge(BRAND_PROFILE_BASE[meta.brand], { mode: meta.mode },
            BRAND_PROFILE_MODE_PATCH[meta.brand]?.[meta.mode]);
```

- **默认行为不变**：补丁为空时，`resolveThemeProfile` 等价于今天的 `withMode`，现有 8 套方案表现不变。
- **缺口补齐**：需要时只填一小块 patch，即可让同品牌亮/暗结构发散——情况 B 沿 mode 成立。
- `useThemeComponentProfile()` 内部改调 `resolveThemeProfile`，对外签名不变，**调用方零改动**。
- gtb 特例继续在解析器里单独处理（`brand=superbet` + 特定取值）。

> 取舍：也可以把注册表直接做成 `PROFILE[brand][mode]` 全展开（8 份），更直白但重复度高、亮暗共用结构时要改两处。**推荐 base+patch**：默认零重复，发散按需付费。

### 3.2 改造二：统一注入 `ThemeScope`（收敛散落的 style）

新增一个挂载点，一次性把所有「全局级」CSS 变量包注入，后代 DOM 通过 CSS 继承自动拿到：

```tsx
// components/theme-provider/theme-scope.tsx（新增），挂在 (main)/layout 顶层
export const ThemeScope = ({ children }) => {
  const meta = useSchemeMeta();
  const profile = resolveThemeProfile(meta);
  const brandSkin = getBrandUiSkin(meta);
  return (
    <div data-brand={meta.brand} data-mode={meta.mode}
         style={{ ...brandSkin.style, ...profile.style }}>
      {children}
    </div>
  );
};
```

- 之后**逐步删除**各组件里重复的 `style={{ ...componentProfile.style }}` / `...brandUiSkin.style`——它们改为从祖先继承。
- 组件只在**需要结构分支时**才 `useThemeComponentProfile()` 读判别字段，不再为了拿 CSS 变量而调 hook。
- `data-brand` / `data-mode` 挂在 scope 上，全站可用 `[data-brand=betano] &` 之类做 CSS 钩子。

> **Portal 注意**：抽屉 / 底部弹层 / Toast 用 Portal 渲染到 `body`，**脱离 ThemeScope 子树、拿不到继承变量**。两种处理：(a) 给 Portal 容器（`getPortalContainer()`）也包一层 ThemeScope；(b) 这些 Portal 组件继续局部注入自己的 skin（如 slip-skin）。**推荐 (a)**，彻底消除「记得自注入」的心智负担。组件级 skin（slip / smart-activity / recommend）可保留局部注入，因为其变量作用域本就局部。

### 3.3 改造三：明确三类契约（决定新东西放哪）

| 你要随主题变的东西 | 放哪 | 组件怎么消费 | 维度 |
|------|------|------|------|
| 通用颜色（底/字/边/主色） | **全局语义令牌** `theme.css :root.<scheme>` + `tokens.css @theme` | `bg-surface-1` `text-content-primary` `bg-brand-primary-0` | A · brand×mode 自动 |
| 品牌专属颜色（语义令牌覆盖不到） | **skin 表**（`*-skin.ts`，brand×mode 两份） | `var(--brand-xxx, 兜底)` | A · brand×mode |
| 尺寸 / 圆角 / 宽高 / 间距 | **`profile.style`** 的 `--component-*`；要按 mode 变则进 mode patch | `var(--component-xxx)` | A · brand（+可选 mode） |
| 布局 / 子组件 / 渲染哪棵子树 | **`profile` 判别字段** + 布局枚举；要按 mode 变则进 mode patch | `switch(profile.<组>.profile)` + `data-*` | B · brand（+可选 mode） |

A、B 同源：组件调**一个** `useThemeComponentProfile()`，回来的对象同时带 `style`（A）和判别字段（B），不分家。

---

## 4. 新组件接入规范（决策树）

定义一个组件、要它在每个主题不同表现时，按下面走：

```
1. 只换颜色？
   ├─ 通用色 → 直接用语义工具类（bg-surface-1…）。零额外代码。           [A]
   └─ 品牌专属色 → 在对应 *-skin.ts 加 brand×mode 块，var(--x) 消费。   [A]
2. 还要换尺寸/圆角？
   └─ profile.style 加 --component-myx；按 mode 变则进 mode patch。      [A]
3. 还要换布局/子组件/子树？
   ├─ ThemeComponentProfile 加一组判别字段：
   │     myWidget: { profile: 'match-x' | 'superbet-y' | 'betano-z'; layout: ... }
   │   并在每个 BRAND_PROFILE_BASE 填一份（漏填会 fallback，需 lint 兜底）。
   ├─ 组件内 const p = useThemeComponentProfile();
   │     按 p.myWidget.profile 分支渲染；挂 data-my-widget-profile={...}。  [B]
   └─ 若「同品牌亮/暗」结构也不同 → 在 BRAND_PROFILE_MODE_PATCH 填该 mode 块。[B·mode]
```

### 示例骨架（情况 B + A 混合）

```tsx
// 1) component-profile.ts —— 加字段 + 每 brand 填值
export type MyWidgetProfile = 'match-stack' | 'superbet-hero' | 'betano-row';
// ThemeComponentProfile 内：
//   myWidget: { profile: MyWidgetProfile; density: 'compact'|'roomy' };
// 各 *_PROFILE 内：
//   MATCH:    myWidget: { profile: 'match-stack',  density: 'compact' }
//   SUPERBET: myWidget: { profile: 'superbet-hero', density: 'roomy'  }
//   BETANO:   myWidget: { profile: 'betano-row',    density: 'compact' }
//   style 内加：'--component-mywidget-radius': '10px' 等

// 2) my-widget.tsx
export const MyWidget = () => {
  const p = useThemeComponentProfile();
  const body = match(p.myWidget.profile)
    .with('superbet-hero', () => <HeroLayout />)   // 不同子树
    .with('betano-row',   () => <RowLayout />)
    .otherwise(()         => <StackLayout />);
  return (
    <section
      data-my-widget-profile={p.myWidget.profile}   // CSS 状态钩子
      className="bg-surface-1 text-content-primary    // [A] 通用色，自动换肤
                 rounded-[var(--component-mywidget-radius)]" // [A] 尺寸
    >
      {body}                                         {/* [B] 结构 */}
    </section>
  );
};
```

颜色：`bg-surface-1` 八套自动；尺寸：`--component-mywidget-radius` 按 brand（必要时按 mode）；结构：`profile.myWidget.profile` 分支。三个旋钮各自独立、互不耦合。

---

## 5. 关键改动点（文件级清单）

| 文件 | 改动 | 兼容性 |
|------|------|------|
| `component-profile.ts` | 拆 `BRAND_PROFILE_BASE` + 新增 `BRAND_PROFILE_MODE_PATCH`；`getThemeComponentProfile` 改 `resolveThemeProfile`（deepMerge）；移除/内化 `withMode` | hook 签名不变，调用方零改动 |
| `theme-provider/theme-scope.tsx` | **新增** `ThemeScope`：一次注入 `brandSkin.style + profile.style` + `data-brand/-mode` | 新增，不破坏 |
| `(main)/layout.tsx` 或 `root-providers.tsx` | 挂 `ThemeScope`；Portal 容器同样包一层 | 叠加 |
| 30+ 消费组件 | **分阶段**删除冗余 `style={{ ...componentProfile.style }}` / `...brandUiSkin.style`，改继承 | 可逐个迁移，删一个测一个 |
| `utils/deep-merge`（如无） | 加一个类型安全 deepMerge（或用 lodash `merge`） | 新增 |
| `.agent/references/scheme-system.md` | 补注：已从「纯配色方案」演进为 `brand×mode`，新增 profile/skin 结构层（指向本文） | 文档 |

---

## 6. 迁移步骤（不破坏现状，分阶段）

1. **底层升维**：落 `resolveThemeProfile` + `BRAND_PROFILE_BASE/MODE_PATCH`（patch 留空）。此时全站行为与今天**逐像素一致**，纯重构。
2. **统一注入**：加 `ThemeScope` 挂到 layout 顶层 + Portal 容器。先**叠加**不删旧注入（旧的 `style={{...}}` 还在，重复无害）。
3. **回收冗余**：按模块逐个删除组件里重复的 `componentProfile.style` 注入，每删一处目检该模块四 brand × 亮暗。
4. **验证缺口**：挑一个组件，在某 brand 的 mode patch 里填一条结构差异，确认 `superbet-light` vs `superbet-dark` 能呈现不同布局——证明 B·mode 通路打通。
5. **补 lint/类型**：`ThemeComponentProfile` 用必填字段，保证新增判别字段时**每个 brand 都得填**，漏填编译期报错（替代静默 fallback）。
6. **更新文档**：回填 `scheme-system.md` 与 `frontend.md` 的样式章节。

---

## 7. 取舍 · 风险 · QA

- **brand 漏填 fallback 静默**：现状漏填某 brand 会 fallback 到默认 profile、不报错，易悄悄不一致。建议靠 `Record<SchemeBrand, …>` 必填 + 类型收紧，把它变成编译期错误。
- **base+patch 的深合并边界**：数组 / 对象合并语义要定清楚（patch 覆盖优先、`style` 浅合并即可）。建议 deepMerge 只对纯对象递归，叶子值直接覆盖。
- **Portal 继承断裂**：见 3.2，务必给 Portal 容器包 ThemeScope，否则抽屉/弹层在新方案下取不到 `--brand-*`。这是迁移期最易踩的回归点。
- **on-brand 对比度**：延续 `scheme-system.md` §6 的已知项——亮主色块上的白字对比度需逐方案目检（如 match `#26c07a` 上白字 ~2.2:1 低于 AA）。新增 brand 时纳入 QA 清单。
- **mode patch 不要滥用**：多数情况「亮暗只换色」，结构应共用。patch 仅用于**确有布局差异**的少数场景，否则会把「两维」退化成「八份」重复。
- **验收矩阵**：任何接入多主题的新组件，提测前过一遍 `4 brand × 2 mode × {桌面,移动}` = 16 态目检（可借 `?scheme=` dev 查询参数逐个切）。

---

## 8. 附：能力对照（改造前后）

| 能力 | 改造前 | 改造后 |
|------|--------|--------|
| A 换色 · brand×mode | ✅ | ✅ |
| A 换尺寸 · brand | ✅ | ✅ |
| A 换尺寸 · mode | ❌（style 仅 brand） | ✅（mode patch） |
| B 换结构 · brand | ✅ | ✅ |
| B 换结构 · mode | ❌ | ✅（mode patch） |
| CSS 变量注入 | 散落 30+ 处自注入 | ThemeScope 一次注入、继承 |
| 新组件接入 | 须记得自注入 + 仅能按 brand 分构 | 继承即用 + 按 brand/mode 自由分构 |
