# Theme Component Profile Plan

> Scope: only `match`, `match-light`, `superbet-dark`, `superbet-light`, `betano-dark`, and `betano-light`.
> Goal: make each theme differ by component information layout and interaction behavior, not only by palette, radius, or shadow.

## Principle

A theme is a component profile:

- visual skin: color, surface, border, radius, shadow, typography emphasis
- information layout: order, density, grouping, metadata placement, action hierarchy
- interaction policy: hover/selected/locked feedback, collapse behavior, mobile sheet flow, CTA placement

Token and skin files should keep owning visual values. Component profile files should own structural choices and state behavior.

## P0 Profile Matrix

| Brand | Navigation | Match card | Market card | Bet slip | Mobile bet flow |
| --- | --- | --- | --- | --- | --- |
| `match` | Command-center nav. Compact shell, clear active rail/block, low promo weight, betting content first. | Board-style match card. League/time first, teams and live score in a compact block, odds remain the main action. | Dense accordion. Short headers, compact grids, stronger market grouping, fewer decorative elements. | Working panel. Stable selection review, odds/stake/payout visible, restrained secondary actions. | Compact sheet. Summary opens a direct stake task; keep CTA and stake controls stable. |
| `superbet` | Pill-promo nav. Rounded active tabs, stronger promo/account entries, more top-level acquisition energy. | Promo-card match card. More card depth, visible sport/live badges, match story above odds, selected odds as strong red CTA. | Rich grid. Roomier market groups, clearer popular markets, pill-like odds buttons, richer empty rhythm. | Empty-panel / ticket panel. Empty state is visible and branded; selected state has stronger CTA and module separation. | CTA-led sheet. Summary bar emphasizes the next action; sheet uses a sticky footer and clearer expand/collapse affordance. |
| `betano` | Orange utility nav. Orange identifies navigation; green is reserved for betting action; right tools stay explicit. | Ticket-row match card. Crisp table/ticket grouping, time/competition and market count visible, green odds value/action. | Table-ticket market card. Strong column alignment, label rows, compact controls, orange context accents. | My-bets panel. Right rail feels like a betting utility area; stake/return/CTA are crisp and green. | Ticket sheet. Sheet layering is navy/orange context with green confirmation; safe-area and right-tool rhythm matter. |

## P0 Components To Wire

| Component family | Primary files | Profile responsibilities |
| --- | --- | --- |
| Navigation | `src/modules/home/_components/navigation-bar/*`, `src/modules/match/sidebar/*`, `src/modules/home/_components/bottom-tab-bar.tsx` | `nav.profile`, active marker style, promo strip policy, account/promo action weight, mobile drawer treatment. |
| Match cards | `src/modules/match/_components/card.tsx`, `src/modules/match/home/hot-league-match-carousel/match-card.tsx`, `src/modules/home/_components/top-live-matches/index.tsx` | `matchCard.profile`, information order, stacked/table/ticket layout, odds row placement, market count position, hover/selected rhythm. |
| Market cards | `src/modules/match/_components/bet-item.tsx`, `src/modules/match/_components/bet-btn-standard-base.tsx`, `src/modules/match/_components/bet-btn-short-base.tsx` | `marketCard.profile`, header density, accordion controls, column label treatment, odds button layout policy. |
| Bet slip | `src/modules/bet-slip/_components/*`, `src/modules/bet-slip/slip/*`, `src/modules/bet-slip/cart/*`, `src/modules/bet-slip/_utils/slip-skin.ts` | `betSlip.profile`, desktop placement, empty/selected/parlay information order, quick stake behavior, CTA hierarchy, mobile sheet behavior. |

## P1 Profile Matrix

| Brand | Home recommend cards | Smart activity cards |
| --- | --- | --- |
| `match` | Market-board rail. Compact card width, market-stack selections, inline expand behavior, odds CTA remains workmanlike and low decoration. | Compact grid. Dense activity tiles, restrained hover, board-like quick-bet and follow-bet modules. |
| `superbet` | Promo rail. Wider cards, event-first story, stronger CTA sheet behavior, promotional lift on hover. | Promo mosaic. Larger featured rhythm, more generous gaps, richer promotion/follow-bet presentation. |
| `betano` | Ticket feed. Ticket-like rows, selection lines read as betting slips, mobile expansion follows ticket-sheet flow. | Ticket hub. Balanced two/three-column layout, utility-focused quick bet, crisp focus states without promo lift. |

## P1 Components To Wire

| Component family | Primary files | Profile responsibilities |
| --- | --- | --- |
| Recommend cards | `src/modules/home/_components/super-odds/*`, `src/modules/home/_components/super-odds/recommend-card/*` | `homeRecommend.profile`, rail density, card width, selection row layout, CTA shape, mobile sheet behavior. |
| Smart activity cards | `src/modules/home/_components/smart-activity-cards/*` | `activityCards.profile`, grid/mosaic/ticket-hub layout, card density, hover/focus behavior, quick-bet CTA flow. |

## Priority States

The first implementation pass should cover:

- desktop sports list populated
- match detail with market groups
- desktop bet slip empty, single, and parlay
- mobile summary bar and bottom sheet
- locked/invalid odds and odds-change feedback

## Acceptance Rule

For each brand, every P0 component must differ from the nearest neighbor on at least two non-color axes:

- information order
- density
- shape/radius
- divider strength
- elevation
- active/selected state behavior
- mobile placement
- collapse/expand behavior

If a component intentionally shares a structure across brands, record the product reason in `docs/theme-reference-drift-audit.md`.
