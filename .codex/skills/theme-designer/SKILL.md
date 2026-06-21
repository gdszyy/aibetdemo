---
name: theme-designer
description: Design and configure visual themes for the gotobet sportsbook project. Use when Codex is asked to create a new theme, adjust color schemes, plan theme tokens, define PC/mobile visual standards, review readability and page focus, add a new next-themes scheme, or clean hardcoded reusable UI colors into semantic tokens.
---

# Theme Designer

Use this skill to design, configure, or review gotobet themes without turning the product into a one-off repaint.

## Workflow

1. Read `references/theme-design-guide.md` before making design or implementation decisions.
2. Inspect the current theme entry points:
   - `src/components/theme-provider/theme-provider.tsx`
   - `src/assets/css/theme.css`
   - `src/assets/css/tokens.css`
   - `docs/theme-style-cleanup-plan.md`
3. Determine the theme scope: sportsbook core, account shell, casino, marketing, or full site.
4. Configure semantic tokens first. Edit component classes only when a reusable component still uses hardcoded color, shadow, or surface values.
5. Preserve intentional campaign artwork, VIP visuals, sport icon colors, ticket glass effects, and third-party imagery unless the user explicitly asks for those areas to follow the theme.
6. Verify with TypeScript, targeted lint/format checks, and a production build when code changes are made.
7. Report the theme name, design direction, changed tokens/files, screens checked, exceptions, verification results, and remaining design risks.

## Implementation Rules

- Add new scheme names to `SCHEMES` in `src/components/theme-provider/theme-provider.tsx`.
- Add the matching `:root.<scheme-name>` block in `src/assets/css/theme.css`.
- Prefer semantic classes such as `bg-page-bg`, `bg-surface-1`, `bg-surface-shell`, `text-content-primary`, `border-border-subtle`, `shadow-card`, and `shadow-floating`.
- Avoid adding new `bg-[#...]`, `text-[#...]`, or raw `rgba(...)` in reusable product UI.
- Keep betting actions, odds, selected states, stake inputs, and validation messages visually clearer than shell/background decoration.

## Validation Commands

Use the project-local command style where available:

```powershell
node_modules\.bin\tsc.CMD --noEmit
node_modules\.bin\biome.CMD check <changed-files>
node_modules\.bin\next.CMD build --webpack
```

If Markdown docs are ignored by Biome, mention that as a project configuration behavior rather than a validation failure.
