# Betano P0 Source Audit

Date: 2026-06-24
Brand: betano
Priority: P0
Status: light source-validated (incl. live surface 2026-06-24); dark pending

Sources:
- `https://www.betano.bet.br/`
- `https://www.betano.bet.br/sport/futebol/jogos-de-hoje/`
- `https://www.betano.bet.br/live/`
- `https://www.betano.bet.br/odds/portugal-uzbequistao/83963581/`

## Coverage & Limits

- Inspected Betano P0 components on real PC and mobile layouts.
- This pass inspected the default/light appearance.
- The site exposes appearance choices (`Betano Classico`, `Claro`, `Escuro`, `Sistema`) in the header.
- The dark-mode picker did not open reliably in the current browser automation session.
- Dark mode should be validated in a separate pass before implementation.
- A `2026-06-24` desktop pass (Brazil egress) checked the live surface and homepage for a Superbet-style top-live card and a copy/follow-bet (跟单) feature. Betano has neither: live betting is a flat league-grouped list, and the homepage `SUBSTITUIÇÃO DE OURO` carousel is editorial boosted-odds combo/mission cards, not live-match cards with stacked markets.

## PC — Shell & Header

- Header is a `kaizen-header` web component using shadow DOM.
- Header height is `64px`.
- Header background is Betano orange `rgb(255, 60, 0)`.
- Primary nav items are uppercase white text: `APOSTAS ESPORTIVAS`, `APOSTAS AO VIVO`, `CASSINO`, `CASSINO AO VIVO`, `JOGOS CRASH`, `VIRTUAIS`.
- Login actions sit on the right: `REGISTRAR` is transparent/outlined white, `ENTRAR` is green `rgb(55, 162, 92)`, both `8px` radius.
- App shell under header is three-column:
  - Left sports/sidebar: `200px` wide, white/off-white `rgb(252, 252, 253)`.
  - Main content: `920px` wide at `1440px` viewport.
  - Right sidebar: `320px` wide, layout background `rgb(239, 242, 250)`.
- Default right sidebar is not a generic bet slip. Empty/idle state shows `MINHAS APOSTAS`, `Em Aberto`, `Resolvidas`, `Nao tem apostas em aberto`, plus BetanIA/offers widgets.

## PC — Match List

- Main list background is light gray `rgb(239, 242, 250)`.
- Top route tabs are a pill segmented control:
  - Outer container: white/off-white, `40px` tall, `20px` radius.
  - Selected tab uses Betano orange `rgb(255, 60, 0)`, white text, `16px` radius, `32px` tall.
- Market switch (`Principais` / `CA Criar Aposta + NOVO`) is a compact pill:
  - `428px` wide on desktop, `34px` tall.
  - Background `rgb(209, 217, 235)`, border `rgb(194, 206, 229)`, full pill radius.
  - `CA` badge is orange and small.
- League header is not a heavy card header:
  - `904px` wide, `40px` tall.
  - Transparent background, `8px`/`4px` padding.
- Match list uses row cards, not marketing cards:
  - First row: `904px` wide, `74px` tall, white background, `12px` padding.
  - First row radius is `12px 12px 0 0`; following rows continue as a stacked table/card group.
  - Row layout is horizontal: date/time column, teams link, odds columns.
  - Team area is `389px` wide; teams are stacked vertically.
- Odds buttons:
  - Desktop list: `124px x 36px`.
  - Background `rgb(247, 249, 252)`.
  - Border `rgb(226, 232, 248)`.
  - Radius `8px`.
  - Label and price are in one horizontal button (`1 1.18`, `X 7.80`, `2 19.50`).
  - Selected odds background becomes Betano orange `rgb(255, 60, 0)`; label and odds text become white.

## PC — Live List

- Live entry URL: `https://www.betano.bet.br/live/` (nav item `APOSTAS AO VIVO`); page header is `JOGOS AO VIVO` with a live count.
- No top-live featured card. Unlike Superbet's `MELHORES PARTIDAS AO VIVO`, Betano has no scoreboard-led carousel with stacked markets; live betting is a flat list grouped by league.
- View toggles at the top right: `Stream`, `Campo` (default), `Estatísticas`.
- Sport filter row: `My Live`, `Futebol`, `Tênis`, `Basquete`, `Tênis de Mesa`, `Esports`, `Dardos`, `Virtuais`.
- Market filter chips under the active sport: `Mercados populares` (default), `Total de Gols Mais/Menos`, `Total de gols - 1º Tempo`, `Próximo gol`, `Ambas equipes Marcam`, `Empate Anula`, `Chance Dupla`.
- Each live row: live time + flash/stream icons, team names stacked, score, a `1` / `X` / `2` odds row, and a `+` market-count control; the row offers `Expandir` / `Fixar Evento` to pin the event to the right column.
- No copy/follow-bet (跟单) and no social-proof module on the live surface. The right column shows `MINHAS APOSTAS` (`Em Aberto` / `Resolvidas`) plus `Criar Aposta` and `Gol Betano` offers only.

## PC — Match Detail & Markets

- Detail page keeps the `200px` left rail, `920px` main column, `320px` right sidebar.
- Match header:
  - Main hero is `904px` wide, `130px` tall.
  - Background sits on the layout gray.
  - Inner participant panel has a subtle translucent surface and bottom radius `12px`.
  - Contains date/time, `AO VIVO APENAS NA BETANO`, and the `Portugal Uzbequistao` H1.
- Market category nav:
  - White `48px`-high horizontal surface with `12px` radius.
  - Selected category (`Populares`) is dark navy `rgb(42, 48, 70)`, white text, `16px` radius, `32px` tall.
  - `Criar Aposta` appears as a separate toggle/action at the right of the category rail.
- Market card:
  - White card, border `rgb(226, 232, 248)`, radius `12px`.
  - `Resultado Final SuperOdds` card is `904px x 94px`.
  - Odds grid inside is 3 columns; each odds button is `287px x 36px`.
  - Ordinary `Resultado Final` card is taller because it includes insight/explainer text below the odds.
  - `CA` badge is displayed before some market titles.
- Main detail page also includes recommendation/carousel modules such as `ESCOLHAS PRINCIPAIS`, but that is P1 unless surfaced in a P0 context.

## PC — Bet Slip

- After an odds selection, a fixed bet slip can appear at the bottom-right, over the right column:
  - Container: `380px` wide, bottom fixed, top radius `32px 32px 0 0`.
  - Inner section: `364px` wide.
  - Header: `Cupom de Apostas`, count `1/30`, actions `Salvar`, `Compartilhar`.
  - Bet type segmented control: `Simples`, `Multiplas`, `Sistema`, `348px` wide, `32px` tall, pill radius `100px`, gray background `rgb(234, 238, 251)`.
  - Selection card: white, border `rgb(226, 232, 248)`, radius `12px`.
  - Stake area has a currency input and quick buttons `+10`, `+50`, `+200`, `MAX`.
  - Primary CTA is green `rgb(55, 162, 92)`, `40px` tall, `8px` radius, text `APOSTE JA`.

## Mobile — Shell & Header

- Mobile viewport inspected at `390px x 844px`.
- Header remains `kaizen-header` shadow DOM.
- Header height is `56px`.
- Header background is Betano orange `rgb(255, 60, 0)`.
- Mobile header uses compact logo/menu area on the left and action icons plus `REGISTRAR` / `ENTRAR` on the right.
- There is no left or right rail.
- Sports navigation is a horizontal icon scroller directly below the header:
  - `63px` tall.
  - Each sport item is `67px x 47px`.
  - Selected `Futebol` has translucent gray-blue background `rgba(184, 197, 224, 0.4)`, border `rgb(226, 232, 248)`, radius `8px`.
- Bottom nav is fixed:
  - `56px` tall.
  - White/off-white background.
  - Items: `Inicio`, `Ao Vivo`, `Esportes`, `Apostas`.

## Mobile — Match List

- Main background is light gray `rgb(239, 242, 250)`.
- Top route tabs match desktop but are compressed:
  - Outer width `374px`, height `40px`, radius `20px`.
  - Selected `Proximos` is orange `rgb(255, 60, 0)`, `122px x 32px`, `16px` radius.
- Market switch:
  - `358px x 34px`.
  - Background `rgb(209, 217, 235)`, border `rgb(194, 206, 229)`, pill radius.
- League header:
  - `374px x 40px`, transparent background.
- Match card:
  - `374px` wide, `130px` tall.
  - White background, border `rgb(226, 232, 248)`, radius `12px`.
  - Layout is vertical:
    - Top row: date/time, small status/stat/favorite controls.
    - Middle: teams stacked on two lines with small team icons.
    - Bottom: odds row.
- Mobile odds:
  - Three equal columns: `111px x 36px`.
  - `8px` radius.
  - Default background `rgb(247, 249, 252)`, border `rgb(226, 232, 248)`.
  - Selected state uses Betano orange background and white text.
  - Non-selected odds price may use green highlight text `rgb(58, 120, 36)` when odds movement/highlight is active.

## Mobile — Match Detail & Markets

- Detail hero:
  - Full width `390px`, `134px` tall.
  - Participant panel width `374px`, bottom radius `12px`.
  - H1 area is `374px` wide, `32px` tall.
- Category nav:
  - `374px` wide, `48px` tall, white surface.
  - Scrollable pills; selected `Populares` is dark navy `rgb(42, 48, 70)`, white text, `16px` radius.
  - `CRIAR APOSTA` is a separate action/toggle area at the right.
- Market cards:
  - Width `374px`.
  - White background, border `rgb(226, 232, 248)`, radius `12px`.
  - `Resultado Final SuperOdds`: `94px` tall.
  - Odds are `111px x 36px` in a 3-column row.
  - Ordinary `Resultado Final` is taller because it includes predictive/insight text.

## Mobile — Bet Flow

- Selected bet appears as a bottom fixed drawer/section rather than a right rail.
- The bottom CTA replaces/overlays the normal bottom nav area:
  - Footer is `390px` wide, `56px` tall.
  - CTA button is `374px x 40px`, green `rgb(55, 162, 92)`, `8px` radius, text `APOSTE JA`.
- Above the CTA:
  - Stake area uses input + quick amount buttons.
  - Selection content is a card-like section containing outcome, odds, market name, and match.

## Implementation Implications

- Betano P0 should not be implemented as a generic reskinned betting card.
- Match list needs two different layouts:
  - PC: table-like row card with compact horizontal odds.
  - Mobile: standalone vertical match card with top metadata row, team block, and bottom odds row.
- Market cards need their own structure:
  - White bordered cards with `12px` radius.
  - Market title + optional `CA`/`SuperOdds`.
  - 3-column odds grid for 1X2 markets.
  - Optional insight text below normal markets.
- Navigation must include:
  - Orange brand header.
  - PC left sports tree.
  - Mobile horizontal sports scroller and bottom nav.
- Bet slip needs state-specific behavior:
  - Empty/idle desktop right rail is `MINHAS APOSTAS` and recommendation content, not a coupon.
  - Selected desktop coupon is a fixed bottom-right drawer.
  - Selected mobile coupon is a bottom fixed drawer/CTA that occupies the bottom nav area.
- Betano has no `toplive` featured live card and no copy/follow-bet (跟单) surface. If our build needs either, Superbet is the reference, not Betano: Betano live stays a flat league-grouped list, and its social/gamification energy lives in promos (`SUBSTITUIÇÃO DE OURO`, `SuperOdds`, `Gol Betano`, `Bolão da Copa`) rather than a social feed or popular-bets carousel.
- Source dark mode still needs direct validation before committing final dark tokens.
