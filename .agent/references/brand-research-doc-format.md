# Brand Research Doc Format

Format spec for the brand-replication research docs under `docs/` (e.g. `betano-p0-*`,
`superbet-p0-*`). These docs capture how a competitor sportsbook brand looks and behaves,
translate that into an implementation plan, and record what was built. This spec unifies
them into **one inclusive skeleton** so any brand x priority x platform fills the same
predictable shape.

## Core principle: canonical optional slots

There is one ordered menu of sections (the "canonical slots"). A doc includes the slots
that apply, in the canonical order, and omits the rest. It never renames a slot or invents
a parallel structure for the same content. **Variation between brands is expressed by which
slots are present, not by reshaping the skeleton.**

- Superbet has a Live List; Betano does not -> Betano omits the Live List slots, it does
  not restructure the rest.
- Superbet shipped screenshots; Betano did not -> Betano omits `Artifacts`, keeps every
  other slot.

## Document types

Three types, one family. The filename encodes brand, priority, and type:

`<brand>-<priority>-<type>.md`

- `<brand>`: lowercase slug — `betano`, `superbet`, `match`.
- `<priority>`: `p0`, `p1`, `p2`, ...
- `<type>`: `source-audit` | `implementation-breakdown` | `implementation-notes`

| Type | Purpose | Answers |
| --- | --- | --- |
| `source-audit` | Observed facts from the real competitor site | "What does the source look and behave like?" |
| `implementation-breakdown` | Plan mapping audit -> code | "What do we change, where, and how do we know it's done?" |
| `implementation-notes` | Record of what was actually built | "What shipped, and is it verified?" |

## Shared header

Every doc opens with one `H1` title followed by a metadata block (plain `Key: value`
lines, no bullets), in this order:

```
# <Brand> <Priority> <Type Title>

Date: YYYY-MM-DD
Brand: <brand>
Priority: P<n>
Status: <status>
```

Then the type-specific header fields:

- `source-audit`: `Sources:` (list of URLs) and optional `Artifacts:` (list of screenshot
  paths). Each entry is a backticked path or URL.
- `implementation-breakdown`: `Source baseline:` (backticked path to the matching audit)
  and `Scope:` (one short paragraph: what is in/out, which regressions to protect).
- `implementation-notes`: `Scope:` (one short paragraph).

`Status` vocabulary (compose with `;` when a doc has mixed state):

- `draft` — in progress, not yet source-verified.
- `source-validated` — facts confirmed against the live source (DOM/computed style or
  screenshots).
- `inferred` — structure deduced from a related surface, not directly captured.
- `implemented` — the corresponding code has shipped.
- `superseded` — replaced by a later doc (link the successor).

Example: `Status: light source-validated; dark pending`.

## Notation rules

Normalize all machine-like values into backtick code spans. This removes the
Betano (plain text) vs Superbet (code span) split.

- **Dimensions**: `` `904px x 74px` `` — lowercase `x` with a space on each side. Single
  values: `` `64px` ``.
- **Colors**: `` `rgb(255, 60, 0)` ``, `` `rgba(184, 197, 224, 0.4)` ``, `` `#c21e1c` ``.
  Preserve the source string exactly; only add the backticks.
- **CSS values**: radius / border / spacing in code spans, e.g. `` `radius 12px` ``,
  `` `border rgb(226, 232, 248)` ``.
- **Code refs**: file paths, selectors, profile/skin field names, data attributes, CSS
  variables — all code spans, e.g. `` `src/modules/match/_components/card.tsx` ``,
  `` `betano-table-row` ``, `` `--component-slip-desktop-width` ``.
- **Source UI copy**: literal on-screen strings in code spans, e.g. `` `APOSTE JA` ``,
  `` `O cupom de apostas esta vazio.` ``.
- Prose stays prose. Do not backtick ordinary words.

## Heading levels

- `H1` — doc title. Exactly one per file.
- `H2` — top-level sections (each surface slot, each breakdown slice, each notes block).
- `H3` — states/variants inside a section (e.g. bet-slip `Empty`/`Selected`, mobile
  `Compact Summary`/`Bottom Sheet`).
- No `H4`. Inside a section, use bold labels (`**Files**`, `**Work**`) plus lists, not
  deeper headings.

## Canonical surface taxonomy (audit + breakdown)

Platform-first. Include the slots that apply, in this order; omit the rest. Mobile mirrors
PC. Use the exact `<Platform> — <Surface>` names below.

PC:

1. `## PC — Shell & Header`
2. `## PC — Navigation & Sidebar`
3. `## PC — Match List` (prematch)
4. `## PC — Live List` *(optional)*
5. `## PC — Match Detail & Markets`
6. `## PC — Bet Slip` -> `### Empty`, `### Selected` (states as needed)

Mobile:

7. `## Mobile — Shell & Header`
8. `## Mobile — Sports Nav`
9. `## Mobile — Match List`
10. `## Mobile — Live List` *(optional)*
11. `## Mobile — Match Detail & Markets`
12. `## Mobile — Bet Flow` -> `### Compact Summary`, `### Bottom Sheet` (states as needed)

If a brand needs a surface not in this list, add it as a new `H2` in the nearest sensible
position **and add it to this spec** so it becomes canonical for everyone.

## Type A — Source Audit skeleton

```
# <Brand> <Priority> Source Audit

Date: YYYY-MM-DD
Brand: <brand>
Priority: P<n>
Status: <status>

Sources:
- `<url>`

Artifacts:                      (optional)
- `<path>`

## Coverage & Limits
- appearance/theme captured, what could not be loaded, validation method,
  what still needs a manual pass

<canonical surface slots that apply, PC then Mobile, with H3 states>

## Implementation Implications
- what the source means for our build
- brand-vs-brand contrasts on non-color axes
```

`Coverage & Limits` is the standardized home for what Superbet called "Research Notes And
Limits" and what Betano buried inside its `Scope` paragraph. It sits directly after the
header, before the surface slots.

## Type B — Implementation Breakdown skeleton

```
# <Brand> <Priority> Implementation Breakdown

Date: YYYY-MM-DD
Brand: <brand>
Priority: P<n>
Status: <status>
Source baseline: `docs/<brand>-<priority>-source-audit.md`
Scope: <one paragraph>

## Goal
- target structure in a few bullets

## TODO Matrix                  (optional)
| Component | Difference point | Landing detail |
| --- | --- | --- |

## 1. <Slice name>
**Files**
- `<path>`
**Source shape**
- observed facts the slice must hit
**Work**
- concrete changes
**Acceptance**
- verifiable pass criteria

## 2. <Slice name>
...

## Execution Order              (optional)
1. ...

## Verification
- commands (`pnpm lint:ts`, `pnpm lint`)
- screens to check (PC `1440px` / Mobile `390px`)
- run log with date, if executed
- regression checks

## Open Items
- risks, unvalidated areas, follow-ups
```

Each slice carries the four labels in this order: `Files` -> `Source shape` -> `Work` ->
`Acceptance`. A profile/contract slice with no distinct source shape may omit
`Source shape` only.

This folds Betano's `Verification Checklist` and Superbet's `Verification Plan` into one
`Verification`, and Betano's `Open Items` and Superbet's `Open Risks` into one
`Open Items`.

## Type C — Implementation Notes skeleton

```
# <Brand> <Priority> Implementation Notes

Date: YYYY-MM-DD
Brand: <brand>
Priority: P<n>
Status: <status>
Scope: <one paragraph>

## Implemented
- what was built

## Corrections                  (optional)
- source-fidelity fixes: what was wrong and why

## Verified
- route/theme checked -> observed result

## Remaining                    (optional)
- deferred / known-open
```

## Authoring checklist

- [ ] Filename is `<brand>-<priority>-<type>.md`.
- [ ] Header has Date / Brand / Priority / Status plus the type fields.
- [ ] Every dimension, color, path, field name, and UI string is in a code span.
- [ ] Sections follow the canonical order; absent surfaces are omitted, not renamed.
- [ ] Headings stop at `H3`; in-section detail uses bold labels.
- [ ] Audit ends with `Implementation Implications`; breakdown ends with `Verification` +
      `Open Items`.
- [ ] Cross-links resolve (breakdown -> audit; `superseded` -> successor).

## Canonical name map (old -> new)

| Old (varied) | Canonical |
| --- | --- |
| `PC Layout` / `PC Shell And Header` | `PC — Shell & Header` |
| `PC Sidebar And Navigation` | `PC — Navigation & Sidebar` |
| `PC Match List` / `PC Football List` | `PC — Match List` |
| `PC Live List` | `PC — Live List` |
| `PC Match Detail And Markets` / `... And Market Cards` | `PC — Match Detail & Markets` |
| `PC Bet Slip` (+ Empty/Selected) | `PC — Bet Slip` |
| `Mobile Layout` | `Mobile — Shell & Header` |
| mobile sports nav (inlined) | `Mobile — Sports Nav` |
| `Mobile Match List` / `Mobile Football List` | `Mobile — Match List` |
| `Mobile Bet Slip` / `Mobile Bet Flow` | `Mobile — Bet Flow` |
| `Research Notes And Limits` / scope-buried limits | `Coverage & Limits` |
| `Verification Checklist` / `Verification Plan` | `Verification` |
| `Open Items` / `Open Risks` | `Open Items` |
