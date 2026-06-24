@AGENTS.md

# Claude-Specific Instructions

## Context Loading Strategy

**Always load** (every conversation):
1. `.agent/rules/general-rules.md` — Code of conduct, tech stack, code standards
2. `.agent/rules/frontend.md` — Frontend architecture, core mechanisms

**On-demand** (load only when task is relevant):
- `.agent/plans/` — Implementation plans. List filenames, load the one relevant to current task.
- `.agent/references/` — Icon conventions, Figma workflows, Sportradar UOF, CR anti-patterns, etc.

## Sandbox 文件系统：双视图 + 短读截断（必读）

本沙箱有两套**不一致**的文件系统视图：文件工具（Read/Write/Edit）直连宿主 Windows NTFS（权威、可靠）；Bash 在独立 Linux 沙箱里经一层虚拟挂载访问同一目录，对**大文件 / 多字节文件**会发生 partial read（短读），导致 `cp` / `cat` / `zip` 等不重试到 EOF 的工具拿到**截断或字节损坏**的数据（有时字节大小还与源相同）。Edit 不背锅——它写到 NTFS 是完整的，是挂载层"读漏"或缓存到旧版。

操作规则：

- **写**：直接写（文件工具 Write/Edit、heredoc、`python open().write()`）；不要用 `cp` 搬大文件。
- **读 / 校验真值**：以**文件工具 Read** 为准；Bash 读到的异常优先怀疑挂载层，而非内容本身。
- **必须复制时**：用"读 + 写 + 再读断言相等"的带校验复制，短读则重试；不要裸 `cp`。
- **校验**：结构解析（`json.load` / `compile`）+ 尾部行比对 + 行数比对；**不能只看字节大小**（大小相同也可能坏）。
- **跑 Bash 校验脚本（如 `theme:contrast`）结果异常时**，先怀疑挂载截断：用文件工具 Read 确认真实文件；必要时用「挂载已同步部分 + 文件工具读到的尾部」拼出完整文件再校验。

完整根因分析：`.agent/references/sandbox-fs-truncation.md`。

## Slash Commands

Project workflows are configured as native Claude Code commands, implemented via symlinks from .claude/commands folder to .agent/workflows:

| Command | Description |
|------|------|
| `/init` | Initialize project context |
| `/a` | Analyze implementation plan |
| `/cr` | Code Review |
| `/uc` | Review project, update context |

## Agent skills

### Issue tracker

Issues and PRDs for this repo live as GitHub issues. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context layout with one root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.
