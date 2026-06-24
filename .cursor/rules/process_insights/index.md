# Process Insights Index

This directory stores workflow notes discovered during implementation, debugging, and cross-module changes. Use it for non-obvious coupling, recurring pitfalls, and procedures that future agents should check before editing related code.

## Active Insights

No active process insights have been recorded yet.

| ID | Title | Version | Related modules | Last updated | Document |
|----|-------|---------|-----------------|--------------|----------|
| - | - | - | - | - | - |

## Deprecated Insights

No deprecated process insights have been recorded yet.

| ID | Title | Deprecated version | Reason | Deprecated date |
|----|-------|--------------------|--------|-----------------|
| - | - | - | - | - |

## Maintenance Rules

- Create new insight files as `PI-001_short-slug.md`, incrementing the numeric ID.
- Add or update this index whenever an insight is created, revised, or deprecated.
- Keep insights focused on workflow behavior and hidden coupling; stable architecture belongs in `AGENTS.md`, `.cursor/rules/general-rules.mdc`, or `.cursor/rules/frontend.mdc`.
- Keep design documents separate from code. Do not place plans, audits, ADRs, or workflow notes inside implementation directories such as `src/`.
