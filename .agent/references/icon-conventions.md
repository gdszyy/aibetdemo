# 图标约定

## 目录结构
扁平目录 `src/assets/icons2/` + 模块前缀。不使用子目录做语义分类（业界共识：Lucide 1700+、Radix、Phosphor 均使用扁平结构）。

## 模块前缀命名

| 前缀 | 模块 | 示例 |
|------|------|------|
| `sport-` | 体育 | `sport-basketball.svg`、`sport-match-live.svg` |
| `casino-` | 赌场 | `casino-baccarat.svg`、`casino-slots-active.svg` |
| `uc-` | 用户中心 | `uc-deposit.svg`、`uc-kyc-active.svg` |
| `market-` | 投注 | `market-handicap.svg` |
| `nav-` | 导航 | `nav-live.svg` |
| `promo-` | 促销 | `promo-clock.svg` |
| （无） | 通用 | `arrow-left.svg`、`close.svg`、`success.svg` |

## 状态变体
- 仅对**结构不同**的 SVG 使用 `-active` 后缀（如轮廓 → 实心）。
- 仅颜色变化的状态使用 CSS `currentColor` + Tailwind 类（`hover:text-*`、`data-[active]:text-*`），不创建单独文件。
- 禁止使用 `-hover` 作为文件名后缀 — hover 是 CSS 状态，不是图标变体。

## SVGR 管线注意事项
- `pnpm icon2:build` 读取 `src/assets/icons2/`，在 `src/components/icons2/` 中生成支持传色的 React 组件。
- 生成后按文件导入，例如 `import { UserOutlined } from '@/components/icons2/UserOutlined'`。
- 重命名/删除 SVG 后，检查并清理旧的生成组件，再重新构建。
- 单色图标使用 `className` 控色；多色图标通过 `colors` 传入完整颜色数组。

## Figma 导出工作流
- **优先**使用 Figma 客户端直接导出 SVG，而非 Figma MCP `get_design_context`（MCP 会将布尔形状拆分为多个独立层，生成不完整的图标）。
- 流程：用户从 Figma 导出 SVG → 放入 `src/assets/icons2/` → agent 重命名（模块前缀 + kebab-case），清理工件，运行 `pnpm icon2:build`，更新导入。
- 不要创建 `_assets/` 或子目录 — 所有图标通过扁平的中央管线处理。
