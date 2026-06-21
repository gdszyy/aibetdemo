# 最优方案研究方法论

面对性能问题或选择实现方案时，**不要搜索"如何做 X" — 搜索"平台如何执行 X"**，找到约束边界，然后在其中设计。

1. **首先理解平台的执行模型**
   - 不要搜索 "border beam animation" → 搜索 "offset-distance compositor thread"
   - 不要搜索 "React fast list" → 搜索 "React reconciliation model"
   - 不要搜索 "SQL optimization" → 搜索 "query planner execution path"
   - 目标：理解瓶颈在**哪里**，而非如何绕过症状。

2. **找到约束，而非方案**
   - 约束能极大缩小方案空间。示例：Chrome 仅 GPU 合成 `transform/opacity/filter/backdrop-filter` → 立即排除 90% 的动画方案。
   - 搜索模式：`"<property/API> <platform> execution model"`、`"<property> compositor thread"`，查阅官方平台文档（Chrome DevBlog、React 文档、DB 引擎文档）。

3. **分解为独立层**
   - 将复杂效果拆分为可独立优化的关注点。
   - 示例：border beam = **动画层**（conic-gradient + `transform: rotate`，S 级 GPU）+ **静态遮罩层**（CSS mask，零逐帧开销）。
   - 每层使用其特定关注点的最优机制。

4. **按机制评估，而非按流行度**
   - 热门库 ≠ 最优机制。Magic UI v4 使用 `@property`（C 级每帧重绘）；我们的 `transform` 方案是 S 级 — 相同视觉效果，规模化时性能好 10 倍。
   - 始终问："浏览器/运行时执行这段代码时**实际做了什么**？" 而非 "社区推荐什么？"
   - 在选择前，对比 3+ 种方案与平台执行模型的匹配度。
