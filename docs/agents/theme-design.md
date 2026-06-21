# Theme Design Agent Guide

This guide is the working contract for any agent designing or configuring a new visual theme for the project.

The goal is not to repaint individual components. A theme must preserve the betting workflow, keep text and odds easy to scan, and express a distinct brand direction through semantic tokens.

## When To Use This Guide

Use this guide when the task mentions:

- new theme, theme design, color scheme, brand skin, visual refresh
- mobile and desktop visual standards
- readability, clean UI, page focus, card style, spacing, radius, shadow
- adding a new scheme to `src/components/theme-provider/theme-provider.tsx`

Related engineering plan: `docs/theme-style-cleanup-plan.md`.

## Required Inputs

Before designing a theme, collect or infer:

- Theme name: the class name used by `next-themes`, for example `neo`, `pro-dark`, or `brand-x`.
- Brand direction: energetic, premium, restrained, casino-like, sportsbook-like, or neutral product UI.
- Base mode: light, dark, or hybrid.
- Primary color family: one main brand hue.
- Accent policy: whether bonus/gold, success/green, and danger/red should remain distinct from the brand hue.
- Scope: core sportsbook only, account pages, casino, marketing pages, or full site.

If inputs are missing, make conservative assumptions and document them in the final summary.

## Design Principles

### Betting First

The visual center must stay on:

- match information
- odds buttons
- selected bets
- stake input
- submit/place bet action
- win/loss and validation states

Navigation, backgrounds, gradients, and decorative color must not compete with those areas.

### Token First

Configure the theme through semantic tokens first. Avoid editing component classes unless a component still uses hardcoded values or the semantic token model cannot express the state.

Preferred token layers:

- raw palette: `brand-primary-*`, `filltext-ft-*`, `neutral-*`, `func-*`
- semantic theme: `page-bg`, `surface-*`, `border-*`, `content-*`, `on-brand`, `accent-warm`
- shape and elevation: `style-radius-*`, `style-card-*`, `style-floating-shadow`

Preferred Tailwind classes in components:

- background: `bg-page-bg`, `bg-surface-1`, `bg-surface-2`, `bg-surface-shell`, `bg-surface-raised`, `bg-surface-muted`
- text: `text-content-primary`, `text-content-secondary`, `text-content-muted`, `text-on-brand`
- border: `border-border-subtle`, `border-border-strong`
- elevation: `shadow-card`, `shadow-floating`
- radius: `rounded-sm`, `rounded-md`, `rounded-radius-card`, `rounded-radius-panel` where available

Avoid new `bg-[#...]`, `text-[#...]`, and raw `rgba(...)` in reusable product UI.

## Color Standards

### Palette Cleanliness

A theme should have:

- one dominant brand hue
- two to four brand support values for hover, active, subtle surface, and border
- a neutral surface scale with clear page/card/floating layers
- functional colors for success, danger, warning, and info
- one optional warm accent for bonus, boost, or badge moments

Do not let brand color, success color, danger color, and bonus color all appear as large surfaces at the same time.

### Contrast

Core readability rules:

- Primary text must be clearly readable on `page-bg`, `surface-1`, `surface-2`, and `surface-shell`.
- Odds, stake amounts, validation messages, and submit buttons need stronger contrast than normal body text.
- Disabled text can be muted, but it must still be distinguishable from borders and placeholder text.
- Brand buttons must use `on-brand` or another high-contrast foreground.

When in doubt, make betting actions clearer and decorative surfaces quieter.

### Backgrounds

Use at most three product surface depths in normal screens:

- page background
- card/panel background
- floating/drawer background

Gradients are allowed for shell/header or campaign areas, but not as the default background for dense betting lists.

## Shape, Spacing, And Elevation

Default product feel:

- controls: small radius
- cards/list groups: small to medium radius
- bottom sheets/drawers/modals: medium radius
- full-page sections: avoid card-like wrappers

Use shadows only for:

- popovers
- tooltips
- drawers
- bottom sheets
- floating bet slip
- mobile fixed bars

Dense sportsbook screens should rely more on spacing, borders, and surface layers than heavy shadows.

## Desktop Standards

Desktop interaction must optimize scanning and repeated use:

- Hover states should be visible but not jumpy.
- Match rows and odds grids should stay compact.
- The right bet slip should feel like a working panel, not a marketing card.
- Navigation, sidebars, content, and bet slip must have distinguishable but calm layers.
- Popovers and account menus should share `surface-1` or `surface-raised`, `border-subtle`, and `shadow-floating`.
- Sticky or floating elements must not obscure odds or submit actions.

## Mobile Standards

Mobile interaction must optimize thumb flow and bottom actions:

- Main tap targets should be at least 44px high where space allows.
- The mobile bet summary bar must be high-contrast and stable.
- Bottom sheets should use consistent radius, surface, and elevation.
- Stake input, quick stake buttons, and submit action should read as one continuous task area.
- Avoid stacking many borders and shadows in the same viewport.
- Do not use large decorative gradients behind dense betting content.

## Page Focus Checklist

For every theme, inspect these screens:

- home sports list
- match detail
- desktop floating bet slip
- mobile bet summary bar and bottom sheet
- single and parlay stake footers
- account menu/account shell
- deposit and withdraw forms
- transaction list
- empty/error/loading states

The page passes when:

- the first visual focus is on actionable betting content
- odds buttons and selected states are unmistakable
- primary CTA is visually stronger than secondary controls
- text hierarchy is clear without relying only on color
- surfaces feel clean instead of noisy or muddy
- mobile and desktop feel like the same brand

## Implementation Order

1. Add the scheme name to `SCHEMES` in `src/components/theme-provider/theme-provider.tsx`.
2. Add `:root.<scheme-name>` to `src/assets/css/theme.css`.
3. Configure raw palette values first.
4. Configure semantic tokens next.
5. Configure radius, card padding, and shadows last.
6. Use the existing `LayoutExperimentToggle` to switch themes during review.
7. Run type check and production build.
8. Review the required screens on desktop and mobile.

## What Not To Theme Blindly

Do not automatically rewrite:

- campaign artwork
- promotion-specific gradients
- VIP tier illustrations
- ticket glass effects that already use dedicated ticket variables
- sport/team icon colors
- third-party game imagery

Theme reusable controls inside those pages, but preserve intentional artwork unless the task explicitly says the campaign pages should follow the new theme.

## Expected Agent Output

When proposing or implementing a new theme, return:

- Theme name and design direction
- Token changes made or proposed
- Screens checked
- Known exceptions, especially campaign or artwork areas
- Verification commands and results
- Remaining design risks

Short example:

```txt
Theme: pro-dark
Direction: dark sportsbook UI with restrained emerald brand actions.
Scope: core sportsbook + account shell; marketing pages keep artwork colors.
Changed: theme.css scheme block, SCHEMES registration.
Verified: tsc, biome check, next build.
Risk: VIP campaign cards still use fixed gold gradients by design.
```
