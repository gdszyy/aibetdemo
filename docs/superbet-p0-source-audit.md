# Superbet P0 Source Audit

Date: 2026-06-24
Brand: superbet
Priority: P0
Status: dark source-validated; live-list & social modules desktop source-validated (2026-06-24); light/mobile-detail inferred

Sources:
- `https://superbet.bet.br/apostas/futebol`
- `https://superbet.bet.br/apostas/ao-vivo`
- `https://superbet.bet.br/apostas/futebol/ao-vivo`
- `https://superbet.bet.br/odds/futebol/portugal-x-uzbequistao-11499957`
- `https://superbet.bet.br/odds/futebol/shaanxi-chang-atl-f-x-liaoning-shenbei-hefeng-f-13527224`
- `https://supersocial.com.br/`

Artifacts:
- `.codex-artifacts/superbet-p0/desktop-football-list.png`
- `.codex-artifacts/superbet-p0/desktop-live-list.png`
- `.codex-artifacts/superbet-p0/desktop-match-detail.png`
- `.codex-artifacts/superbet-p0/desktop-detail-market-expanded.png`
- `.codex-artifacts/superbet-p0/desktop-selected-slip-stable.png`
- `.codex-artifacts/superbet-p0/mobile-resized-football-list.png`
- `.codex-artifacts/superbet-p0/mobile-resized-live-list.png`
- `.codex-artifacts/superbet-p0/mobile-selected-list.png`
- `.codex-artifacts/superbet-p0/mobile-bottom-sheet-wait.png`
- Mobile direct-load limitation captures:
  - `.codex-artifacts/superbet-p0/mobile-football-wait.png`
  - `.codex-artifacts/superbet-p0/playwright-mobile-football-list.png`
  - `.codex-artifacts/superbet-p0/mobile-resized-match-detail.png`

## Coverage & Limits

- The anonymous Superbet site rendered in the default dark appearance. I did not find an anonymous light/dark appearance toggle in the inspected header, bet slip, or account/login surfaces.
- `superbet-dark` can be treated as directly validated against the real source default. `superbet-light` should reuse the same component structure and interaction profile, with light tokens adapted locally.
- Mobile first-load automation at `390px` repeatedly stopped on Superbet's own loading shell in both the in-app browser and system Chrome mobile emulation. To inspect mobile content, I loaded the page successfully at desktop width and then resized the already-hydrated SPA to `390px x 844px`. This produced real responsive mobile DOM for list, live list, selected summary, and bottom sheet.
- Mobile match-detail direct navigation and match-card click navigation fell back to the loading shell in automation. Mobile detail implementation should therefore infer structure from desktop detail plus the verified mobile list/sheet patterns, and should be rechecked manually if a real device/browser session is available.
- A `2026-06-24` desktop pass (Brazil egress) directly validated the live-list featured modules: the `MELHORES PARTIDAS AO VIVO` top-live card carries exactly three stacked markets plus a chat footer, and the `APOSTAS POPULARES - AO VIVO` card is social proof that opens the match rather than copying the bet.
- `Supersocial` is a separate product on its own domain (`https://supersocial.com.br/`); its content sits behind a cookie wall and a likely login, so its internal copy/follow UX was not captured and needs a logged-in manual pass.

## PC — Shell & Header

- Viewport inspected: `1440px x 900px`.
- App shell starts below a fixed header:
  - Header rect: `1432px x 64px`, y `16`.
  - Main shell grid: `240px 808px 320px`, gap `16px`, padding `16px 16px 0`.
  - Left sport rail width: `240px`.
  - Main content width: `808px`.
  - Right bet slip rail width: `320px`.
- Header is a red-black elevated pill-like bar:
  - Background visually reads as dark red/black gradient.
  - Active top nav has a red underline bar, not a square block.
  - Header controls are circular or pill:
    - Search/account icons: `32px x 32px`, radius `1000px`.
    - `Registre-se`: `112px x 32px`, translucent white bg `rgba(255,255,255,0.16)`, radius `1000px`.
    - `Entrar`: `74px x 32px`, red `rgb(194, 30, 28)`, radius `1000px`.
- Top navigation order:
  - Logo, `Esportes`, `Ao Vivo + count`, `Supersocial`, `Apostas + count`, divider, `Cassino`, `Cassino Ao Vivo`, search, account, register/login.
  - `Supersocial` is not an in-app route: clicking it opens Superbet's standalone social-betting product on a separate domain (`https://supersocial.com.br/`).

## PC — Navigation & Sidebar

- Left sidebar is dark and sport-first.
- Row size: each sport item is about `232px x 40px`.
- Active sport (`Futebol` or `Todos` on live page):
  - Red translucent/gradient rail-like row.
  - Circular sport icon at the left.
- Live page sidebar differs from prematch football:
  - Starts with `Todos`, then sports with current live count context.
  - Still uses the same `40px` dense rows and active red treatment.

## PC — Match List

- Page header:
  - Header block: `808px x 106px`.
  - Title row text: `APOSTAS FUTEBOL`, large condensed uppercase.
  - Secondary tabs: `Social`, `Calendário`, `Competições`, `Virtuais`.
  - Active tab has a short red underline.
- Date filter:
  - Horizontal chip rail below title.
  - Dark chip surfaces, compact height around `56px` container.
- Status filter:
  - Buttons are `32px` high, radius `6px`.
  - Idle bg `rgb(24, 26, 27)`, border `rgba(255,255,255,0.08)`.
  - Active `Próximo` bg `rgb(194, 30, 28)`, white text.
- Promo banner:
  - `MULTI CRIAR APOSTA` card is `808px x 132px` on desktop.
  - Gradient red surface, radius `10px`.
  - Information order: title -> short copy -> event/competition count -> `Criar` CTA at right.
- Popular match cards:
  - Rendered as carousel cards, not table rows.
  - First card: about `398px x 161px`.
  - Order:
    - Competition line: sport/country/competition.
    - `Criar Aposta` action at top right.
    - Time (`Amanhã, 01:00`).
    - Team names stacked.
    - Odds row at bottom.
    - Market count (`+359`) at the far right.
- List odds buttons:
  - `108px x 32px`, radius `4px`.
  - Inner/default surface is dark gray (`rgb(39, 42, 44)` through wrapper/inner).
  - Name and price are horizontal (`1 1.17`, `X 7.30`, `2 19.00`).
  - Selected state turns solid red `rgb(194, 30, 28)` with white text.

## PC — Live List

- All-sports live entry URL: `https://superbet.bet.br/apostas/ao-vivo` (header `APOSTAS AO VIVO`). Football-filtered live entry URL: `https://superbet.bet.br/apostas/futebol/ao-vivo` (header `FUTEBOL AO VIVO`).
- Top filters: `Todos` active red chip, `Video` dark chip, `Por competição` dropdown chip.
- The featured module above the ordinary rows differs by page: the all-sports live page leads with the `MELHORES PARTIDAS AO VIVO` top-live carousel; the football live page leads with the `APOSTAS POPULARES - AO VIVO` carousel.

### Top Live Carousel (MELHORES PARTIDAS AO VIVO)

- This is the `toplive` component. Cards render in a horizontal carousel above the ordinary list, larger than prematch cards and scoreboard-led.
- A circular sport-icon selector row sits directly under the `MELHORES PARTIDAS AO VIVO` title and filters the carousel by sport; the three markets adapt per sport.
- Card structure, top to bottom:
  - League line with sport icon (`WTA • Bad Homburg (ALE)`).
  - Live status pill, green (tennis `S • [video]`, football `1º Tempo • 26'`); `Interrompido` when paused.
  - Scoreboard: participant photos/icons, names, centered score (`0 - 0`).
  - Exactly three stacked market blocks, each with its own label and a 2-column odds grid:
    - Tennis example: `Vencedor da Partida` (`Casa` `2.95` / `Visitante` `1.40`), then `X° Set - Vencedor` (`2.55` / `1.53`), then `1° Set - Total de Games` (`MAIS` `2.10` / `MENOS` `1.72`).
    - Football equivalent fills the same three slots with match-result/goals markets.
  - Some market blocks carry an inline `− value +` stepper to change the set number or the total line in place.
  - Chat/social footer: bettor avatars + `As pessoas estão conversando` + `Entre no chat` button.

### Popular Bets (APOSTAS POPULARES - AO VIVO)

- Carousel of other users' live bets shown as social proof. This is Superbet's closest in-product analogue to copy/follow betting (跟单), but it is discovery/social proof, not a one-click copy.
- Card structure, top to bottom:
  - League line with sport icon (`Super League (F)`).
  - Bettor identity: avatar + masked username (`I********`) and their stake (`Aposta R$ 2.000,00`).
  - Popularity row: stacked bettor avatars + `147+ apostaram nisto`.
  - Match block: period tag (`INT`), live time (`45'`), team names, score.
  - The bettor's selection in bold (`Resultado Final - 2`).
  - Full-width odds button for that selection (`1.50`) with a green movement corner.
- Clicking a card navigates to that match's odds page; it does not copy the bet into the slip, and there is no replicate/`seguir` control on the card. True social/copy features live in the separate `Supersocial` product (see Shell & Header and Coverage & Limits).

### Ordinary Live List

- Score-first rows below the featured module:
  - Match metadata line and league header.
  - Live period/time (`90+3'`), with a red live video icon when streamed.
  - Team names and score columns.
  - `Criar Aposta` action.
  - Single market row (`Resultado Final`, `1` / `X` / `2`) and a `+N` market count.

## PC — Match Detail & Markets

- Detail header:
  - Main detail header is `808px x 212px` after scrolling into markets.
  - Background starts as dark red-to-black gradient.
  - Breadcrumb line: `Futebol / Internacional / Copa Do Mundo / Portugal - Uzbequistão`.
  - Match panel is dark, low height, radius around `10px`.
  - Match info order:
    - Competition pill row.
    - Time (`Amanhã, 01:00`).
    - Teams stacked (`Portugal`, `Uzbequistão`).
- Detail tabs:
  - `Chat`, `Odds`, `Dados`, `H2H`, `Escalações`, `Tabela`, `Notícias`.
  - Active `Odds` uses red underline.
- Market category rail:
  - Search icon block at left.
  - Chips are `32px` high, radius `6px`.
  - Active `Todos`: red `rgb(194, 30, 28)`.
  - Idle chips: `rgb(24, 26, 27)`, border `rgba(255,255,255,0.08)`.
  - `Criar Aposta` is a normal category chip, not a separate Betano-style utility toggle.
- Market card behavior:
  - Promo `DICAS DE APOSTAS` appears as a large card with title, multiple recommendation lines, total odds, and `APOSTAR` CTA.
  - Ordinary markets default to collapsed dark accordion rows.
  - Expanded `Total de Gols` card:
    - Header row: market title left, `CA`, info, favorite, collapse controls right.
    - Table header: `GOLS`, `MAIS`, `MENOS`.
    - Rows such as `0.5`, `1.5`, `2.5`.
    - Odds buttons in the expanded grid are about `256px x 32px` on desktop.
    - Inner odds surface is `rgb(39, 42, 44)`, radius `4px`.
    - Selected odds is solid red `rgb(194, 30, 28)`.

## PC — Bet Slip

### Empty

- Right rail empty state:
  - Container width: `320px`.
  - Empty card: `320px x 194px`, y `104`.
  - Surface: `rgb(24, 26, 27)`, radius `10px`.
  - Copy: `O cupom de apostas está vazio.`
  - Illustration above copy.
- This is an always-visible empty panel, not Betano's `Minhas Apostas` utility rail.

### Selected

- After selecting a real odds button, desktop slip becomes a fixed right rail panel:
  - `sds-betslip-desktop`: `320px x 762px`.
  - Surface: `rgb(43, 47, 49)`.
  - Header: `320px x 48px`, bg `rgb(24, 26, 27)`.
  - Header order: segmented control (`Único`, `Sistema`) -> settings icon -> clear/trash count pill.
  - Segmented control: `121px x 24px` desktop, pill radius.
- Selection area:
  - Body: `320px x 682px`.
  - Selection wrapper: `304px` wide.
  - Selection card: compact dark card.
  - Information order:
    - Event (`Portugal - Uzbequistão`).
    - Time (`Amanhã, 01:00`).
    - Selection (`Mais de 2.5` or `1`).
    - Market (`Total de Gols` / `Resultado Final`).
    - Odds value right aligned.
- Promo module:
  - `SUPERMÚLTIPLA` card between selection and stake summary.
  - Message describes adding more selections for boost.
- Footer/stake area:
  - Sticky bottom summary.
  - Stake input left (`APOSTA 20 R$`).
  - Odds value right.
  - Potential prize row.
  - Full-width red CTA `Fazer aposta`.

## Mobile — Match List

Method: page was loaded at desktop width, then resized to `390px x 844px` after hydration.

- Header:
  - Top section `84px` high.
  - Left account icon, right search icon.
  - Sport title row: `FUTEBOL` with chevron.
  - Header background is red-to-black gradient.
- Secondary tabs:
  - `Social`, `Calendário`, `Competições`, `Virtuais`.
  - Active `Calendário` uses red underline.
- Date and status filters:
  - Horizontal scroll chips.
  - Status chips (`Resultado`, `Ao vivo`, `Próximo`, `+1h`) are `32px` high.
- Main content:
  - `APOSTAS FUTEBOL` title.
  - `MULTI CRIAR APOSTA` red promo banner:
    - `358px x 132px`.
    - Radius `10px`.
  - `EVENTOS POPULARES` carousel:
    - Event card visible width about `272px`; next card peeks from the right.
    - Card order matches desktop: competition -> create-bet CTA -> time -> teams -> odds row.
  - Odds buttons are compact, horizontal `name + price`, selected red.
- Bottom:
  - Logged-out CTA row: `Registre-se` gray pill and `Entrar` red pill.
  - Fixed bottom nav: `Home`, `Ao Vivo`, `Esporte`, `Apostas`, `Cassino`.
  - Bottom nav height: about `58px`, bg `rgb(7, 7, 8)`.

## Mobile — Live List

Method: loaded desktop first, then resized to `390px x 844px`.

- Header title: `AO VIVO`.
- Sport chip row under title: `Todos`, `Futebol`, `Tênis`, `E-Sport Futebol`, etc.
- Filter row:
  - `Todos`, `Video`, `Por competição`.
- Main live card (mobile `MELHORES PARTIDAS AO VIVO` / top-live card):
  - Full-width carousel card with a partial next card visible.
  - Scoreboard-first:
    - League line.
    - Live timer green pill.
    - Team icons and score centered.
  - Mirrors desktop: exactly three stacked market blocks below the scoreboard, each with its own label and odds grid (`Total de Gols`, `1º Tempo - Total de Gols`, etc.), some with plus/minus line controls.
  - Chat/social footer as on desktop.

## Mobile — Bet Flow

### Compact Summary

- After selecting a list odds, the selected odds becomes solid red.
- A compact bottom bet slip appears above the logged-out CTA row:
  - Width: `382px`.
  - Height: `60px`.
  - Y position in `390 x 844` viewport: `669`.
  - Background: red `rgb(194, 30, 28)`.
  - Radius: `16px 16px 0 0`.
  - Shadow: upward shadow.
  - Information order:
    - Selection count icon/badge.
    - `ODDS 1.17`.
    - `APOSTA R$ 20,00`.
    - `GANHO POTENCIAL R$ 23,40`.
- The logged-out CTA row remains below the red summary, and bottom nav remains below that.

### Bottom Sheet

- Opening the compact summary produces a modal overlay:
  - Overlay: `rgba(0, 0, 0, 0.48)`.
  - Sheet: `382px x 836px`, y `8`.
  - Radius: `16px 16px 0 0`.
  - Shadow: upward modal shadow.
- Header:
  - `56px` high.
  - Close/down button left.
  - Segmented `Único / Sistema` control, `150px x 32px`.
  - Clear/trash count pill right.
- Content:
  - Body bg `rgb(7, 7, 8)`.
  - Selection card: `358px x 172px`, radius `10px`, bg `rgb(24, 26, 27)`.
  - Selection information order:
    - Time.
    - Teams.
    - Selection.
    - Market.
    - Odds.
  - `SUPERMÚLTIPLA` promo card follows the selection card.
- Sticky footer summary:
  - `382px x 158px`, bottom.
  - Radius `16px 16px 0 0`.
  - Stake input, odds, potential prize, full-width red `Fazer aposta` CTA.

## Implementation Implications

- Superbet P0 is not a Betano ticket/table clone:
  - Football list is promo/carousel/card-led.
  - Live list is scoreboard-led.
  - Detail market cards are dark accordions with rich category chips and promo modules.
  - Bet slip is an empty/selected right rail on desktop and a CTA-led compact summary/full sheet on mobile.
- Superbet differs from Betano on at least these non-color axes:
  - Match list uses carousel promo cards instead of desktop table rows.
  - Desktop slip remains right rail, not Betano bottom-right drawer.
  - Mobile selected flow starts with red compact summary and opens a full-height sheet.
  - Market detail includes promo `DICAS DE APOSTAS` modules and category chips instead of Betano table-ticket rail.
  - Header/nav uses pill controls and promo/social/account energy rather than utility table navigation.
- The `toplive` card (`MELHORES PARTIDAS AO VIVO`) is a fixed three-market template: scoreboard, then exactly three stacked market blocks (some with inline `− value +` line/set steppers), then a chat footer. A replica should hard-code the three-slot layout and swap the market set per sport, not render a variable-length market list.
- For copy/follow betting (跟单), Superbet ships only social-proof discovery in the sportsbook: `APOSTAS POPULARES - AO VIVO` surfaces other users' real selections (masked name, stake, popularity count) but a tap opens the match, not a copy action. True social/copy mechanics are off-loaded to the separate `Supersocial` product. A P0 sportsbook replica needs the popular-bets card, not a copy-bet engine.
- Local `superbet-light` should preserve the same information layout and interaction policy as this audited dark source, while swapping to light skin tokens.
