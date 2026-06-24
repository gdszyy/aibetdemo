# Superbet P0 Implementation Breakdown

Date: 2026-06-23
Brand: superbet
Priority: P0
Status: draft; light synthetic; mobile-detail inferred
Source baseline: `docs/superbet-p0-source-audit.md`
Scope: Superbet P0 only, covering `superbet-light` and `superbet-dark`. Do not implement new Match or Betano requirements in this pass. Betano P0 must keep its ticket/table/drawer profile; Superbet must stay promo/pill/CTA-led.

## Goal

Superbet P0 must be implemented as a component profile, not as a color skin. The same structural and interaction choices should apply to `superbet-light` and `superbet-dark`; only visual tokens should vary by mode.

Target Superbet structure:

- Navigation: red-black pill/promo shell with active underline/pill and stronger acquisition actions.
- Match list: promo/card carousel rhythm, not table rows.
- Detail markets: rich dark accordion/grid with category chips, promo market modules, and pill/CTA odds.
- Bet slip desktop: always-visible right rail, empty panel when idle, selected rail when active.
- Bet slip mobile: red compact summary, then full-height sticky-footer bottom sheet.

## TODO Matrix

| Component | Difference point | Landing detail |
| --- | --- | --- |
| Theme component profile | Superbet is a component profile, not a recolor | Add profile fields for `right-rail-panel`, `superbet-metrics`, `32px` odds, pill category tabs, desktop rail dimensions, mobile sheet radius, and summary height. Keep Betano on `bottom-right-drawer` / `ticket-sheet`. |
| Brand UI skin | Superbet visual skin is red/black promo, not Betano blue/orange or Match green board | Tune `superbet-dark` to audited `#c21e1c` selected/CTA, dark gray card surfaces, `5px` odds radius, `32px` short odds. Tune `superbet-light` with the same structure but light surfaces and red CTA/selected states. |
| Slip skin | Desktop/mobile betting surfaces need Superbet rail and CTA-led behavior | Add Superbet slip tokens for `320px` desktop width, dark panel/header/footer, red CTA, red mobile dock, `194px` empty card height, and separate light-mode slip tokens. |
| Desktop navigation | Header should read as Superbet promo shell | Use profile-injected variables for pill nav radius, red active states, red-black topbar, dark sport rail, and red active rail. Avoid adding brand checks to shared nav. |
| Mobile navigation / bottom tab | Mobile selected bet summary must coexist above auth CTA and bottom nav | Keep Superbet on `summary-bar` rather than Betano `cta-drawer`; use the red metrics summary above existing auth/bottom navigation spacing. |
| Sports list match card | Superbet card order differs from board/table rows | For `superbet-promo-card`, render competition metadata and `Criar Aposta` cue first, then time/live state, teams, divider, `32px` odds row, and inline market count. |
| Home hot league card | Promo rail cards need Superbet density | Use `homeRecommend.profile = superbet-promo-rail` to widen/raise cards, preserve bottom odds CTA row, and add top `Criar Aposta` cue without touching Betano ticket-feed branch. |
| Short odds button | Superbet odds are compact CTA pills | Drive height/radius/selected state from tokens: `32px` high, `5px` radius, dark idle background, solid red selected background, white selected text. |
| Match detail hero | Superbet detail header should be compact dark event panel | Add `superbet-promo-card` hero branch with league strip, status row, stacked teams, score pill, dark card background, and profile-provided radius/shadow. |
| Detail category tabs | Superbet category rail is pill-chip based | Use `marketCard.headerTreatment = pill` to render dark bordered chips, active red pill, horizontal scroll, and no Betano table category shell. |
| Market card accordion | Superbet market card is rich dark grid | For `superbet-rich-grid`, use dark card border/background/shadow, pill header variables, `32px` detail odds height, and red selected odds. Leave Betano `table-ticket` branch intact. |
| Desktop empty bet slip | Superbet idle state keeps a visible right rail | Add `SuperbetDesktopEmptyRail` keyed by `desktopIdle = empty-panel`, width `320px`, height `194px`, dark surface, radius `10px`, and empty-coupon copy. |
| Desktop selected bet slip | Superbet selected state is fixed right rail, not drawer | Use `desktopPlacement = right-rail-panel` to position `BetSlipDrawer` as a fixed right rail with full-height panel treatment. Keep Betano on bottom-right drawer. |
| Mobile selected summary | Superbet summary is metrics-led, not action-button-led | Add `mobileSummaryLayout = superbet-metrics`; render count, odds, stake, potential win in a red `60px` bar with `16px` top radius and no extra right CTA button. |
| Mobile bottom sheet | Superbet sheet is CTA-led and near full height | For `mobileFlow = cta-led-sheet`, use near full-height bottom sheet, `16px 16px 0 0` radius, and existing cart content/sticky footer. |
| Betano regression | Superbet logic must not leak | Keep Betano-specific conditions on `betano-ticket-row`, `betano-table-ticket`, `bottom-right-drawer`, and `ticket-cta`; do not reuse Superbet rail/promo branches for Betano. |
| Local visual verification | Current local smoke is blocked by API CORS | Re-run PC/mobile screenshots after proxy/API fixture is available. Current blocker: `xp-service-test1-api.helix.city/v1/menu/sports*` CORS from `127.0.0.1:3000`, leaving the app container empty. |

## 1. Profile Contract

**Files**

- `src/components/theme-provider/component-profile.ts`
- `src/components/theme-provider/brand-ui-skin.ts`
- `src/modules/bet-slip/_utils/slip-skin.ts`

**Work**

- Extend Superbet profile fields from broad labels into specific structural policies:
  - desktop list: `superbet-promo-carousel`/promo card rhythm.
  - mobile list: `superbet-horizontal-promo-card`.
  - live list: scoreboard-led cards.
  - market card: rich accordion with promo module support.
  - desktop slip: right rail empty/selected panel.
  - mobile slip: compact CTA summary plus full-height sticky sheet.
- Keep Betano fields intact:
  - `betano-table-row`.
  - `betano-ticket-card`.
  - `bottom-right-drawer`.
  - `ticket-sheet`.
- Add CSS variable hooks for Superbet dimensions:
  - desktop shell columns: `240px / 808px / 320px`.
  - promo banner radius and height.
  - event card width/height.
  - market/odds heights.
  - mobile summary height and sheet radius.

**Acceptance**

- Components consume profile fields and variables rather than checking raw `scheme === 'superbet'`.
- `superbet-light` and `superbet-dark` share the same structure but receive different token values.

## 2. Navigation And Shell

**Files**

- `src/modules/home/_components/navigation-bar/*`
- `src/modules/match/sidebar/*`
- `src/modules/home/_components/bottom-tab-bar.tsx`

**Source shape**

- PC header: `64px` fixed red-black pill shell.
- Header action order: logo -> sports/live/social/my bets/casino links -> search/account -> register/login.
- PC sports shell: left rail `240px`, main `808px`, right rail `320px`.
- Mobile header: title-led sport header with account/search icons, sport title + chevron.
- Mobile bottom: logged-out CTA row can coexist with bet summary, then bottom tab bar.

**Work**

- Tune Superbet topbar active marker to underline/pill hybrid without affecting Betano orange utility nav.
- Ensure sidebar active row uses a red promo rail/pill style.
- Mobile bottom tab bar should yield visually to the red bet summary when selections exist, but remain visible below logged-out CTA as source does.
- Prefer existing profile attributes:
  - `nav.profile = superbet-pill-promo`.
  - `nav.activeMarker = pill`.
  - `nav.promoWeight = high`.

**Acceptance**

- PC sports list visually reads as Superbet red/black shell with a 240/808/320 working layout.
- Mobile `superbet-*` has title-led header and CTA/bottom-tab rhythm distinct from Betano.

## 3. Match List Cards

**Files**

- `src/modules/match/_components/card.tsx`
- `src/modules/match/_components/list-item.tsx`
- `src/modules/match/_components/odds-columns.tsx`
- `src/modules/match/_components/bet-btn-short-base.tsx`
- `src/modules/match/home/hot-league-match-carousel/match-card.tsx`

**Source shape**

- Football list is not a league table.
- Top order:
  - Page title/tabs.
  - Date/status filters.
  - Red `MULTI CRIAR APOSTA` promo banner.
  - `EVENTOS POPULARES` carousel.
  - Recommendation/promo cards.
- Match card order:
  - Competition metadata.
  - `Criar Aposta` action top right.
  - Time.
  - Teams stacked.
  - Odds row.
  - Market count at far right.
- Desktop card: about `398px x 161px`.
- Mobile card: horizontal carousel card, partial next card visible.
- Odds: `32px` high, compact horizontal name/price; selected solid red.

**Work**

- Keep Superbet list in promo-card mode on both desktop and mobile.
- Add or refine Superbet card layout flags so the card can place:
  - metadata above teams.
  - create-bet CTA in card header.
  - odds row at bottom.
  - market count inline at the right edge.
- Tune odds short button via skin variables:
  - height `32px` for Superbet P0 source fidelity.
  - radius `4-6px` for in-card odds.
  - selected red; hover uses red-tinted lift.
- Do not reuse Betano desktop table row for Superbet.

**Acceptance**

- At `1440px`, Superbet football cards look like promo carousel cards, not Betano rows.
- At `390px`, cards keep a horizontal carousel rhythm with partial next card visible.
- Selected odds is strong red and updates mobile summary.

## 4. Live List Cards

**Files**

- Same match-card/list files as above.

**Source shape**

- `AO VIVO` page has scoreboard-led cards.
- Live hero card order:
  - League.
  - Live period/time green pill.
  - Team names/logos and centered score.
  - Market label.
  - Odds.
  - Chat/social footer.

**Work**

- If current components cannot express full live hero cards, keep implementation scoped to:
  - live badge/timer prominence.
  - score-first metadata order.
  - darker raised card style.
  - odds under market labels.
- Avoid adding P1 recommendation features outside P0 list/detail surfaces.

**Acceptance**

- Live list does not render like a prematch Betano ticket row.
- Mobile live card preserves scoreboard-first order.

## 5. Detail Header, Category Rail, And Market Cards

**Files**

- `src/modules/match/_components/bet-item.tsx`
- `src/modules/match/_components/bet-btn-standard-base.tsx`
- `src/modules/match/detail/*`

**Source shape**

- Detail header:
  - Breadcrumb line.
  - Compact dark match panel.
  - Competition/time/teams.
  - Tabs with active red underline.
- Category rail:
  - Search icon block.
  - Horizontal chips: `Todos`, `Criar Aposta`, `Dicas de Aposta`, `Popular`, etc.
  - Active chip red, idle dark bordered.
- Market cards:
  - Promo module `DICAS DE APOSTAS`.
  - Ordinary accordion rows.
  - Expanded table/grid market with column labels.
  - Header actions: `CA`, info, favorite, collapse.
  - Odds buttons `32px` high in dark grid.

**Work**

- Superbet `marketCard.profile = superbet-rich-grid` should mean:
  - roomy card/accordion spacing.
  - category chips and active red chip.
  - promo module support where existing data/cards allow.
  - odds grid buttons are CTA-like but not Betano green/orange.
- Detail header should use event-story/compact Superbet surface, not Betano's white category rail.
- Keep existing Match dense accordion behavior untouched.

**Acceptance**

- Expanded Superbet market has dark table/grid density and promo action affordances.
- Category rail is chip-based and horizontally scrollable.
- Selected odds state is red and visually stronger than idle odds.

## 6. Desktop Bet Slip

**Files**

- `src/modules/bet-slip/_components/desktop-floating-bet-slip.tsx`
- `src/modules/bet-slip/slip/*`
- `src/modules/bet-slip/cart/*`
- `src/modules/bet-slip/_utils/slip-skin.ts`

**Source shape**

- Empty:
  - Right rail remains visible.
  - Empty card `320px x 194px`, radius `10px`, dark surface.
  - Copy: `O cupom de apostas está vazio.`
- Selected:
  - Fixed right rail panel, not bottom-right drawer.
  - Width `320px`.
  - Header `48px`.
  - Segmented `Único / Sistema`, settings, clear count.
  - Selection card first, promo card second, sticky stake/CTA footer.
  - CTA `Fazer aposta` is red and full width.

**Work**

- Keep Superbet desktop placement as a right rail/empty panel:
  - `desktopPlacement = empty-panel` or a refined `right-rail-panel`.
  - `desktopIdle = empty-panel`.
- Do not switch Superbet to Betano `bottom-right-drawer`.
- Add mobile/desktop slip variables:
  - `--component-slip-desktop-width: 320px`.
  - `--component-slip-empty-height: 194px`.
  - `--component-slip-mobile-summary-height: 60px`.
  - `--component-slip-mobile-sheet-radius: 16px 16px 0 0`.
- Selection information order should be event/time before market/selection in Superbet:
  - desktop source: event -> time -> selection -> market -> odds.
  - mobile source: time -> teams -> selection -> market -> odds.

**Acceptance**

- Desktop empty Superbet shows a branded empty right rail.
- Desktop selected Superbet keeps a fixed right rail with selection, Supermúltipla promo, stake, payout, CTA.
- Betano remains bottom-right drawer and green CTA.

## 7. Mobile Bet Flow

**Files**

- `src/modules/bet-slip/_components/mobile-cart-summary-bar.tsx`
- `src/modules/bet-slip/_components/bet-slip-bottom-sheet.tsx`
- `src/modules/bet-slip/slip/bet-slip-drawer.tsx`
- `src/modules/bet-slip/cart/*`
- `src/modules/home/_components/bottom-tab-bar.tsx`

**Source shape**

- Compact summary:
  - Red `382px x 60px`.
  - Radius `16px 16px 0 0`.
  - Shows count, odds, stake, potential win.
  - Sits above logged-out CTA row.
- Bottom sheet:
  - Full-height modal, `382px x 836px`, y `8`.
  - Header `56px`.
  - Segmented tabs, clear count.
  - Selection card -> Supermúltipla promo -> sticky footer.
  - Footer: stake input, odds, potential prize, full red CTA.

**Work**

- Superbet `mobileFlow = cta-led-sheet` should produce a CTA-led summary, not Betano ticket sheet.
- Summary content should emphasize next betting action:
  - count.
  - odds.
  - stake.
  - potential payout.
- Sheet should reserve bottom sticky summary/CTA area.
- When logged out, keep login/register row visible under the red summary where current shell supports it.

**Acceptance**

- At `390px`, selected Superbet shows a red summary bar with payout/stake information.
- Opening the sheet exposes selection card and sticky CTA without colliding with bottom nav.

## 8. Superbet Light And Dark

**Work**

- `superbet-dark` should match audited source closely.
- `superbet-light` should keep the same component layout and interaction:
  - Same card order.
  - Same mobile summary/sheet behavior.
  - Same right rail placement.
  - Light surfaces/tokens only.
- Light mode should not become Betano-like simply because surfaces are light. Keep red CTA, pill controls, promo density, and right rail structure.

**Acceptance**

- `superbet-light` differs from Betano light by:
  - promo-card match list.
  - red selected odds/CTA.
  - desktop right rail selected slip.
  - CTA-led mobile summary.
- `superbet-dark` differs from Match dark by:
  - red/promo shell.
  - event-card carousel.
  - richer market categories.
  - Supermúltipla/empty panel slip rhythm.

## Verification

Commands:

- `pnpm lint:ts`
- `pnpm lint`

Current run, 2026-06-23:

- `pnpm lint:ts`: passed.
- `pnpm lint`: passed.
- Local browser smoke was attempted against `http://127.0.0.1:3000/pt/sports?scheme=superbet-dark`.
- The local page returned HTML, but the browser app container stayed empty because client requests to `https://xp-service-test1-api.helix.city/v1/menu/sports/top` and `https://xp-service-test1-api.helix.city/v1/menu/sports` were blocked by CORS from `http://127.0.0.1:3000`.
- Because of that runtime data/API blocker, local PC/mobile visual verification still needs a working proxy, allowed API origin, or local fixtures. The real Superbet source screenshots above remain the visual reference for this implementation pass.

Screens to verify locally:

- PC 1440px:
  - sports list.
  - live list if available.
  - match detail with market group.
  - empty slip.
  - selected slip.
- Mobile 390px:
  - sports list.
  - selected bet summary.
  - opened bottom sheet.
  - match detail if local route supports it.

Regression:

- Betano P0:
  - Desktop ticket/table row remains table-like.
  - Betano selected desktop remains bottom-right drawer.
  - Betano mobile remains ticket CTA/drawer.
  - No Superbet red promo/right-rail assumptions leak into Betano paths.

## Open Items

- Real mobile match detail could not be fully loaded in automation. Local implementation should infer from desktop detail and verified mobile list/sheet, then be manually checked if a real mobile session becomes available.
- Real Superbet anonymous site did not expose a light/dark switch. `superbet-light` is a local theme using the same source structure with light tokens.
