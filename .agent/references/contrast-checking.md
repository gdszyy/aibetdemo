# 底-文字对比度校验规范（Contrast Checking）

> 目的：用一套**可执行**的标准衡量「底色 ↔ 文字」是否看得清。理论基础是「灰度对比」——把任意颜色折算成人眼感知的灰度（相对亮度 relative luminance），用两块灰度的比值判定可读性。覆盖全部 8 套 scheme。
>
> 唯一可执行真源：`scripts/check-contrast.ts`（`pnpm theme:contrast`）。本文解释它「为什么这么算、算了什么、怎么读结果」。脚本与本文不一致时，以脚本为准。
>
> **配套的另一层**：本套是 **WCAG 守门**（底-文字看不看得清，法规硬线，会阻断 CI）。色板**自身**齐不齐——色阶等距、跨品牌同语义一样亮、文字层级单调、品牌色相保持——属感知质量问题，WCAG 比值表达不了，由 [`perceptual-color.md`](./perceptual-color.md)（`pnpm theme:perceptual`，OKLCH 感知亮度）治理。两层正交、不重叠：**先过对比度硬线，再看感知治理质量线**。

## 1. 理论基础：灰度 = 相对亮度，不是 HSL 的 L

直觉「同一色调在 0 饱和度下灰度不同」是对的，但要用对模型。**HSL 的 L（亮度）不是人眼感知的灰度**：纯黄 `hsl(60,100%,50%)` 和纯蓝 `hsl(240,100%,50%)` 的 L 都是 50%，但黄色看上去远比蓝色亮。把它们降到 0 饱和度（同 L）会得到相同的灰，这与肉眼不符。

正确的灰度是 **WCAG 相对亮度**：先把 sRGB 三通道做 gamma 线性化，再按人眼敏感度加权（绿最敏感、蓝最弱）：

```
线性化:  c' = c/255 ≤ 0.03928 ? (c/255)/12.92 : ((c/255+0.055)/1.055)^2.4
相对亮度: Y = 0.2126·R' + 0.7152·G' + 0.0722·B'      （0=黑, 1=白）
对比度:   CR = (Y_亮 + 0.05) / (Y_暗 + 0.05)           （范围 1:1 … 21:1）
```

绿权重 0.7152、蓝权重 0.0722 正是「相同色调、不同灰度」的根因。

**典型反例（也是本项目最严重的失败模式）**：金/奖金块 `func-bonus #ffc31d` 上放白字。黄是高亮度色（Y≈0.79），白 Y=1，两者几乎没有亮度差 → 对比仅 **1.61:1**，远低于 4.5。同样一句「白字」如果放在饱和蓝底上则轻松达标——这就是为什么必须按亮度算，而不能按 HSL-L 或「看起来是深色就行」。

## 2. 判级标准（双档：AA 门槛 / AAA 推荐）

| 文字档 textClass | 适用 | AA 门槛（硬线） | AAA 推荐（目标） |
|---|---|---|---|
| `normal` | 普通正文（< 18.66px 粗 或 < 24px） | **4.5:1** | 7:1 |
| `large` | 大字（≥ 18.66px 且粗，或 ≥ 24px） | **3:1** | 4.5:1 |
| `graphic` | 非文字：图标、功能性边界、状态指示（WCAG 1.4.11） | **3:1** | （无 AAA 档） |

判级逻辑：

```
ratio ≥ AAA          → PASS  （绿，达到推荐线）
AA ≤ ratio < AAA     → WARN  （黄，过门槛但未达推荐）
ratio < AA           → FAIL  （红，未过门槛，必须修）
```

- **文字档（normal/large）的 FAIL 会触发退出码 1**，可接入 CI 阻断合并。
- **WARN 默认不致命**；`--strict` 下 WARN 也触发退出码 1。
- **图形档（graphic）仅作参考，不阻断**。当前装饰性卡片描边普遍 < 3:1，但 WCAG 1.4.11 只约束**功能性**图形/边界；纯装饰分隔线不受约束，故列为信息项由人工判断。

## 3. 校验对象：「底-文字」配对契约

脚本不盲扫所有颜色组合，而是维护一张 **UI 中真实成对出现** 的「前景 / 底」清单（`PAIRS`，语义令牌层），逐套 scheme 求值。当前 38 项配对，分组如下：

| 分组 | 检查内容 | 档 |
|---|---|---|
| 正文·表面 | `content-primary/secondary/muted` × `page-bg/surface-1/2/3` | normal |
| filltext文字 | `filltext-ft-e…h` × `surface-1/page-bg`（旧令牌仍大量直用） | normal |
| 反色·赔率块 | `content-inverse` × `content-primary`(tooltip 底)/`filltext-ft-g`(计数徽章底)；`odds-selected-text` × 选中赔率底 | normal |
| 品牌 CTA | `on-brand` × `brand-primary-0/4`（CTA 上的白字） | normal |
| 功能色块 | `neutral-white-h` × `func-win/lost/favorite-solid`（badge 块底专用暗变体）；`func-bonus-on`(深字) × `func-bonus`(金块) | normal |
| 功能色作文字 | `func-win/lost/favorite/pending` × `surface-1`（彩色字放白卡） | normal |
| 状态条 | `status-success/danger-text` × 半透明状态底（合成到卡片） | normal |
| 移动导航 | `mobile-nav-text/active-text` × 半透明导航底（合成到页面） | normal |
| 侧栏行 | `interactive-row-text/active-text` × `surface-shell` | normal |
| 图形3:1 | `border-strong`、激活轨/图标、导航激活图标 | graphic |

> 维护原则：**新增「成对出现」的底-文字组合时，在 `PAIRS` 里加一行**，而不是扩大扫描面。契约即规范——这张表就是「设计上承诺过要看得清」的清单。

## 4. 解析与建模规则（脚本如何还原真实像素）

1. **scheme 级联**：解析 `theme.css` 的 8 个 `:root[.scheme]` 块。每套 scheme 的有效变量 = `:root`（gtb 基底）∪ 该 scheme 覆盖，模拟浏览器 `:root.scheme` 高特异性覆盖。
2. **`var()` 递归展开**：`var(--x, fallback)` 一路解析到底色字面量，带环检测与 fallback。
3. **半透明合成（alpha compositing）**：底若带透明度（如状态底 `rgba()`、导航底），按 `over` 链自上而下合成到不透明基底（默认 `page-bg`），再算对比。多层（如导航激活图标 pill → 导航底 → 页面底）用 `over: [...]` 链式合成。
4. **渐变取最差停靠色**：底是 `linear-gradient` 时，提取所有停靠色，与前景两两求对比，**取最低值**（worst-case），保证渐变任意位置都达标。
5. **前景半透明**：前景带透明度时先合成到已解析的实底上再求值。

## 5. 运行方式

```bash
pnpm theme:contrast              # 仅打印 FAIL/WARN + 汇总（日常用）
pnpm theme:contrast --all        # 连 PASS 一起打印（审查全量）
pnpm theme:contrast --scheme=betbus   # 只看一套
pnpm theme:contrast --strict     # WARN 也算失败（退出码 1）
pnpm theme:contrast --json       # 机器可读，喂给其他工具
```

接入 CI（可选）：在 `.github/workflows/check-pr.yml` 的 build 前加一步 `pnpm theme:contrast`，文字档 FAIL 即阻断。当前文字档基线已清零（见 §6），可直接接入阻断模式。

## 6. 当前基线结果（2026-06，全 8 套 scheme）

> 三轮整改后，**文字档 FAIL 已清零（21 → 0）**。前两轮令牌级压暗清掉 57 → 21（保色相、0 回归），并把第二轮「修正契约暴露的深色主题真问题」显形为 21 项架构残留；第三轮按「拆 / 换 / 梯度」三招把这 21 项全部解决。

文字档合计：**FAIL 0**（已逐对用 WCAG 相对亮度复核）。WARN/PASS 以 `pnpm theme:contrast` 实时输出为准。

> ⚠️ **沙箱内未能跑真源校验器**：当前挂载的 `node_modules` 不完整（缺 `tsx`），`pnpm theme:contrast` 跑不起来，下列数值是用真实令牌值逐对手算 WCAG 相对亮度复核的。**请在本地 `pnpm theme:contrast` 复跑一次确认 ground truth**。

### 第三轮三招（解决残留 21 项，均保色相）

1. **拆——深色主题 badge 块底专用暗令牌（解决 12 项「白字 on 亮功能块」）**：根因是同一 `func-*` 在深卡上「当文字」要亮、「当 badge 块底托白字」要暗，单令牌双重身份取值冲突。新增 `--func-win-solid`/`--func-lost-solid`/`--func-favorite-solid`：仅深色 scheme（betbus / match / superbet-dark / betano-dark）覆盖为暗值托白字，浅色 scheme 在 `:root` 用 `var(--func-*)` 自动继承本套基值（不变）。组件里 `bg-func-*` badge（online / ticket-leg-status-node / parlay-leg / live-matches / top-live-matches / clear-exception-button / promo-codes-section / stake-card / kyc-step-chip / support-floating 等）改用 `bg-func-*-solid`；`func-* on surface-1`（当文字）仍用原亮值，照常达标。
2. **换——金 bonus 块改深字（解决 4 项「白字 on 金块」）**：新增 `--func-bonus-on: #241a00`（深棕），金黄物理上托不住白字。`vip.tsx` 联系按钮在 working/金底态用 `text-func-bonus-on`，disabled 灰底态保留白字（达标）。契约 pair 17 的 fg 由 `on-brand` 改为 `func-bonus-on`。
3. **梯度——品牌 CTA 取更亮梯度步（解决 5 项）**：品牌色是梯度，CTA 底取更亮一档即可托白字而不离色相。betbus `--brand-primary-4` #d93642 → `#df3844`；betano-light #d93400 → `#ec3800`。on-brand/p4 由 4.40/4.00 提到 4.62。

### 附带修正：betbus `content-inverse`（#ffffff → #160006）

排查中发现 betbus 是唯一未把 `content-inverse` 反相为深色的 scheme。`content-inverse` 真实用在 `content-primary`(tooltip 底，见 tooltip.tsx / question-tooltip.tsx) 与 `filltext-ft-g`(计数徽章底，见 checkbox-filter.tsx) 上，betbus 这两底均为浅色，白字必挂。改深后两对达 18.09 / 13.67。契约把原 `content-inverse × brand-primary-0` 一对拆为这两个真实用例。

### 复核要点（全 PASS/WARN，0 FAIL）

| scheme | 类型 | 文字 FAIL | 关键复核值 |
|---|---|---|---|
| `gtb` | 浅·红 | 0 | func-bonus-on/bonus ≈ 8–12 |
| `betbus` | 深 | 0 | on-brand/p4 4.62；content-inverse 18.09 / 13.67；func-*-solid 白字 4.7–5.5 |
| `match` | 深·绿 | 0 | func-*-solid 白字 4.7–5.5 |
| `match-light` | 浅·绿 | 0 | func-bonus-on/bonus ≈ 8–12 |
| `superbet-light` | 浅·红 | 0 | func-bonus-on/bonus ≈ 8–12 |
| `superbet-dark` | 深·红 | 0 | func-*-solid 白字 4.7–5.5；func-bonus-on 已改深字 |
| `betano-light` | 浅·橙 | 0 | on-brand/p4 4.62 |
| `betano-dark` | 深·橙 | 0 | func-*-solid 白字 4.7–5.5（func-* on surface-1 当文字 6.2–9.5，未动） |

## 7. 整改优先级建议

文字档 FAIL 已清零，下表前三项（P0/P1 功能色）已完成，余下为 WARN 质量提升，非阻断。

| 优先级 | 模式 | 状态 / 建议方向 |
|---|---|---|
| ~~P0~~ ✅ | 深色主题白字 on 亮 `func-win`/`func-lost`/`func-favorite`（12 项）| **已拆令牌**：新增 `func-*-solid` badge 块底暗变体（仅深色 scheme 覆盖），文字版保留亮值。见 §6「拆」。 |
| ~~P0~~ ✅ | 白字 on `func-bonus` 金块（4 项）| **已换深字**：新增 `--func-bonus-on: #241a00`，金块上用深字。见 §6「换」。 |
| ~~P1~~ ✅ | 品牌 CTA 白字（5 项）| **已取亮梯度步**：betbus / betano-light `brand-primary-4` 提亮一档。见 §6「梯度」。 |
| P1 | 弱灰 `filltext-ft-e`/`content-muted` | 浅色 scheme 下压暗弱灰，目标 ≥ 4.5（正文）/ ≥ 7（推荐）。已达 AA，余 WARN。 |
| P2 | 状态文字、品牌红激活文字 on 浅底 | 已到 ≥ 4.5；可继续向 7 提升。 |
| P3 | WARN 项（4.5–7 之间） | 过 AA 未达 AAA，按品牌质量目标择机提升；非阻断。整改后 WARN 数上升属预期：原本 FAIL 的项被压过 4.5 门槛后多落进 4.5–7 的 WARN 区。 |

> 「色块上的白字」与「同色当文字」共用一个 `func-*` 变量却需要相反取值——本轮已按 scheme-system.md 拆 `surface`/`neutral-white-h` 的思路，给功能色做了「块底色」(`func-*-solid`)与「文字色」(`func-*`)的语义拆分。

## 8. 人工目检清单（脚本测不到的）

自动校验只覆盖「令牌层成对出现」的静态颜色，以下仍需人工核：

- [ ] **图片/视频/Logo 上的叠字**：底是位图而非令牌，脚本无法采样，需目检（尤其 banner、战队 logo 上的文字）。
- [ ] **真·渐变文字 / 文字描边 / 阴影**：脚本对渐变底取最差停靠色，但文字本身带渐变或 text-shadow 时需肉眼确认。
- [ ] **hover/active/disabled 临时态**：契约覆盖了主要交互态，但组件局部自定义的临时背景（写死 rgba 阴影、半透明遮罩）需抽查。
- [ ] **焦点环 / 选中边界**：功能性边界（聚焦、选中）应达 3:1；当前图形档列为参考，需人工区分「功能性」与「装饰性」。
- [ ] **混合不透明叠层**：多层半透明叠加且 `over` 链未在契约中声明的场景。
- [ ] **真实设备/弱光环境**：数值达标 ≠ 主观舒适，关键页面在真机暗光下复核。

## 9. 维护

- **加一对底-文字**：在 `scripts/check-contrast.ts` 的 `PAIRS` 加一行（指定 `fg`/`bg`/`textClass`，半透明底加 `over`）。
- **加一套 scheme**：`theme.css` 新增 `:root.<scheme>` 块后，脚本自动纳入，无需改契约。
- **调阈值**：改 `THRESHOLDS`（不建议偏离 WCAG）。
- 本文 §6 基线随 `theme.css` 变动会过时，**以 `pnpm theme:contrast` 实时输出为准**；大改色后请重跑并更新本节。
