'use client';

import { useMemo } from 'react';
import type { SchemeBrand, SchemeMeta, SchemeMode } from './scheme-meta';
import { useSchemeMeta } from './scheme-meta';

export type NavProfile = 'match-command' | 'superbet-pill-promo' | 'betano-orange-utility';
export type MatchCardProfile = 'match-board' | 'superbet-promo-card' | 'betano-ticket-row';
export type MarketCardProfile = 'match-dense-accordion' | 'superbet-rich-grid' | 'betano-table-ticket';
export type BetSlipProfile = 'match-working-panel' | 'superbet-empty-panel' | 'betano-my-bets-panel';
export type MobileBetFlowProfile = 'compact-sheet' | 'cta-led-sheet' | 'ticket-sheet';
export type OddsButtonProfile = 'price-first' | 'pill-cta' | 'ticket-price';
export type HomeRecommendProfile = 'match-market-board' | 'superbet-promo-rail' | 'betano-ticket-feed';
export type SmartActivityProfile = 'match-compact-grid' | 'superbet-promo-mosaic' | 'betano-ticket-hub';
export type PlayerPropsProfile = 'match-stat-list' | 'superbet-curated-rail' | 'betano-stat-matrix';
export type DesktopMatchListLayout = 'board-row' | 'promo-card' | 'betano-table-row';
export type MobileMatchListLayout = 'stacked-card' | 'promo-card' | 'betano-ticket-card';
export type DesktopBetSlipPlacement = 'working-panel' | 'empty-panel' | 'bottom-right-drawer' | 'right-rail-panel';
export type DesktopBetSlipIdle = 'none' | 'empty-panel' | 'my-bets-rail';
export type MobileBetSlipPlacement = 'summary-bar' | 'cta-drawer';
export type MobileBetSlipSummaryLayout = 'compact-dock' | 'superbet-metrics' | 'ticket-cta';

export type ComponentProfileStyle = Record<`--${string}`, string>;

export interface ThemeComponentProfile {
    brand: SchemeBrand;
    mode: SchemeMode;
    nav: {
        profile: NavProfile;
        activeMarker: 'block' | 'pill' | 'underline';
        promoWeight: 'low' | 'high' | 'utility';
    };
    matchCard: {
        profile: MatchCardProfile;
        listLayout: 'board' | 'promo-card' | 'ticket-row';
        desktopListLayout: DesktopMatchListLayout;
        mobileListLayout: MobileMatchListLayout;
        useStackedMobileOdds: boolean;
        interaction: 'subtle-lift' | 'promo-lift' | 'ticket-highlight';
    };
    marketCard: {
        profile: MarketCardProfile;
        density: 'compact' | 'balanced' | 'roomy';
        headerTreatment: 'flat' | 'pill' | 'table';
    };
    oddsButton: {
        profile: OddsButtonProfile;
        layout: 'name-odds' | 'odds-emphasis' | 'ticket';
    };
    betSlip: {
        profile: BetSlipProfile;
        desktop: 'working-panel' | 'empty-panel' | 'utility-panel';
        desktopPlacement: DesktopBetSlipPlacement;
        desktopIdle: DesktopBetSlipIdle;
        mobilePlacement: MobileBetSlipPlacement;
        mobileFlow: MobileBetFlowProfile;
        mobileSummaryLayout: MobileBetSlipSummaryLayout;
        selectionInfoOrder: 'market-selection-event' | 'event-selection-market' | 'ticket-market-selection';
    };
    homeRecommend: {
        profile: HomeRecommendProfile;
        sectionLayout: 'board-rail' | 'promo-rail' | 'ticket-feed';
        cardDensity: 'compact' | 'featured' | 'ticket';
        selectionLayout: 'market-stack' | 'event-first' | 'ticket-line';
        interaction: 'inline-expand' | 'cta-sheet' | 'ticket-sheet';
    };
    activityCards: {
        profile: SmartActivityProfile;
        layout: 'compact-grid' | 'promo-mosaic' | 'ticket-hub';
        cardDensity: 'compact' | 'featured' | 'balanced';
        interaction: 'board-hover' | 'promo-lift' | 'ticket-focus';
    };
    /** 球员盘口（player props）：按品牌切布局——紧凑列表 / 编辑精选横滑 / 博彩化阈值矩阵。 */
    playerProps: {
        profile: PlayerPropsProfile;
        layout: 'list' | 'rail' | 'matrix';
        categoryFilter: 'hidden' | 'chips';
        thresholdLayout: 'inline' | 'pill-row' | 'matrix';
        showStatNudge: boolean;
        showGoldenSubstitution: boolean;
        interaction: 'inline-add' | 'cta-add' | 'ticket-add';
    };
    style: ComponentProfileStyle;
}

const MATCH_PROFILE: ThemeComponentProfile = {
    brand: 'match',
    mode: 'dark',
    nav: {
        profile: 'match-command',
        activeMarker: 'block',
        promoWeight: 'low',
    },
    matchCard: {
        profile: 'match-board',
        listLayout: 'board',
        desktopListLayout: 'board-row',
        mobileListLayout: 'stacked-card',
        useStackedMobileOdds: true,
        interaction: 'subtle-lift',
    },
    marketCard: {
        profile: 'match-dense-accordion',
        density: 'compact',
        headerTreatment: 'flat',
    },
    oddsButton: {
        profile: 'price-first',
        layout: 'odds-emphasis',
    },
    betSlip: {
        profile: 'match-working-panel',
        desktop: 'working-panel',
        desktopPlacement: 'working-panel',
        desktopIdle: 'none',
        mobilePlacement: 'summary-bar',
        mobileFlow: 'compact-sheet',
        mobileSummaryLayout: 'compact-dock',
        selectionInfoOrder: 'market-selection-event',
    },
    homeRecommend: {
        profile: 'match-market-board',
        sectionLayout: 'board-rail',
        cardDensity: 'compact',
        selectionLayout: 'market-stack',
        interaction: 'inline-expand',
    },
    activityCards: {
        profile: 'match-compact-grid',
        layout: 'compact-grid',
        cardDensity: 'compact',
        interaction: 'board-hover',
    },
    playerProps: {
        profile: 'match-stat-list',
        layout: 'list',
        categoryFilter: 'chips',
        thresholdLayout: 'pill-row',
        showStatNudge: false,
        showGoldenSubstitution: false,
        interaction: 'inline-add',
    },
    style: {
        '--component-nav-item-radius': '8px',
        '--component-match-card-hover-transform': 'translateY(-1px)',
        '--component-market-card-radius': '10px',
        '--component-market-header-min-height': '36px',
        '--component-market-body-gap': '8px',
        '--component-odds-radius': '9px',
        '--component-slip-selection-gap': '8px',
        '--component-slip-cta-radius': '8px',
        '--component-recommend-card-radius': '10px',
        '--component-recommend-card-width': '300px',
        '--component-recommend-gap': '8px',
        '--component-recommend-cta-height': '34px',
        '--component-smart-card-radius': '10px',
        '--component-smart-card-min-height': '152px',
        '--component-smart-section-gap': '8px',
        '--component-player-card-radius': '10px',
        '--component-player-gap': '8px',
        '--component-player-threshold-radius': '8px',
    },
};

const SUPERBET_PROFILE: ThemeComponentProfile = {
    brand: 'superbet',
    mode: 'dark',
    nav: {
        profile: 'superbet-pill-promo',
        activeMarker: 'pill',
        promoWeight: 'high',
    },
    matchCard: {
        profile: 'superbet-promo-card',
        listLayout: 'promo-card',
        desktopListLayout: 'promo-card',
        mobileListLayout: 'promo-card',
        useStackedMobileOdds: false,
        interaction: 'promo-lift',
    },
    marketCard: {
        profile: 'superbet-rich-grid',
        density: 'roomy',
        headerTreatment: 'pill',
    },
    oddsButton: {
        profile: 'pill-cta',
        layout: 'name-odds',
    },
    betSlip: {
        profile: 'superbet-empty-panel',
        desktop: 'working-panel',
        desktopPlacement: 'working-panel',
        desktopIdle: 'none',
        mobilePlacement: 'summary-bar',
        mobileFlow: 'cta-led-sheet',
        mobileSummaryLayout: 'superbet-metrics',
        selectionInfoOrder: 'event-selection-market',
    },
    homeRecommend: {
        profile: 'superbet-promo-rail',
        sectionLayout: 'promo-rail',
        cardDensity: 'featured',
        selectionLayout: 'event-first',
        interaction: 'cta-sheet',
    },
    activityCards: {
        profile: 'superbet-promo-mosaic',
        layout: 'promo-mosaic',
        cardDensity: 'featured',
        interaction: 'promo-lift',
    },
    playerProps: {
        profile: 'superbet-curated-rail',
        layout: 'rail',
        categoryFilter: 'chips',
        thresholdLayout: 'inline',
        showStatNudge: true,
        showGoldenSubstitution: false,
        interaction: 'cta-add',
    },
    style: {
        '--component-nav-item-radius': '999px',
        '--component-match-card-hover-transform': 'translateY(-2px)',
        '--component-superbet-desktop-main-width': '808px',
        '--component-superbet-sidebar-width': '240px',
        '--component-superbet-right-rail-width': '320px',
        '--component-superbet-promo-card-min-height': '160px',
        '--component-superbet-mobile-card-min-height': '148px',
        '--component-superbet-mobile-card-width': '276px',
        '--component-superbet-card-header-height': '24px',
        '--component-detail-category-bg': 'var(--brand-match-card-bg,var(--surface-1))',
        '--component-detail-category-border': 'var(--brand-match-card-border,var(--border-subtle))',
        '--component-detail-category-radius': '10px',
        '--component-detail-tab-active-bg': '#c21e1c',
        '--component-detail-tab-active-text': '#ffffff',
        '--component-detail-tab-desktop-active-bg': '#c21e1c',
        '--component-detail-tab-desktop-active-text': '#ffffff',
        '--component-detail-tab-radius': '999px',
        '--component-detail-tab-indicator-bg': 'transparent',
        '--component-market-card-radius': '10px',
        '--component-market-header-min-height': '44px',
        '--component-market-body-gap': '8px',
        '--component-odds-radius': '5px',
        '--component-detail-odds-shell-height': '32px',
        '--component-detail-odds-inner-height': '30px',
        '--component-slip-selection-gap': '10px',
        '--component-slip-cta-radius': '4px',
        '--component-slip-desktop-width': '320px',
        '--component-slip-desktop-shell-width': '320px',
        '--component-slip-desktop-right': '16px',
        '--component-slip-desktop-bottom': '24px',
        '--component-slip-desktop-top': 'calc(var(--desktop-nav-height) + var(--header-strip-height) + 24px)',
        '--component-slip-desktop-radius': '10px',
        '--component-slip-empty-height': '194px',
        '--component-slip-mobile-summary-height': '60px',
        '--component-slip-mobile-sheet-radius': '16px 16px 0 0',
        '--mobile-summary-bar-radius': '16px 16px 0 0',
        '--mobile-sheet-radius': '16px 16px 0 0',
        '--component-recommend-card-radius': '16px',
        '--component-recommend-card-width': '390px',
        '--component-recommend-gap': '12px',
        '--component-recommend-cta-height': '40px',
        '--component-smart-card-radius': '14px',
        '--component-smart-card-min-height': '176px',
        '--component-smart-section-gap': '12px',
        '--component-player-card-radius': '16px',
        '--component-player-gap': '12px',
        '--component-player-threshold-radius': '5px',
    },
};

const BETANO_PROFILE: ThemeComponentProfile = {
    brand: 'betano',
    mode: 'dark',
    nav: {
        profile: 'betano-orange-utility',
        activeMarker: 'underline',
        promoWeight: 'utility',
    },
    matchCard: {
        profile: 'betano-ticket-row',
        listLayout: 'ticket-row',
        desktopListLayout: 'betano-table-row',
        mobileListLayout: 'betano-ticket-card',
        useStackedMobileOdds: false,
        interaction: 'ticket-highlight',
    },
    marketCard: {
        profile: 'betano-table-ticket',
        density: 'balanced',
        headerTreatment: 'table',
    },
    oddsButton: {
        profile: 'ticket-price',
        layout: 'ticket',
    },
    betSlip: {
        profile: 'betano-my-bets-panel',
        desktop: 'utility-panel',
        desktopPlacement: 'bottom-right-drawer',
        desktopIdle: 'my-bets-rail',
        mobilePlacement: 'cta-drawer',
        mobileFlow: 'ticket-sheet',
        mobileSummaryLayout: 'ticket-cta',
        selectionInfoOrder: 'ticket-market-selection',
    },
    homeRecommend: {
        profile: 'betano-ticket-feed',
        sectionLayout: 'ticket-feed',
        cardDensity: 'ticket',
        selectionLayout: 'ticket-line',
        interaction: 'ticket-sheet',
    },
    activityCards: {
        profile: 'betano-ticket-hub',
        layout: 'ticket-hub',
        cardDensity: 'balanced',
        interaction: 'ticket-focus',
    },
    playerProps: {
        profile: 'betano-stat-matrix',
        layout: 'matrix',
        categoryFilter: 'chips',
        thresholdLayout: 'matrix',
        showStatNudge: true,
        showGoldenSubstitution: true,
        interaction: 'ticket-add',
    },
    style: {
        '--component-nav-item-radius': '8px',
        '--component-match-card-hover-transform': 'translateY(0)',
        '--component-betano-desktop-match-row-height': '74px',
        '--component-betano-desktop-time-column-width': '86px',
        '--component-betano-desktop-team-column-width': '390px',
        '--component-betano-mobile-match-card-height': '130px',
        '--component-topic-shell-bg': 'var(--brand-page-bg,var(--surface-2))',
        '--component-topic-shell-radius': '0px',
        '--component-topic-hero-bg': 'var(--brand-match-card-bg,var(--surface-1))',
        '--component-topic-hero-border': 'var(--brand-match-card-border,var(--border-subtle))',
        '--component-topic-hero-radius': '12px',
        '--component-topic-hero-min-height': '96px',
        '--component-topic-tabs-bg': 'var(--brand-match-card-bg,var(--surface-1))',
        '--component-topic-tabs-border': 'var(--brand-match-card-border,var(--border-subtle))',
        '--component-topic-card-bg': 'var(--brand-match-card-bg,var(--surface-1))',
        '--component-topic-card-border': 'var(--brand-match-card-border,var(--border-subtle))',
        '--component-detail-category-bg': 'var(--brand-match-card-bg,var(--surface-1))',
        '--component-detail-category-border': 'var(--brand-match-card-border,var(--border-subtle))',
        '--component-detail-category-radius': '12px',
        '--component-detail-tab-active-bg': '#2a3046',
        '--component-detail-tab-active-text': '#ffffff',
        '--component-detail-tab-desktop-active-bg': '#2a3046',
        '--component-detail-tab-desktop-active-text': '#ffffff',
        '--component-detail-tab-radius': '16px',
        '--component-detail-tab-indicator-bg': 'transparent',
        '--component-detail-odds-shell-height': '36px',
        '--component-detail-odds-inner-height': '34px',
        '--component-slip-desktop-width': '380px',
        '--component-slip-desktop-shell-width': '364px',
        '--component-slip-desktop-right': '16px',
        '--component-slip-desktop-bottom': '0px',
        '--component-slip-desktop-radius': '32px 32px 0 0',
        '--component-betano-right-rail-width': '320px',
        '--component-market-card-radius': '12px',
        '--component-market-header-min-height': '40px',
        '--component-market-body-gap': '10px',
        '--component-odds-radius': '8px',
        '--component-slip-selection-gap': '8px',
        '--component-slip-cta-radius': '8px',
        '--component-recommend-card-radius': '12px',
        '--component-recommend-card-width': '344px',
        '--component-recommend-gap': '10px',
        '--component-recommend-cta-height': '36px',
        '--component-smart-card-radius': '12px',
        '--component-smart-card-min-height': '164px',
        '--component-smart-section-gap': '10px',
        '--component-player-card-radius': '12px',
        '--component-player-gap': '10px',
        '--component-player-threshold-radius': '8px',
    },
};

const BETBUS_PROFILE: ThemeComponentProfile = {
    ...MATCH_PROFILE,
    brand: 'betbus',
    nav: {
        profile: 'match-command',
        activeMarker: 'block',
        promoWeight: 'low',
    },
    matchCard: {
        profile: 'match-board',
        listLayout: 'board',
        desktopListLayout: 'board-row',
        mobileListLayout: 'stacked-card',
        useStackedMobileOdds: false,
        interaction: 'subtle-lift',
    },
    marketCard: {
        profile: 'match-dense-accordion',
        density: 'compact',
        headerTreatment: 'flat',
    },
    oddsButton: {
        profile: 'price-first',
        layout: 'odds-emphasis',
    },
    betSlip: {
        profile: 'match-working-panel',
        desktop: 'working-panel',
        desktopPlacement: 'working-panel',
        desktopIdle: 'none',
        mobilePlacement: 'summary-bar',
        mobileFlow: 'compact-sheet',
        mobileSummaryLayout: 'compact-dock',
        selectionInfoOrder: 'market-selection-event',
    },
    homeRecommend: {
        profile: 'match-market-board',
        sectionLayout: 'board-rail',
        cardDensity: 'compact',
        selectionLayout: 'market-stack',
        interaction: 'inline-expand',
    },
    activityCards: {
        profile: 'match-compact-grid',
        layout: 'compact-grid',
        cardDensity: 'compact',
        interaction: 'board-hover',
    },
    style: {
        '--component-nav-item-radius': '4px',
        '--component-match-card-hover-transform': 'translateY(0)',
        '--component-market-card-radius': '4px',
        '--component-market-header-min-height': '40px',
        '--component-market-body-gap': '10px',
        '--component-odds-radius': '4px',
        '--component-slip-selection-gap': '8px',
        '--component-slip-cta-radius': '4px',
        '--component-recommend-card-radius': '4px',
        '--component-recommend-card-width': '312px',
        '--component-recommend-gap': '10px',
        '--component-recommend-cta-height': '34px',
        '--component-smart-card-radius': '4px',
        '--component-smart-card-min-height': '154px',
        '--component-smart-section-gap': '8px',
        '--component-player-card-radius': '4px',
        '--component-player-gap': '8px',
        '--component-player-threshold-radius': '4px',
    },
};

const GTB_PROFILE: ThemeComponentProfile = {
    ...BETBUS_PROFILE,
    brand: 'betbus',
};

/* iOS26 液态玻璃：沿用 match 的结构（board/price-first/working-panel），仅放大圆角到玻璃质感。 */
const GLASS_PROFILE: ThemeComponentProfile = {
    ...MATCH_PROFILE,
    brand: 'glass',
    style: {
        ...MATCH_PROFILE.style,
        '--component-nav-item-radius': '14px',
        '--component-match-card-hover-transform': 'translateY(-1px)',
        '--component-market-card-radius': '18px',
        '--component-odds-radius': '14px',
        '--component-slip-cta-radius': '999px',
        '--component-recommend-card-radius': '18px',
        '--component-smart-card-radius': '18px',
        '--component-player-card-radius': '18px',
        '--component-player-threshold-radius': '999px',
    },
};

/* CIS 投后视觉识别：沿用 match 的结构（board/price-first/working-panel），圆角收敛到 8px 卡 / 6px 控件。 */
const CIS_PROFILE: ThemeComponentProfile = {
    ...MATCH_PROFILE,
    brand: 'cis',
    style: {
        ...MATCH_PROFILE.style,
        '--component-nav-item-radius': '6px',
        '--component-market-card-radius': '8px',
        '--component-odds-radius': '6px',
        '--component-slip-cta-radius': '6px',
        '--component-recommend-card-radius': '8px',
        '--component-smart-card-radius': '8px',
        '--component-player-card-radius': '8px',
        '--component-player-threshold-radius': '6px',
    },
};

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type UnknownRecord = Record<string, unknown>;

const isMergeableObject = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * 不可变深合并：纯对象递归、叶子值（含数组）直接覆盖、undefined 补丁原样返回基底。
 * 绝不修改入参——基底是模块级 singleton，必须 copy-on-write。
 */
const mergeInto = <T>(base: T, patch: unknown): T => {
    if (patch === undefined) return base;
    if (!isMergeableObject(base) || !isMergeableObject(patch)) return patch as T;
    const result: UnknownRecord = { ...base };
    for (const key of Object.keys(patch)) {
        result[key] = mergeInto((base as UnknownRecord)[key], (patch as UnknownRecord)[key]);
    }
    return result as T;
};

const deepMerge = <T>(base: T, ...patches: Array<DeepPartial<T> | undefined>): T =>
    patches.reduce<T>((acc, patch) => mergeInto(acc, patch), base);

/** 每个 brand 的结构基底（亮暗共用）。 */
const BRAND_PROFILE_BASE: Record<SchemeBrand, ThemeComponentProfile> = {
    match: MATCH_PROFILE,
    superbet: SUPERBET_PROFILE,
    betano: BETANO_PROFILE,
    betbus: BETBUS_PROFILE,
    glass: GLASS_PROFILE,
    cis: CIS_PROFILE,
};

/**
 * 可选的「按 mode 发散」补丁：仅在某 brand 的某 mode 确需改结构 / 尺寸时填写。
 * 留空 = 该 brand 亮暗共用基底（多数情况）。这是补齐「情况 B 沿 mode」缺口的入口。
 *
 * 例：betano 浅色把投注单从抽屉换成右栏——
 * betano: { light: { betSlip: { desktopPlacement: 'right-rail-panel' },
 *                    style: { '--component-slip-desktop-radius': '12px' } } }
 */
const BRAND_PROFILE_MODE_PATCH: Partial<
    Record<SchemeBrand, Partial<Record<SchemeMode, DeepPartial<ThemeComponentProfile>>>>
> = {};

/**
 * 结构解析器：scheme = brand × mode。
 * gtb 为历史特例，单独以 GTB_PROFILE 为基底，不并入 brand 补丁。
 * 当 BRAND_PROFILE_MODE_PATCH 为空时，结果与旧 `withMode` 逐字段一致（纯重构、零行为变化）。
 */
export const resolveThemeProfile = (schemeMeta: SchemeMeta): ThemeComponentProfile => {
    const modePatch: DeepPartial<ThemeComponentProfile> = { mode: schemeMeta.mode };

    if (schemeMeta.scheme === 'gtb') {
        return deepMerge(GTB_PROFILE, modePatch);
    }

    return deepMerge(
        BRAND_PROFILE_BASE[schemeMeta.brand],
        modePatch,
        BRAND_PROFILE_MODE_PATCH[schemeMeta.brand]?.[schemeMeta.mode],
    );
};

/** @deprecated 改用 `resolveThemeProfile`；保留为向后兼容别名。 */
export const getThemeComponentProfile = resolveThemeProfile;

export const useThemeComponentProfile = (): ThemeComponentProfile => {
    const schemeMeta = useSchemeMeta();

    return useMemo(() => resolveThemeProfile(schemeMeta), [schemeMeta]);
};
