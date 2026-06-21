@AGENTS.md

# Claude-Specific Instructions

## Context Loading Strategy

**Always load** (every conversation):
1. `.agent/rules/general-rules.md` — Code of conduct, tech stack, code standards
2. `.agent/rules/frontend.md` — Frontend architecture, core mechanisms

**On-demand** (load only when task is relevant):
- `.agent/plans/` — Implementation plans. List filenames, load the one relevant to current task.
- `.agent/references/` — Icon conventions, Figma workflows, Sportradar UOF, CR anti-patterns, etc.

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
