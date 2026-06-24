# 感知用色治理校验规范（Perceptual Color Governance · OKLCH）

> 目的：用一套**可执行**的标准衡量「整套色板自身排得齐不齐」——色阶是否等距、跨品牌同语义是否一样亮、文字层级是否单调、品牌色相是否守得住。理论基础是 **OKLCH / OKLab 的感知亮度 L**（CIELAB L\* 的现代版，CSS Color 4 原生支持）。覆盖全部已注册 scheme。
>
> 唯一可执行真源：`scripts/check-perceptual.ts`（`pnpm theme:perceptual`）。本文解释它「为什么这么算、算了什么、怎么读结果」。脚本与本文不一致时，以脚本为准。
>
> **与 [`contrast-checking.md`](./contrast-checking.md) 的关系**：那一套是 **WCAG 守门**（底-文字看不看得清，法规硬线）；本套是 **OKLCH 治理**（色板自身齐不齐，质量线）。两层正交、不重叠，详见 §1。

## 1. 为什么再加一层：WCAG 守门，OKLCH 治理

`contrast-checking.md` 已经用 WCAG 相对亮度把「底-文字可读性」守住了，且文字档 FAIL 已清零。那为什么还要这一层？

因为 WCAG 相对亮度 `Y` 是**线性光强**——它是为「对比度比值」设计的，算对了「看不看得清」，但它**不是人眼感知的明暗刻度**：`Y` 在暗端被压扁（暗区里物理光强差一点点，人眼看上去差很多）。于是有一类问题，WCAG 的比值天然表达不了：

- **色阶等不等距**：`surface-1/2/3`、`filltext` 灰阶，相邻两阶的「人眼台阶」是否均匀、有没有两阶撞在一起？这是单组颜色内部的均匀性，不是底-文字比值。
- **跨品牌同语义一样不一样亮**：5 套深色 scheme 的 `content-secondary`，人眼看上去是不是「一样亮的次级文字」？还是有的偏白有的偏灰？这是跨 scheme 的一致性，WCAG 只看单套内的比值。
- **文字层级单不单调**：`primary → secondary → muted` 离底的「感知明暗距离」是不是单调递减、步长可辨？倒挂了 WCAG 各自都可能仍达标，但层级语义已经坏了。

**OKLCH / OKLab 的 L 才是感知均匀的明暗刻度**，且有一条关键保证：

> **固定 L、只改 H（色相），人眼看到的明暗 / 灰度绝对一致。**

所以上面这些「齐不齐」的问题，都能用一根 `L` 轴判定——这正是 WCAG 给不了的。

| | `contrast-checking.md`（WCAG） | 本文（OKLCH） |
|---|---|---|
| 度量 | 相对亮度 `Y`（线性光强）的比值 | 感知亮度 `L`（OKLab）的差与序 |
| 回答 | 「这块底上的这行字看得清吗」 | 「这套色板自己排得齐吗」 |
| 定位 | **可读性硬门槛**（法规线，会阻断 CI） | **感知治理层**（质量线，默认不阻断） |
| 单位 | `CR` 1:1 … 21:1 | `ΔL` ∈ 0..1 |
| 失败语义 | 文字档 FAIL = 必须修 | 仅色域越界 / 层级倒挂 = FAIL，其余 = WARN |

**为什么不拿 OKLCH ΔL 去替 WCAG 算对比**：ΔL 不是被验证过的可读性指标——它忽略了 chroma 对可读性的影响，也不含 WCAG 的法规语义。两套各管一段，别混用。这层是 WCAG 的**补充**，不是替代。

## 2. 理论基础：OKLCH L 是感知明暗刻度

换算链路（Björn Ottosson 的 OKLab，脚本逐行实现并自检）：

```
sRGB 8bit → 去 gamma（线性 sRGB） → LMS 锥响应 → 立方根压缩 → OKLab(L,a,b) → OKLCH(L,C,h)
```

- `L`：感知亮度，0=黑 1=白，**感知均匀**（等量 ΔL ≈ 等量人眼明暗变化）。这是 CIELAB `L*` 的现代等价物。
- `C`：感知彩度（到中性轴的距离）。
- `h`：色相角（度）；**低彩度时 `h` 无意义**，故色相一致性检查会先按 `C ≥ HUE_MIN_C` 剔除近灰步。

与 WCAG `Y` 的分工：`Y` 是线性光强、给**比值**用对（对比度）；`L` 是感知刻度、给**差与序**用对（均匀 / 一致 / 单调）。同一个 #ffc31d 金色，`Y≈0.79`（线性光强很高，所以托不住白字），`L≈0.85`（感知上也很亮）——两者都对，但用途不同。

换算正确性由 `--selftest` 守门：以 6 个已知锚点（黑、白、中灰、sRGB 红绿蓝原色）校验，`#ff0000→L .628 C .258 h29`、`#00ff00→L .866 C .295 h142`、`#0000ff→L .452 C .313 h264`，漂移超过 `ΔL .002 / ΔC .002 / Δh .5°` 即判换算坏，**拒绝在错误的色彩空间上判级**。每次正式运行前会先静默跑一遍自检。

## 3. 四项检查（契约 + 阈值）

契约是语义层的——**新增一组只在脚本对应数组里加一行**，不扩大扫描面。阈值集中在脚本顶部 `T` 对象，勿散落。

### 3.1 色阶亮度均匀度 `ramp`（WARN）

「同一物理梯度」的台阶应**单调** + **步长大致等距** + **不许两阶撞在一起**。方向（升/降）不限。

当前 3 组：`surface-1/2/3`（表面台阶）、`filltext-ft-a…d`（灰阶·底）、`filltext-ft-e…h`（灰阶·墨）。

| 判据 | 阈值 | 含义 |
|---|---|---|
| 非单调 | 出现反向台阶 | 台阶忽明忽暗（WARN） |
| 撞色 | 相邻 ΔL < `RAMP_COLLISION` = 0.012 | 两阶人眼几乎分不开（WARN） |
| 步距偏小 | 相邻 ΔL < `RAMP_MIN_STEP` = 0.025 | 区分度不足（WARN） |
| 不等距 | max步 / min步 > `RAMP_UNEVEN_RATIO` = 3.0 | 台阶疏密不均（WARN） |

> **真实命中**：`gtb` 的灰阶·墨 `filltext-ft-e #666d7a`（L 0.533）与 `ft-f #606e86`（L 0.536）ΔL 仅 **0.0023**，远低于 0.012 → 撞色 WARN。两个「弱/次级文字灰」在感知上几乎同明暗，这就是 ramp 检查要抓的典型。（该撞色已于 2026-06 修复：`ft-f` `#606e86→#526077`，该组恢复单调；此处保留作检查示例。）

### 3.2 文字层级单调 `tier`（倒挂=FAIL，太近=WARN）

`content-primary → secondary → muted` 相对 `page-bg` 的**感知明暗距离 |ΔL|** 必须单调递减（primary 离底最远、对比最强；muted 最近、最弱），且相邻层级步长可辨。

| 判据 | 阈值 | 判级 |
|---|---|---|
| 层级倒挂 | `dist[i] ≥ dist[i-1]`（后一级反而离底更远/相等） | **FAIL**（真错，退出码 1） |
| 层级太近 | 相邻 `|ΔL|` 差 < `TIER_MIN_STEP` = 0.05 | WARN |

> 倒挂是真错：若 `secondary` 比 `primary` 离底还远，「次要文字反而比主要文字更扎眼」，层级语义已坏，必须修——故唯独这一项与色域越界并列为 FAIL。

### 3.3 跨方案同语义亮度一致 `parity`（WARN，可标「严重」）

**同一 mode 下**（light / dark 分别聚合），同一语义角色在各 scheme 的 `L` 应落在窄带内——这正是「固定 L、变 H」保证的直接应用：同是「次级文字」，换了品牌色相，**明暗不该变**。

检查角色：`content-primary/secondary/muted`、`surface-1/2`、`page-bg`、`func-win/lost/favorite/bonus/pending`。仅取**不透明**（`a ≥ 1`）的有效色参与，避免半透明令牌污染。

| 判据 | 阈值 | 判级 |
|---|---|---|
| 跨方案 L 极差 ≥ `PARITY_WARN` = 0.06 | 不齐 | WARN |
| 跨方案 L 极差 ≥ `PARITY_FAIL` = 0.14 | 严重不齐 | WARN（metric 标「严重」，仍不阻断） |

> **真实命中**：深色组 `content-secondary` 在 `betbus #d4d4d4`（L 0.870）与 `match #a6a6a6`（L 0.725）之间极差 **0.145**，越过 0.14 → WARN（严重）。同是深色主题的「次级文字」，betbus 偏白、match 偏灰，人眼一眼能看出两套「不一样亮」。这是跨 scheme 一致性问题，单套 WCAG 校验永远发现不了。（该不齐已于 2026-06 收敛至极差 0.092：`betbus/superbet-dark/betano-dark/glass-dark` 的 `content-secondary` 由 `ft-g` 改挂各自 `ft-f` 级，见 §7；上列数值为收敛前，保留作 parity 检查示例。）

### 3.4 品牌色相保持 + 色域 `brand`（色域越界=FAIL，其余 WARN）

两件事：

**(a) 色相一致**：`brand-primary-0..5` 是「同一品牌色变明暗」的环，剔除低彩度步（`C < HUE_MIN_C` = 0.04）后，剩余步的有效色相极差应小。`HUE_WARN` = 10° 触发 WARN；`HUE_FAIL` = 24° 在 metric 标「严重漂移」（仍 WARN）。

**(b) 饱和度顶格 + 色域越界**：抽查 `brand-primary-0`、`func-win/lost/favorite/bonus`。

| 判据 | 阈值 | 判级 |
|---|---|---|
| sRGB 色域越界 | 线性 sRGB 任一通道越界（换算异常） | **FAIL**（退出码 1） |
| 饱和度顶格 | `C / Cmax` > `SAT_UTIL_WARN` = 0.98 | WARN·**信息性** |

`Cmax` 是在该 `(L,h)` 下 sRGB 内可达的最大彩度（gamut 边界 32 次二分搜索）。`C/Cmax` 即饱和度占用率。

> **关于 0.98 这个高阈值**：本项目功能色（win 绿 / lost 红 / favorite 橙 / bonus 金）**按设计就贴着 sRGB 色域边**——实测 `func-win 99% · func-lost 99% · func-favorite 100% · func-bonus 100% · func-pending 94%`。若用低阈值会把每个功能色都报一遍，纯噪声。故阈值取 0.98，只报**几乎零余量**的（贴边色在 alpha 合成 / 色相旋转时易并色、易 banding），且仅作**信息性**提示——`pending`（94%，有余量）正确地不报。真正的硬错是**色域越界 = FAIL**（源是 sRGB hex，越界只可能来自解析 / 换算异常）。

## 4. 判级与退出码

```
色域越界  / 文字层级倒挂          → FAIL  （红，退出码 1）
其余全部感知质量问题（撞色/不等距/
  层级太近/跨方案不齐/色相漂移/
  饱和顶格）                      → WARN  （黄，默认不致命）
合规                              → PASS  （绿）
```

- 本层定位「治理 / 质量」，**默认不阻断 CI**：只有色域越界（真换算错）和文字层级倒挂（真语义错）会 FAIL。
- `--strict` 下 WARN 也触发退出码 1——可在「色板冻结期 / 设计系统验收」时启用，把质量线也变成硬线。
- 与 WCAG 层的分工：**先过 `theme:contrast`（看得清，硬线）→ 再看 `theme:perceptual`（排得齐，质量线）**。

## 5. 解析与建模（与 WCAG 校验同源）

复用 `check-contrast.ts` 的解析逻辑，保证两层看到的是同一像素：

1. **scheme 级联**：解析 `theme.css` 的 `:root[.scheme]` 块；每套有效变量 = `:root`（gtb 基底）∪ 该 scheme 覆盖，模拟浏览器高特异性覆盖。
2. **`var()` 递归展开**：一路解析到色字面量，带环检测与 fallback。
3. **取首色标**：令牌是渐变时取第一个停靠色用于探测（本层不校验渐变令牌本身——渐变均匀度是另一回事）。
4. **mode 来源**：`scheme → light/dark` 从 `scheme-meta.ts` 正则解析，与运行时单一真源同步，不在脚本里另写一份。

## 6. 运行方式

```bash
pnpm theme:perceptual               # 仅打印 WARN/FAIL + 汇总（日常用）
pnpm theme:perceptual --all         # 连 PASS 一起打印（审查全量）
pnpm theme:perceptual --scheme=match  # 只看一套（跨方案 parity 此时跳过）
pnpm theme:perceptual --strict      # WARN 也算失败（退出码 1，验收用）
pnpm theme:perceptual --json        # 机器可读，喂给其他工具
pnpm theme:perceptual --selftest    # 仅跑 OKLCH 换算自检（CI 守换算正确性）
```

## 7. 当前基线 + 已知命中（2026-06）

**基线（2026-06 复核 + 收敛后）**：无色域越界、无文字层级倒挂 → **FAIL = 0**；**WARN = 73 / 15 套 scheme**。本轮已把每条 WARN 归入「✅ 已修复」或「经逐条复核 · 按设计接受」两类，**无遗留未决缺陷**。下表为按类别的处置基线（均由标准化 OKLCH 换算 + 评估器逻辑离线复核）：

| 类别 | 数量 | 检查 | 处置 |
|---|---|---|---|
| 文字层级倒挂 / 色域越界 | 0 | tier/brand | 基线无（仅此两项为 FAIL 级真错，零命中） |
| `gtb` 灰阶·墨 `ft-e`/`ft-f` 撞色 | — | ramp | ✅ 已修复：`ft-f` `#606e86→#526077`，该组恢复单调（ΔL 0.0023→≈0.047） |
| 浅色 `func-bonus` 跨方案不齐 | — | parity | ✅ 已修复：`glass-light` `#d946ef→#f195ff`，与 `glass-dark` 对齐（极差 0.200→0.090） |
| 深色 `content-secondary` 跨方案不齐 | 1 | parity | ✅ 已收敛：`betbus/superbet-dark/betano-dark/glass-dark` 由 `ft-g`(near-primary) 改挂各自 `ft-f`(secondary) 级，极差 **0.168→0.092**（严重→普通），WCAG 保持 9.6–11.3:1 |
| 功能色饱和度顶格 `C/Cmax≈100%` | 43 | brand | 按设计接受 · 信息性：win/lost/favorite/bonus 本就贴 sRGB 边，降饱和 = 改品牌色 |
| 色阶步距 偏小/不均/非单调 | 20 | ramp | 按设计接受：逐条核对无可用性缺陷——多为近黑/近白锚点处的台阶压缩；2 条非单调（`match-light`/`glass-light`）是浅色「微染头部 chrome 比纯白卡片略暗」习语；文字墨阶 `E→H` 全部单调、仅步长不匀 |
| 跨方案 parity（品牌签名色） | 8 | parity | 按设计接受：`func-win` 绿 / `func-lost` 红 / `content-primary` 墨 等各品牌本色不同，属品牌识别，不强制收敛 |
| `glass-dark` 品牌色相漂移 11.2° | 1 | brand | 按设计接受：`brand-primary-0` violet → `-3` purple，与该主题 紫→粉 渐变美学一致 |

> **判定原则（本轮固化）**：撞色 / 层级倒挂 / 同语义**中性**色（次级灰）不齐 = 真缺陷，修；饱和顶格 / 品牌**签名**色跨品牌差异 / 刻意的多色相渐变 = 品牌识别与物理约束，按设计接受、由治理层持续暴露供人复核，**不为压数字而改品牌色**。

> ⚠️ **沙箱内未跑真源全量校验器**：当前挂载层对大文件（`theme.css` / 脚本本身）存在 partial-read 截断（见 `CLAUDE.md`「Sandbox 文件系统」一节），在沙箱里 `node` 读到的源是截断的，全量 `pnpm theme:perceptual` 结果不可信。**上表数值是用真实令牌十六进制值、以独立、与脚本逐行一致的 OKLCH 换算离线复核的**（6 锚点自检全过、四项评估器在真实/构造样本上行为正确）。**请在本地 `pnpm theme:perceptual` 复跑一次确认 ground-truth 基线**——与 `contrast-checking.md` §6 同样的沙箱限制与复跑约定。

## 8. 用 OKLCH 设计未来色阶（authoring 指南）

新增 / 调整色板时，按感知轴思考，能让上面四项检查天然通过：

- **色阶先定 ΔL 步长**：要 N 阶表面 / 灰阶，先在 OKLCH 里取等距的 `L`（如每阶 ΔL ≈ 0.05–0.08），再各自配 `C/h`。等距的是**感知台阶**，不是 hex 数值。
- **跨品牌同角色对齐 L**：同一语义角色（如深色 `content-secondary`）在各 scheme 应取**相近的 L**，只让 `h`（品牌色相）变。这就是「固定 L、变 H」——parity 检查直接守这条。
- **文字层级按 |ΔL| 单调下楼**：`primary/secondary/muted` 相对 `page-bg` 的 `|ΔL|` 等比递减，步长 ≥ 0.05，别让某一级越过相邻级。
- **功能色先定 L 再绕 H**：win/lost/bonus 等若要「一样醒目」，应取相近 `L` 再各绕到绿/红/金的 `h`；同时留意别贴满 `Cmax`（留 ≥ 2% 余量给 alpha 合成）。
- **改完先自检再判级**：动了换算相关代码先 `--selftest`；动了色值跑 `theme:perceptual` 看 WARN 增减，再跑 `theme:contrast` 确认没破可读性硬线。

## 9. 维护

- **加一组色阶**：在 `scripts/check-perceptual.ts` 的 `RAMPS` 加一行（`group/tokens/note`）。
- **加一个跨方案校验角色**：在 `PARITY_ROLES` 加一行。
- **加一套 scheme**：`theme.css` 新增 `:root.<scheme>` 块、`scheme-meta.ts` 注册 mode 后，脚本自动纳入，无需改契约。
- **调阈值**：改脚本顶部 `T` 对象（集中可调）。调动请同步本文 §3 表格。
- 本文 §7 基线随 `theme.css` 变动会过时，**以 `pnpm theme:perceptual` 实时输出为准**；大改色后请重跑并更新本节。
