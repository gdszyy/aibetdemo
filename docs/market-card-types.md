# 比赛详情市场卡片类型

## 概述

比赛详情页中每个 `MarketGroup` 渲染为一个 `BetItem` 折叠面板。展开后的内容区有 4 种布局，**完全由后端字段驱动**：

- `market.card_type` — 选择布局（1 | 2 | 3 | 4）
- `market.col` — 可选列头（Type 2 / Type 4 使用）
- `line.row` — 可选行头（Type 2 使用）
- `outcome.sorted` — 同一 line 内的展示排序

派发逻辑位于 `src/modules/match/_components/bet-item.tsx`：

```ts
const CONTENT_BY_CARD_TYPE: Record<MarketCardType, FC<ContentProps>> = {
    [MarketCardType.Type1]: Type1Content,
    [MarketCardType.Type2]: Type2Content,
    [MarketCardType.Type3]: Type3Content,
    [MarketCardType.CorrectScore]: CorrectScoreContent,
};

const Content = CONTENT_BY_CARD_TYPE[market.card_type as MarketCardType] ?? Type1Content;
```

`card_type` 缺失或不识别时兜底为 Type 1。

## 后端字段消费矩阵

| 字段              | Type 1 | Type 2 | Type 3 | Type 4 (CorrectScore) |
| ----------------- | :----: | :----: | :----: | :-------------------: |
| `card_type`       |   ✓    |   ✓    |   ✓    |          ✓            |
| `market.col`      |   —    |   ✓    |   —    |     ✓（必须 3 个）    |
| `line.row`        |   —    |   ✓    |   —    |          —            |
| `outcome.sorted`  |   —    |   ✓    |   —    |    ✓（每列独立）      |
| `outcome.name`    | 直接显示 | 直接显示 / fallback 列头 | 直接显示 | 解析为比分用于分桶 |

Outcome 排序统一走 `compareOutcomesByDisplayOrder`（位于 `src/api/models/market.ts`）：双方都提供 `sorted` 时按 `sorted` 升序，否则退化为 `id` 数值序。

## Type 1 — 默认网格

**适用场景**：1X2、Over/Under、Yes/No 等"一行 N 个等宽按钮"的简单市场。

**布局规则**：

- 每条 `line` 一个独立的 CSS Grid。
- 列数为 `clamp(line.outcomes.length, 2, 5)`。
- 按钮以 `layout="vertical"` 渲染（name 在上、odds 在下）。
- 不消费 `market.col` 和 `line.row`。

```text
[ Home  1.85 ]  [ Draw  3.40 ]  [ Away  4.20 ]
```

## Type 2 — 表格布局

**适用场景**：让分盘 / 大小球等多 line × 多 outcome 的二维表格，需要列头（outcome 维度）+ 行头（line 维度）。

**布局规则**：

- Grid 模板：`minmax(min-content, 6rem) repeat(N, minmax(0, 1fr))`，第一列固定为行头。
- **列头**：优先使用 `market.col`；缺失时取 `sortByDisplayOrder(visibleLines[0].outcomes).map(o => o.name)` 作 fallback。
- **行头**：`getRowLabel(line)` 按以下优先级解析：
  1. `line.row`（trim 后非空）
  2. `line.specifiers`（原始字符串）
  3. `extractSpecifierNum(line.specifiers)` 兜底。
- 单条 line 内 outcomes 通过 `compareOutcomesByDisplayOrder` 排序，以保证单元格落在对应列头下。
- 按钮以 `layout="auto"` + `showName={false}` 渲染 —— 列头已经标注了含义，按钮只显示 odds。
- outcome 数 < 列数时用空 `<div />` 占位，保持网格对齐。

```text
            Home    Draw    Away
  -1.5      1.85    3.40    4.20
   0        1.95    3.30    3.95
  +1.5      2.05    3.20    3.70
```

## Type 3 — 自适应宽度网格

**适用场景**：outcome 数量不定且 name 长短差异较大的市场（如球员 prop bets），Type 1 的固定列数策略容易产生留白或拥挤。

**布局规则**：

- 视觉形状与 Type 1 一致（vertical 按钮 + Grid），但列数由**容器实际宽度 + 最长 name 像素宽度**动态决定。
- `measureTextWidth` 通过模块级 `<canvas>` 测量像素宽度（canvas 跨渲染缓存）。
- `resolveType3Cols` 从 4 列向下回退，挑选满足以下条件的最大列数：
  1. 总宽度（含 gap）能塞进容器，且
  2. 末行不会留下单个孤儿（`outcomes.length % cols === 1` 且 `cols > 1` 时跳过）。
- `ResizeObserver` 监听容器尺寸变化重新计算列数。
- 没有列数能塞下时回退为 1 列。

```text
[ Player A 1.85 ] [ Player B 2.10 ] [ Player C 2.40 ]
[ Player D 3.10 ] [ Player E 4.50 ]
```

## Type 4 — CorrectScore 精确比分

**适用场景**：`outcome.name` 形如 `"1:0"` / `"2-1"` 的精确比分市场。outcomes 按比分大小分到三列。

**布局规则**：

- 固定 3 列。**列头完全由后端 `market.col` 提供**（含多语言文案），前端不做兜底；`market.col` 必须按 `[home, draw, away]` 顺序下发 3 项。
- `groupByCorrectScoreColumn` 先用 `compareOutcomesByDisplayOrder` 排序，再用 `resolveCorrectScoreColumn(outcome.name)` 分桶为 3 个列索引：
  - `home > away` → 列 0（home）
  - `home === away` → 列 1（draw）
  - `home < away` → 列 2（away）
  - 不匹配 `^\d+[:-]\d+$` 的 name 直接丢弃。
- 列索引与 `market.col` 下标一一对应，因此后端列头顺序错了内容也会跟着错。
- 行数 = 三列中最长一列的长度，短列用空 `<div />` 占位。
- 按钮以 `layout="auto"` 渲染（按钮内部根据比分 label 是否溢出自行决定横排还是竖排）。

```text
   Home Win        Draw        Away Win
 [ 1:0  4.50 ]  [ 0:0  9.00 ]  [ 0:1  6.50 ]
 [ 2:0  9.00 ]  [ 1:1  5.50 ]  [ 0:2 13.00 ]
 [ 2:1  9.50 ]  [ 2:2 17.00 ]  [ 1:2 11.00 ]
 [ 3:0 21.00 ]                 [ 0:3 26.00 ]
```

## 后端契约说明

- 前端**完全信任 `card_type`**，不做"CorrectScore 解析失败回退到 Type 3"之类的二次校正 —— 无效 name 直接被分桶逻辑丢弃。
- `card_type` 缺失或未知时回退到 Type 1，不报错。
- `market.col` 在 Type 2 / Type 4 中**必须**下发：
  - Type 2：长度 = outcomes 数量，作为列头。
  - Type 4：必须 3 项，按 `[home, draw, away]` 顺序（含多语言文案），前端不做兜底。
  - Type 1 / Type 3 忽略。
- `line.row` 在 Type 2 中作为行头（缺省退化为 specifiers）；其它 Type 忽略。
- `outcome.sorted` 通过 `compareOutcomesByDisplayOrder` 在 Type 2 / Type 4 中生效。Type 1 / Type 3 维持后端 payload 中的原始顺序。

## 相关文件

- `src/modules/match/_components/bet-item.tsx` — 派发逻辑 + 4 个布局子组件
- `src/modules/match/_components/bet-btn-standard-base.tsx` — 支持 `horizontal` / `vertical` / `auto` 三种内部布局的按钮，4 种 card type 共用
- `src/modules/match/_utils/match-utils.ts` — `resolveCorrectScoreColumn`
- `src/api/models/market.ts` — `MarketCardType` 枚举、`MarketGroup` / `MarketLine` / `OutcomeModel`、`compareOutcomesByDisplayOrder`
- `src/utils/odds-change-merge.ts` — WS 侧复用 `compareOutcomesByDisplayOrder`，确保实时更新与首屏渲染顺序一致
