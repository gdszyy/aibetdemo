# SUPERODD：当前项目实现 vs Superbet 差距分析

日期：2026-06-25（按 Superbet 官网实测覆盖 2026-06-24 旧版结论）
范围：首页推荐区「SUPERODD」模块（`src/modules/home/_components/super-odds/`）
对标：Superbet（`https://superbet.bet.br/`）首页真实「SUPER ODDS / Price Boost」模块（`price-boost-carousel`）
来源审计：`docs/superbet-p0-source-audit.md` 的 `PC — Home — Super Odds (Price Boost)`

---

## 0. 结论速览（已按官网实测纠正）

旧版本文档（2026-06-24）的核心结论是**错的**，源头是：当时的 `superbet-p0-source-audit.md` **没有抓到 Super Odds 模块本体**，于是据二手科普文章臆断成"单注 1x2 加成"，并据此把视觉改成了**红色 `#c21e1c`**。

2026-06-25 直连官网 `https://superbet.bet.br/` 实测后确认：

- **Superbet 真实「SUPER ODDS」是首页一个金色多腿「SUPER BOOST」组合轮播**（容器 `price-boost-carousel`）：金色头部渐变 + 白色斜体大标题 `SUPER ODDS` + 副标题 `Aumente seus Ganhos!` + `Ver tudo`，下面排一行卡片，每张卡是**多腿组合**，带金色 `SUPER BOOST` 角标，底部展示"原价划线 → 加成后总赔率"。
- **当前项目的 SUPERODD** = 首页多腿组合推荐卡轮播，底部展示各腿连乘后的总赔率、一键加入。

也就是说：两者**本质相同**（都是"多腿组合 + 加成总赔率"），**不是**旧文档说的"单注加成 vs 组合推荐"的产品错配。真正需要纠正的只有**视觉**：官网是**金色**，旧文档却把皮肤改成了红色。

本轮已落地：把 superbet 皮肤由红 `#c21e1c` 改回官网实测的**金色**；并把 `superbet-p0-source-audit.md` 补上 Super Odds 模块章节。

---

## 1. Superbet 官网实测真相（authoritative）

来源：`https://superbet.bet.br/` 首页 `price-boost-carousel`，2026-06-25 实测计算样式。

| 维度 | 实测值 |
| --- | --- |
| 模块容器 | class `price-boost-carousel` |
| 头部渐变 | `linear-gradient(180deg, rgb(157, 118, 36) 0%, rgb(126, 94, 32) 32%, rgb(7, 7, 8) 84%)`（金→近黑） |
| 模块圆角/内距 | radius `16px 16px 0px 0px`，padding `16px 0px 0px` |
| 标题 `SUPER ODDS` | `rgb(255, 255, 255)`，`Roboto Flex`，`32px`，weight `900`，`italic`，`uppercase`，字距 `1.2px` |
| 副标题 `Aumente seus Ganhos!` | `rgb(255, 255, 255)`，`14px`，weight `400`，`Inter` |
| `Ver tudo` | `rgb(255, 109, 87)`，`14px`，weight `600` |
| 卡面 | `rgb(24, 26, 27)`，radius `10px`，padding `12px` |
| `SUPER BOOST` 角标文字 | `rgb(248, 190, 44)` 金，`16px`，weight `900`，`italic`，`uppercase` |
| `SUPER BOOST` 胶囊 | bg `rgba(248, 190, 44, 0.2)`，radius `1000px`，padding `3px 8px` |
| 角标图标（"小闪电"） | `commerce-price-boost-dark.svg`，`20px x 20px`（多色 price-boost 字形） |
| 赔率芯片 | 内层 `rgb(39, 42, 44)`，radius `4px`，height `32px` |
| 原价（划线） | `rgba(255, 255, 255, 0.68)`，`12px`，`line-through` |
| 加成后赔率 | `rgba(255, 255, 255, 0.8)`，weight `600` |
| 装饰插画 | `generosity_price_boost_alt.png`，`80px x 80px` |

要点：模块身份色是**金色**（`#f8be2c` / 头部 `#9d7624`），与官网其余部分的红 `#c21e1c`（头部/选中/CTA）**刻意区分**——金色专属于 Super Odds / price-boost。

---

## 2. 旧文档错在哪（逐条纠正）

| 旧 Gap | 旧结论 | 实测纠正 |
| --- | --- | --- |
| G1 加成语义缺失 | "Super Odds 灵魂是单注原价→加成价，现卡片只展示连乘总赔率" | 部分成立但定性错。官网 Super Odds **就是多腿组合**，展示的正是"组合原价划线 → 加成后总赔率"。我们的 `showBoostedOdds`（原价划线 + 加成价）路径**方向正确**，缺的只是后端把 `rule` 填上（现 `rule=null` 故未点亮），**不是产品形态错** |
| G2 产品模型错配 | "Superbet=单注加成；现实现=多腿组合，命名对但行为错" | **错误，已否定**。官网 Super Odds 首页模块本身就是多腿 `SUPER BOOST` 组合轮播，与我们的 SUPERODD **同形态**。无错配 |
| G3 视觉 Token 偏离 | "把 superbet 皮肤改成 `#c21e1c` 红 + `#181a1b` 深底" | **方向错，已重改**。卡面 `#181a1b` 对（实测 `rgb(24,26,27)`），但强调色应是**金色**（头部金渐变 + 金字 `SUPER BOOST`），不是红。本轮已改金，见 §4 |
| G4 底部 CTA 语义 | "应展示单注'选项+加成价'" | 随 G2 否定而失效。组合场景下"连乘原价划线 → 加成后总价"即为正解 |
| G5 入口/发现性 | "官网有专题页 `odds-aumentadas` + 主推内嵌" | 仍成立（低优）。官网首页模块有 `Ver tudo` 通向全部；我们仅首页轮播一处 |
| G6 角标文案 | "现 `SUPERODD`；官网用 `SUPER ODDS`" | 仍成立（文案决策）。官网模块标题 `SUPER ODDS`、卡片角标 `SUPER BOOST` |

---

## 3. 当前实现 vs 官网（校正后剩余差距）

| # | 差距 | 严重度 | 说明 | 可否纯前端修 |
| --- | --- | --- | --- | --- |
| R1 | 加成数据未点亮 | 中 | `showBoostedOdds` 依赖 `rule`，现全程 `rule=null` → 原价划线/加成价不显示。需后端在卡级补 `ParlayBoostRule`（或选项级原价/加成倍率） | 否（需数据） |
| R2 | 模块头部缺金色品牌带 | 低 | 官网有金渐变头部带（标题 + `Aumente seus Ganhos!` + `Ver tudo`）。本轮已把 superbet section 背景改成金→近黑渐变近似该带；副标题/`Ver tudo` 暂未结构化新增 | 部分（结构增量） |
| R3 | 角标文案 | 低 | 现 `SUPERODD`；官网 `SUPER BOOST`。属 locale 文案决策（`common.recommendCardBadge.superOdd`），未擅改 | ✅ 易改 |
| R4 | 专题入口 | 低 | 官网 `Ver tudo` → 全部 Super Odds；我们暂无 | 需产品规划 |

---

## 4. 本轮已落地修复

**文件**：`src/modules/home/_components/super-odds/recommend-card/skin.ts`（superbet 分支）

把 superbet 皮肤从旧文档误改的"红 `#c21e1c`"重写为官网实测**金色**：

- section 背景（近似模块头部金带）：dark `linear-gradient(180deg, #9d7624 0%, #7e5e20 32%, #070708 84%)`，light 金白渐变。
- 标题竖条/分隔线：金 `#f8be2c`。
- `SUPER BOOST` 角标：金字 `#f8be2c` + 金色 20% 透明胶囊 `rgba(248,190,44,0.2)`、全圆角、斜体 900（对齐实测）。
- 卡面：保留中性深底 `#181a1b`，圆角对齐实测 `10px`。
- 底部 CTA：金 `#f8be2c`（hover `#ffce3a`）+ 深色文字 `#181a1b` + 深色"+"圆点内嵌金色。
- 「加成」造型（`boostMotif`，替换官网原生小闪电）：superbet 用 `flame` 并染金 `#f8be2c`，与其余品牌（betano `boost` / match `spark` / betbus `star` / default `spark`）的"按主题变化"体系一致。

`docs/superbet-p0-source-audit.md`：新增 `PC — Home — Super Odds (Price Boost)` 章节（金渐变头部、`SUPER BOOST` 金角标、多腿组合、原价划线→加成价等实测 token），并更新 `Sources` / `Status` / `Coverage & Limits`，注明此前漏抓、已于 2026-06-25 补全。

blast radius：仅 superbet 配色下该卡片；betano/match/betbus/default 与亮/暗其余皮肤不受影响。

---

## 5. 建议后续（需后端/产品确认，未擅自实现）

- **R1（核心）**：后端补卡级 `ParlayBoostRule`（或选项级原价/加成倍率），前端 `showBoostedOdds` 即自动点亮"原价划线 → 加成后总赔率"，与官网一致；在没有该数据前不造假展示。
- **R2**：如需更贴官网，可在 section 顶部结构化新增金色头部带（副标题 `Aumente seus Ganhos!` + `Ver tudo`）。
- **R3/R4**：`SUPERODD` → `SUPER BOOST` 文案；评估 `Ver tudo` / Super Odds 专题入口。

---

## 6. 验证说明

- 静态：`skin.ts` 改动为 superbet 单分支等价替换（仅颜色/圆角/角标类名），不改类型/结构；`boostMotif`、`boostMotifClassName` 字段保留，`parts.tsx` / `odds-footer.tsx` / `card.tsx` 无需改动。
- 工具链：本沙箱无法运行 `tsc / biome / theme:check / theme:contrast`（`node_modules` 挂载受限）。请在本地执行确认：
  - `pnpm lint:ts`
  - `pnpm lint`
  - `pnpm theme:check`（连带 `theme:contrast`，确认金底 `#f8be2c` + 深字 `#181a1b`、金字 `#f8be2c` 角标、白标题压金渐变的对比度达标）
- 视觉：在 `?scheme=superbet-dark` 与 `superbet-light` 下回归首页 SUPERODD 卡片，核对金色头部带、`SUPER BOOST` 金角标、底部金色加成 CTA。

---

## Sources

- Superbet 首页 Super Odds 模块（实测）：`https://superbet.bet.br/`
- Superbet Super Odds 专题页：`https://superbet.bet.br/odds-aumentadas/futebol`
- 已审计源：`docs/superbet-p0-source-audit.md`（`PC — Home — Super Odds (Price Boost)`）、`docs/superbet-p0-implementation-breakdown.md`
