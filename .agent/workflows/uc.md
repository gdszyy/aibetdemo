---
description: 更新上下文
---

0. 审查所有项目代码（尤其是最近的提交）
1. 审查时，按照 .agent/workflows/cr.md 提出建设性建议，更新计划（.agent/plans）。发现自定义实现时，搜索更成熟/标准的方案（见 `general-rules.md` §2 "网络搜索"）。
2. 必要时更新规则：
   - [general-rules.md](@.agent/rules/general-rules.md) — 技术栈、目录结构、编码规范
   - [frontend.md](@.agent/rules/frontend.md) — 架构、令牌、机制
   - [cr.md](@.agent/workflows/cr.md) — CR 模式、反模式
3. **验证环节**：所有更新写入后，重新阅读每个修改的 `.agent/` 文件并验证：
   1. 无过时引用 — 提到的文件路径、函数名、store 名在 `src/` 中仍然存在（grep 确认）
   2. 无矛盾 — 新内容不与同文件或其他规则文件的其他章节冲突
   3. 计划状态准确 — 标记 ✅ 的项在代码中确实完成，标记 ❌ 的项未被偷偷完成

- 更新文档的主要目的是更新项目上下文，例如架构更新、重大功能更新或规范更新，都可以同步到文档。
- 可使用 CLI 工具审查项目代码，不要总是打开浏览器查看网页。
- 不要移除文件的 trigger、description 部分。
- 不要将 workflow 内容放入 rules。
