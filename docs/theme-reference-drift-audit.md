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
| P0 | All schemes | Theme acceptance now requires a component-level style fingerprint, not only palette parity. | Prevents "same layout, different hue" drift and gives design review a concrete way to reject under-differentiated skins. | Compare shell, match card, odds button, bet slip, mobile sheet, account card, and feedback states against each theme's fingerprint below. |
| Done | `match` | `scheme-meta.ts` now maps it to brand `match`; `getBrandUiSkin()` returns `MATCH_UI_STYLE`. | No Betbus red topbar/sidebar/odds/mobile sport-nav inheritance. | Desktop and true mobile-UA recaptures saved. |
| Done | `match-light` | `MATCH_LIGHT_UI_STYLE` now owns light shell, cards, odds, and mobile sport-nav variables. | No Betbus-light or inherited dark card/odds dependency. | Desktop and true mobile-UA recaptures saved. |
| Done | `superbet-light` | `SUPERBET_LIGHT_UI_STYLE` now owns light shell, rails, interactive rows, cards, odds, and mobile sport-nav variables. | `gtb` was split to `GTB_UI_STYLE`, so Superbet-light can become light without changing legacy GTB. | Desktop and true mobile-UA recaptures saved; deeper content hierarchy tuning remains P1. |
| P1 | `betano-dark` | Local clean desktop and true mobile-UA captures now exist, and desktop bet slip / mobile sheet skin was split from the light Betano style. | The previous white slip/sheet drift is fixed locally; official clean no-overlay comparison and non-slip modal/drawer states are still incomplete. | Capture remaining modal/drawer states and obtain a clean official dark sportsbook baseline if possible. |
| P1 | `betano-light` | Card/odds direction was previously fixed toward gray-white cards and green odds/CTA; local clean desktop and true mobile-UA captures now exist. | Modal/drawer coverage still needs validation. | Recheck overlay states. |
| P1 | `superbet-*` | Shell variables are fixed, but content/module hierarchy still differs from official Superbet. | Quick entries, promo modules, live cards, and empty slip rhythm need deeper tuning. | Use official rich captures for the next visual pass. |

## Component Design Fingerprints

Use this table during the next comparison pass. A scheme should fail review if it only changes color while keeping the same density, shape, surface treatment, and betting-card rhythm as another scheme.

| Theme | Design fingerprint | Must look different from | Component details to inspect |
| --- | --- | --- | --- |
| `gtb` | Legacy light-red utility UI: flatter cards, smaller radii, simple solid selected odds, calm white rails, minimal shadows. | `superbet-light` rich red shell. | Topbar should feel legacy/product-first; match cards should be simple white panels; odds selected state should be solid GTB red rather than rich gradients; mobile sport nav may have light red badges but no heavy promo styling. |
| `betbus` | Dense dark Betbus board: compact black/charcoal layers, square cards, hard separators, floating-ticket attitude. | `match` dark green sportsbook. | Sidebar and match rows should stay compact; card shadow should be absent; odds value uses warm contrast; mobile sheet should feel dark and utilitarian rather than rounded/premium. |
| `match` | Dark green command-center: medium-radius cards, active green rails, green selected odds gradients, low-noise charcoal surfaces. | `betbus` dark red and `superbet-dark` black/red. | Active nav/row rail should be green; odds value and selected states should read as the strongest betting cues; cards should have a subtle lifted hover without becoming promo cards. |
| `match-light` | Light mint sportsbook: softer cards, larger radii, airy green filters, white/mint surfaces. | `gtb` legacy light red and unused Betbus-light fallback. | Match-card spacing should breathe more than GTB; active rails should be green; account/money cards should look fresh and light, not gray corporate. |
| `superbet-light` | Rich light Superbet: pill controls, red promotional energy, stronger module spacing, white shell with red active blocks. | `gtb` legacy red. | Header/nav active blocks should feel bolder than GTB; carousel/recommendation cards should support promo rhythm; odds selected states can use red gradients and pill-like control shapes. |
| `superbet-dark` | Dark Superbet: black/navy shell, red action rails, pill controls, high-contrast white odds values. | `betbus` compact black/red. | Topbar/sidebar should feel more premium and less flat than Betbus; match cards can carry shadow; selected odds use red gradients; empty slip rhythm should mirror Superbet's stronger product modules. |
| `betano-light` | Orange-plus-green Betano: orange shell/action identity with green odds, blocky ticket cards, navy dock contrast. | `superbet-light` red and `match-light` green. | Topbar should be orange-led; odds values and selected betting actions should be green; card surfaces should feel crisp and slightly ticket-like, not pill-heavy. |
| `betano-dark` | Deep navy Betano: blue-black sports shell, orange navigation identity, green odds/action system, rounded bottom sheets. | `superbet-dark` red dark mode and `match` green dark mode. | Header/rails should stay navy/orange; selected odds should be green; bet slip and mobile sheet must not inherit light/white surfaces; account drawers should keep navy layering. |

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
- Split Betano slip skin into explicit dark and light styles so `betano-dark` no longer inherits the white/light slip surface variables; desktop bet slip and true mobile-UA sheet captures saved under `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-slip-{desktop,mobile-ua}-p1-fix-2026-06-22.png`.
- Corrected dark-theme match-card odds value drift: `match` now uses the brand green value color, while `superbet-dark` uses primary white text instead of the shared warm/yellow activity accent; desktop match-card button captures saved under `D:\Documents\gotobet\.codex-artifacts\theme-references\local-{match,superbet-dark}-match-card-buttons-desktop-p1-fix-2026-06-22.png`.
- Added a component-design fingerprint table so each scheme has explicit non-color differences for shell, match cards, odds controls, betting card/slip, mobile sheet, account/money, and feedback surfaces.
- Split the `gtb` brand skin away from the Superbet dark base so GTB uses its own light legacy topbar, rails, match-card, odds, and mobile sport-nav variables instead of inheriting Superbet shell behavior.
- Added per-scheme shape and density tokens (`--style-radius-*`, `--style-card-padding`, `--style-card-gap`) so themes differ in card/control feel, not only palette.
- Started the reusable-UI hardcoded color cleanup: `Loading`, network signal icon, toast weak-signal icon, mobile sign-in disabled action, and account balance overview hover/hero surfaces now use semantic theme tokens instead of fixed red/gray/blue/purple hex or arbitrary gradients.
- Extended the reusable-UI cleanup across shared controls and account money UI: parlay boost mark, bonus card gradients, segmented progress, FAQ badges, carousel masks, border beam defaults, shared button, tooltip, question tooltip, sidebar tooltip, time picker focus/arrow colors, KYC step chips, pagination, checkbox count badge, icon-button badge, VIP support badge, and password confirm action now use theme tokens.
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

## Checklist Gap Audit

The detailed acceptance source now lives in `docs/theme-comparison-acceptance-matrix.md`. Keep this section as a status summary only.

| Gap | Current coverage | Missing comparison | Priority |
| --- | --- | --- | --- |
| Official baselines | Local clean captures exist for most target schemes. | Clean official `betano-dark` no-overlay sportsbook baseline and official `superbet-dark` sportsbook baseline are still missing. | P1 |
| Per-theme component reference pass | Theme references are indexed, and some shell/card/slip captures exist. | Each scheme still needs a component-level comparison against its own target reference rather than a generic whole-page check. Required components: shell/navigation, match cards, market/detail cards, betting cards, recommendation/carousel cards, account/money cards, and feedback components. | P1 |
| Sports page depth | Sports home has desktop and true mobile-UA captures. | Sport topic, match detail, live/in-play, outright, expanded tournament groups, carousel cards, and scrolled states need per-theme captures. | P1 |
| Betting-card layout and buttons | `betano-dark` desktop slip and mobile sheet are covered after the fix; `match` and `superbet-dark` match-card button captures exist. | For every target theme, compare betting-card information order and action layout against the target reference: selection/market/match/odds/stake/payout order, remove/clear, quick stake, accept odds change, collapse/expand, login/deposit, and primary CTA placement across desktop floating slip, mobile summary bar, mobile sheet, single, parlay, locked/invalid, odds-change, insufficient-balance, logged-out, success, and error states. | P1 |
| Modal/drawer matrix | Audit names Betano/Superbet modal/drawer risk. | Login/sign-in, account menu, mobile nav drawer, withdraw password, deposit/withdraw result, generic dialog, popover, tooltip, and bottom sheet states are not enumerated as required captures. | P1 |
| Account and money pages | Index mentions account menu, deposit, and withdraw. | Account shell, wallet/balance panels, transaction list, deposit form states, withdraw form states, bank-account empty states, KYC/security/settings are not yet tracked in this audit. | P1 |
| Empty/error/loading states | Mentioned only in `theme-design.md`. | Shared empty cards, skeleton/loading spinners, network/API error panels, `global-error.tsx`, toast/dialog feedback, and disabled controls need explicit screenshots. | P2 |
| Mobile chrome and safe areas | Mobile sports captures exist. | Bottom tab bar, mobile auth action bar, mobile drawer close button, safe-area padding, sheet overlap, and long-scroll bottom content need explicit checks. | P2 |
| Interaction states | Some standard odds buttons have been visually checked. | Hover, focus-visible, active, selected, disabled, locked, trend-up/down, and long localized text overflow states are not a formal matrix. | P2 |
| Hardcoded reusable colors | Reusable-UI passes removed fixed colors from loading, network signal, toast weak-signal icon, mobile sign-in disabled action, account balance overview, bonus card gradients, progress segments, FAQ badges, carousel masks, border beam defaults, button, tooltip, question tooltip, sidebar tooltip, time picker, KYC step chip, pagination, checkbox badge, icon-button badge, VIP support badge, and password confirm action. | Remaining scoped hits are mainly fractional border utilities, CSS variable arbitrary classes, brand/logo assets, and debug console style; continue reviewing account/auth/dialog surfaces as they are touched. | P2 |
| Adjacent theme regression | `theme:check` confirms skin separation. | Visual adjacent checks for `betbus`, `gtb`, light/dark counterparts, and mobile counterparts after each token edit are not yet captured consistently. | P2 |

## Next Implementation Order

1. For each scheme, choose the exact target reference page/capture and run a component-level comparison pass instead of a generic whole-page visual pass.
2. Prioritize betting-card and bet-slip information/button layout: desktop floating slip or panel, mobile summary bar, mobile sheet, single, parlay, locked/invalid, odds-change, quick stake, logged-out, insufficient-balance, success, and error states.
3. Capture remaining Betano and Superbet modal/drawer states beyond the fixed Betano dark bet slip and mobile summary sheet.
4. Capture the sportsbook depth matrix: sport topic, match detail, live/in-play, outright, carousel, and scrolled tournament states.
5. Capture the account/money matrix: account shell, account menu, deposit, withdraw, transaction list, wallet/balance, and empty/error/loading states.
6. Obtain or create clean official Betano-dark and Superbet-dark sportsbook baselines where possible.
7. Tune per-theme token values now that skin boundaries and recapture paths are separated.
8. Re-run adjacent-risk checks for `betbus`, `gtb`, and each light/dark/mobile counterpart after token tuning.
