# Theme and Style Cleanup Plan

## Goal

Build theme switching around semantic design tokens instead of page-level hardcoded colors. The first target is color theme switching, then spacing, radius, card shape, and the overall product style.

New theme design and agent handoff rules live in `docs/agents/theme-design.md`.
Theme reference links, local reference files, and drift checks live in `docs/theme-reference-index.md`.

## Current State

- Theme runtime already exists through `next-themes`.
- Available schemes are `gtb`, `betbus`, `match`, `match-light`, `superbet-light`, `superbet-dark`, `betano-light`, and `betano-dark` in `src/components/theme-provider/theme-provider.tsx`.
- CSS enters through `src/assets/css/tailwind.css`, which imports `theme.css`, Tailwind, `tokens.css`, `base.css`, and animations.
- Raw palette tokens already exist, for example `brand-primary-*`, `filltext-ft-*`, `func-*`, and `surface-*`.
- Many core screens still use hardcoded values such as `#010101`, `#252525`, `#f0c289`, `#242424`, and custom gradients.

## Token Layers

Use three layers and keep them separate:

1. Raw palette tokens: brand, functional, fill/text, neutral, auxiliary.
2. Semantic theme tokens: `page-bg`, `surface-*`, `border-*`, `content-*`, `on-brand`, `accent-warm`.
3. Style shape tokens: `style-radius-*`, `style-card-*`, `style-floating-shadow`.

Components should prefer layer 2 and layer 3. Layer 1 remains for legacy compatibility and highly specific product colors.

## Initial Theme Contract

- Page background: `bg-page-bg`
- Card/panel background: `bg-surface-1`
- Input/hover/nested background: `bg-surface-2`, `bg-surface-3`
- App shell background: `bg-surface-shell`
- Selected/detail background: `bg-surface-selected`
- Floating layer: `bg-surface-raised shadow-floating`
- Muted block: `bg-surface-muted`
- Borders: `border-border-subtle`, `border-border-strong`
- Text: `text-content-primary`, `text-content-secondary`, `text-content-muted`, `text-content-inverse`
- Brand blocks: `bg-brand-primary-0 text-on-brand`
- Warm highlight: `text-accent-warm`, `bg-accent-warm`
- Status hints: `bg-status-success-surface`, `text-status-success-text`, `bg-status-danger-surface`, `text-status-danger-text`, `bg-status-info-surface`

## Shape Contract

- Controls: `rounded-control`
- Cards: `rounded-card`
- Panels and modals: `rounded-panel`
- Shared account cards: `.account-card`
- Card padding and shadow should come from `--style-card-padding` and `--style-card-shadow`.

## Migration Order

1. Keep the current schemes working and add semantic aliases without changing visuals.
2. Replace hardcoded core shell colors first: navigation, sidebars, bet slip shell, match detail shell.
3. Replace account center and common components: forms, select, tooltip, drawer, modal, empty states.
4. Leave campaign pages and sport icons for last because many of their colors are artwork or event branding.
5. Add a small theme preview route or Storybook-like page to compare tokens across schemes.

## Guardrails

- Do not use new hardcoded hex values in reusable components.
- Event campaign pages may keep artwork-specific colors, but reusable controls inside them should use tokens.
- New components should use semantic tokens by default.
- Raw `filltext-*` classes are allowed while migrating, but new shared components should use `content-*`, `surface-*`, and `border-*`.
- Visual changes should be verified in the target scheme and `betbus` at minimum. Shared brand skin changes should also verify every scheme using that skin, especially `gtb`/`superbet-*` and `match*`/`betbus`.
