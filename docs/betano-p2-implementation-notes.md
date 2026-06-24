# Betano P2 Implementation Notes

Date: 2026-06-23
Brand: betano
Priority: P2
Status: implemented
Scope: Betano secondary homepage controls and supporting UI around P1 cards.

## Implemented

- Betano reference-home search input and search popover now use ticket-style white surfaces, subtle borders, and no generic floating shadow.
- Search chips, search result rows, carousel arrows, tabs, promo dots, live badges, and boost badges are normalized under the Betano `ticket-feed` profile.
- Casino game hover CTA uses the `green` action color, keeping `orange` reserved for navigation and selected odds.
- P2 styling is scoped to `data-home-recommend-profile="betano-ticket-feed"` and does not alter match or superbet behavior.

## Verified

- `/pt?theme=betano-light`
  - Desktop search popover opens with Betano scoped styles.
  - Mobile search popover opens without runtime errors.
  - Reference-home odds still open the desktop Betano drawer.
  - Mobile reference-home odds still open Betano `cta-drawer` / `ticket-sheet`.
