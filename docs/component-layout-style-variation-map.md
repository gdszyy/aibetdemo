# Component Layout And Style Variation Map

> Purpose: enumerate sportsbook product modules/components and their feasible layout/style variation axes for future theme exploration. This document intentionally excludes color choices; use it to discuss structure, hierarchy, density, typography, spacing, shape, elevation, and interaction patterns.

## Non-Color Variation Axes

Use these axes before discussing palette:

| Axis | Possible directions |
| --- | --- |
| Density | Compact odds-board, balanced product UI, spacious premium UI, mobile-first compressed. |
| Information hierarchy | Odds-first, match-first, competition-first, promotion-first, account/action-first. |
| Layout rhythm | Table-like rows, stacked cards, split panels, carousel cards, sticky/floating tools, bottom-sheet flow. |
| Typography | Numeric-heavy, label-heavy, compact metadata, editorial headings, all-caps sport labels, tabular odds. |
| Shape | Square rows, small-radius cards, pill controls, sheet/modal rounded top, circular sport icons. |
| Surface treatment | Flat separated rows, outlined cards, raised floating panels, inset sections, grouped list blocks. |
| Dividers | Hard grid lines, soft separators, gap-only grouping, section headers, accordion boundaries. |
| Elevation | None, subtle card shadow, floating slip shadow, modal/drawer shadow, sticky header shadow. |
| Motion | Static, subtle hover lift, odds trend pulse, drawer slide, bottom-sheet drag, carousel snap. |
| Responsiveness | Same structure across viewports, desktop table plus mobile cards, desktop panel plus mobile sheet. |

## Shell And Navigation

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Top header | Single row; promo strip + main row; logo-left nav-center actions-right; compact mobile topbar; sticky scrolled header. | Height, nav item spacing, active underline/block, icon-only vs text+icon, account/deposit grouping, scroll shadow. |
| Desktop sidebar | Expanded tree; compact icon rail; two-level rail + content; flat sport list; collapsible quick sections. | Row height, icon size, counter placement, nested indentation, accordion affordance, active row weight. |
| Mobile drawer | Full-height drawer; partial-width drawer; nested sport list; search-first drawer; account actions at top. | Close affordance, safe-area padding, row grouping, sticky drawer header, nested back behavior. |
| Bottom tab bar | 4-5 fixed tabs; center action slot; badge/counter tab; text-only; icon-only; floating dock. | Tab height, hit target, active indicator, label wrapping, safe-area handling, bet slip counter treatment. |
| Sport quick nav | Horizontal icon chips; circular icon grid; text segmented tabs; sticky sport rail; carousel with arrows. | Icon scale, chip height, scroll snap, selected state shape, counter/badge position. |

## Sports Home And Discovery

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Hero/banner | Wide carousel; compact promotion strip; sport-specific header; no hero, direct match list; split quick-entry header. | Aspect ratio, image crop, text overlay density, carousel controls, pagination dots, spacing below. |
| Match filters | Segmented tabs; chip row; dropdown filters; sticky filter bar; two-row filter + sort. | Height, overflow behavior, active indicator, count placement, date/time label width. |
| League/tournament group | Accordion block; sticky league header; table section; card section; country-first grouping. | Header height, expand icon position, match-count badge, separator strength, nested group spacing. |
| Match list | Table-like dense rows; individual match cards; grouped card stack; 2-column desktop grid; compact live board. | Team alignment, score/time placement, odds column width, market-count placement, row hover, long-name truncation. |
| Live/in-play row | Scoreboard-first; timer-first; market-first; compact live badge row; expanded live stats row. | Clock placement, score typography, event status density, trend/lock affordance. |
| Outright/futures list | Competition cards; flat option list; expandable country sections; search + list; grouped market panels. | Long-label wrapping, option row height, odds alignment, group header rhythm. |

## Match Card And Odds Controls

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Match list card | Horizontal teams + odds grid; vertical team stack + odds row; score-centered; league metadata top; market-count CTA side. | Card padding, row height, team logo size, metadata line count, odds gutter, hover/selected behavior. |
| Odds button | Name + odds horizontal; name above odds vertical; odds-only; compact short button; large touch button. | Min height, min width, inner alignment, numeric weight, name truncation, locked/disabled shape, trend bubble placement. |
| Odds grid | 3-column 1/X/2; 2-column handicap; responsive wrap; horizontal scroll; market-specific column headers. | Column gap, header alignment, equal width vs content width, wrap threshold, grid dividers. |
| Trend indicator | Bubble badge; inline arrow; corner marker; background pulse; no motion, text-only. | Indicator size, duration, reserved space, selected-state compatibility. |

## Match Detail And Markets

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Match detail header | Compact scoreboard; large team hero; sport-specific banner; stats/weather strip + scoreboard; sticky mini-header after scroll. | Team alignment, score/time prominence, breadcrumb placement, tabs location, header collapse behavior. |
| Detail tabs | Top segmented tabs; sticky horizontal tabs; icon+text tabs; scrollable category chips; secondary market nav. | Tab height, overflow, active marker, sticky offset, long-label handling. |
| Market group | Accordion card; table panel; dense list; grouped by category; pinned popular markets. | Header density, collapse icon, market description placement, card spacing, group dividers. |
| Market card type | Single row; two-column; grid matrix; correct-score matrix; player/prop list. | Column labels, row grouping, odds button ratio, empty cell handling, long player names. |
| Chat/analytic side panel | Right rail; tab within detail; collapsible drawer; mobile full tab; overlay panel. | Width, sticky height, message density, input footer, empty/loading state layout. |

## Betting Card And Bet Slip

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Desktop bet slip shell | Right fixed panel; right-bottom floating panel; collapsed ticket bar; drawer from side; popover anchored to cart button. | Width, max height, sticky/fixed offset, collapse affordance, shadow/elevation, content scroll area. |
| Mobile bet summary | Bottom compact bar; CTA-led bar; two-line summary; floating pill; tab-integrated badge. | Height, safe-area padding, count/odds/stake order, CTA width, tap target stability. |
| Mobile bet sheet | Full-height sheet; half sheet; snap points; sticky header/footer; keypad-attached sheet. | Drag handle, max height, internal scroll, footer stickiness, keyboard/keypad overlap. |
| Selection card | Selection-first; match-first; odds-first; market + selection stacked; compact per-leg row; detailed ticket card. | Information order, metadata line count, remove action placement, warning placement, lock/changed state reserved space. |
| Stake input area | Input under selection; input beside odds; shared footer input; per-leg input plus parlay total; keypad read-only input. | Input width, currency affix, focus ring, validation line, layout stability. |
| Quick stake buttons | Fixed chips; wrapping chips; plus-amount buttons; numeric keypad; recent amount row. | Button count, chip size, selected/pressed state, wrap behavior, long amount handling. |
| Parlay summary | Collapsed combined-odds strip; expandable legs; grouped multiples; boost preview footer; total summary card. | Parlay count placement, combined odds prominence, expand icon, per-leg density, payout hierarchy. |
| Submit/CTA area | Full-width button; button + payout row; split deposit/login + submit; sticky footer CTA; floating action inside panel. | CTA height, disabled/loading state, secondary action order, error/success feedback position. |
| Odds-change action | Inline row action; top alert; per-selection badge; footer confirm button; modal confirmation. | Priority relative to CTA, per-leg clarity, accept/reject placement, height impact. |

## Recommendation And Promotion Cards

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Super odds/recommend card | Match-card mini slip; editorial card; odds-footer card; image-led card; compact carousel card. | Card height consistency, team/league hierarchy, odds footer placement, CTA vs odds prominence. |
| Hot match carousel | Single card carousel; multi-card rail; compact table rail; hero-style featured match. | Aspect ratio, snap points, nav arrows, visible partial next card, long-name handling. |
| Smart activity card | Quick bet card; follow-bet card; leaderboard card; progress/task card. | Header density, metric emphasis, action placement, content clipping, mobile first-screen fit. |
| Right rail promo | Vertical card stack; sticky promo rail; small banners; account/widget rail; collapsible rail. | Rail width, card spacing, image ratio, CTA placement, sticky boundaries. |

## Account, Wallet, And Money Flows

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Account menu | Avatar popover; full account drawer; route-based account shell; quick grid menu; wallet-first popover. | Width, balance hierarchy, quick action grid, scroll behavior, long username/balance handling. |
| Account shell | Sidebar + content; tabbed page; card grid dashboard; mobile menu list; drawer navigation. | Sidebar width, active state, page header density, content max width, section spacing. |
| Balance card | Single balance hero; multi-balance grid; compact row list; hidden-balance state; refresh/sync row. | Amount typography, secondary balances, refresh icon placement, skeleton shape. |
| Deposit/withdraw form | Method-first split; single-column wizard; two-column desktop form; bottom sticky submit; modal result. | Field spacing, selected method layout, submit alignment, validation placement, loading state. |
| Transaction list | Table; card list; timeline; grouped by date; filter drawer + list. | Row height, amount alignment, status badge placement, filter density, empty/error layout. |
| Bank/KYC/security cards | Status rows; checklist cards; stepper; grouped setting rows; action-right list. | Status prominence, action button width, row separators, error/approved state shape. |

## Feedback, Overlay, And Utility Components

| Component | Feasible layouts | Style decisions |
| --- | --- | --- |
| Modal/dialog | Center modal; side modal; bottom modal; compact confirmation; form modal. | Width, title/action alignment, close placement, footer stickiness, destructive action hierarchy. |
| Drawer | Left navigation drawer; right account drawer; bottom action drawer; nested drawer. | Width/height, overlay opacity policy, header stickiness, nested back controls. |
| Toast | Top stack; bottom stack; near action; mobile safe-area stack; inline toast-like banner. | Width, icon placement, action link, stacked spacing, duration/motion. |
| Tooltip/popover | Hover tooltip; click popover; rich explanation card; edge-aware floating panel. | Max width, arrow/no arrow, padding, text wrapping, focus/hover behavior. |
| Empty state | Illustration-led; compact text-only; action-led card; inline no-data row. | Vertical spacing, CTA placement, icon size, compatibility with dense lists. |
| Loading/skeleton | Page skeleton; row skeleton; card skeleton; spinner; shimmer disabled. | Reserved dimensions, skeleton density, transition into content, no-layout-shift rule. |
| Error/retry | Inline error row; page error block; toast + retry; modal error; form validation list. | Retry placement, error copy length, height reservation, relationship to primary action. |

## Cross-Theme Divergence Ideas

| Theme direction | Layout/style choices that can differ without changing color |
| --- | --- |
| Dense sportsbook | Table-like match rows, compact odds buttons, minimal elevation, small radius, hard dividers, sticky filters. |
| Premium sportsbook | More breathing room, larger match/detail header, raised floating slip, softer dividers, clearer account cards. |
| Mobile-first betting | CTA-led bottom summary, half-sheet snap points, large stake/keypad controls, reduced desktop-only side rails. |
| Data-heavy live betting | Score/time prominence, compact live rows, sticky market nav, trend indicators with reserved space. |
| Promotion-forward | Heavier right rail, more carousel cards, activity modules above lists, account/deposit shortcuts near top. |
| Minimal utility UI | Flat shell, list-first layout, fewer images, restrained cards, quick filters and clear typography hierarchy. |

## Current Scheme Design Fingerprints

These fingerprints bind the abstract variation axes above to the current theme set. Use them to keep styles differentiated when extending comparison reports or tuning component skins.

| Scheme | Shell/navigation | Sports content | Betting card/slip | Account/money | Feedback/overlay |
| --- | --- | --- | --- | --- | --- |
| `gtb` | Legacy utility topbar, small-radius nav blocks, white rails, low shadow. | Flat white cards, compact rows, solid red selected odds, subtle borders. | Simple working ticket, small radius, solid red CTA, minimal decorative depth. | Functional account cards, compact balance rows, red actions. | Standard light popovers with low elevation and direct copy. |
| `betbus` | Dense black shell, compact red active blocks, hard sidebar boundaries. | Charcoal list boards, square cards, visible dividers, warm odds value contrast. | Floating-ticket feel, compact selection cards, dark sheet, no unnecessary elevation. | Dark utilitarian panels with clear deposit/withdraw shortcuts. | Dark overlays, strong contrast, restrained motion. |
| `match` | Dark green command shell, active green rails, medium-radius nav surfaces. | Charcoal cards with subtle hover lift, green odds emphasis, low-noise metadata. | Green selected odds, focused stake flow, rounded dark sheet. | Dark green-accent panels, clean balance hierarchy. | Dark raised surfaces with green focus/active states. |
| `match-light` | Mint light shell, softer active rails, airy navigation. | White/mint card stacks, softer radius, green selected odds, more breathing room. | Rounded light sheet, green CTA, spacious quick-stake chips. | Fresh mint cards, softer empty states, clear green actions. | Light popovers with mint hover/focus treatments. |
| `superbet-light` | Rich white/red shell, pill controls, bolder active navigation. | Stronger module spacing, promo-friendly cards, red gradient selected odds. | CTA-forward slip, pill-like controls, richer empty-slip rhythm. | Promotional wallet shortcuts and rounded modules. | Bright light overlays with red action hierarchy. |
| `superbet-dark` | Premium black/navy shell, red pill actions, elevated dark rails. | Shadowed dark cards, white odds values, red selected gradients. | Dark panel/sheet with red primary action and stronger module separation. | Dark premium panels with clear action rows. | Higher-elevation dark overlays with red focus cues. |
| `betano-light` | Orange identity shell with navy contrast docks. | Crisp ticket-like cards, orange navigation cues, green odds/actions. | Green selected bets, orange brand context, navy bottom dock contrast. | Clean money cards with orange headers and green success/action states. | Light overlays with orange headers and green confirmation actions. |
| `betano-dark` | Deep navy shell, orange active identity, dark layered rails. | Navy cards, orange metadata/nav accents, green odds selections. | Dark rounded sheet, green betting action, orange state context. | Navy account panels with orange actions and green success states. | Dark navy overlays, orange focus cues, green confirmations. |

Minimum divergence rule: before approving a visual pass, confirm each scheme differs from its nearest neighbor on at least two non-color axes such as density, radius, elevation, divider strength, information order, mobile placement, or interaction-state treatment.

## Layout Combination Starters

Use these starters as concrete composition recipes. They intentionally mix module choices, hierarchy, density, and interaction shape without relying on color.

### Sports Home Combinations

| Pattern | Best for | Module arrangement | Key style choices |
| --- | --- | --- | --- |
| Odds-board first | Dense sportsbook, live-heavy products | Header -> sport quick nav -> sticky filters -> league accordion list -> right floating slip. | Table-like match rows, compact odds buttons, hard section rhythm, minimal cards, market-count side action. |
| Card discovery | Broad casual sportsbook | Header -> banner carousel -> sport icon rail -> featured match carousel -> stacked league cards -> right promo rail. | More vertical spacing, individual match cards, visible carousel affordance, larger team hierarchy. |
| Competition-first | League/tournament browsing | Header -> sport topic hero -> country/competition grid -> selected competition list -> futures/live split. | Country headers, accordion competition groups, compact tournament metadata, sticky A-Z/filter row. |
| Promotion-forward sports | Acquisition or campaign periods | Header -> promo strip -> hero/banner -> smart activity cards -> hot matches -> normal match list. | Activity modules above odds list, stronger CTA placement, right rail with repeated promo cards. |
| Utility minimal | Fast repeat bettors | Header -> search/filter row -> match list -> compact right slip, no hero. | Very little imagery, flat list grouping, short headers, high scan density. |

### Match Detail Combinations

| Pattern | Best for | Module arrangement | Key style choices |
| --- | --- | --- | --- |
| Market-first detail | Users who come to bet quickly | Breadcrumb -> compact scoreboard -> sticky market category tabs -> pinned popular markets -> all markets. | Short header, dense market groups, odds grid aligned like table, limited hero height. |
| Event-story detail | Premium match page | Large team header -> stats/weather row -> tabs -> market groups -> chat/analysis side rail. | Spacious scoreboard, metadata strips, section cards, side panel with independent scroll. |
| Live command center | In-play betting | Sticky live scoreboard -> event timeline/stat strip -> live market tabs -> compact live odds board. | Timer and score always visible, market groups dense, trend indicators reserve space, reduced decorative modules. |
| Research-first detail | Analytic-heavy users | Header -> Apuesta/Stats/Lineup/History tabs -> split market + analytics layout. | Two-column desktop, mobile full tabs, sticky tab rail, detail cards with clear section headers. |
| Bet-builder detail | Builder or same-game parlay | Header -> market categories -> builder tray -> compatible market groups -> slip preview. | Builder tray sticky or docked, compatible selections grouped, conflict/locked states visible early. |

### Bet Slip And Betting Card Combinations

| Pattern | Best for | Desktop arrangement | Mobile arrangement | Key style choices |
| --- | --- | --- | --- | --- |
| Floating ticket | Betbus-like flow | Right-bottom floating slip appears after selection; collapses to compact ticket bar. | Bottom summary bar opens half sheet. | Strong panel elevation, no layout occupation when empty, compact selection cards, CTA always near footer. |
| Working side panel | Power desktop bettors | Right fixed panel always available; empty state shown when no selections. | Bottom sheet with full-height snap option. | Stable width, internal scroll, settings/tabs in header, per-selection stake rows. |
| CTA-led mobile | Mobile conversion focus | Desktop can use panel or floating. | Bottom summary bar dominated by primary action; details expand upward. | Summary shows count/combined odds/stake/payout in two lines, CTA fixed width, sheet footer sticky. |
| Per-leg detailed ticket | Complex parlay/futures | Each selection card includes market, match, odds, stake, validation, remove. | Same cards stacked in sheet with compact metadata. | More vertical space, stronger separators, reserved warning area, per-leg input optional. |
| Compact parlay strip | Multi-selection speed | Collapsed parlay row shows count + combined odds + payout; legs hidden behind expand. | Sheet starts collapsed to parlay summary, expands to legs. | Summary-first hierarchy, small per-leg rows, expand/collapse prominent but secondary to CTA. |
| Keypad-first stake flow | Mobile betting with custom keypad | Optional numeric keypad popover or none. | Stake input is read-only; custom keypad occupies bottom above CTA or replaces quick chips. | Large tap targets, stable sheet height, keypad/action separation, done/delete controls fixed. |

### Account And Money Flow Combinations

| Pattern | Best for | Module arrangement | Key style choices |
| --- | --- | --- | --- |
| Wallet-first popover | Sportsbook shell with fast deposits | Avatar -> balance popover -> deposit/withdraw shortcuts -> common functions grid. | Compact popover, amount-first hierarchy, grid actions, route links secondary. |
| Full account workspace | Compliance and settings depth | Account sidebar -> page header -> dashboard cards -> detail forms/lists. | Route-based layout, wider content, stable sidebar active states, card grid for summary. |
| Mobile account hub | Mobile-first account access | Account top card -> wallet actions -> menu cards -> support/security sections. | Large rows, grouped setting cards, sticky optional deposit CTA, reduced nested navigation. |
| Transaction analyst | Heavy history users | Filter toolbar -> summary cards -> transaction table/list -> details drawer. | Strong filter density, amount/status aligned columns, detail drawer instead of page jump. |
| Guided money forms | Deposit/withdraw conversion | Method step -> amount step -> details step -> result modal/page. | Stepper or wizard rhythm, sticky submit, validation below fields, selected method summary. |

## Theme Archetype Recipes

These recipes combine multiple modules into coherent design directions. They can be mixed, but each row is a good starting point for a targeted visual exploration.

| Archetype | Shell/navigation | Sports content | Betting card/slip | Account/money | Interaction style |
| --- | --- | --- | --- | --- | --- |
| Dense pro book | Compact topbar + icon rail | Odds-board first, league accordions, minimal hero | Working side panel, compact parlay strip | Route shell, table-heavy transactions | Subtle hover, little motion, hard alignment. |
| Casual sports discovery | Larger header + sport icon nav | Card discovery, featured carousel, visible promotions | Floating ticket, detailed selection cards | Wallet-first popover | Carousel snap, hover lift, readable card spacing. |
| Mobile conversion | Compact topbar + bottom dock | Sport chips, stacked match cards, sticky filters | CTA-led summary, half sheet, keypad-first flow | Mobile account hub | Bottom-sheet motion, large tap targets, stable sticky actions. |
| Live betting console | Sticky live header + fast filters | Compact live board, timer/score-first rows | Working side panel, odds-change action inline | Minimal wallet shortcuts | Trend pulses, sticky score/tabs, reserved update space. |
| Premium event experience | Spacious header + reduced rails | Event-story detail, large match hero, right analysis/chat | Floating ticket or detailed ticket cards | Full account workspace with summary cards | Softer elevation, slower drawer/sheet motion, clearer section spacing. |
| Promotion-led sportsbook | Promo strip + heavier right rail | Promotion-forward sports, smart activity cards | CTA-led slip, deposit/login secondary actions visible | Wallet-first popover + guided forms | More card modules, sticky promo/account shortcuts. |

## Component Pairing Matrix

Some component choices naturally reinforce each other. Use this matrix to avoid awkward combinations.

| If choosing... | Pair with... | Avoid pairing with... | Reason |
| --- | --- | --- | --- |
| Dense match rows | Compact odds buttons, sticky filters, working side panel | Large hero banners above every list | Keeps scan rhythm tight and prevents first viewport dilution. |
| Individual match cards | Carousel cards, sport icon nav, floating slip | Hard table grid lines everywhere | Cards need spacing and soft grouping to avoid visual contradiction. |
| Floating desktop slip | Right promo rail, compact cart trigger, selection-count badges | Always-visible empty slip panel | Floating slip works best when it does not reserve empty space. |
| Fixed side slip | Dense odds board, table match rows, settings in panel header | Heavy right promo rail | Two right-side utilities compete for width and attention. |
| CTA-led mobile summary | Half sheet, sticky footer, quick stake chips | Deep nested sheet navigation | Summary CTA should open one clear betting task, not a navigation stack. |
| Keypad-first mobile flow | Read-only stake input, stable sheet height, large quick amount alternatives | Native keyboard-dependent input flow | Mixing native and custom keypad behavior creates focus and overlap issues. |
| Large match detail hero | Market category sticky tabs, chat/analysis rail | Dense odds board starting below fold with no shortcuts | Big headers need strong shortcuts back to betting content. |
| Account popover | Wallet shortcuts, quick grid menu, route links | Long multi-step forms inside popover | Popovers should aggregate and route, not host complex flows. |

## Betting Card Permutation Library

Use these as more granular building blocks for bet-card experiments.

### Information Order Options

| Order | Structure | Good for |
| --- | --- | --- |
| Selection -> odds -> market -> match | Strong selection and price first, metadata below. | Fast bettors who recognize markets quickly. |
| Match -> market -> selection -> odds | Event context first, odds as confirmation. | Safer general UX and long parlay review. |
| Market -> selection -> match -> odds | Market category first. | Futures, props, player markets, bet builder. |
| Odds -> selection -> match -> stake | Price-led card. | Odds boost or promo contexts where price is the hook. |
| Warning -> selection -> recovery action | State-led card. | Locked, invalid, odds-change, or unavailable selections. |

### Button Layout Options

| Layout | Structure | Good for |
| --- | --- | --- |
| Full-width primary CTA footer | Payout summary above, CTA below. | Mobile sheet and simple single/parlay submit. |
| Split secondary + primary | Deposit/login or accept-change beside/above submit. | Logged-out, insufficient balance, odds-change states. |
| Inline per-selection action | Remove/accept/change directly inside selection card. | Per-leg state resolution in parlays. |
| Collapsed bar action | Parlay summary row includes expand + CTA nearby. | Multi-selection speed and compact desktop floating slip. |
| Keypad action cluster | Numeric keypad plus Done/Delete and sticky submit. | Mobile custom stake entry. |

### Selection Card Shapes

| Shape | Structure | Good for |
| --- | --- | --- |
| Ticket row | Thin row, small remove, odds aligned right. | Compact parlay leg review. |
| Mini card | Two to four metadata lines, stake below. | Balanced desktop/mobile slip. |
| Detailed card | Full event/market/selection/stake/warning blocks. | Complex bets, risk states, logged-in review. |
| Summary chip | Selection count + combined odds only. | Collapsed parlay or dormant slip. |
| Alert card | Warning header + recovery action + selection info. | Locked/changed/invalid states. |

## Page-Level Permutation Checklist

When exploring a new subject/style, choose one option from each line before designing screenshots:

```txt
Desktop shell:
- topbar only / topbar + sidebar / topbar + icon rail / topbar + right utility rail

Desktop content:
- dense match rows / stacked match cards / carousel + list / competition grid + list

Desktop bet slip:
- absent until selection / right fixed panel / right-bottom floating / side drawer / cart popover

Mobile navigation:
- bottom tabs / bottom dock with center action / hamburger drawer + sport chips / topic tabs

Mobile content:
- stacked cards / compact odds board / featured carousel + cards / live command list

Mobile bet flow:
- summary bar + half sheet / summary CTA + full sheet / keypad-first sheet / collapsed parlay sheet

Account access:
- avatar popover / account drawer / route shell / mobile account hub

Feedback:
- inline banners / toast stack / modal confirmation / per-card alert states
```

## Design Pass Template

Use this template when exploring a new subject/style:

```txt
Theme / subject:
Target reference:
Viewport:
Primary layout direction:
Density:
Typography direction:
Shape/elevation direction:

Components compared:
- Shell/navigation:
- Match list card:
- Odds button/grid:
- Match detail/market card:
- Betting card/slip:
- Mobile summary/sheet:
- Account/money card:
- Feedback/overlay:

Intentional divergence:
Open drift:
Next screenshot/state to capture:
```
