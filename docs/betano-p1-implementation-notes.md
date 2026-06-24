# Betano P1 Implementation Notes

Date: 2026-06-23
Brand: betano
Priority: P1
Status: implemented
Scope: Betano homepage and sports-topic recommendation cards.

## Implemented

- Sports-topic featured match cards now use the `betano-ticket-feed` home recommendation profile instead of polluting P0 match-list layout selectors.
- Homepage reference cards expose `data-home-recommend-card-kind` for promo, competition, trending event, casino game, parlay pick, outright, live row, and upcoming row cards.
- Betano reference-home cards are normalized to white ticket surfaces with subtle full borders, no shared promo shadows, and no orange left rail.
- Promo cards keep a visible top-left label decoration through `.promoKicker`; that label is the structural cue, not a substituted side accent.
- Static reference-home odds now create local `OddsEntity` selections and open the Betano bet slip flow without marking cart sync as pending.
- Betano recommendation cards use white ticket surfaces instead of `yellow`/`red` promotional washes.
- Betano smart activity CTAs use `green` action styling, keeping `orange` reserved for navigation and selected odds.

## Corrections

- Correction, 2026-06-23: an earlier Betano P1 pass incorrectly translated the brand `orange` into a card-side rail. That was not source-evidenced and has been removed.
- Brand colors are not layout evidence. A structural change such as a side rail, ribbon, card grouping, tab shape, or bet-slip placement must have a source screenshot, DOM/computed-style note, or an explicitly documented product decision.
- For Betano, `orange` is allowed for the audited header/navigation and selected odds states. `green` remains the betting action CTA. Default card surfaces should stay `white`/light with subtle borders unless a source pass proves otherwise.
- Before styling P1/P2 cards, map these source primitives first: surface, border, radius, top-left label/ribbon, media placement, CTA, hover state, selected state. Do not replace a missing primitive with a decorative accent.

## Verified

- `/pt/sports/sr:sport:1?theme=betano-light`
  - P1 featured cards report `data-home-recommend-card-profile="betano-ticket-feed"`.
  - P0 match-list selectors only report `betano-table-row`.
- `/pt?theme=betano-light`
  - Root reports `data-home-recommend-profile="betano-ticket-feed"` and `data-home-recommend-layout="ticket-feed"`.
  - P1 card kinds render on desktop and mobile without runtime errors.
  - Selecting a recommendation odd uses `orange` background and `white` label/value text.
  - Selecting a reference-home odd opens the desktop Betano drawer and mobile Betano `cta-drawer` / `ticket-sheet`.
  - Reference-home selections persist locally with `hasPendingSync=false`.
- `/pt?theme=betano-light` correction check:
  - Promo-card left border computes to the normal 1px card border, not an `orange` structural rail.
  - Promo-card top-left `.promoKicker` renders visibly as the card label decoration.

## Remaining

- P1 cards in `reference-sports-home` still use static data, so selections intentionally stay local-only and are not synced to backend cart APIs.
- Betano dark-mode token tuning should wait for direct source validation.
