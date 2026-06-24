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
| Comparison matrix | `docs/theme-comparison-acceptance-matrix.md` | Required screenshot surfaces, state matrix, and adjacent regression gates |
| Drift audit | `docs/theme-reference-drift-audit.md` | Current comparison findings and implementation progress |
| Research doc format | `.agent/references/brand-research-doc-format.md` | Unified skeleton, header, and notation spec for the `docs/<brand>-<priority>-<type>.md` source-audit / implementation-breakdown / implementation-notes files |

## Index Check

Run `pnpm theme:check` after adding, removing, renaming, or remapping a scheme. The check verifies that `SCHEMES`, `scheme-meta.ts`, `theme.css`, and this index contain the same scheme set, then prints skin groups so shared CSS blast radius is visible before editing.

## Theme Index

| Scheme | Reference | Local reference files | Code landing | Current positioning | CSS risk |
| --- | --- | --- | --- | --- | --- |
| `gtb` | Current product GTB legacy shape; no external site | `betbus-vs-gtb-布局对比分析.md`, `docs/theme-style-cleanup-plan.md` | `:root` in `src/assets/css/theme.css`; `SCHEME_META.gtb`; `GTB_UI_STYLE` special-case in `getBrandUiSkin()` | Light red legacy fallback | Split from `SUPERBET_LIGHT_UI_STYLE`; preserves the previous mixed shell so Superbet-light fixes do not change GTB |
| `betbus` | [betbus.com](https://www.betbus.com/); focus `/soccer`, match detail, bet slip | `betbus-vs-gtb-布局对比分析.md`, `docs/betbus-gap-todolist.md` | `:root.betbus`; `SCHEME_META.betbus`; `BETBUS_UI_STYLE` | Default dark red Betbus direction | Single-scheme skin; changes to `--brand-odds-*`, CTA, or mobile dock still affect betting UX widely |
| `match` | Internal sportsbook reference, no external URL | `match-theme-preview.png`, `match-theme-fixed-preview.png`, `match-theme-mobile-fixed-preview.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-sports-mobile-ua-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-match-card-buttons-desktop-p1-fix-2026-06-22.png` | `:root.match`; `SCHEME_META.match`; `MATCH_UI_STYLE` via brand=`match` | Dark green sportsbook reference theme | Split from Betbus; desktop and true mobile-UA recaptures confirm green shell, match cards, odds, and mobile sport entry; match-card odds value now uses brand green instead of warm/yellow accent |
| `match-light` | Light counterpart of the internal Match reference | `match-light-theme-preview.png`, `match-light-theme-mobile-preview.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-light-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-match-light-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.match-light`; `SCHEME_META.match-light`; `MATCH_LIGHT_UI_STYLE` via brand=`match` | Light green sportsbook reference theme | Split from Betbus-light; desktop and true mobile-UA recaptures confirm white/mint cards and green selected states |
| `match-mint` | MATCH mint variant from user-provided palette mockup (薄荷绿) | uploaded palette mockup (薄荷绿) | `:root.match-mint`; `SCHEME_META['match-mint']`; `MATCH_MINT_UI_STYLE` via brand=`match`, dispatched by `MATCH_DARK_SKIN_BY_SCHEME` | Dark deep-slate + mint-green Match variant; switchable via the bottom-left MATCH color swatch row | Dark scheme (not 17-key checked); all match dark variants share brand=`match`, so accent diffs live in scheme-keyed skins—keep `MATCH_DARK_SKIN_BY_SCHEME` in sync |
| `match-bright` | MATCH bright-green variant from user-provided palette mockup (亮黑绿) | uploaded palette mockup (亮黑绿) | `:root.match-bright`; `SCHEME_META['match-bright']`; `MATCH_BRIGHT_UI_STYLE` (spreads `MATCH_UI_STYLE`) via brand=`match` | Dark black + neon-green Match variant; switchable via MATCH color swatch row | Shares the black shell with `match`; only accent tokens diverge—verify selected odds and active nav contrast |
| `match-red` | MATCH black-red variant from user-provided palette mockup (黑红) | uploaded palette mockup (黑红) | `:root.match-red`; `SCHEME_META['match-red']`; `MATCH_RED_UI_STYLE` (spreads `MATCH_UI_STYLE`) via brand=`match` | Dark black + red Match variant; odds value stays green (up=green); switchable via MATCH color swatch row | Red accent uses white on-accent text; odds value intentionally kept green—do not recolor to red |
| `match-navy-red` | MATCH navy-red variant from user-provided palette mockup (深蓝红) | uploaded palette mockup (深蓝红) | `:root.match-navy-red`; `SCHEME_META['match-navy-red']`; `MATCH_NAVY_RED_UI_STYLE` via brand=`match` | Dark navy + red Match variant; odds value stays green; switchable via MATCH color swatch row | Navy shell diverges from black `match`; full skin object—keep navy bg/border levels aligned with `:root.match-navy-red` |
| `match-navy-yellow` | MATCH navy-yellow variant from user-provided palette mockup (深蓝黄) | uploaded palette mockup (深蓝黄) | `:root.match-navy-yellow`; `SCHEME_META['match-navy-yellow']`; `MATCH_NAVY_YELLOW_UI_STYLE` via brand=`match` | Dark navy + yellow Match variant; yellow uses dark on-accent text; odds value stays green; switchable via MATCH color swatch row | Yellow accent needs dark (#241c00) on-accent text for contrast; odds value kept green |
| `superbet-light` | [superbet.com](https://www.superbet.com/) | `D:\Documents\gotobet\.codex-artifacts\theme-references\superbet-official-desktop-rich-visible-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\superbet-official-mobile-refresh-wait25s-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-light-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-light-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.superbet-light`; `SCHEME_META.superbet-light`; `SUPERBET_LIGHT_UI_STYLE` | Light Superbet-inspired | Light skin now owns shell, rails, interactive rows, cards, odds, and mobile sport nav; P1 tuning remains around module hierarchy and official rich alignment |
| `superbet-dark` | [superbet.com](https://www.superbet.com/) | `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-dark-sports-desktop-clean-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-dark-mobile-ua-refresh-wait20s-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-superbet-dark-match-card-buttons-desktop-p1-fix-2026-06-22.png` | `:root.superbet-dark`; `SCHEME_META.superbet-dark`; `SUPERBET_UI_STYLE` | Dark Superbet-inspired | Single-scheme dark skin; match-card odds value now uses primary white instead of warm/yellow accent; official dark sportsbook reference is still missing |
| `betano-light` | [betano.com](https://www.betano.com/) | `D:\Documents\gotobet\.codex-artifacts\mobile-betano-light.png`, `D:\Documents\gotobet\.codex-artifacts\betano-actual-mobile-iab.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-light-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-light-sports-mobile-ua-p1-query-2026-06-21.png` | `:root.betano-light`; `SCHEME_META.betano-light`; `BETANO_LIGHT_UI_STYLE`; `recommend-card/skin.ts` | Light Betano-inspired | Clean local desktop and true mobile-UA recaptures exist; modal/drawer comparison remains |
| `betano-dark` | [betano.com](https://www.betano.com/) | `D:\Documents\gotobet\.codex-artifacts\betano-actual-mobile-iab.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-sports-desktop-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-sports-mobile-ua-p1-query-2026-06-21.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-slip-desktop-p1-fix-2026-06-22.png`, `D:\Documents\gotobet\.codex-artifacts\theme-references\local-betano-dark-slip-mobile-ua-p1-fix-2026-06-22.png` | `:root.betano-dark`; `SCHEME_META.betano-dark`; `BETANO_UI_STYLE`; `recommend-card/skin.ts`; `bet-slip/_utils/slip-skin.ts` | Dark Betano-inspired | Local clean captures exist and the previous white bet-slip/mobile-sheet drift is fixed; official dark sportsbook baseline and remaining modal/drawer states are still missing |
| `glass-light` | iOS26 liquid-glass design language; no external betting site | none yet (new scheme) | `:root.glass-light` in `src/assets/css/theme.css`; `SCHEME_META.glass-light`; `GLASS_LIGHT_UI_STYLE` via brand=`glass`; `GLASS_PROFILE`; material layer in `src/assets/css/glass.css` | Light liquid-glass, purple→pink vibrant accent; switchable only (not default) | New `glass` brand; translucent surfaces + `backdrop-filter` blur + SVG `feDisplacementMap` edge refraction are scoped under `:root.glass-light` so the other 8 schemes are untouched; verify contrast over the vibrant mesh wallpaper |
| `glass-dark` | iOS26 liquid-glass design language; no external betting site | none yet (new scheme) | `:root.glass-dark` in `src/assets/css/theme.css`; `SCHEME_META.glass-dark`; `GLASS_DARK_UI_STYLE` via brand=`glass`; `GLASS_PROFILE`; material layer in `src/assets/css/glass.css` | Dark liquid-glass, purple→pink vibrant accent; switchable only (not default) | New `glass` brand; translucent surfaces + `backdrop-filter` blur + SVG `feDisplacementMap` edge refraction are scoped under `:root.glass-dark` so the other 8 schemes are untouched; verify contrast over the vibrant mesh wallpaper |
| `cis-light` | CIS 投后管理视觉识别系统（暖燕麦底 + 常春藤绿主色）；无外部博彩站点 | uploaded `cis-identity-system.skill`（`references/vi-specification.md`, `templates/cis-tokens.css`） | `:root.cis-light` in `src/assets/css/theme.css`; `SCHEME_META['cis-light']`; `CIS_LIGHT_UI_STYLE` via brand=`cis`; `CIS_PROFILE`; `getSkinKey` cis branch | Light warm-oatmeal shell + ivy-green accent with a deep-forest topbar; switchable only (not default) | New `cis` brand (light-only); palette, status pastels, card shadow, and 8px/6px radii are translated from the CIS VI spec and scoped under `:root.cis-light` so the other schemes are untouched; recommend-card/slip skins intentionally fall back to the neutral default |

## Current Drift Checks

| Check | Result | Action |
| --- | --- | --- |
| `SCHEMES` all have CSS blocks | Pass; all 8 schemes are present in `theme.css` | Keep running `pnpm theme:check` after scheme edits |
| CSS blocks all have `SCHEME_META` entries | Pass; all 8 schemes are registered | None |
| Docs index is aligned | Pass after this update | Keep the table scheme names in sync with code |
| Brand skins are scheme-safe | Improved | `match*`, `superbet-light`, `superbet-dark`, `betano*`, `betbus`, and `gtb` now resolve to separate skin keys |
| Reference coverage | Expanded checklist | `docs/theme-comparison-acceptance-matrix.md` is now the acceptance source for clean official baselines, sports depth, bet slip states, modal/drawer states, account/money pages, shared UI states, mobile chrome, hardcoded color audit, and adjacent screenshots |
| CSS blast radius | Lower than before | Skin groups are now single-scheme, but odds, slip, and mobile dock variables remain high-impact betting UX surfaces |
| Local dev rendering | Improved | `src/app/layout.tsx` and `src/app/[locale]/layout.tsx` provide dev/test i18n fallbacks when region/language/timezone cookies are missing |
| Local recapture route | Added | In dev/test, append `?scheme=<scheme>` or `?theme=<scheme>` to force a scheme through the normal `next-themes` setter |

## Per-Theme Validation Order

1. Lock the target scheme with the dev/test `?scheme=<scheme>` query, `LayoutExperimentToggle`, or `next-themes` class.
2. Check `docs/theme-comparison-acceptance-matrix.md` P1 gates first: clean official baselines, sportsbook depth, bet slip states, modal/drawer states, and account/money pages.
3. Check P2 gates next: empty/error/loading/skeleton/global-error/toast, mobile chrome and safe areas, interaction states, reusable-UI hardcoded colors, and adjacent regression screenshots.
4. For sports depth, cover sports home, sport topic, live/in-play, match detail, outright, carousel cards, expanded tournaments, and scrolled list states.
5. For betting depth, cover desktop slip, mobile summary bar/sheet, empty slip, one selection, multi/parlay, locked/invalid selections, odds-change accept, quick stake, numeric keypad, login-required, insufficient-balance, and submit success/error.
6. Compare against the external or local reference only for visual direction; keep product data flow aligned with this repo.
7. Record color and hierarchy drift in `theme.css` first, then brand-specific shell/card/odds drift in `brand-ui-skin.ts`.
8. After each change, validate the target scheme and adjacent risk schemes. With the current split, adjacent checks are mainly `betbus`, `gtb`, the matching light/dark counterpart, and the mobile counterpart.

## CSS Change Guardrails

- Do not add new hardcoded component colors unless they are artwork or campaign-specific.
- Before editing `src/assets/css/theme.css`, identify whether the variable belongs to raw palette, semantic token, shape token, or mobile token layers.
- Before editing `src/components/theme-provider/brand-ui-skin.ts`, run `pnpm theme:check` and review the printed skin groups.
- Changes touching `--brand-odds-*`, `--odds-selected-*`, `--mobile-dock-*`, or `--dock-bar-*` require bet slip, odds button, and mobile bottom-bar checks.
- Campaign/VIP/World Cup pages are not forced into global theme repainting; only their reusable controls should follow theme tokens.
