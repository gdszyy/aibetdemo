# Figma → 代码

## 原则
实现 Figma 设计时，区分**设计令牌**和**布局尺寸**：
- **采用**：间距（gap、padding）、颜色、阴影、字体令牌、圆角 — 这些是通用的设计决策。
- **不要硬编码**：Figma 中的固定宽度/高度（如 `w-[920px]`、`w-[220px]`）。Figma 使用固定画板，但我们的布局是**响应式**的（`flex-1`、`grid`、容器查询）。只在设计令牌（如侧边栏 200/60px）或 min/max 约束时采用宽度。
- **经验法则**：Figma 的像素值用于*间距/颜色/阴影/字体* = 采用。Figma 的像素值用于*容器宽度/高度* = 转化为响应式等价物。

## 像素精确对齐清单

对齐组件到 Figma 时，验证**每一个**属性 — 不仅仅是布局。容易遗漏的常见不匹配：

| 属性 | 检查要点 |
|------|----------|
| **颜色继承** | `currentColor` 图标从最近的设置了 `color` 的祖先继承。如果颜色在 `<span>` 上但图标是兄弟元素，图标不会继承。将颜色移到共享父元素（如 `<button>`）。|
| **各状态图标尺寸** | Figma 常为不同状态指定不同图标尺寸（如 hover 20px → 22px）。使用 `group-hover:size-[22px]` + transition。|
| **各状态图标颜色** | 默认：通过 `currentColor` 单色。激活：多色 `ActiveIcon`（忽略 `currentColor`）。将颜色类设在父元素上使图标和文字都正确继承。|
| **阴影** | Figma 可能无阴影而代码有，反之亦然。检查每个变体。|
| **圆角** | 匹配精确令牌：`rounded-xs`(4px)、`rounded-sm`(8px)、`rounded-md`(16px)、`rounded-lg`(20px)、`rounded-full`(999px)。|
| **字重/令牌** | 使用项目文字令牌（`text-body-lg`、`text-auxiliary-sm`），禁止裸写 `text-[14px] font-bold`。|
| **SVG 描边粗细** | Figma 可能使用填充形状；我们的 SVG 使用描边。比较渲染尺寸下的视觉粗细。标准箭头图标使用 `strokeWidth={1.5}`。|
| **容器尺寸** | 按钮/图标包装器：验证精确像素尺寸（如 32px vs 36px）。使用 Tailwind `size-*` 令牌。|

**流程**：打开 Figma dev mode → 检查每个变体（默认、hover、active、disabled）→ 逐一比对代码中每个 CSS 属性。不要假设"差不多就行" — 用户期望精确匹配。

## 图标组件工作流
> 完整约定（命名表、状态变体、SVGR 注意事项）：`.agent/references/icon-conventions.md`

**快速步骤**：用户从 Figma 客户端导出 SVG → 放入 `src/assets/icons2/` → agent 重命名（模块前缀 + kebab-case），清理工件，运行 `pnpm icon2:build`，更新导入到 `@/components/icons2/...`。

> **避免** Figma MCP `get_design_context` 导出图标 — 它会将布尔形状拆分为多个独立层。仅用 MCP 获取设计上下文/截图。

## MCP 工作流技巧

### 隐藏图层
- **始终忽略** Figma 中的隐藏（不可见）图层。MCP 服务器可能会暴露它们，导致实现设计师隐藏的占位/WIP 元素。生成代码前清理或跳过隐藏图层。

### 推荐工具顺序
为获得最大保真度，按此顺序：
1. `get_metadata` — 布局层级和帧结构（大文件优先使用）
2. `get_screenshot` — 验证的视觉基准（始终截取）
3. `get_variable_defs` — 应用到选区的设计令牌（颜色、间距、字体）
4. `get_design_context` — 详细布局、字体、颜色、组件结构（针对特定节点，非整页）

### 深度检查工作流
当 Figma 帧包含可复用子组件时（通过实例 ID 标识如 `I8217:171969;5789:168689`）：
1. **先对父帧 `get_metadata`** — 从层级中识别子组件实例节点 ID
2. **对每个不同子组件**，用其节点 ID 调用 `get_design_context` 获取精确样式（不要依赖父级输出获取子级细节）
3. **比较子组件变体**（default/hover/active/disabled）— Figma 组件通常有属性变体（`property1: "Default" | "chosen"`）映射到交互状态
4. **检查叶子级别**：父级样式（padding、gap）不能告诉你子级的字体、颜色或圆角。始终深入最深的组件验证令牌。
5. **与项目组件交叉引用**：从 Figma 输出构建新组件前，检查 `src/components/` 是否已有匹配的原语（Button、Select、Tooltip、Modal 等）。将 Figma 组件映射到项目等价物。

### 关键实践
- **大屏幕分块处理**：针对特定帧/组件而非整页，避免 token 溢出
- **显式使用 `get_variable_defs`**：当输出显示原始 CSS 值而非令牌引用时
- **始终对照截图验证**：将最终 UI 与 Figma 截图比较 — 检查布局、字体、颜色、间距、圆角、交互状态
- **检查所有变体**：在 Figma dev mode 中检查 default、hover、active、disabled 状态 — 不要假设"差不多"
- **Code Connect**（未来）：将 Figma 组件映射到仓库组件，自动生成代码片段。最具影响力的集成，消除猜测
- **`create_design_system_rules`**：可自动生成将项目令牌映射到 Figma 变量的规则文件

## 图片资源工作流（PNG/JPG）
从 Figma 导出光栅图片（照片、插图、背景、徽章）时：
1. **高分辨率导出**：最低 **2x**，推荐 **4x**。视网膜/HiDPI 屏幕渲染 1x 资源会模糊。始终导出最高质量
2. **格式**：PNG 用于透明或锐边图片；JPG/WebP 用于照片。浏览器支持充分时优先 WebP
3. **命名**：`src/assets/images/{kebab-case-name}.png` 或模块内 `_images/` — 名称描述用途（如 `promo-deposit-mobile.png`，而非 `image-1.png`）
4. **优化**：提交前压缩 — 使用 TinyPNG、`sharp` 或 `squoosh`。目标：单个资源 < 1MB（4x banner/hero 图片可能超出）
5. **使用**：使用 Next.js `<Image>` 组件并显式设置 `width`/`height`。除非必要（如动画 GIF、外部 CDN），避免 `unoptimized`
6. **Figma 导出步骤**：选择图层 → Export 面板 → 设置缩放 **4x** → 格式 PNG/JPG → 下载
> 禁止提交 1x 导出 — 在所有现代设备上都会显得模糊。
