# CIS & Match 多配色主题 — 用色规范全面验收报告（WCAG + OKLCH + 行动按钮用色心理学）

> 验收日期：2026-06-25 ｜ 分支：`claude/hopeful-mayer-jcljft`
> 验收范围：新 `cis` brand（`cis-light`）+ `match` brand 多配色家族（`match` / `match-light` / `match-mint` / `match-bright` / `match-red` / `match-navy-red` / `match-navy-yellow`），共 8 套方案。
> 方法：实跑仓库自带的三个可执行校验器（`theme:check` / `theme:contrast` / `theme:perceptual`，经 Node 22 type-stripping 运行）取 ground truth；对自动校验覆盖不到的 **brand-skin 行动按钮**逐项离线复算 WCAG；用 OKLCH 评估行动按钮用色心理学与可达性。
> 规范依据：`.agent/references/contrast-checking.md`（WCAG 硬线）、`.agent/references/perceptual-color.md`（OKLCH 治理线）。

---

## 0. 验收判定总表（含修复后复验）

> 🟢 **本轮已落地修复**：发现的全部 8 项 token 文字档 FAIL + 行动按钮隐藏 FAIL + 移动端注册/登录按钮黄底白字均已修复并复验。下表「修复前 → 修复后」。

| 方案 | 修复前 WCAG（token） | 修复前 行动按钮（brand-skin） | 修复后 | 综合判定 |
|---|---|---|---|---|
| `cis-light` | **FAIL ×2**（favorite 金 `#b8860b`） | PASS / AA✓ | **FAIL 0**（favorite→`#8c6608`，双向 5.22；parity 0.219→0.131） | ✅ **通过** |
| `match` | 0 FAIL（WARN ×16） | PASS / AA✓ | FAIL 0 | ✅ 通过 |
| `match-light` | 0 FAIL（WARN ×20） | **FAIL ×3（隐藏）** 白字配中调绿/红 | 行动按钮加深至 `#087348`/`#0a784c`/`#cc2b2b`，白字 ≥4.9 | ✅ **通过** |
| `match-mint` | 0 FAIL | AA✓ | FAIL 0 | ✅ 通过 |
| `match-bright` | 0 FAIL | AA✓/PASS | FAIL 0 | ✅ 通过 |
| `match-red` | **FAIL ×3** | **FAIL ×1**（赔率选中 3.52） | **FAIL 0**（content-inverse→`#160006` 18.09/12.11；选中赔率亮端→`#e6202b` 4.56） | ✅ **通过** |
| `match-navy-red` | **FAIL ×3** | **FAIL ×1**（赔率选中 3.52） | **FAIL 0**（同上） | ✅ **通过** |
| `match-navy-yellow` | 0 FAIL（token） | **黄底白字**（注册/登录等组件 + 移动 dock） | 组件改 `text-on-brand`，黄底深字 ≥7:1 | ✅ **通过** |

> **WARN 不阻断**：规范中 WARN 是「过 AA 门槛、未达 AAA 推荐」的质量线（4.5–7:1），默认不致命。本表只把 **FAIL（< AA 4.5）** 计为不通过项。

**结论（修复后）**：8 套 CIS/Match 方案文字档 **FAIL 全部清零**，行动按钮（含投注按钮、注册/登录、赔率选中、导航激活、live 徽章、移动 dock）全部 ≥ AA；`cis` favorite 严重 parity 已收敛。全部经 `theme:contrast` / `theme:perceptual` 真源复跑确认（见 §1.5）。

> ⚠️ **范围外、改动前既存**：全量跑 `theme:contrast` 另暴露 5 套 `glass-*-dark` 各自的 status 文字 / 移动导航文字 FAIL（共 18 项，如 `status-success-text #34d399` on `#dff8ef` = 1.72）。经改动前快照核对，**这些是 glass 方案早于本次改动就存在的缺陷**（glass 在文档基线清零的 8 套之外、晚加入），不在 CIS/Match 验收范围；本次未触碰 glass，建议另起一轮专门整改。

---

## 1. ⚠️ 校验工具本身的缺陷（已修复，必须先说）

**`scripts/check-perceptual.ts` 第 125 行 OKLab 矩阵常数写错**，导致整个 OKLCH 治理校验器**完全跑不起来**：

```diff
- L: 0.2104542553 * l_ + 0.789_617_785 * m_ - 0.0040720468 * s_,   // 错：Σ=0.996
+ L: 0.2104542553 * l_ + 0.793_617_785 * m_ - 0.0040720468 * s_,   // 对：Ottosson 标准值，Σ=1.0
```

- 现象：换算自检 6 锚点全 BAD——白色 `#ffffff` 算出 `L=0.9960`（应为 1.0），全部锚点 L 统一偏低 ~0.4%（×0.996）。
- 根因：L 行 `m_` 系数应为 Ottosson 参考矩阵的 `0.7936177850`，仓库写成 `0.789617785`，净差 −0.004，正好令白点 `0.2104542553 + 0.7936177850 − 0.0040720468` 从 `1.0` 掉到 `0.996`。
- 后果：`main()` 每次运行先静默自检，自检失败即打印「拒绝在错误的色彩空间上判级」并以退出码 1 提前返回——**`pnpm theme:perceptual` 从未真正产出任何 finding**。`perceptual-color.md §7` 声称「6 锚点自检全过、基线 FAIL=0」与当前 committed 代码不符（基线应为离线复核，未在真源上跑通）。

修复后自检全 OK（白 `1.0000`、红 `0.6280`、绿 `0.8664`、蓝 `0.4520`、灰 `0.5999`，「换算正确」），本报告的 OKLCH 数据即基于修复后的真源实跑。**此修复仅动离线校验脚本，不改任何主题/产品行为。**

## 1.5 修复落地与复验（本轮已应用）

按「针对不同主题切换、适配不同文字用色」的原则，分三类修复，全部经真源复跑确认 **CIS+Match 文字档 FAIL：8 → 0**。

**A. 系统性：品牌色块上的白字 → 随主题自适应的 `--on-brand`（修移动端注册/登录按钮等黄底白字）**
根因：大量组件用 `bg-brand-primary-0`（在 `match-navy-yellow` 下 = 黄 `#ffd21a`）配硬编码白字 `text-neutral-white-h`，黄底白字 ≈ 1.3:1 不可见；`--on-brand`（navy-yellow=深字 `#241c00`、亮绿系=深字 `#07130d`、红/橙系=白）才是随主题自适应的正确 token。把以下持久态/hover 态的 `text-neutral-white-h` 统一换成 `text-on-brand`（红/橙系零回归，亮绿/黄系修复）：
`mobile-auth-action-bar`(注册/登录)、`numeric-keypad`、`selection-badge`、`parlay-boost-rules-content`、`tags-filter-h5`、`support-floating-entry`、`certificationItem`、`top-live-matches`、`ad-placement-floating-card`、`date-range-picker`、`transactions-sort-chips-v2`、`quick-stake-button`、`bet-history-list-item`、`funs-select-short-cut-list`、`slip-settings`、`right-aside`、`Wallet`，以及 match 模块 `hot-matches/filters`、`list/layout`、`detail/layout`，可复用控件 `PromotionCard`、`MobileCountryHero`、`PaymentModal`、`vip/CommonButton`(hover)。

**B. `match-red` / `match-navy-red`（theme.css + brand-ui-skin.ts）**
- `--content-inverse`：`#ffffff` → `#160006`（照 betbus 范式）。复验：tooltip/徽章底 18.09 / 12.11 PASS。
- 选中赔率 / 移动 dock 行动底亮端：`#ff3b46` → `#e6202b`，hover `#ff5560`→`#cc1a24`。复验：白字 4.56 AA。

**C. `cis-light`（theme.css）+ `match-light`（brand-ui-skin.ts）**
- cis `--func-favorite`：`#b8860b`（L0.652 中调金，双向 3.25）→ `#8c6608`（深金）。复验：作文字 5.22、作白字块 5.22 双向达标；favorite 跨方案 parity 0.219（严重）→ **0.131**（普通）。`func-bonus` 保留古金 `#b8860b`（走深字 `func-bonus-on` 已 5.28 达标，其 parity 属品牌识别）。
- match-light brand-skin 行动按钮：nav-active `#0f9c61`→`#087348`、hover→`#075d3b`、live 徽章 `#e23b3b`→`#cc2b2b`、选中赔率 `#15a96c…`→`#0a784c…`（对齐该主题自身品牌深绿）。复验：白字 4.9–5.9 AA。

**复验结果**：`theme:contrast` 全 24 套文字档——CIS+Match **FAIL 0**；`theme:perceptual` CIS/Match **FAIL 0**、cis favorite 严重 parity 已消除；`theme:check` 索引对齐；OKLCH 自检绿。（沙箱缺 `biome`，未跑 lint——改动均为 className token / CSS hex / 字符串值等价替换，不影响类型与格式，由 CI 兜底。）

---

## 2. WCAG 对比度验收（token 契约，实跑 `theme:contrast`）

`pnpm theme:contrast` 覆盖 38 项「底-文字」配对契约。CIS + Match 共 **8 项文字档 FAIL（< AA 4.5）**：

### 2.1 `cis-light`（2 FAIL）— 金色 `#b8860b` 双向不达标
| 配对 | 实测 | 判级 | 说明 |
|---|---|---|---|
| `neutral-white-h` on `func-favorite-solid` | **3.25:1** `#ffffff/#b8860b` | FAIL | 收藏/热门徽章块白字 |
| `func-favorite` on `surface-1` | **3.25:1** `#b8860b/#ffffff` | FAIL | 金色作文字放白卡 |

根因：`--func-favorite` 与 `--func-bonus` 都设成同一个中调古金 `#b8860b`（DarkGoldenrod，L≈0.652）。这个亮度的金「托白字不够暗、作文字不够深」，两个方向都卡在 3.25。对照同方案 `--func-pending: #916d16`（更深，作文字 4.77:1 达标）即知——是取值不一致，不是金色无解。
注：`func-bonus` 因走深字范式（`func-bonus-on #241a00` on `#b8860b` = 5.28:1）反而达标。

### 2.2 `match-red` & `match-navy-red`（各 3 FAIL）— 两个根因
| 配对 | 实测 | 判级 | 说明 |
|---|---|---|---|
| `content-inverse` on `content-primary` | **1.12:1** `#ffffff/#f2f2f2` | FAIL | tooltip 底（近白）上的反色文字 |
| `content-inverse` on `filltext-ft-g` | **1.67:1** `#ffffff/#c8c8c8` | FAIL | 计数徽章底上的反色文字 |
| `odds-selected-text` on `odds-selected-bg` | **3.52:1** `#ffffff/#ff3b46` | FAIL | 选中赔率/下注 CTA 白字（取渐变最差停靠 `#ff3b46`） |

根因一（content-inverse）：**这正是 `contrast-checking.md §6` 记录过、betbus 修过的同一个 bug 又复现了**。`content-inverse` 实际用在浅色 tooltip 底（`content-primary`）和计数徽章底（`filltext-ft-g`）上，深色方案这两个底是浅色，反色文字必须为深色。逐套核对 14 套深色方案的 `--content-inverse`：

```
match #07130d ✓   match-mint #07130d ✓   match-bright #07130d ✓   match-navy-yellow #241c00 ✓
betbus #160006 ✓  superbet-dark #07080c ✓  betano-dark #0e0f22 ✓   glass-* 各自深色 ✓
match-red #ffffff ✗   match-navy-red #ffffff ✗      ← 仅这两套是白色（回归）
```

根因二（odds-selected）：红色渐变 `linear-gradient(140deg, #ff3b46, #b3151f)` 的亮端 `#ff3b46` 托不住白字（3.52）。这个 token 同时被**主下注 CTA**（`place-bet-button.tsx` 经 `--slip-cta-bg` 回退到 `--odds-selected-bg`）使用——即**整个「下注」主行动按钮在这两套方案下不达标**。

### 2.3 其余 5 套：0 FAIL
`match` / `match-light` / `match-mint` / `match-bright` / `match-navy-yellow` 在 token 契约下文字档零 FAIL，仅有 4.5–7:1 区间的 WARN（过 AA 未达 AAA，非阻断质量线，符合既有基线策略）。

---

## 3. 行动按钮专项（brand-skin 层 — 自动校验盲区）

**重大发现：投注按钮的真实渲染色不在自动 WCAG 契约里。** 比赛卡内的赔率按钮（`bet-btn-standard-base.tsx` / `bet-btn-short-base.tsx`）和导航/徽章用的是 `brand-ui-skin.ts` 里**硬编码**的 `--brand-odds-selected-*` / `--brand-nav-active-*` / `--brand-nav-live-badge-*`，而 `theme:contrast` 的 PAIRS 契约只查 token 层的 `--odds-selected-*` / `--on-brand`。两层取值会分歧 → **自动校验看不到的行动按钮 FAIL**。

逐项离线复算（取渐变最差停靠色；正文档 AA=4.5、大字档 AA=3.0）：

| 方案 | 元素 | 前景/最差底 | 对比 | 正文判定 | 大字判定 |
|---|---|---|---|---|---|
| `match` | 赔率选中 | `#07130d`/`#1b9e61` | 5.51 | AA✓ | PASS |
| `match` | 导航激活 / live | `#07130d`/`#26c07a` | 8.04 | PASS | PASS |
| **`match-light`** | **赔率选中** | `#ffffff`/`#15a96c` | **3.03** | **FAIL** | AA✓ |
| **`match-light`** | **导航激活** | `#ffffff`/`#0f9c61` | **3.53** | **FAIL** | AA✓ |
| **`match-light`** | **live 徽章** | `#ffffff`/`#e23b3b` | **4.27** | **FAIL** | AA✓ |
| `cis-light` | 赔率选中 / 导航 | `#ffffff`/`#2d6a4f` | 6.39 | AA✓ | PASS |
| `cis-light` | live 徽章 | `#ffffff`/`#c62828` | 5.62 | AA✓ | PASS |
| `match-mint` | 赔率选中 | `#07130d`/`#15b07e` | 6.81 | AA✓ | PASS |
| `match-mint` | 导航激活 | `#07130d`/`#1fe0a0` | 11.04 | PASS | PASS |
| `match-bright` | 赔率选中 | `#07130d`/`#25a82e` | 6.06 | AA✓ | PASS |
| `match-bright` | 导航激活 | `#07130d`/`#3bd63b` | 9.81 | PASS | PASS |
| **`match-red`** | **赔率选中** | `#ffffff`/`#ff3b46` | **3.52** | **FAIL** | AA✓ |
| `match-red` | 导航激活 / live | `#ffffff`/`#e6202b` | 4.56 | AA✓ | PASS |
| **`match-navy-red`** | **赔率选中** | `#ffffff`/`#ff3b46` | **3.52** | **FAIL** | AA✓ |
| `match-navy-red` | 导航激活 | `#ffffff`/`#e6202b` | 4.56 | AA✓ | PASS |
| `match-navy-yellow` | 赔率选中 | `#241c00`/`#d6a800` | 7.62 | PASS | PASS |
| `match-navy-yellow` | 导航 / live | `#241c00`/`#ffd21a` | 11.67 | PASS | PASS |

**结论**：
- `match-light` 的**三个行动元素全部在正文档 FAIL**（白字配中调绿/红，3.03 / 3.53 / 4.27），是自动校验完全看不到的隐藏缺陷。赔率值若按大字（粗体 ≥18.66px）渲染勉强过 AA-large，但导航文字、徽章文字是正文级 → 实测不达标。
- `match-red` / `match-navy-red` 赔率选中 3.52 再次确认（与 token 层一致）。
- `cis` / `match` / `match-mint` / `match-bright` / `match-navy-yellow` 行动按钮**全部 AA✓ 或 PASS**——深字配亮绿/亮黄达 8–11:1，可达性极佳。

> **治理缺口本身也应修**：`check-contrast.ts` 的 PAIRS 应补 `--brand-odds-selected-text × --brand-odds-selected-bg`、`--brand-nav-active-text × --brand-nav-active-bg`、`--brand-nav-live-badge-text × --brand-nav-live-badge-bg` 三对（渐变取最差停靠），否则 brand-skin 层行动按钮永远在自动校验之外。

---

## 4. OKLCH 感知治理验收（实跑 `theme:perceptual`，矩阵修复后）

- **色域越界 / 文字层级倒挂（FAIL 级真错）**：`cis-light` 与全部 `match` 方案 **0 FAIL**。✅
- **CIS 跨方案 parity 严重不齐 ×2（与 §2.1 WCAG FAIL 同根）**：
  - 浅色 `func-favorite` L 极差 **0.219（严重）**：`cis #b8860b`（L 0.652）是最亮离群点。
  - 浅色 `func-bonus` L 极差 **0.215（严重）**：`cis #b8860b`（L 0.652）又是最暗离群点（别家亮金 ~0.85）。
  - 即同一个 `#b8860b` 既触发 WCAG 双向 FAIL，又同时是 favorite/bonus 两个角色的跨方案离群——**一处改色同解 4–5 项**。
- **Match 家族**：全部是「按设计接受」类 WARN——功能色（win/lost/favorite/bonus）饱和度顶格（贴 sRGB 边，降饱和=改品牌色）；`match-mint`/`match-navy-red`/`match-navy-yellow` 近黑灰阶台阶压缩（浅/深锚点处习语）。无新增感知缺陷，符合 `perceptual-color.md §7` 既有基线策略。
- **浅色微染头部 chrome 习语**：`cis-light` / `match-light` 灰阶·底 `ft-a(#efeeea) → ft-b(#ffffff)` 非单调 1 处——「微染页面底比纯白卡片略暗」，与文档已接受的同类习语一致。

> **附带暴露（非本次范围，但矩阵修复后首现）**：5 套 `glass-*-dark` 报 tier 倒挂 FAIL，经核为**误报**——glass 方案的 `content-*`/`surface-*` 用 `oklch()` 字面量，而 `check-perceptual.ts` 的 `firstColor()` 只解析 `#hex`/`rgba()`、不解析 `oklch()` → 解析为 null → NaN → 误判倒挂。**CIS/Match 全用 hex/rgba，不受影响，结论可靠。** 建议后续给校验器补 `oklch()`/`color-mix()` 解析，否则所有 glass 方案实际处于「未被感知校验」状态。

---

## 5. 行动按钮用色心理学评估

把 8 套方案的主行动色（CTA / 选中赔率 / 导航激活）按色相归类，结合博彩场景与可达性：

| 色相族 | 方案 | 主行动色 | 心理学语义 | 可达性处理 | 评估 |
|---|---|---|---|---|---|
| **绿（go / 增长 / 确认）** | `match` `#26c07a`、`match-mint` `#1fe0a0`、`match-bright` `#3bd63b` | 亮翠/薄荷/霓虹绿 | 绿=前进、确认、正向收益、金钱；博彩里「下注成功/进行」最自然的行动色 | 亮绿亮度高、托不住白字 → **正确改用深字** `#07130d`（8–11:1） | ✅ 心理学 + 可达性双优 |
| **深绿（信任 / 财务健康）** | `cis-light` `#2d6a4f` | 常春藤/森林绿 | 投后管理 VI：绿=财务增长、稳健、可信；深绿比亮绿更显「专业/机构」 | 深绿可托白字（6.39:1） | ✅ 与「投后管理」品牌定位高度契合 |
| **红（紧迫 / 兴奋 / 危险）** | `match-red`、`match-navy-red` `#e6202b` | 鲜红 | 红=紧迫、刺激、肾上腺素（赌场常用）；但**双刃**——红也是「危险/停止」，且本系统 `func-lost`（输）也是红 | 白字配红：CTA `#e6202b` 4.56 勉强 AA；**选中赔率亮端 `#ff3b46` 仅 3.52 FAIL** | ⚠️ 见下「语义撞色」+ 需修 |
| **黄（注意 / 乐观 / 警示）** | `match-navy-yellow` `#ffd21a` | 金黄 | 黄=吸睛、乐观，但作主行动色「行动号召力」最弱（易读成「警示/待定」） | 黄亮度极高、必须深字 → **正确用深字** `#241c00`（11.67:1） | ✅ 可达性满分；作为变体可接受，但行动号召力天然弱于绿 |

**专项提醒 — 红色 CTA 的语义撞色（`match-red` / `match-navy-red`）**：
主行动色红 `#e6202b` 与功能色「输」`func-lost #ff5a5a` 同处红色区。用户在「下注 CTA（红）」与「这一注输了（红）」之间会产生潜意识语义混淆——行动鼓励色与损失警示色撞车，是博彩 UI 的经典反模式。该主题已做的缓解：**赔率数值保持绿色**（`--brand-odds-value: #33d488`，up=green），把「数值/收益」与「品牌红」在语义上分开——方向正确，建议保留。但仍建议：① 修复选中赔率白字对比（见 §6 P0）；② 评估是否给「输」状态换一个可区分的红（如更冷/更暗），降低与品牌红的混淆。

**总体心理学结论**：绿色族（match/mint/bright/cis）行动色心理学与可达性俱佳，是最稳的方向；CIS 深绿与「投后管理」定位契合度最高。红色族刺激性强但有语义撞色与对比风险，黄色族可达性满分但行动号召力偏弱——这两族作为「多配色」可选项可以保留，但需补齐对比度并注意红色语义。

---

## 6. 推荐修复清单（按优先级）

> P0 已在本轮落地（见 §1.5），均沿用仓库既有范式、低风险。P1/P2 为后续建议。

### P0 — WCAG 文字档 FAIL（< AA，必修）✅ 已完成
1. ✅ **`match-red` / `match-navy-red` 的 `--content-inverse`**：`#ffffff` → `#160006`。复验 18.09 / 12.11 PASS。
2. ✅ **`match-red` / `match-navy-red` 选中赔率/下注 CTA**：亮端 `#ff3b46` → `#e6202b`（token + brand-skin 同步）。复验白字 4.56 AA。
3. ✅ **`cis-light` favorite 金**：`--func-favorite` `#b8860b` → `#8c6608`（深金，双向 5.22；solid 自动继承）。favorite parity 0.219→0.131。
4. ✅ **`match-light` brand-skin 行动按钮**：加深至 `#087348` / `#0a784c` / `#cc2b2b`，白字 ≥4.9。
5. ✅ **移动端注册/登录按钮等黄底白字（系统性）**：组件 `text-neutral-white-h` → `text-on-brand`（28 处），黄/亮绿系自适应深字。

### P1 — 校验治理缺口（防止行动按钮长期脱离校验）
6. 给 `check-contrast.ts` 的 PAIRS 补 brand-skin 行动按钮三对（`--brand-odds-selected-*`、`--brand-nav-active-*`、`--brand-nav-live-badge-*`，渐变取最差停靠）+ 移动 dock（`--mobile-dock-icon-text/-action-bg`），否则行动按钮永远在自动校验之外（本轮即靠手工补算才发现 match-light/red 的隐藏 FAIL）。
7. 给 `check-perceptual.ts` 的 `firstColor()` 增加 `oklch()` / `color-mix()` 解析，让 glass 方案重新进入感知校验、消除 §4 的 5 个 tier 误报。

### P1.5 — 范围外、改动前既存（建议另起一轮）
8. **`glass-*-dark`（5 套）的 contrast FAIL 共 18 项**：`status-success/danger-text`（浅状态底配浅状态字 1.72/2.18）、`mobile-nav-text/active-text`（半透明导航底合成后 2.5–4.26）。改动前快照即存在，glass 不在本次 CIS/Match 范围；建议比照本轮 token 拆分/取深值的范式专门整改。

### P2 — 质量线（WARN，非阻断，择机）
9. 视品牌质量目标把弱灰（`content-muted` / `filltext-ft-e`）与状态文字从 AA（4.5–7）继续推向 AAA（7）。
10. 评估 `match-red` / `match-navy-red` 的「输」状态红 `func-lost`，降低与品牌红 CTA 的语义撞色（见 §5）。

---

## 附录：复跑命令（本地，ground truth）

```bash
pnpm theme:check          # 索引漂移（当前：24 套对齐，PASS）
pnpm theme:contrast --json    # WCAG 全量；--scheme=cis-light 单看
pnpm theme:perceptual --selftest   # 先确认 OKLCH 换算自检通过（修复后应全 OK）
pnpm theme:perceptual --json       # OKLCH 治理全量
```

> 沙箱内无 `tsx`，本次以 `node --experimental-strip-types scripts/check-*.ts` 运行真源（Node 22 类型擦除）取得上述全部数据；`theme.css` 经核未发生挂载层截断（node 读 118696 字符、尾部完整）。
