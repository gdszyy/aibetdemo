# Betano P0 Implementation Breakdown

Date: 2026-06-23
Brand: betano
Priority: P0
Status: draft; dark pending
Source baseline: `docs/betano-p0-source-audit.md`
Scope: Betano light/dark P0 only. The source audit verified Betano light/default on real PC and mobile pages. Betano dark still needs direct source validation before final token tuning.

## Goal

Betano P0 must be implemented as a brand-specific component profile, not as a shared layout with orange/green tokens.

The implementation must cover:

- PC and mobile sports navigation.
- PC and mobile match list cards.
- Match detail hero, category nav, and market cards.
- PC idle right rail, PC selected bet slip drawer.
- Mobile selected bet CTA/drawer flow.

## 1. Profile Contract

**Files**

- `src/components/theme-provider/component-profile.ts`
- `src/components/theme-provider/brand-ui-skin.ts`
- `src/modules/bet-slip/_utils/slip-skin.ts`

**Work**

- Extend the Betano profile from broad labels into concrete layout flags.
- Separate desktop and mobile match-card layout policy.
- Add explicit Betano bet-slip placement policy:
  - desktop idle right rail
  - desktop selected `bottom-right-drawer`
  - mobile selected bottom CTA/drawer
- Keep visual tokens in skin files and structural decisions in profile.

**Acceptance**

- `betano-light` and `betano-dark` can select Betano-specific P0 behavior without branching on raw scheme names inside every component.
- Match, Superbet, and Betano can share primitive components while choosing different layout variants.

## 2. Navigation And Shell

**Files**

- `src/modules/home/_components/navigation-bar/index.tsx`
- `src/modules/home/_components/navigation-bar/desktop-menu.tsx`
- `src/components/sidebar/sidebar-shell.tsx`
- `src/components/sidebar/sidebar-item.tsx`
- `src/modules/match/sidebar/sidebar.tsx`
- `src/modules/home/_components/bottom-tab-bar.tsx`
- `src/app/[locale]/(main)/(sports)/sports-layout-client.tsx`

**Source shape**

- PC header: `64px` orange utility header.
- PC sports shell: left rail about `200px`, main about `920px`, right rail about `320px` on `1440px` viewport.
- Mobile header: `56px` orange header.
- Mobile sports nav: horizontal sport icon scroller below header.
- Mobile bottom nav: fixed `56px` white/off-white nav.

**Work**

- Tune Betano topbar height, logo/nav density, login/register hierarchy.
- Make Betano desktop sports left rail width and surface closer to source.
- Add or adapt a mobile sports icon scroller for Betano sports pages.
- Keep mobile bottom nav visible only when no selected-bet CTA drawer is occupying the same bottom space.
- Avoid promo-heavy desktop top strip for Betano P0 unless source-equivalent content exists.

**Acceptance**

- PC sports page visually reads as header + left sports rail + main list + right utility rail, not a centered generic app shell.
- Mobile sports page has header, sport scroller, content, and bottom nav in the same order as source.
- Betano green is reserved for betting action/login CTA; orange owns navigation and selected odds.

## 3. Match List Cards

**Files**

- `src/modules/match/_components/list-item.tsx`
- `src/modules/match/_components/card.tsx`
- `src/modules/match/_components/odds-columns.tsx`
- `src/modules/match/_components/bet-btn-short-base.tsx`
- `src/modules/match/_components/market-count-action.tsx`
- `src/modules/match/_components/tournament-group-header.tsx`

**Source shape**

- PC match list rows are table-like, about `904px x 74px`.
- PC row order: time/status column, team link column, odds columns, actions.
- Mobile match cards are standalone cards, about `374px x 130px`.
- Mobile order: top metadata/actions, middle teams, bottom three odds.
- Odds buttons are `36px` high, `8px` radius, light surface + border; selected is orange with white text.

**Work**

- Split Betano match list rendering into:
  - `desktop-table-row`
  - `mobile-ticket-card`
- Current `betano-ticket-row` branch in `card.tsx` should stop using the same vertical structure on desktop.
- Desktop Betano should use horizontal row layout and keep first/main market odds aligned in columns.
- Mobile Betano should keep the vertical standalone card, with stable `130px`-ish height and bottom odds row.
- Odds button layout for Betano list should be name + price horizontal on PC and equal-width three-column on mobile.
- League headers should become low-weight transparent row headers, not heavy cards.

**Acceptance**

- At `1440px` desktop, a Betano match row does not look like the mobile card stretched wide.
- At `390px` mobile, a Betano match card keeps its top/meta, team, odds row rhythm without text overlap.
- Selected odds uses orange, not green; betting submit CTA remains green.

## 4. Detail Hero, Category Nav, And Market Cards

**Files**

- `src/modules/match/detail/layout.tsx`
- `src/modules/match/detail/match-score-summary.tsx`
- `src/modules/match/detail/desktop-match-card.tsx`
- `src/modules/match/detail/filters.tsx`
- `src/modules/match/detail/chips.tsx`
- `src/modules/match/detail/match-detail-top-tabs.tsx`
- `src/modules/match/_components/bet-item.tsx`
- `src/modules/match/_components/bet-btn-standard-base.tsx`

**Source shape**

- Detail hero is about `904px x 130px` on PC and `390px x 134px` on mobile.
- Category nav is a white `48px` surface, `12px` radius.
- Active category is dark navy, `16px` radius, `32px` high.
- `Criar Aposta` is a separate action/toggle on the right of the category rail.
- Market cards are white, bordered, `12px` radius.
- 1X2 SuperOdds market is about `94px` high with three `36px` odds buttons.
- Ordinary `Resultado Final` may be taller due insight/explainer text.

**Work**

- Add Betano detail hero treatment instead of current green summary card.
- Replace Betbus-style detail tab labels/treatment with Betano category pill rail when profile is Betano.
- Add a separate Betano `Criar Aposta` entry beside the category rail where supported by existing data.
- Change Betano market card header:
  - no orange left stripe as the primary signature
  - compact title row with optional badges
  - action icons on the right
- Tune detail odds buttons to `36px` height for Betano, with white/light surface and orange selected state.
- Keep market card grid responsive: 3 columns for 1X2, existing card_type behavior for other markets.

**Acceptance**

- Detail hero no longer uses the generic green sportsbook style under Betano.
- The category rail reads as Betano white surface + navy active pill.
- First popular market and normal market have visibly different content heights when data provides helper text/badges.

## 5. Desktop Right Rail And Selected Bet Slip

**Files**

- `src/app/[locale]/(main)/(sports)/sports-layout-client.tsx`
- `src/modules/bet-slip/_components/desktop-floating-bet-slip.tsx`
- `src/modules/bet-slip/slip/bet-slip-drawer.tsx`
- `src/modules/bet-slip/slip/slip-tabs.tsx`
- `src/modules/bet-slip/cart/cart.tsx`
- `src/modules/bet-slip/cart/single.tsx`
- `src/modules/bet-slip/cart/parlay.tsx`
- `src/modules/bet-slip/cart/single-stake-card.tsx`
- `src/modules/bet-slip/cart/stake-card.tsx`
- `src/modules/bet-slip/cart/stake-input.tsx`
- `src/modules/bet-slip/cart/quick-stake-button.tsx`
- `src/modules/bet-slip/cart/_components/place-bet-button.tsx`

**Source shape**

- Idle PC right rail is `MINHAS APOSTAS` plus offers/widgets, not a coupon.
- Selected PC coupon is fixed bottom-right, `380px` wide, top radius `32px`.
- Selected coupon header: title, count, save/share actions.
- Bet type selector is a `32px` pill segmented control.
- Selection card is white, bordered, `12px` radius.
- Stake area has quick buttons `+10`, `+50`, `+200`, `MAX`.
- Submit CTA is green, `40px` high, `8px` radius.

**Work**

- Add a Betano desktop right rail component for idle state.
- Keep selected-state `DesktopFloatingBetSlip`, but align placement and top radius to source.
- Add Betano-specific slip header/action layout if current tabs cannot match source.
- Add Betano segmented control treatment for single/multiple/system.
- Tune selection card order to outcome, odds, market, match.
- Ensure CTA green is visually dominant and not confused with orange selected odds.

**Acceptance**

- With zero selections on desktop Betano, right side does not disappear into generic empty space.
- With one selection, the drawer appears bottom-right and does not occupy the full right rail from top to bottom.
- Single/parlay tabs, stake input, quick stakes, and CTA are all visible without scrolling at common desktop heights.

## 6. Mobile Selected Bet Flow

**Files**

- `src/modules/bet-slip/_components/mobile-cart-summary-bar.tsx`
- `src/modules/bet-slip/_components/bet-slip-bottom-sheet.tsx`
- `src/modules/bet-slip/slip/bet-slip-drawer.tsx`
- `src/modules/bet-slip/cart/cart.tsx`
- `src/modules/bet-slip/cart/single-footer.tsx`
- `src/modules/bet-slip/cart/parlay-footer.tsx`
- `src/modules/home/_components/bottom-tab-bar.tsx`

**Source shape**

- Selected mobile state uses bottom fixed CTA/drawer, occupying the bottom nav area.
- Footer is `390px x 56px`.
- CTA is `374px x 40px`, green, `8px` radius.
- Stake controls and selection card sit above the CTA.

**Work**

- For Betano, replace the generic summary dock with a CTA-first bottom bar.
- When Betano selection count > 0, bottom nav should yield to the bet CTA/drawer.
- Bottom sheet content should prioritize:
  - selection summary
  - stake input
  - quick stakes
  - green submit CTA
- Keep keyboard/safe-area behavior stable.

**Acceptance**

- At `390px` mobile, selected bet CTA does not collide with bottom navigation.
- The CTA is immediately tappable and matches Betano green action behavior.
- Opening the sheet keeps stake input and submit action reachable.

## Execution Order

1. Lock Betano profile contract and tokens.
2. Implement PC/mobile match list layout split.
3. Implement detail hero/category/market-card treatment.
4. Implement desktop idle rail and selected drawer placement.
5. Implement mobile selected CTA/drawer flow.
6. Run visual checks for `1440px` desktop and `390px` mobile.
7. Validate Betano dark source appearance, then tune dark tokens.

## Verification

- `pnpm lint:ts`
- `pnpm lint`
- Desktop sports list screenshot at `1440px`.
- Desktop match detail screenshot at `1440px`.
- Desktop selected bet slip screenshot at `1440px`.
- Mobile sports list screenshot at `390px`.
- Mobile match detail screenshot at `390px`.
- Mobile selected bet flow screenshot at `390px`.

## Open Items

- Betano dark source still requires direct validation.
- Source screenshots were limited by security/age-gate behavior; current source facts come from real page DOM/computed style inspection.
- Existing repo has partial profile wiring from previous work. Implementation should refine that wiring rather than duplicate another theme layer.
