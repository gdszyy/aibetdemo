'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { MarketCardType, type MarketGroup, type MarketLine, type OutcomeModel } from '@/api/models/market';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible/collapsible';
import { ArrowDown } from '@/components/icons';
import { DoubleArrowDownOutlined } from '@/components/icons2/DoubleArrowDownOutlined';
import { ExclamationCircleOutlined } from '@/components/icons2/ExclamationCircleOutlined';
import { FavoriteOutlined } from '@/components/icons2/FavoriteOutlined';
import { type MarketCardProfile, useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Toast } from '@/components/toast';
import { cn } from '@/utils/common';
import { useForceCollapse } from '../_hooks/use-force-collapse';
import { createOddsEntity } from '../_logic/odds-factory';
import { parseCorrectScore, resolveCorrectScoreColumn } from '../_utils/match-utils';
import { sortDetailMarketOutcomes } from '../_utils/outcome-sort';
import { BetBtnStandard } from './bet-btn-standard';
import { MarketTooltipTrigger } from './market-tooltip-trigger';

interface BetItemProps {
    /** Market data from API (Market detail page or Popular Market expander) */
    market: MarketGroup;
    /** Match context for building OddsEntity */
    eventId: string;
    eventIdType: string;
    tournamentId: string;
    /** 地区 ID，用于活动规则 region_id 匹配。 */
    categoryId?: string;
    sportId: string;
    matchTitle: string;
    /** Unique ID for tracking in parent's collapse management */
    itemId?: number;
    /** Callback when expansion state changes */
    onExpandChange?: (itemId: number, expanded: boolean) => void;
    /** Force expanded from parent */
    forceExpanded?: boolean;
    /** Show all lines (detail view) or only the first one (list view). Default: false */
    showAllLines?: boolean;
    /** Visual treatment by page surface. */
    surface?: 'default' | 'detail';
    /** 当前语言的市场说明文案。 */
    tooltipDesc?: string;
}

interface ContentProps {
    market: MarketGroup;
    visibleLines: MarketLine[];
    ctx: MatchContext;
    surface?: BetItemProps['surface'];
}

type MatchContext = Pick<
    BetItemProps,
    'eventId' | 'eventIdType' | 'tournamentId' | 'categoryId' | 'sportId' | 'matchTitle'
>;

const buildOddsEntity = (ctx: MatchContext, market: MarketGroup, line: MarketLine, outcome: OutcomeModel) =>
    createOddsEntity(
        { event_id: ctx.eventId, event_id_type: ctx.eventIdType },
        {
            sportId: ctx.sportId,
            tournamentId: ctx.tournamentId,
            categoryId: ctx.categoryId,
            matchTitle: ctx.matchTitle,
        },
        market,
        line,
        outcome,
    );

type BetItemSurface = NonNullable<BetItemProps['surface']>;

const BET_ITEM_SURFACE_CLASS: Record<
    BetItemSurface,
    {
        body: string;
        row: string;
        header: string;
        headerWrap: string;
        label: string;
        headerLabel: string;
        buttonSurface: 'default' | 'detail';
    }
> = {
    default: {
        body: 'p-4 gap-[var(--component-market-body-gap,12px)]',
        row: 'gap-x-2 gap-y-3',
        header: 'gap-2 px-2 pb-1 items-end',
        headerWrap: 'flex flex-col gap-3 p-4',
        label: 'text-center text-auxiliary-sm text-filltext-ft-g font-medium tabular-nums wrap-break-word',
        headerLabel: 'text-center text-auxiliary-sm text-filltext-ft-e capitalize wrap-break-word',
        buttonSurface: 'default',
    },
    detail: {
        body: 'gap-[var(--component-market-body-gap,8px)] px-2 py-2 md:py-2',
        row: 'gap-x-2 gap-y-2',
        header: 'gap-2 px-2 py-2',
        headerWrap: 'flex flex-col',
        label: 'text-center text-auxiliary-sm text-filltext-ft-g font-medium tabular-nums wrap-break-word',
        headerLabel: 'text-center text-auxiliary-sm text-filltext-ft-g uppercase wrap-break-word',
        buttonSurface: 'detail',
    },
} as const;

const getSurfaceClasses = (surface: BetItemProps['surface']) => BET_ITEM_SURFACE_CLASS[surface ?? 'default'];

/** Type5 卡片默认展示的最大行数。 */
const TYPE5_MAX_VISIBLE_LINES = 6;

const BetItemHeader: FC<{
    isExpanded: boolean;
    marketName: string;
    surface: BetItemSurface;
    marketCardProfile: MarketCardProfile;
    tooltipDesc?: string;
    onComingSoonClick: () => void;
}> = ({ isExpanded, marketName, surface, marketCardProfile, tooltipDesc, onComingSoonClick }) => {
    const isDetail = surface === 'detail';
    const tooltipIcon = <ExclamationCircleOutlined className="size-4" />;

    return (
        <div
            className={cn(
                'flex min-h-[var(--component-market-header-min-height,2.5rem)] flex-row items-start justify-between border-filltext-ft-c transition-colors',
                isDetail ? 'min-h-9 bg-surface-2 px-3' : 'border-b px-4',
                marketCardProfile === 'superbet-rich-grid' &&
                    'border-[color:var(--brand-match-divider,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] px-3 md:px-4',
                marketCardProfile === 'betano-table-ticket' &&
                    'border-[color:var(--brand-match-card-border,var(--border-subtle))] border-b bg-[var(--brand-match-card-bg,var(--surface-1))]',
            )}
        >
            <CollapsibleTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex min-w-0 flex-1 cursor-pointer items-center text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                        isDetail
                            ? 'min-h-[var(--component-market-header-min-height,2.25rem)] py-2'
                            : 'min-h-[var(--component-market-header-min-height,2.5rem)] py-2.5',
                    )}
                >
                    <span
                        className={cn(
                            'whitespace-normal text-filltext-ft-g capitalize leading-5 wrap-break-word',
                            isDetail ? 'text-body-md font-bold text-filltext-ft-h' : 'text-body-lg',
                            marketCardProfile === 'superbet-rich-grid' &&
                                'text-[var(--brand-match-team-text,var(--filltext-ft-h))]',
                        )}
                    >
                        {marketName}
                    </span>
                </button>
            </CollapsibleTrigger>

            <div
                className={cn(
                    'flex min-h-[var(--component-market-header-min-height,2.5rem)] items-center justify-center',
                    isDetail ? 'gap-4 text-filltext-ft-e' : 'size-3',
                )}
            >
                {isDetail && (
                    <>
                        {tooltipDesc ? (
                            <MarketTooltipTrigger title={marketName} desc={tooltipDesc}>
                                {tooltipIcon}
                            </MarketTooltipTrigger>
                        ) : (
                            <button
                                type="button"
                                onClick={onComingSoonClick}
                                className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                            >
                                {tooltipIcon}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onComingSoonClick}
                            className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-e focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                        >
                            <FavoriteOutlined className="size-4" />
                        </button>
                    </>
                )}
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="flex size-3 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                    >
                        <ArrowDown
                            className={cn(
                                'size-3 transition-transform duration-200 ease-in-out',
                                isExpanded && 'rotate-180',
                            )}
                        />
                    </button>
                </CollapsibleTrigger>
            </div>
        </div>
    );
};

const Type1Content: FC<ContentProps> = ({ market, visibleLines, ctx, surface }) => {
    const surfaceClasses = getSurfaceClasses(surface);

    return (
        <div className={cn('flex flex-col', surfaceClasses.body)}>
            {visibleLines.map((line) => {
                const sortedOutcomes = sortDetailMarketOutcomes(market.id, line.outcomes);
                const colCount = Math.min(Math.max(sortedOutcomes.length, 2), 5);
                return (
                    <div
                        key={line.id || line.specifiers}
                        className={cn('grid', surfaceClasses.row)}
                        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
                    >
                        {sortedOutcomes.map((outcome) => (
                            <BetBtnStandard
                                key={outcome.id}
                                oddsEntity={buildOddsEntity(ctx, market, line, outcome)}
                                layout="vertical"
                                surface={surfaceClasses.buttonSurface}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

function resolveType2ColumnHeaders(market: MarketGroup, outcomes: OutcomeModel[]): string[] {
    if (!market.col?.length) {
        return sortDetailMarketOutcomes(market.id, outcomes).map((outcome) => outcome.quick_name || outcome.name);
    }

    return market.col;
}

const Type2Content: FC<ContentProps> = ({ market, visibleLines, ctx, surface }) => {
    const colHeaders = resolveType2ColumnHeaders(market, visibleLines[0]?.outcomes ?? []);
    const colCount = Math.max(colHeaders.length, ...visibleLines.map((line) => line.outcomes.length), 0);
    const gridTemplate = `minmax(min-content, 44px) repeat(${colCount}, minmax(0, 1fr))`;
    const surfaceClasses = getSurfaceClasses(surface);

    return (
        <div className={surfaceClasses.headerWrap}>
            {colHeaders.length > 0 && (
                <div
                    className={cn(
                        'grid',
                        surfaceClasses.header,
                        surface === 'detail' && 'border-filltext-ft-c border-b bg-surface-1',
                    )}
                    style={{ gridTemplateColumns: gridTemplate }}
                >
                    <div />
                    {colHeaders.map((header, index) => (
                        <span key={`${header}-${index.toString()}`} className={surfaceClasses.headerLabel}>
                            {header}
                        </span>
                    ))}
                </div>
            )}

            <div className={cn('flex flex-col gap-3', surface === 'detail' && 'px-3 py-3')}>
                {visibleLines.map((line) => {
                    const sorted = sortDetailMarketOutcomes(market.id, line.outcomes);
                    const placeholders = Math.max(colCount - sorted.length, 0);
                    const key = line.id || line.specifiers;

                    return (
                        <div
                            key={key}
                            className="grid items-center gap-x-2"
                            style={{ gridTemplateColumns: gridTemplate }}
                        >
                            <span className={surfaceClasses.label}>{line.row}</span>
                            {sorted.map((outcome) => (
                                <BetBtnStandard
                                    key={outcome.id}
                                    oddsEntity={buildOddsEntity(ctx, market, line, outcome)}
                                    layout="auto"
                                    showName={false}
                                    surface={surfaceClasses.buttonSurface}
                                />
                            ))}
                            {Array.from({ length: placeholders }).map((_, i) => (
                                <div key={`${key}-empty-${i.toString()}`} />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Type5Content: FC<ContentProps> = ({ market, visibleLines, ctx, surface }) => {
    const t = useTranslations('matches');
    const [isRowsExpanded, setIsRowsExpanded] = useState(false);
    const prevLinesKeyRef = useRef('');
    const linesKey = useMemo(
        () => visibleLines.map((line) => `${line.id}:${line.specifiers}`).join('|'),
        [visibleLines],
    );
    const colHeaders = resolveType2ColumnHeaders(market, visibleLines[0]?.outcomes ?? []);
    const colCount = Math.max(colHeaders.length, ...visibleLines.map((line) => line.outcomes.length), 0);
    const gridTemplate = `repeat(${colCount}, minmax(0, 1fr))`;
    const surfaceClasses = getSurfaceClasses(surface);
    const hasHiddenLines = visibleLines.length > TYPE5_MAX_VISIBLE_LINES;
    const displayedLines = isRowsExpanded ? visibleLines : visibleLines.slice(0, TYPE5_MAX_VISIBLE_LINES);
    const hiddenLineCount = Math.max(visibleLines.length - TYPE5_MAX_VISIBLE_LINES, 0);

    if (prevLinesKeyRef.current !== linesKey) {
        prevLinesKeyRef.current = linesKey;
        setIsRowsExpanded(false);
    }

    const renderLineRow = (line: MarketLine) => {
        const sorted = sortDetailMarketOutcomes(market.id, line.outcomes);
        const placeholders = Math.max(colCount - sorted.length, 0);
        const key = line.id || line.specifiers;

        return (
            <div key={key} className="grid items-center gap-x-2" style={{ gridTemplateColumns: gridTemplate }}>
                {sorted.map((outcome) => (
                    <BetBtnStandard
                        key={outcome.id}
                        oddsEntity={buildOddsEntity(ctx, market, line, outcome)}
                        displayNameOverride={
                            outcome.line?.trim() || outcome.quick_name || outcome.name_alias || outcome.name
                        }
                        layout="vertical"
                        surface={surfaceClasses.buttonSurface}
                    />
                ))}
                {Array.from({ length: placeholders }).map((_, i) => (
                    <div key={`${key}-empty-${i.toString()}`} />
                ))}
            </div>
        );
    };

    return (
        <div className={surfaceClasses.headerWrap}>
            {colHeaders.length > 0 && (
                <div
                    className={cn(
                        'grid',
                        surfaceClasses.header,
                        surface === 'detail' && 'border-filltext-ft-c border-b bg-surface-1',
                    )}
                    style={{ gridTemplateColumns: gridTemplate }}
                >
                    {colHeaders.map((header, index) => (
                        <span key={`${header}-${index.toString()}`} className={surfaceClasses.headerLabel}>
                            {header}
                        </span>
                    ))}
                </div>
            )}

            <div className={cn('flex flex-col gap-3', surface === 'detail' && 'px-3 pt-3', !hasHiddenLines && 'pb-3')}>
                {displayedLines.map(renderLineRow)}
                {hasHiddenLines && (
                    <div className={cn(surface === 'detail' && '-mx-3 border-filltext-ft-c border-t')}>
                        <button
                            type="button"
                            onClick={() => setIsRowsExpanded((prev) => !prev)}
                            className={cn(
                                'flex h-10 w-full cursor-pointer items-center justify-center text-body-sm leading-none text-filltext-ft-f transition-colors hover:text-filltext-ft-g focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                                surface === 'detail' && 'px-3',
                            )}
                        >
                            <span className="inline-flex items-center gap-2">
                                <span>
                                    {isRowsExpanded ? t('showLess') : t('showMore', { count: hiddenLineCount })}
                                </span>
                                <DoubleArrowDownOutlined
                                    className={cn(
                                        'block size-3 shrink-0 overflow-visible transition-transform duration-200 ease-in-out',
                                        isRowsExpanded && 'rotate-180',
                                    )}
                                />
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

let measureCanvas: HTMLCanvasElement | null = null;

function measureTextWidth(text: string, font = '13px Inter, sans-serif'): number {
    if (typeof document === 'undefined') return text.length * 8;
    measureCanvas ??= document.createElement('canvas');
    const ctx = measureCanvas.getContext('2d');
    if (!ctx) return text.length * 8;
    ctx.font = font;
    return ctx.measureText(text).width;
}

function resolveType3Cols(outcomes: OutcomeModel[], containerWidth: number): number {
    const buttonPadding = 24;
    const oddsWidth = 36;
    const gap = 8;
    const minWidth = 60;
    const shouldAvoidSingleLastItem = outcomes.length <= 12;
    const maxNameWidth = Math.max(...outcomes.map((o) => measureTextWidth(o.name ?? '')), 0);
    const buttonWidth = Math.max(maxNameWidth + buttonPadding, oddsWidth + buttonPadding, minWidth);

    for (let cols = 4; cols >= 1; cols -= 1) {
        if (cols * buttonWidth + (cols - 1) * gap > containerWidth) continue;
        if (shouldAvoidSingleLastItem && cols > 1 && outcomes.length % cols === 1) continue;
        return cols;
    }
    return 1;
}

const Type3Content: FC<ContentProps> = ({ market, visibleLines, ctx, surface }) => {
    const allOutcomes = useMemo(
        () => visibleLines.flatMap((line) => sortDetailMarketOutcomes(market.id, line.outcomes)),
        [market.id, visibleLines],
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(4);
    const surfaceClasses = getSurfaceClasses(surface);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const width = el.getBoundingClientRect().width;
            if (width > 0) setColumns(resolveType3Cols(allOutcomes, width));
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [allOutcomes]);

    return (
        <div ref={containerRef} className={cn('flex flex-col', surfaceClasses.body)}>
            {visibleLines.map((line) => {
                const sortedOutcomes = sortDetailMarketOutcomes(market.id, line.outcomes);

                return (
                    <div
                        key={line.id || line.specifiers}
                        className={cn('grid', surfaceClasses.row)}
                        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                    >
                        {sortedOutcomes.map((outcome) => (
                            <BetBtnStandard
                                key={outcome.id}
                                oddsEntity={buildOddsEntity(ctx, market, line, outcome)}
                                layout="vertical"
                                surface={surfaceClasses.buttonSurface}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Bucket outcomes into [home, draw, away] columns by parsing scores from `outcome.name`.
 * Index aligns with `market.col` ordering (assumed to be [home, draw, away]).
 */
function compareCorrectScoreOutcomes(a: OutcomeModel, b: OutcomeModel): number {
    const scoreA = parseCorrectScore(a.name);
    const scoreB = parseCorrectScore(b.name);

    if (!scoreA || !scoreB) return 0;

    return scoreA.home - scoreB.home || scoreA.away - scoreB.away;
}

function groupByCorrectScoreColumn(outcomes: OutcomeModel[]): OutcomeModel[][] {
    const groups: OutcomeModel[][] = [[], [], []];
    for (const outcome of outcomes) {
        const idx = resolveCorrectScoreColumn(outcome.name);
        if (idx !== null) groups[idx].push(outcome);
    }
    return groups.map((group) => [...group].sort(compareCorrectScoreOutcomes));
}

function getCorrectScoreColumnCount(columnCount: number): number {
    return Math.min(Math.max(columnCount, 2), 5);
}

function CorrectScoreSingleColumnContent({
    line,
    outcomes,
    market,
    ctx,
    surfaceClasses,
}: {
    line: MarketLine;
    outcomes: OutcomeModel[];
    market: MarketGroup;
    ctx: MatchContext;
    surfaceClasses: ReturnType<typeof getSurfaceClasses>;
}) {
    const colCount = getCorrectScoreColumnCount(outcomes.length);

    return (
        <div
            key={line.id || line.specifiers}
            className={cn('grid', surfaceClasses.row)}
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
            {outcomes.map((outcome) => (
                <BetBtnStandard
                    key={outcome.id}
                    oddsEntity={buildOddsEntity(ctx, market, line, outcome)}
                    layout="vertical"
                    surface={surfaceClasses.buttonSurface}
                />
            ))}
        </div>
    );
}

const CorrectScoreContent: FC<ContentProps> = ({ market, visibleLines, ctx, surface }) => {
    const labels = market.col ?? [];
    const surfaceClasses = getSurfaceClasses(surface);

    return (
        <div className={cn('flex flex-col', surfaceClasses.body)}>
            {visibleLines.map((line) => {
                const lineKey = line.id || line.specifiers;
                const cols = groupByCorrectScoreColumn(line.outcomes);
                const visibleCols = cols.flatMap((col, index) =>
                    col.length > 0
                        ? [
                              {
                                  label: labels[index],
                                  outcomes: col,
                              },
                          ]
                        : [],
                );

                if (visibleCols.length === 0) return null;

                if (visibleCols.length === 1) {
                    return (
                        <CorrectScoreSingleColumnContent
                            key={lineKey}
                            line={line}
                            outcomes={visibleCols[0].outcomes}
                            market={market}
                            ctx={ctx}
                            surfaceClasses={surfaceClasses}
                        />
                    );
                }

                const rowCount = Math.max(...visibleCols.map((col) => col.outcomes.length));
                const gridTemplate = `repeat(${visibleCols.length}, minmax(0, 1fr))`;

                return (
                    <div key={lineKey} className="flex flex-col gap-3">
                        <div className="grid gap-2" style={{ gridTemplateColumns: gridTemplate }}>
                            {visibleCols.map((col) => (
                                <span key={col.label} className={surfaceClasses.headerLabel}>
                                    {col.label}
                                </span>
                            ))}
                        </div>
                        {Array.from({ length: rowCount })
                            .map((_, rowIdx) => rowIdx)
                            .map((rowIdx) => (
                                <div
                                    key={`${lineKey}-row-${rowIdx}`}
                                    className="grid gap-x-2 gap-y-3"
                                    style={{ gridTemplateColumns: gridTemplate }}
                                >
                                    {visibleCols.map((col) => {
                                        const outcome = col.outcomes[rowIdx];
                                        return outcome ? (
                                            <BetBtnStandard
                                                key={outcome.id}
                                                oddsEntity={buildOddsEntity(ctx, market, line, outcome)}
                                                layout="auto"
                                                surface={surfaceClasses.buttonSurface}
                                            />
                                        ) : (
                                            <div key={`${lineKey}-empty-${rowIdx}-${col.label}`} />
                                        );
                                    })}
                                </div>
                            ))}
                    </div>
                );
            })}
        </div>
    );
};

const CONTENT_BY_CARD_TYPE: Record<MarketCardType, FC<ContentProps>> = {
    [MarketCardType.Type1]: Type1Content,
    [MarketCardType.Type2]: Type2Content,
    [MarketCardType.Type3]: Type3Content,
    [MarketCardType.CorrectScore]: CorrectScoreContent,
    [MarketCardType.Type5]: Type5Content,
    [MarketCardType.Type6]: Type2Content,
};

/**
 * BetItem - Standardized Accordion for a single Market.
 * Uses backend-provided card_type / col / row to drive the detail-card layout.
 */
export const BetItem: FC<BetItemProps> = ({
    market,
    eventId,
    eventIdType,
    tournamentId,
    categoryId,
    sportId,
    matchTitle,
    itemId,
    onExpandChange,
    forceExpanded = true,
    showAllLines = false,
    surface = 'default',
    tooltipDesc,
}) => {
    const tCommon = useTranslations('common');
    const componentProfile = useThemeComponentProfile();
    const isBetanoMarketCard = componentProfile.marketCard.profile === 'betano-table-ticket';
    const isSuperbetMarketCard = componentProfile.marketCard.profile === 'superbet-rich-grid';
    const [isExpanded, setIsExpanded] = useForceCollapse(!forceExpanded);
    const displayableLines =
        market.card_type === MarketCardType.Type5
            ? market.lines.filter((line) => line.outcomes.length >= 2)
            : market.lines;
    const visibleLines = showAllLines ? displayableLines : displayableLines.slice(0, 1);

    if (visibleLines.length === 0) return null;

    const handleOpenChange = (open: boolean) => {
        setIsExpanded(open);
        if (itemId !== undefined) onExpandChange?.(itemId, open);
    };

    const ctx: MatchContext = { eventId, eventIdType, tournamentId, categoryId, sportId, matchTitle };
    const Content = CONTENT_BY_CARD_TYPE[market.card_type ?? MarketCardType.Type1] ?? Type1Content;
    const handleComingSoonClick = () => {
        Toast.info(tCommon('message.coming'), { id: 'coming-soon', duration: 650 });
    };

    return (
        <Collapsible
            open={isExpanded}
            onOpenChange={handleOpenChange}
            className={cn(
                'flex w-full flex-col overflow-hidden rounded-[var(--component-market-card-radius,var(--style-radius-card))]',
                surface === 'detail' ? 'bg-surface-muted' : 'bg-surface-1',
                isSuperbetMarketCard &&
                    'border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] shadow-[var(--brand-match-card-shadow,var(--style-card-shadow))]',
                isBetanoMarketCard &&
                    'border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))]',
            )}
            data-market-card-profile={componentProfile.marketCard.profile}
            data-market-card-density={componentProfile.marketCard.density}
            data-market-header-treatment={componentProfile.marketCard.headerTreatment}
            data-odds-profile={componentProfile.oddsButton.profile}
            style={componentProfile.style}
        >
            <BetItemHeader
                isExpanded={isExpanded}
                marketName={market.name}
                surface={surface}
                marketCardProfile={componentProfile.marketCard.profile}
                tooltipDesc={tooltipDesc}
                onComingSoonClick={handleComingSoonClick}
            />

            <CollapsibleContent
                className={cn(
                    'overflow-hidden',
                    surface === 'detail'
                        ? 'border-filltext-ft-b border-t bg-surface-muted'
                        : 'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
                    isSuperbetMarketCard &&
                        'border-[color:var(--brand-match-divider,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))]',
                    isBetanoMarketCard &&
                        'border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))]',
                )}
            >
                <Content market={market} visibleLines={visibleLines} ctx={ctx} surface={surface} />
            </CollapsibleContent>
        </Collapsible>
    );
};
