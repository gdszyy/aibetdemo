# Theme Comparison Acceptance Matrix

> Purpose: turn theme comparison from "home + skin + bet slip" into a repeatable acceptance matrix that covers page depth, state depth, account money flows, shared UI, and adjacent regression screenshots.
> Updated: 2026-06-22.

## Scope

This checklist applies to `gtb`, `betbus`, `match`, `match-light`, `superbet-light`, `superbet-dark`, `betano-light`, and `betano-dark`.

For local checks, lock a scheme with `?scheme=<scheme>` or `?theme=<scheme>`. Save screenshots under `D:\Documents\gotobet\.codex-artifacts\theme-references\` with names that include scheme, surface, viewport, state, and date.

## Reference Target Map

Every comparison must be scoped to the target reference for the scheme being edited. Do not compare all schemes against the same reference site unless the scheme intentionally shares that brand direction.

| Scheme group | Target reference | Component comparison focus |
| --- | --- | --- |
| `gtb` | GTB legacy product | Preserve legacy hierarchy while checking that shared sportsbook components are not broken by newer skins. |
| `betbus` | Betbus sports pages, match detail, and bet slip | Floating desktop slip, mobile summary bar/sheet, compact red sportsbook cards, and Betbus-specific account/nav rhythm. |
| `match`, `match-light` | Internal Match sportsbook reference captures | Green sportsbook shell, match cards, odds buttons, mobile sport nav, and selected-bet clarity in dark/light modes. |
| `superbet-light`, `superbet-dark` | Superbet sportsbook pages that match the target mode | Light/rich or dark shell rhythm, quick-entry modules, match rows, odds button density, and empty-slip rhythm. |
| `betano-light`, `betano-dark` | Betano sportsbook pages that match the target mode | Orange/neutral sportsbook hierarchy, match-card density, bet slip card structure, mobile sheet layering, and modal/drawer treatment. |

If an official reference is blocked by overlays, login walls, or missing dark/light mode, record that blocker with date and use the closest clean local/reference capture only as a temporary baseline.

## Differentiated Theme Design Contract

A theme pass is not accepted when the only visible difference is hue. Each scheme must have a distinct component signature across density, radius, surface depth, odds-button treatment, betting-card rhythm, and mobile sheet behavior.

| Scheme | Required component signature | Rejection signal |
| --- | --- | --- |
| `gtb` | Legacy utility shell, small radii, flat white cards, solid red active/selected states, minimal elevation. | Looks like `superbet-light` with the same rich red gradient controls or pill rhythm. |
| `betbus` | Dense dark board, square cards, hard separators, red active blocks, warm odds values, no card shadow by default. | Looks like `match` with only red swapped in, or uses airy/premium spacing. |
| `match` | Dark green command-center, medium radii, green active rails, green selected odds gradients, subtle hover lift. | Looks like Betbus density/square cards with green applied. |
| `match-light` | Airy mint sportsbook, softer radii, white/mint surfaces, green active rails, more breathing room than GTB. | Looks like the same light card stack as GTB or Superbet with only green variables. |
| `superbet-light` | Rich red promotional light mode, pill controls, bolder active navigation, stronger module spacing. | Looks like GTB's flatter legacy red layout. |
| `superbet-dark` | Premium black/navy shell, red pill actions, shadowed dark match cards, white odds values. | Looks like Betbus' compact flat dark board. |
| `betano-light` | Orange shell identity, green odds/action system, navy dock contrast, crisp ticket-like cards. | Looks like Superbet red or Match green after palette swap. |
| `betano-dark` | Deep navy shell, orange navigation identity, green odds selections, dark rounded sheets. | Looks like Superbet dark red or Match dark green. |

When a component intentionally shares structure across themes, the comparison note must name the shared reason, for example "shared bet-slip information order for risk control", and still confirm different surface, state, and action styling.

## Component-Level Comparison Method

For each target scheme and viewport, compare the local product against its target reference by component, not only by page screenshot. Each component pass should record the reference URL or file, viewport, login state, local route, and a short drift note.

| Component family | What to compare | Required local surfaces |
| --- | --- | --- |
| Shell and navigation | Header height, tab order, active state, sidebar depth, drawer layout, bottom tabs, spacing, and elevation. | Sports home, sport topic, match detail, mobile drawer, bottom tab. |
| Match list cards | League header, match time/score placement, team alignment, market-count placement, odds column count, card separators, and collapsed/expanded rhythm. | Sports home, sport topic, live/in-play, expanded league, scrolled list. |
| Market/detail cards | Market title hierarchy, group spacing, column headers, odds grid density, collapsed state, sticky tabs, and long-label wrapping. | Match detail, market groups, outright/futures. |
| Betting card and slip | Selection card information order, odds-change/locked states, stake input position, quick stake buttons, CTA placement, clear/remove actions, and payout summary. | Desktop floating slip or panel, mobile summary bar, mobile sheet, single, parlay, invalid, odds-change, and logged-out states. |
| Recommendation/carousel cards | Image/league/team hierarchy, odds footer layout, selected state, CTA affordance, and card height consistency. | Super Odds/recommend cards, hot matches, carousel cards. |
| Account and money cards | Balance hierarchy, row grouping, action button placement, empty/error state composition, and form action layout. | Account menu/shell, deposit, withdraw, transactions, bank card empty state. |
| Feedback components | Toast, dialog, popover, tooltip, loading, disabled and retry states, including layer order near fixed betting UI. | Login modal, generic dialog, tooltip/popover, API error, loading/skeleton, toast. |

For each component family, record whether the scheme differs through at least two non-color axes: density, radius, elevation, divider strength, information order, motion/state treatment, or mobile placement.

## Betting Card Layout Rubric

The betting card is the highest-risk component in theme work. A pass must inspect both the card information layout and the action/button layout against the target reference.

| Area | Compare against reference | Pass condition |
| --- | --- | --- |
| Information order | Selection name, market name, match name, league, time/live state, odds value, stake, potential payout, and warning copy. | Users can identify what they selected, where it belongs, current odds, stake, and return without scanning unrelated controls first. |
| Visual hierarchy | Font size/weight, muted metadata, emphasis color, selected/changed odds color, separators, card background, and row density. | Selection and odds are stronger than metadata; warnings are visible without overpowering the stake/CTA flow. |
| Remove/clear actions | Single remove affordance, clear-all action, icon size, touch area, and disabled/locked recovery actions. | Destructive or recovery actions are reachable but secondary to stake and submit. |
| Stake input layout | Input width, currency prefix/suffix, placeholder, focus state, validation text, and read-only behavior when keypad is active. | Input is visually tied to the selected bet and does not resize or shift the card unexpectedly. |
| Quick stake buttons | Button count, wrapping, selected/pressed/disabled states, long currency labels, and relation to stake input. | Buttons wrap cleanly, preserve stable height, and do not compete with the primary CTA. |
| Primary CTA | CTA text, width, height, color, disabled/loading state, and placement relative to payout summary. | CTA is the strongest action and remains visible in desktop floating slip and mobile sheet. |
| Secondary buttons | Accept odds change, show selections, show more multiples, deposit/login, collapse/expand, settings. | Secondary buttons follow the reference order and never hide the primary bet action. |
| Multi/parlay summary | Parlay count, combined odds, expand/collapse row, per-leg cards, total stake, bonus/boost, and payout. | Summary is compact when collapsed and complete when expanded; each leg still exposes remove/locked/changed states. |
| Mobile sheet controls | Drag handle, sticky header/footer, keypad, safe-area padding, and CTA above keyboard/safe area. | Sheet keeps selection cards, stake controls, keypad, and CTA in a stable order at true mobile UA. |
| Edge states | Locked, inactive, suspended, odds up/down, odds-change pending, insufficient balance, logged out, success, and submit error. | State-specific actions are themed and readable in both normal and selected-card contexts. |

When a theme intentionally diverges from the reference, write the product reason in `docs/theme-reference-drift-audit.md`; otherwise treat the difference as drift to tune through tokens or the relevant skin file.

## Priority Gates

| Priority | Gate | Pass condition |
| --- | --- | --- |
| P1 | Clean official baselines | `betano-dark` has a no-overlay official sportsbook baseline; `superbet-dark` has an official dark sportsbook baseline. Record source URL, date, viewport, and whether the state is logged in. |
| P1 | Component-level reference pass | The target scheme has a component-by-component comparison against its own target reference, including shell, match cards, market/detail cards, betting cards, account/money cards, and feedback components. |
| P1 | Sportsbook depth | The target scheme has desktop and true mobile-UA screenshots for sport topic, match detail, live/in-play, outright, carousel cards, expanded leagues, and scrolled list states, with component drift notes. |
| P1 | Bet slip states | Empty, single, multi/parlay, locked/invalid, odds-change confirmation, quick stake, numeric keypad, logged-out, insufficient-balance, success, and error states are captured with explicit betting-card information/button layout notes. |
| P1 | Modal and drawer states | Login, account menu, mobile nav drawer, withdraw password, deposit/withdraw result, generic dialog, popover, and tooltip are captured. |
| P1 | Account and money pages | Account shell, wallet/balance, transaction list, deposit, withdraw, bank-card empty state, KYC, security, and settings are captured. |
| P2 | Empty/error/loading coverage | Empty, API error, loading, skeleton, global error, toast, disabled, and retry states are captured where components support them. |
| P2 | Mobile chrome | Bottom tab, auth action bar, safe-area padding, bottom sheet overlap, and long-scroll bottom content are captured. |
| P2 | Interaction states | Hover, focus-visible, active, selected, disabled, locked, trend-up/down, and long localized text overflow are checked on reusable controls. |
| P2 | Hardcoded reusable colors | Run a scoped audit that excludes icons, artwork, and campaign assets, but includes reusable account, auth, dialog, drawer, loading, toast, and sportsbook UI. |
| P2 | Adjacent regressions | After every token or skin edit, capture the target scheme plus `betbus`, `gtb`, the light/dark counterpart, and the mobile counterpart when applicable. |

## P1 Official Baselines

| Theme | Required baseline | Status |
| --- | --- | --- |
| `betano-dark` | Official dark sportsbook page without cookie, login, or promo overlays. | Missing. Existing official captures are overlay-contaminated and useful only for modal/shell clues. |
| `superbet-dark` | Official dark sportsbook page, preferably sports home plus match list/detail. | Missing. Existing official rich captures mainly support `superbet-light`. |
| `superbet-light` | Official light/rich sportsbook baseline. | Available, but keep date/source with each comparison. |
| `betano-light` | Official light sportsbook baseline, including mobile if available. | Partial. Use existing official mobile captures, then add clean desktop when possible. |

## P1 Sportsbook Depth Matrix

For every target scheme, capture both desktop and true mobile-UA unless a surface is desktop-only.

| Surface | Required states | Notes |
| --- | --- | --- |
| Sports home | Initial viewport, populated list, scroll after first viewport. | Include shell, left rail, content, right rail, bottom tab on mobile. |
| Sport topic | Hero/header, `Partidos`/`Futuras`, time filters, A-Z, popular grid. | Validate topic-specific palette, hierarchy, and density. |
| Match detail | Header, market tabs, market groups, expanded/collapsed groups, scrolled market list. | Include sticky areas and odds grid contrast. |
| Live/in-play | Live list, score clock, active odds, empty/no-live state if reachable. | Check update/trend colors against normal odds. |
| Outright/futures | Futures list, league/tournament grouping, selection into slip. | Avoid losing hierarchy in long outright labels. |
| Carousel cards | Default, selected, hover/focus where possible, long team names. | Includes Super Odds/recommend cards when theme-specific skins apply. |
| Expanded leagues | Several expanded tournament groups, nested country/category rows. | Check separator and accordion affordance. |
| Scrolled states | Header/nav sticky state, bet slip/floating controls, mobile bottom bars. | Confirm fixed layers do not hide odds or CTA. |

## P1 Bet Slip State Matrix

| State | Desktop | Mobile |
| --- | --- | --- |
| Empty | Floating or dormant shell does not occupy awkward space. | Summary bar/sheet empty state is clear and not too tall. |
| One selection | Odds, stake, quick stake, remove, and payout are readable. | Bottom sheet has stable CTA and no system keyboard overlap. |
| Multi/parlay | Combined odds, parlay count, expand/collapse, and stake footer are clear. | Sheet keeps selections, keypad, and CTA in a usable order. |
| Locked/invalid | Disabled odds, validation copy, remove/clear actions, and contrast pass. | Locked rows do not collapse or hide the primary recovery action. |
| Odds changed | Accept/confirm changed odds is visually prominent without overpowering stake. | `Aceptar Cambio` or equivalent stays visible above bottom CTA/keypad. |
| Quick amount | Chips/buttons show default, hover, selected, disabled, and long currency values. | Chips wrap without clipping or resizing the sheet unexpectedly. |
| Numeric keypad | N/A unless desktop keypad is added. | Custom keypad appears; stake input remains read-only; `Del`/`Done` are visible. |
| Logged out | Login-required banner/modal/action bar is themed and actionable. | Auth action bar and sheet do not overlap safe areas. |
| Insufficient balance | Banner/modal plus deposit action are themed and high contrast. | Deposit action remains reachable above bottom safe area. |
| Success/error | Submit success, API error, retry, and toast/dialog feedback are captured. | Toast/sheet/dialog layering is stable. |

## P1 Modal And Drawer Matrix

| Surface | Required states |
| --- | --- |
| Login/sign-in | Initial, validation error, loading, disabled submit, focused input, mobile layout. |
| Account menu | Logged-in avatar popover, wallet/balance rows, common actions, long username/balance. |
| Mobile nav drawer | Open, nested sport/category, close affordance, active item, safe-area top/bottom. |
| Withdraw password | Empty, input focus, validation error, submit loading, success/failure. |
| Deposit result | Pending, success, failed, retry/close action. |
| Withdraw result | Pending/polling, success, failed, retry/contact support. |
| Generic dialog | Title/body/actions, destructive action, disabled/loading action, long copy. |
| Popover | Default, hover/focus trigger, overflow near viewport edge. |
| Tooltip | Short text, long text, disabled trigger, dark/light contrast. |

## P1 Account And Money Matrix

| Surface | Required states |
| --- | --- |
| Account shell | Sidebar/menu active state, page header, mobile account nav, scroll behavior. |
| Wallet/balance | Main balance, bonus balance, hidden/loading balance, refresh/sync state. |
| Transaction list | Populated, filtered, empty, loading, error, pagination/infinite scroll. |
| Deposit | Method list, selected method, form focus, validation, disabled, submit loading, result. |
| Withdraw | Bank/account selector, amount input, password gate, validation, insufficient funds, result. |
| Bank card empty | Empty state, add-card CTA, validation modal/drawer. |
| KYC | Not started, pending, approved, rejected, upload/form focus and error states. |
| Security/settings | Bound/unbound contact, toggle/switch states, password/change confirmation dialogs. |

## P2 Shared UI And Failure States

| Category | Required checks |
| --- | --- |
| Empty states | Account, transaction, notifications, sports no-data, bet slip empty. |
| Error states | API error panels, inline form errors, retry surfaces, network signal. |
| Loading/skeleton | Page-level loading, list skeleton, account skeleton, button loading. |
| Global error | `src/app/global-error.tsx` in each major theme mode. |
| Toast | Success, error, warning/info, stacked toasts, mobile safe-area placement. |
| Disabled controls | Buttons, odds, inputs, selects, tabs, quick stake. |

## P2 Mobile Chrome Checks

| Surface | Required checks |
| --- | --- |
| Bottom tab | Active/inactive state, badge/counter, safe-area bottom, long label. |
| Auth action bar | Logged-out sportsbook pages, keyboard-open state, safe-area bottom. |
| Bottom sheet | Open/closed, max height, internal scroll, keypad overlap, CTA visibility. |
| Mobile drawer | Header close action, nested scroll, bottom tab interaction, safe-area top/bottom. |
| Long-scroll page | Sticky/fixed bars do not cover final content or primary CTA. |

## P2 Interaction And Text Overflow

| Component class | States |
| --- | --- |
| Odds buttons | Default, hover, focus-visible, active, selected, disabled, locked, trend-up, trend-down, long price/label. |
| Primary/secondary buttons | Default, hover, focus-visible, active, loading, disabled, long translated text. |
| Inputs/selects | Empty, focus, filled, invalid, disabled, read-only, long value. |
| Tabs/segmented controls | Active, hover, disabled, overflow/scroll. |
| Cards/list rows | Hover, selected, expanded, collapsed, long team/league names. |
| Dialog/drawer actions | Focus trap, close button, destructive action, text wrapping. |

## Hardcoded Color Audit

Run the audit only against reusable UI. Exclude sport/team icons, SVG icon assets, bitmap artwork, promotion/campaign backgrounds, and brand-specific event illustrations.

Include these folders and components:

- `src/components`
- `src/modules/home/_components` reusable product UI
- `src/modules/match`
- `src/modules/bet-slip`
- `src/modules/user`
- `src/modules/user-center`
- `src/modules/transaction`
- `src/modules/withdraw`

Flag new or remaining hardcoded `#...`, `rgba(...)`, `rgb(...)`, one-off gradients, and raw Tailwind arbitrary color classes when a semantic token can express the same role.

## Adjacent Regression Rule

Every token or brand skin edit must define:

| Edited area | Required adjacent screenshots |
| --- | --- |
| Global semantic tokens | Target scheme, `betbus`, `gtb`, matching light/dark counterpart, target mobile. |
| `brand-ui-skin.ts` topbar/sidebar | Target scheme, `gtb`, `betbus`, target mobile nav/drawer. |
| Match card or odds variables | Target scheme sports list, match detail, bet slip, mobile sheet; plus `betbus` and light/dark counterpart. |
| Bet slip skin | Desktop slip and mobile sheet for target scheme, `betbus`, and counterpart scheme. |
| Account/shared components | Target account page, deposit/withdraw, login modal, toast/dialog; plus `gtb` and mobile counterpart. |

## Completion Definition

A theme comparison pass is complete only when:

1. Required P1 screenshots exist or the blocker is documented with date and reason.
2. P2 checks that are reachable locally are either captured or listed as not applicable.
3. Drift is recorded in `docs/theme-reference-drift-audit.md`.
4. Token or skin changes are followed by adjacent regression screenshots.
5. `pnpm theme:check` passes after any scheme/index/skin mapping changes.
