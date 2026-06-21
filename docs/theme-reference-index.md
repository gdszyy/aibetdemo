# Theme Reference Index And Drift Checks

> Purpose: pin every scheme to its reference material, code ownership, current positioning, and CSS blast-radius notes before editing theme tokens or brand skins.

## Source Of Truth

| Layer | File | Responsibility |
| --- | --- | --- |
| Scheme registry | `src/components/theme-provider/theme-provider.tsx` | `SCHEMES`, default scheme, and `next-themes` class injection |
| Scheme metadata | `src/components/theme-provider/scheme-meta.ts` | Scheme to brand/mode mapping |
| Brand skin | `src/components/theme-provider/brand-ui-skin.ts` | Topbar, sidebars, match cards, odds buttons, mobile sport-nav variables |
| Global tokens | `src/assets/css/theme.css` | Per-scheme raw palette, semantic, shape, and mobile tokens |
| Tailwind mapping | `src/assets/css/tokens.css` | CSS variables exposed as Tailwind tokens |
| Base styles | `src/assets/css/base.css` | Body, scrollbar, shared card/account/market base selectors |
| Design constraints | `docs/agents/theme-design.md` | Theme workflow and validation rules |
| Cleanup plan | `docs/theme-style-cleanup-plan.md` | Migration order and guardrails |
| Drift audit | `docs/theme-reference-drift-audit.md` | Current comparison findings and implementation progress |

## Index Check

Run `pnpm theme:check` after adding, removing, renaming, or remapping a scheme. The check verifies that `SCHEMES`, `scheme-meta.ts`, `theme.css`, and this index contain the same scheme set, then prints skin groups so shared CSS blast radius is visible before editing.

## Theme Index

| Scheme | Reference | Local reference files | Code landing | Current positioning | CSS risk |
| --- | --- | --- | --- | --- | --- |
| `gtb` | Current product GTB legacy shape; no external site | `betbus-vs-gtb-布局对比分析.md`, `docs/theme-style-cleanup-plan.md` | `:root` in `src/assets/css/theme.css`; `SCHEME_META.gtb`; `GTB_UI_STYLE` special-case in `getBrandUiSkin()` | Light red legacy fallback | Split from `SUPERBET_LIGHT_UI_STYLE`; preserves the previous mixed shell so Superbet-light fixes do not change GTB |
| `betbus` | [betbus.com](https://www.betbus.com/); focus `/soccer`, match detail, bet slip | `betbus-vs-gtb-布局对比分析.md`, `docs/betbus-gap-todolist.md` | `:root.betbus`; `SCHEME_META.betbus`; `BETBUS_UI_STYLE` | Default dark red Betbus direction | Single-scheme skin; changes to `--brand-odds-*`, CTA, or mobile dock still affect betting UX widely |
| `match` | Internal sportsbook reference, no external URL | `match-theme-preview.png`, `match-theme-fixed-preview.png`, `match-theme-mobile-fixed-preview.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.match`; `SCHEME_META.match`; `MATCH_UI_STYLE` via brand=`match` | Dark green sportsbook reference theme | Split from Betbus; desktop and true mobile-UA recaptures confirm green shell, match cards, odds, and mobile sport entry |
| `match-light` | Light counterpart of the internal Match reference | `match-light-theme-preview.png`, `match-light-theme-mobile-preview.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-light-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-light-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.match-light`; `SCHEME_META.match-light`; `MATCH_LIGHT_UI_STYLE` via brand=`match` | Light green sportsbook reference theme | Split from Betbus-light; desktop and true mobile-UA recaptures confirm white/mint cards and green selected states |
| `superbet-light` | [superbet.com](https://www.superbet.com/) | `D:\Documents\gotobet\.codex-artifacts\theme-references\superbet-official-desktop-rich-visible-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\superbet-official-mobile-refresh-wait25s-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-light-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-light-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.superbet-light`; `SCHEME_META.superbet-light`; `SUPERBET_LIGHT_UI_STYLE` | Light Superbet-inspired | Light skin now owns shell, rails, interactive rows, cards, odds, and mobile sport nav; P1 tuning remains around module hierarchy and official rich alignment |
| `superbet-dark` | [superbet.com](https://www.superbet.com/) | `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-dark-sports-desktop-clean-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-dark-mobile-ua-refresh-wait20s-2026-06-21.png` | `:root.superbet-dark`; `SCHEME_META.superbet-dark`; `SUPERBET_UI_STYLE` | Dark Superbet-inspired | Single-scheme dark skin; official dark sportsbook reference is still missing |
| `betano-light` | [betano.com](https://www.betano.com/) | `D:\Documents\gotobet\.codex-artifacts\mobile-betano-light.png`, `D:\Documents\gotobet\.codex-artifacts\betano-actual-mobile-iab.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-light-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-light-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.betano-light`; `SCHEME_META.betano-light`; `BETANO_LIGHT_UI_STYLE`; `recommend-card/skin.ts` | Light Betano-inspired | Clean local desktop and true mobile-UA recaptures exist; modal/drawer comparison remains |
| `betano-dark` | [betano.com](https://www.betano.com/) | `D:\Documents\gotobet\.codex-artifacts\betano-actual-mobile-iab.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.betano-dark`; `SCHEME_META.betano-dark`; `BETANO_UI_STYLE`; `recommend-card/skin.ts` | Dark Betano-inspired | Clean local desktop and true mobile-UA recaptures exist; official dark sportsbook baseline and modal/drawer states are still missing |

## Current Drift Checks

| Check | Result | Action |
| --- | --- | --- |
| `SCHEMES` all have CSS blocks | Pass; all 8 schemes are present in `theme.css` | Keep running `pnpm theme:check` after scheme edits |
| CSS blocks all have `SCHEME_META` entries | Pass; all 8 schemes are registered | None |
| Docs index is aligned | Pass after this update | Keep the table scheme names in sync with code |
| Brand skins are scheme-safe | Improved | `match*`, `superbet-light`, `superbet-dark`, `betano*`, `betbus`, and `gtb` now resolve to separate skin keys |
| Reference coverage | Improved | `match*`, `superbet-light`, and `betano*` now have clean local desktop and true mobile-UA P1 captures; modal/drawer states and clean official Betano-dark baseline are still missing |
| CSS blast radius | Lower than before | Skin groups are now single-scheme, but odds, slip, and mobile dock variables remain high-impact betting UX surfaces |
| Local dev rendering | Improved | `src/app/layout.tsx` and `src/app/[locale]/layout.tsx` provide dev/test i18n fallbacks when region/language/timezone cookies are missing |
| Local recapture route | Added | In dev/test, append `?scheme=<scheme>` or `?theme=<scheme>` to force a scheme through the normal `next-themes` setter |

## Per-Theme Validation Order

1. Lock the target scheme with the dev/test `?scheme=<scheme>` query, `LayoutExperimentToggle`, or `next-themes` class.
2. Check sports home, sport topic, match detail, desktop bet slip, mobile summary bar/sheet, account menu, deposit, and withdraw.
3. Compare against the external or local reference only for visual direction; keep product data flow aligned with this repo.
4. Record color and hierarchy drift in `theme.css` first, then brand-specific shell/card/odds drift in `brand-ui-skin.ts`.
5. After each change, validate the target scheme and adjacent risk schemes. With the current split, adjacent checks are mainly `betbus`, `gtb`, and the matching light/dark counterpart.

## CSS Change Guardrails

- Do not add new hardcoded component colors unless they are artwork or campaign-specific.
- Before editing `src/assets/css/theme.css`, identify whether the variable belongs to raw palette, semantic token, shape token, or mobile token layers.
- Before editing `src/components/theme-provider/brand-ui-skin.ts`, run `pnpm theme:check` and review the printed skin groups.
- Changes touching `--brand-odds-*`, `--odds-selected-*`, `--mobile-dock-*`, or `--dock-bar-*` require bet slip, odds button, and mobile bottom-bar checks.
- Campaign/VIP/World Cup pages are not forced into global theme repainting; only their reusable controls should follow theme tokens.
