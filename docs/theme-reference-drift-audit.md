# Theme Reference Drift Audit

> Scope: compare each scheme against its target reference and record drift.
> Date: 2026-06-21.

## References Checked

- `match` / `match-light`: internal sportsbook reference files for dark/light desktop and mobile.
- `betano-light` / `betano-dark`: official Betano captures currently include modal/cookie overlays, useful for shell/card/slip/modal comparison but not clean no-overlay baselines.
- `superbet-light` / `superbet-dark`: official Superbet desktop/mobile rich captures are usable for the light-shell baseline; official dark reference is still missing.

## Executive Findings

| Priority | Theme | Finding | Impact | Next action |
| --- | --- | --- | --- | --- |
| Done | `match` | `scheme-meta.ts` now maps it to brand `match`; `getBrandUiSkin()` returns `MATCH_UI_STYLE`. | No Betbus red topbar/sidebar/odds/mobile sport-nav inheritance. | Desktop and true mobile-UA recaptures saved. |
| Done | `match-light` | `MATCH_LIGHT_UI_STYLE` now owns light shell, cards, odds, and mobile sport-nav variables. | No Betbus-light or inherited dark card/odds dependency. | Desktop and true mobile-UA recaptures saved. |
| Done | `superbet-light` | `SUPERBET_LIGHT_UI_STYLE` now owns light shell, rails, interactive rows, cards, odds, and mobile sport-nav variables. | `gtb` was split to `GTB_UI_STYLE`, so Superbet-light can become light without changing legacy GTB. | Desktop and true mobile-UA recaptures saved; deeper content hierarchy tuning remains P1. |
| P1 | `betano-dark` | Local clean desktop and true mobile-UA captures now exist via the dev/test scheme query. | Official clean no-overlay comparison and modal/drawer states are still incomplete. | Capture modal/drawer states and obtain a clean official dark sportsbook baseline if possible. |
| P1 | `betano-light` | Card/odds direction was previously fixed toward gray-white cards and green odds/CTA; local clean desktop and true mobile-UA captures now exist. | Modal/drawer coverage still needs validation. | Recheck overlay states. |
| P1 | `superbet-*` | Shell variables are fixed, but content/module hierarchy still differs from official Superbet. | Quick entries, promo modules, live cards, and empty slip rhythm need deeper tuning. | Use official rich captures for the next visual pass. |

## Implementation Progress

- Added brand `match` and mapped `match` / `match-light` to it.
- Added `MATCH_UI_STYLE` and `MATCH_LIGHT_UI_STYLE`.
- Added explicit `match` handling in bet slip skin, Super Odds recommend card skin, and parlay boost progress.
- Split `gtb` into `GTB_UI_STYLE` before completing `SUPERBET_LIGHT_UI_STYLE`.
- Completed `SUPERBET_LIGHT_UI_STYLE` for topbar, sidebar, right rail, interactive rows, match cards, odds, and mobile sport nav.
- Updated `pnpm theme:check` skin-key mapping to print all skin groups separately.
- Added a dev/test i18n fallback so local SSR can render pages when region/language/timezone cookies are missing.
- Added a dev/test `?scheme=` / `?theme=` sync in `ThemeProvider` for deterministic visual recapture without manually mutating storage.
- Downgraded the non-fatal shared WebSocket `onerror` browser log from `console.error` to `console.warn`; connection state, reconnection, broadcast, and Sentry capture are unchanged, and the local Next dev overlay no longer blocks screenshots.
- P1 desktop recaptures saved under `D:\Documents\gotobet\.codex-artifacts\theme-references\local-{match,match-light,superbet-light,betano-dark,betano-light}-sports-desktop-p1-query-2026-06-21.png`.
- P1 true mobile-UA recaptures saved under `D:\Documents\gotobet\.codex-artifacts\theme-references\local-{match,match-light,superbet-light,betano-dark,betano-light}-sports-mobile-ua-p1-query-2026-06-21.png`.
- Verification so far: `pnpm theme:check`, `pnpm lint:ts`, touched-file Biome checks, and a runtime skin-resolution assertion pass.
- Local recapture no longer depends on the visible switcher overlay; use `http://localhost:3000/en/sports?scheme=<scheme>` in dev/test.

## Remaining Risk Map

| Variable family | Used by | Risk |
| --- | --- | --- |
| `--brand-topbar-*` | `navigation-bar` | Very visible shell drift; recapture after edits. |
| `--brand-sidebar-*` | sidebar shell and sports rails | Can invert light/dark shell unexpectedly. |
| `--brand-match-card-*` | match cards, carousel cards, sports activity | High first-viewport betting-card visibility. |
| `--brand-odds-*` | standard/short bet buttons, cart toggle | Highest betting UX risk: selected, hover, price text, and contrast. |
| `--brand-mobile-sport-nav-*` | mobile match filters | Mobile first-viewport drift. |
| `--dock-bar-*`, `--mobile-dock-*` | mobile summary bar and dock actions | Conversion CTA and selected-slip risk. |

## Next Implementation Order

1. Capture Betano and Superbet modal/drawer states, including desktop bet slip and mobile summary sheet.
2. Obtain or create a clean official Betano-dark sportsbook baseline; the current official capture is still overlayed.
3. Tune per-theme token values now that skin boundaries and recapture paths are separated.
4. Re-run adjacent-risk checks for `betbus`, `gtb`, and each light/dark counterpart after token tuning.
