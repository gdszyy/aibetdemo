# 样��与令牌改进

> Tailwind 令牌规范、CSS 兼容性、视觉一致性 | 更新 2026-04-20 | **维护规则**：已���成项直接删除。

## 概览

| # | 事项 | P | 状�� |
|---|------|---|------|
| 54 | `card.tsx:184` score 列 `w-5` 可能截断 3 位数比分 | P2 | ❌ |
| 91 | 全站 `border-[0.5px]` → 跨浏览器 hairline（12 文件 19 处, 2026-04-15 审计） | P1 | ❌ |

## #91 Hairline 方案

> Chrome 执行 border snapping (0.5px → 1px on 1x)。W3C `border-width: hairline` 已入 Draft 但无浏览器实装。

**混合策略**:
| 场景 | 方案 |
|------|------|
| 单边 (border-b/r/l/t) | `@utility hairline-b/t/l/r` — `::before` + `scaleY(0.5)` / `scaleX(0.5)` |
| 全围 (无已有 shadow) | `shadow-[inset_0_0_0_0.5px_var(--color)]` |
| ��围 + 已有 shadow | `@utility hairline-box` — `::before` 200% + `scale(0.5)` |

**注意**: `::before` 需宿主有定位上下文; `border-color: inherit` 传颜色; tailwind-merge 需注册自定义 group

**执行顺序**: 定义 `@utility` → 注册 tailwind-merge → 单边迁移 → 全围迁移 → 更新 CR 规则 → 视觉回归 (Chrome + Safari + Firefox)
