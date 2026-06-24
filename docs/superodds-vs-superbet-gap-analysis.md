# SUPERODDS：当前项目实现 vs Superbet 差距分析

日期：2026-06-24
范围：首页推荐区「SUPERODD」模块（`src/modules/home/_components/super-odds/`）
对标：Superbet（superbet.bet.br）真实「Super Odds / Odds Aumentadas」功能 + 已审计的 Superbet P0 设计语言（`docs/superbet-p0-source-audit.md`）

---

## 0. 结论速览

当前项目的「SUPERODD」与 Superbet 真实的「Super Odds」**名字相同，但本质不是同一个东西**：

- **Superbet 的 Super Odds** = 在精选赛事上对**单一选项**（主要是 1x2 胜平负）做的**赔率加成**，展示「原始赔率 → 加成后赔率」，入口在主推赛事 + 专门页 `/odds-aumentadas/futebol`。它是"单注增强赔率"。
- **当前项目的 SUPERODD** = 首页一个**多腿组合（串关）推荐卡**轮播，底部展示的是各腿赔率**连乘后的总赔率**（一个"+"图标 + 总赔率），点击一键把所有腿加入投注单。它是"精选组合推荐"。

也就是说：现有实现更接近"推荐串关 / Bet Builder 组合"，而不是 Superbet 定义的"加成单注"。叠加视觉上用了偏品牌外的亮红+酒红配色，与 Superbet 主题其余部分（`#c21e1c` 红 + 中性深灰底）不一致。

本轮已落地 1 个低风险高收益修复（视觉 Token 对齐）；其余涉及数据模型/产品口径的差距以"建议项"列出，需后端/产品确认后再改。

---

## 1. 当前项目 SUPERODD 实现现状

| 维度 | 现状 | 代码位置 |
| --- | --- | --- |
| 入口 | 仅首页推荐区；`ParlayBoost` 组件（沿用旧导出名）挂在 `reference-sports-home` | `super-odds/index.tsx`，`reference-sports-home/index.tsx:21,961` |
| 触发条件 | 卡片 `status=1` 且 `json_list` 非空 且 类型命中 SuperOdd 别名 | `index.tsx:291-296`、`isSuperOddCard` |
| 卡片结构 | 标题 → 分隔线 → 角标(SUPERODD) + 选项列表（>4 条 H5 走 Show More 弹窗）→ 底部赔率 CTA | `card.tsx`、`parts.tsx` |
| 底部赔率 | 各腿 `outcome_odds` 连乘的总赔率 + 圆形"+"图标；`rule=null` 恒定传入 | `odds-footer.tsx:41-44` |
| 加成展示 | **实际不展示**：`showBoostedOdds` 依赖 `rule`，现全程 `rule=null` → 恒为 `false`，无划线原价对比 | `parlay-boost-preview.ts:387-401` |
| 数据模型 | `RecommendCardSelection` 仅有 `outcome_odds`（当前赔率），**无"原始赔率/加成后赔率"字段**；`RecommendCard` 无卡级加成倍率字段 | `api/models/recommend-card.ts` |
| 配色（superbet skin） | 亮红 `#ff1f32` + 酒红底（卡 `#1d0d12`、根渐变 `#3b0b13`、边 `#6f2630`） | `recommend-card/skin.ts`（修复前） |
| 多主题 | 5 套 skin（superbet/betano/match/betbus/default）× light/dark | `skin.ts` |

一句话：现卡片是"精选多腿组合 → 展示连乘总赔率 → 一键加入"的推荐卡，**没有任何"赔率加成"语义在界面上体现**。

---

## 2. Superbet 真实「Super Odds」是什么

依据公开资料与已审计源（见文末 Sources、`superbet-p0-source-audit.md`）：

- **本质**：对精选赛事的**单一选项**给出高于常规的"加成赔率"，核心市场是**胜平负 / Final Result（1x2）**。属于"被运营商抬高的单注赔率"。
- **展示**：突出"原价 → 加成价"的对比，强调更高的潜在回报。
- **入口**：当日主推赛事中内嵌，且有**独立专题页/横幅** `https://superbet.bet.br/odds-aumentadas/futebol`（页面标题「Super Odds Futebol | Odds Aumentadas」）。
- **适用**：通常面向赛前单注（enhanced-odds 促销的普遍口径）。
- **与组合的关系**：Superbet 的"多腿组合"是另一套功能（Multi Criar Aposta / Bet Builder / SUPERMÚLTIPLA 串关加成），与 Super Odds 不是同一模块。

> 注：已审计的 Superbet P0 截图覆盖了 `MULTI CRIAR APOSTA`、`EVENTOS POPULARES`、`DICAS DE APOSTAS`、`SUPERMÚLTIPLA`、`APOSTAS POPULARES`，**未单独抓取 Super Odds 模块**；但线上确有 `odds-aumentadas` 专题页，故 Super Odds 作为独立功能成立。

设计语言（已审计，用于对齐视觉）：选中/CTA 红 `rgb(194,30,28) = #c21e1c`；卡面/侧栏中性深灰底 `#181a1b`；展开内层赔率底 `rgb(39,42,44) = #272a2c`；赔率按钮高 `32px`、圆角约 `4–6px`。这些已在 `brand-ui-skin.ts` 的 superbet 配置里落地（`--brand-odds-selected-bg:#c21e1c`、`--brand-match-card-bg:#181a1b`）。

---

## 3. 差距清单（按优先级）

| # | 差距 | 严重度 | 说明 | 可否纯前端修 |
| --- | --- | --- | --- | --- |
| G1 | **加成语义缺失** | 高 | Super Odds 的灵魂是"原价→加成价"。现卡片只展示连乘总赔率，无任何加成对比；`showBoostedOdds` 因 `rule=null` 恒为关闭 | 否（需数据字段） |
| G2 | **产品模型错配** | 高 | Superbet=单注加成；现实现=多腿组合推荐。命名 SUPERODD 但行为是组合卡 | 否（需产品口径） |
| G3 | **视觉 Token 偏离品牌** | 高 | superbet skin 用 `#ff1f32`+酒红底，与全站 Superbet 的 `#c21e1c`+中性深灰底不一致 | ✅ 已修，见 §4 |
| G4 | **底部 CTA 语义** | 中 | 单注加成应展示"市场/选项 + 加成价"，现展示通用"+ 总赔率"，与单注场景不符（与 G1/G2 联动） | 部分 |
| G5 | **入口/发现性** | 低 | Superbet 有主推内嵌 + 专题页 `odds-aumentadas`；现仅首页轮播一处 | 需产品规划 |
| G6 | **角标文案** | 低 | 现 `SUPERODD`；Superbet 实际用 `SUPER ODDS / Odds Aumentadas`。若想贴近可调 locale 文案 | ✅ 易改（属文案决策） |

---

## 4. 本轮已落地修复（G3）

**文件**：`src/modules/home/_components/super-odds/recommend-card/skin.ts`（superbet 分支）

把 SuperOdd 卡片的 superbet 皮肤从"亮红 `#ff1f32` + 酒红底"重写为 Superbet 真实品牌：选中/CTA/标题竖条/分隔线/角标描边统一为 `#c21e1c`，深色卡面改为中性深灰 `#181a1b`（对齐 `--brand-match-card-bg`），根渐变改为"品牌红低透明 → 中性深灰"，浅色保留浅底 + `#c21e1c` 红强调。仅影响 superbet 配色下的该卡片，blast radius 极小，light/dark 同步对齐。

效果：SuperOdd 模块视觉与全站 Superbet 主题（红黑壳、`#c21e1c` 选中、中性深底）一致，不再像"另一个产品"。

---

## 5. 建议后续（需后端/产品确认，未擅自实现）

- **G1+G2（核心）**：若要做成真正的 Super Odds，需要后端在选项级补充"原始赔率 / 加成后赔率（或加成倍率）"字段。前端拿到后即可复用现成的划线原价 → 加成价展示路径（`ParlayBoostDisplayOdds` 的 `showBoostedOdds` 思路），并支持"单选项卡"形态（`json_list.length===1` 时按单注加成渲染：市场名 + 选项 + 原价划线 + 加成价）。在没有该数据前不应造假展示，故本轮不实现。
- **G4**：随 G1/G2 一起，单注场景下把"+图标 + 总赔率"换成"选项 + 加成价"。
- **G5**：评估是否新增 `odds-aumentadas` 专题入口 / 主推赛事内嵌。
- **G6**：如需贴近 Superbet，可把 `matches.superOdd.title` 与 `common.recommendCardBadge.superOdd` 文案从 `SUPERODD` 调整为 `SUPER ODDS`（属品牌命名决策，未改）。

---

## 6. 验证说明

- 静态校验：已全量 grep 确认删除残留为 0，`skin.ts` 改动为同分支等价替换（仅颜色值），不影响类型/结构。
- 工具链：本环境 `node_modules` 挂载持续 I/O error，`tsc / biome / theme:check / theme:contrast` **无法在沙箱内运行**。请在本地执行以最终确认：
  - `pnpm lint:ts`
  - `pnpm lint`
  - `pnpm theme:check`（如有 `theme:contrast` 一并跑，确认 `#c21e1c` 白字对比度达标）
- 视觉：建议在 `?scheme=superbet-dark` 与 `superbet-light` 下回归首页 SUPERODD 卡片。

---

## Sources

- Superbet Super Odds 专题页：https://superbet.bet.br/odds-aumentadas/futebol
- SuperOdds 科普（Goal.com）：https://www.goal.com/br/apostas/superodds-betano/blt64cfca7bfc814621
- Super odds 指南（Placar）：https://placar.com.br/apostas/guias/super-odds/
- Superbet BR Sportsbook Review（AskGamblers）：https://www.askgamblers.com/sports-betting/sportsbook-reviews/superbet-br-sportsbook
- 已审计源：`docs/superbet-p0-source-audit.md`、`docs/superbet-p0-implementation-breakdown.md`
