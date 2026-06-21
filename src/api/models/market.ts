import { extractSpecifierNum } from '@/utils/specifier';

/** Investment option model */
export interface OutcomeModel {
    /** Primary key serial number */
    id: string;
    /** Option name (e.g., "home", "away", "over", "under") */
    name: string;
    /** Alias used for compact UI labels when provided by API */
    name_alias?: string;
    /** Short label used by match list odds buttons when provided by API */
    quick_name?: string;
    /** Odds */
    odds: number;
    line: string;
    /** Whether bettable */
    active: OutcomeActiveEnum;
    /** Display sort order within a market line (ascending) */
    sorted?: number;
    /** 投注项最新赔率更新时间。 */
    last_update?: number;
    /** 投注项图标地址。 */
    icon?: string;
}

/** WS 新增投注项名称补全请求项 */
export interface OutcomeNameBatchItem {
    /** 赛事 ID */
    event_id: string;
    /** 市场 ID */
    market_id: number;
    /** 投注项 ID */
    outcome_id: string;
    /** WS 推送的投注项名称 */
    outcome_name: string;
    /** WS 推送的投注项盘口线 */
    outcome_line: string;
}

/** WS 新增投注项名称补全接口返回项 */
export interface OutcomeNameBatchResponseItem {
    /** 赛事 ID */
    event_id: string;
    /** 市场 ID */
    market_id: number;
    /** 投注项 ID */
    outcome_id: string;
    /** 接口返回的投注项名称 */
    outcome_name: string;
    /** 接口返回的完整展示别名 */
    outcome_name_alias?: string;
    /** 接口返回的快捷展示名称 */
    outcome_quick_name?: string;
}

/** WS 新增投注项名称补全后的内部项 */
export interface OutcomeNameBatchResolvedItem extends OutcomeNameBatchItem {
    /** 接口返回的展示名称 */
    name: string;
    /** 完整展示别名 */
    name_alias?: string;
    /** 快捷展示名称 */
    quick_name?: string;
}

/**
 * Market line — a single bet line identified by market_id + specifiers.
 * Renamed from SpecifierModel to align with SportRadar "market line" semantics.
 */
export interface MarketLine {
    /** Primary key serial number */
    id: number;
    /** Product identifier used by alive state and line matching */
    product: string;
    /** Raw product value used by cart/order payloads */
    product_raw: string;
    /** Specifier value (e.g., handicap=1.5) */
    specifiers: string;
    /** Backend-provided row label for detail-page table layouts */
    row?: string;
    /** Whether this line is the backend-selected main handicap/total line */
    is_main_line?: boolean;
    /** Line status */
    line_status: LineStatus;
    /** Outcome list */
    outcomes: OutcomeModel[];
}

/** @deprecated Use {@link MarketLine} instead */
export type SpecifierModel = MarketLine;

/**
 * Backend-driven card layout type for the match-detail market card.
 */
export enum MarketCardType {
    /** Standard grid fallback: no Line / CS BaseLine; single row with fewer than 6 outcomes. */
    Type1 = 1,
    /** Multi-row variable layout: any Bets[*].Line is non-empty; also works for a single row. */
    Type2 = 2,
    /** Dense layout: no Line / CS BaseLine; exactly one row with 6 or more outcomes. */
    Type3 = 3,
    /** Correct Score layout: no Line; Bets[*].BaseLine is Home Win / Draw / Away Win; market_id=6. */
    CorrectScore = 4,
    /** Handicap layout: split lines flagged `is_main_line` into a primary card. */
    Type5 = 5,
    /** Under/Over layout: split lines flagged `is_main_line` into a primary card. */
    Type6 = 6,
}

export function isRowBasedMarketCardType(cardType: MarketCardType | undefined): boolean {
    return cardType === MarketCardType.Type2 || isMainLineSplitMarketCardType(cardType);
}

export function isMainLineSplitMarketCardType(cardType: MarketCardType | undefined): boolean {
    return cardType === MarketCardType.Type5 || cardType === MarketCardType.Type6;
}

/**
 * Market group — a visual grouping of market lines sharing the same display name.
 * Renamed from MarketModel to align with SportRadar "market" semantics.
 */
export interface MarketGroup {
    /** Market ID */
    id: number;
    /** Backend alias for market ID */
    market_id?: number;
    /** Market name (resolved display name) */
    name: string;
    /** Backend-provided card layout hint for detail page */
    card_type?: MarketCardType;
    /** Backend-provided column headers for detail page */
    col?: string[];
    /** Market lines (bet lines with different specifier values) */
    lines: MarketLine[];
}

/** @deprecated Use {@link MarketGroup} instead */
export type MarketModel = MarketGroup;

/** Line status */
export enum LineStatus {
    /** Show button */
    Active = 1,
    /** Hide button */
    Deactivated = 0,
    /** Show button, but locked */
    Suspended = -1,
    /** Hide button */
    HandedOver = -2,
    /** Hide button */
    Settled = -3,
    /** Hide button */
    Cancelled = -4,
}

export enum ProductEnum {
    /** Live */
    Live = '1',
    /** Pre-match */
    PreMatch = '3',
}

/** 下单/活动规则使用的原始产品类型。 */
export enum ProductRawEnum {
    Inplay = 'inplay',
    PreMatch = 'prematch',
}

/** 将 product ID 或 WS 下发的 product_raw 规范为 inplay/prematch。 */
export const resolveProductRaw = (product: string, productRaw?: string): string => {
    if (productRaw) return productRaw;

    switch (product) {
        case ProductEnum.Live:
            return ProductRawEnum.Inplay;
        case ProductEnum.PreMatch:
            return ProductRawEnum.PreMatch;
        default:
            throw new Error(`Unknown product for product_raw: ${product}`);
    }
};

export enum OutcomeActiveEnum {
    /** Legacy fallback when backend omits `active`; treated as hidden by UI helpers */
    Inactive = 0,
    Active = 1,
    Locked = 2,
    Hidden = 3,
}

export const shouldShowOutcome = (active: OutcomeActiveEnum | undefined): boolean => {
    return active === OutcomeActiveEnum.Active || active === OutcomeActiveEnum.Locked;
};

export const isOutcomeActiveLocked = (active: OutcomeActiveEnum | undefined): boolean => {
    return active === OutcomeActiveEnum.Locked;
};

export function filterVisibleOutcomes<T extends Pick<OutcomeModel, 'active'>>(outcomes: T[]): T[] {
    return outcomes.filter((outcome) => shouldShowOutcome(outcome.active));
}

/**
 * Generate composite unique key for a market
 * Format: "${variantId}:${marketId}"
 */
export const getMarketKey = (marketId: number, variantId: string): string => `${variantId}:${marketId}`;

/**
 * Derive a unique group identifier from a MarketGroup for indexing / dedup / React key.
 * Format: "${id}:${name}"
 */
export function getMarketGroupId(market: Pick<MarketGroup, 'id' | 'name'>): string {
    return `${market.id}:${market.name}`;
}

function sortMarketLines(lines: MarketLine[]): MarketLine[] {
    return [...lines].sort((a, b) => extractSpecifierNum(a.specifiers) - extractSpecifierNum(b.specifiers));
}

/**
 * Comparator for outcomes within a market line.
 * Prefers backend-provided `sorted` order; otherwise preserves API order.
 */
export function compareOutcomesByDisplayOrder(a: OutcomeModel, b: OutcomeModel): number {
    if (a.sorted !== undefined && b.sorted !== undefined && a.sorted !== b.sorted) {
        return a.sorted - b.sorted;
    }
    return 0;
}

export function mergeMarketGroupsByGroupId<T extends MarketGroup>(markets: T[]): T[] {
    const merged = new Map<string, T>();

    for (const market of markets) {
        const key = getMarketGroupId(market);
        const existing = merged.get(key);

        if (!existing) {
            merged.set(key, {
                ...market,
                lines: sortMarketLines(market.lines),
            } as T);
            continue;
        }

        merged.set(key, {
            ...existing,
            ...market,
            lines: sortMarketLines([...existing.lines, ...market.lines]),
        } as T);
    }

    return Array.from(merged.values());
}

export function normalizeMarketGroups(markets?: MarketGroup[] | null): Array<MarketGroup> {
    if (!markets?.length) {
        return [];
    }

    return mergeMarketGroupsByGroupId(
        markets.map((market) => ({
            ...market,
            id: market.id ?? market.market_id,
            lines: market.lines
                .map((line) => ({
                    ...line,
                    outcomes: filterVisibleOutcomes(line.outcomes),
                }))
                .filter((line) => line.outcomes.length > 0),
        })),
    );
}
