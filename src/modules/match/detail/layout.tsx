'use client';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInterval } from 'ahooks';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { type FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GetMatchInterface } from '@/api/handlers/match';
import { GetMarketTabsInterface } from '@/api/handlers/matches';
import { GetStatscoreEventIdInterface } from '@/api/handlers/statscore';
import type { MarketGroup } from '@/api/models/market';
import { getMarketGroupId, isMainLineSplitMarketCardType, ProductEnum } from '@/api/models/market';
import { MatchStatus, type MatchWithMarkets, SportCode } from '@/api/models/match';
import type { MarketTab } from '@/api/models/match-game';
import { Empty } from '@/components/empty';
import { ArrowLeft, DetailLiveSwitch } from '@/components/icons';
import { LiveOverlayBack } from '@/components/icons2/LiveOverlayBack';
import { LiveOverlayClose } from '@/components/icons2/LiveOverlayClose';
import { StickyBlurHeader } from '@/components/sticky-blur-header';
import { Toast } from '@/components/toast';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { useIsDesktop } from '@/hooks/use-media-query';
import { isValidLocale, Link, type Locale } from '@/i18n';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { LIVE_MARKET_STALE_TICK_MS } from '@/modules/match/_constants/constants';
import { useBreadcrumb } from '@/modules/match/_hooks/use-breadcrumb';
import { useMarketTooltipConfig } from '@/modules/match/_hooks/use-market-tooltip-config';
import { useDetailMatchStatusObserver } from '@/modules/match/_hooks/use-match-status-observer';
import {
    useMatchItemFixtureObserver,
    useMatchItemObserver,
    useMatchLiveScoreObserver,
} from '@/modules/match/_hooks/use-odds-change-observer';
import { sortDetailMarketsByMarketSort } from '@/modules/match/_logic/detail-market-sort';
import { mergeMatchData } from '@/modules/match/_logic/merge-match';
import { filterMarkets } from '@/modules/match/_utils/match-utils';
import { cn, isNullish } from '@/utils/common';
import { reportError } from '@/utils/error';
import { BetItem } from '../_components/bet-item';
import { BetBuilder } from './bet-builder';
import { Card, CardSkeleton } from './card';
import { CardCompact } from './card-compact';
import { Chips } from './chips';
import { StatscoreWidget } from './components/StatscoreWidget';
import { DesktopMatchBreadcrumb, DesktopMatchCard, DesktopMatchCardSkeleton } from './desktop-match-card';
import { Filters } from './filters';
import { MarketTabExpandToggle } from './market-tab-expand-toggle';
import { MarketsSkeleton } from './markets-skeleton';
import { MatchConditionsBar } from './match-conditions';
import { type MatchDetailTopTab, MatchDetailTopTabs } from './match-detail-top-tabs';
import { useShowStatscoreWidget } from './services/useShowStatscoreWidget';

const STATSCORE_CONFIGURATION_IDS: Partial<
    Record<
        SportCode,
        {
            prematch: string;
            live: string;
        }
    >
> = {
    [SportCode.Football]: {
        prematch: '69e5cf381c395f252df9e63c',
        live: '69e0cde3bcea043f4f9cc441',
    },
    [SportCode.Basketball]: {
        prematch: '69e5d0261c395f252df9e63e',
        live: '69e5ca1c80c04613b2efc232',
    },
    [SportCode.Tennis]: {
        prematch: '69e5e2178bcecb03a4f31b75',
        live: '69e5e193ce9688f88c85ee26',
    },
    [SportCode.Volleyball]: {
        prematch: '69e5d029542868c09cae3fef',
        live: '69e5e0978bcecb03a4f31b74',
    },
    // Product mapping confirmed for now: project sport_code=12 uses STATSCORE American football config.
    [SportCode.Rugby]: {
        prematch: '69e5d0311c395f252df9e63f',
        live: '69e5e3138bcecb03a4f31b76',
    },
};

/**
 * STATSCORE non-Pro "Live" widget (compact live-score header) per sport.
 * Used to replace the in-house <Card> header when a match is in play.
 * Separate from STATSCORE_CONFIGURATION_IDS (which feeds the larger
 * PrematchPro / LivematchPro widget in the Analytic tab).
 */
const STATSCORE_LIVE_SCORE_IDS: Partial<Record<SportCode, string>> = {
    [SportCode.Football]: '69e5d0251c395f252df9e63d', // Soccer Live
    [SportCode.Basketball]: '69e5d027542868c09cae3fee', // Basketball Live
    [SportCode.Tennis]: '69e5e29c134a51d9f7510583', // Tennis Live
    [SportCode.Volleyball]: '69e5e118d3d9bd59ccc348cb', // Volleyball Live
    // Project sport_code=12 (Rugby) is mapped to the STATSCORE American football config.
    [SportCode.Rugby]: '69e5e388ce9688f88c85ee27', // American Football Live
};

const ALL_MARKETS_TAB_MARKET_ID = -1;
const POPULAR_MARKET_TAB_KEY = 'popular';
const ALL_MARKET_TAB_KEY = 'all';
/** 详情页默认展开的盘口卡片数量。 */
const DEFAULT_EXPANDED_MARKET_COUNT = 3;

interface DisplayMarketGroup {
    market: MarketGroup;
    key: string;
}

function buildDisplayMarkets(markets: MarketGroup[], additionalLabel: string): DisplayMarketGroup[] {
    const displayMarkets: DisplayMarketGroup[] = [];

    for (const market of markets) {
        if (!isMainLineSplitMarketCardType(market.card_type)) {
            displayMarkets.push({ market, key: getMarketGroupId(market) });
            continue;
        }

        const mainLines = market.lines.filter((line) => line.is_main_line);
        const additionalLines = market.lines.filter((line) => !line.is_main_line);
        const groupId = getMarketGroupId(market);

        if (mainLines.length === 0) {
            displayMarkets.push({ market, key: groupId });
            continue;
        }

        if (mainLines.length > 0) {
            displayMarkets.push({
                market: {
                    ...market,
                    lines: mainLines,
                },
                key: `${groupId}:main`,
            });
        }

        if (additionalLines.length > 0) {
            displayMarkets.push({
                market: {
                    ...market,
                    name: `${market.name} ${additionalLabel}`,
                    lines: additionalLines,
                },
                key: `${groupId}:additional`,
            });
        }
    }

    return displayMarkets;
}

const getStatscoreConfigurationId = (sportCode?: SportCode, status?: MatchStatus) => {
    if (!sportCode || status === undefined) {
        return null;
    }

    const configurations = STATSCORE_CONFIGURATION_IDS[sportCode];

    if (!configurations) {
        return null;
    }

    if (status === MatchStatus.NotStarted) {
        return configurations.prematch;
    }

    if (status === MatchStatus.Live) {
        return configurations.live;
    }

    return null;
};

const getStatscoreLiveScoreConfigurationId = (sportCode?: SportCode) => {
    if (!sportCode) return null;
    return STATSCORE_LIVE_SCORE_IDS[sportCode] ?? null;
};

const LIVE_WIDGET_CONTROL_BUTTON_CLASS =
    'absolute top-1 z-10 flex size-10 items-center justify-center rounded-sm bg-neutral-black-f cursor-pointer';
/** 移动端详情页滚动超过该距离后，比分栏切换为紧凑态。 */
const MATCH_DETAIL_COMPACT_SCROLL_THRESHOLD = 8;
/** 盘口区内容变化后，列表与 sticky 控制区之间保留的安全间距。 */
const MARKET_VIEWPORT_RESTORE_OFFSET = 8;

const DesktopStatscoreSkeleton: FC = () => (
    <aside className="hidden w-[429px] shrink-0 flex-col gap-4 md:flex">
        <div className="aspect-361/251 w-full rounded-sm bg-surface-1 p-3">
            <div className="h-full w-full animate-skeleton-pulse rounded-xs bg-filltext-ft-d/15" />
        </div>
        <div className="h-[320px] w-full rounded-sm bg-surface-1 p-3">
            <div className="h-full w-full animate-skeleton-pulse rounded-xs bg-filltext-ft-d/15" />
        </div>
    </aside>
);

const DetailControlsSkeleton: FC = () => (
    <>
        <div className="hidden h-10 w-full items-center border-filltext-ft-c border-b md:flex">
            <div className="flex min-w-0 flex-1 gap-6 overflow-hidden">
                {[56, 80, 72, 116, 76, 64].map((width) => (
                    <div
                        key={width}
                        className="h-[18px] shrink-0 animate-skeleton-pulse rounded bg-filltext-ft-d/25"
                        style={{ width }}
                    />
                ))}
            </div>
            <div className="ml-4 flex w-10 shrink-0 items-center justify-center">
                <div className="size-8 animate-skeleton-pulse rounded-sm bg-filltext-ft-d/25" />
            </div>
        </div>

        <div className="flex flex-col gap-y-2 md:hidden">
            <div className="flex h-10 w-full items-center justify-center gap-4 border-filltext-ft-c border-b px-6">
                {[88, 80].map((width) => (
                    <div
                        key={width}
                        className="h-[18px] min-w-0 flex-1 animate-skeleton-pulse rounded bg-filltext-ft-d/25"
                        style={{ maxWidth: width }}
                    />
                ))}
            </div>
            <div className="flex w-full gap-4 overflow-hidden">
                {[54, 86, 112, 112].map((width, index) => (
                    <div
                        key={`${width}-${index.toString()}`}
                        className="h-8 shrink-0 animate-skeleton-pulse rounded-sm bg-surface-1"
                        style={{ width }}
                    />
                ))}
            </div>
        </div>
    </>
);

const DesktopChatPlaceholder: FC = () => {
    const messages = [
        ['V2', 'Guest602601', '1-2'],
        ['V1', 'Guest6243188', 'El arbitro esta bajo mucha presion.'],
        ['V3', 'PapaYa PokPok', 'Vamos equipo!'],
        ['V2', 'Guest5919822', 'Necesitan cerrar mejor la defensa.'],
        ['V4', 'Ghanoxn', 'Buen ritmo en el segundo tiempo.'],
        ['V1', 'Simon Zerozeroseven', 'No def'],
        ['V0', 'Yosua Lalo', 'Siguiente gol cambia todo.'],
    ];

    return (
        <aside className="hidden h-[calc(100vh-100px)] w-[339px] shrink-0 flex-col bg-filltext-ft-b md:flex">
            <div className="flex h-[50px] items-center justify-between bg-surface-1 px-3">
                <div className="flex items-center gap-2 text-title-sm font-bold text-filltext-ft-h">
                    <span className="size-4 rounded-full bg-brand-primary-0" />
                    <span>Chat</span>
                </div>
                <span className="text-body-sm text-brand-primary-0">9,999+</span>
            </div>
            <div className="flex h-9 items-center justify-between border-filltext-ft-c border-b bg-surface-selected px-3">
                <span className="text-auxiliary-sm text-filltext-ft-f">Live chat</span>
                <span className="rounded bg-brand-primary-0/12 px-2 py-0.5 text-auxiliary-sm font-bold text-accent-warm">
                    Mock
                </span>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-3 py-2">
                {messages.map(([level, name, message]) => (
                    <div key={`${level}-${name}`} className="flex gap-2 text-[13px] leading-5 text-filltext-ft-h">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-white-c text-auxiliary-xxs text-filltext-ft-f" />
                        <div className="min-w-0 flex-1">
                            <span className="mr-1 rounded-full bg-neutral-white-c px-1 text-auxiliary-xxs font-bold text-filltext-ft-g">
                                {level}
                            </span>
                            <span className="mr-1 font-bold text-auxiliary-blue">{name}</span>
                            <span className="break-words">{message}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2">
                <div className="flex h-[46px] items-center gap-2 rounded-xl bg-surface-1 px-3 shadow-card">
                    <span className="text-title-sm text-filltext-ft-f">☺</span>
                    <span className="flex-1 text-body-sm text-filltext-ft-e">Enviar un mensaje</span>
                    <span className="flex size-8 items-center justify-center rounded-lg bg-neutral-white-b text-filltext-ft-f">
                        ↗
                    </span>
                </div>
            </div>
        </aside>
    );
};

/** Check if a market belongs to a tab based on backend market ID mapping */
const marketMatchesTab = (market: MarketGroup, tab: MarketTab): boolean => {
    if (tab.market_ids.includes(ALL_MARKETS_TAB_MARKET_ID)) {
        return true;
    }

    return tab.market_ids.includes(market.id);
};

/** 判断 tab 在当前比赛下是否至少包含一个可见盘口。 */
const tabHasMarkets = (tab: MarketTab, markets: MarketGroup[]): boolean => {
    if (markets.length === 0) return false;
    return markets.some((market) => marketMatchesTab(market, tab));
};

/** 解析 All tab ID。 */
const getAllMarketTabId = (marketTabs?: MarketTab[]): number | null => {
    if (!marketTabs?.length) return null;

    const allTab = marketTabs.find((tab) => tab.tab_key === ALL_MARKET_TAB_KEY);
    if (allTab) return allTab.id;

    return marketTabs.find((tab) => tab.market_ids.includes(ALL_MARKETS_TAB_MARKET_ID))?.id ?? null;
};

/** 解析详情页默认 tab：优先 Popular，无盘口时回退到 All。 */
const getDefaultMarketTabId = (marketTabs?: MarketTab[], markets: MarketGroup[] = []): number | null => {
    if (!marketTabs?.length) return null;

    const popularTab = marketTabs.find((tab) => tab.tab_key === POPULAR_MARKET_TAB_KEY);
    if (popularTab && tabHasMarkets(popularTab, markets)) {
        return popularTab.id;
    }

    return getAllMarketTabId(marketTabs) ?? marketTabs[0]?.id ?? null;
};

interface MatchDetailProps {
    /** Match ID */
    matchId: string;
}

interface UseMarketTabsOptions {
    /** 当前比赛 ID，用于切换比赛时重置默认选中的盘口 tab。 */
    matchId: string;
    marketTabs?: MarketTab[];
    markets: MarketGroup[];
    areTabsResolved: boolean;
    /** 初次比赛详情数据是否还在加载中。 */
    isMatchLoading: boolean;
}

/** 计算详情页可见盘口 tab 及其对应市场列表。 */
const useMarketTabs = ({ matchId, marketTabs, markets, areTabsResolved, isMatchLoading }: UseMarketTabsOptions) => {
    const [selectedTabId, setSelectedTabId] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (!matchId) return;
        setSelectedTabId(null);
    }, [matchId]);

    useLayoutEffect(() => {
        if (!matchId || !areTabsResolved || !marketTabs?.length || isMatchLoading) return;

        setSelectedTabId((prev) => {
            const defaultTabId = getDefaultMarketTabId(marketTabs, markets);

            if (prev === null) return defaultTabId;

            const selectedTab = marketTabs.find((tab) => tab.id === prev);
            if (selectedTab && tabHasMarkets(selectedTab, markets)) return prev;

            return defaultTabId;
        });
    }, [matchId, marketTabs, markets, areTabsResolved, isMatchLoading]);

    const marketIdsKey = useMemo(
        () =>
            markets
                .map((market) => market.id)
                .sort((a, b) => a - b)
                .join(','),
        [markets],
    );
    const marketIdSet = useMemo(
        () => new Set(marketIdsKey ? marketIdsKey.split(',').map((id) => Number(id)) : []),
        [marketIdsKey],
    );

    const visibleTabs = useMemo(() => {
        if (!marketTabs || marketTabs.length === 0 || markets.length === 0) return marketTabs;
        return marketTabs.filter(
            (tab) =>
                selectedTabId === tab.id ||
                tab.market_ids.includes(ALL_MARKETS_TAB_MARKET_ID) ||
                tab.market_ids.some((id) => marketIdSet.has(id)),
        );
    }, [marketTabs, marketIdSet, markets.length, selectedTabId]);

    const selectedTabStillVisible = visibleTabs?.some((item) => item.id === selectedTabId) ?? false;
    const resolvedTabId = selectedTabStillVisible ? selectedTabId : (visibleTabs?.[0]?.id ?? null);
    const selectedMarketTab = visibleTabs?.find((item) => item.id === resolvedTabId) ?? null;

    const filteredMarketsByTab = useMemo(() => {
        if (!areTabsResolved) return [];
        if (!marketTabs || marketTabs.length === 0) return markets;
        if (!selectedMarketTab) return [];
        return sortDetailMarketsByMarketSort(
            markets.filter((market) => marketMatchesTab(market, selectedMarketTab)),
            selectedMarketTab.market_sort,
        );
    }, [areTabsResolved, marketTabs, markets, selectedMarketTab]);

    const handleTabChange = useCallback((tabId: number) => {
        setSelectedTabId(tabId);
    }, []);

    return {
        isTabFilteringPending: !areTabsResolved || isMatchLoading,
        visibleTabs,
        resolvedTabId,
        selectedMarketTab,
        filteredMarketsByTab,
        handleTabChange,
    };
};

/** 根据详情页自身滚动位置控制移动端比分栏紧凑态。 */
const useCompactCardVisibility = (disabled: boolean, matchId: string): boolean => {
    const [isVisible, setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);

    useLayoutEffect(() => {
        if (!matchId) return;

        // 必须在浏览器绘制前清理上一页滚动，否则首帧会按旧 scrollY 渲染成紧凑比分栏。
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        isVisibleRef.current = false;
        setIsVisible(false);
    }, [matchId]);

    useEffect(() => {
        if (disabled) {
            isVisibleRef.current = false;
            setIsVisible(false);
            return;
        }

        const update = () => {
            const nextVisible = window.scrollY > MATCH_DETAIL_COMPACT_SCROLL_THRESHOLD;

            if (nextVisible === isVisibleRef.current) return;

            isVisibleRef.current = nextVisible;
            setIsVisible(nextVisible);
        };

        update();

        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [disabled]);

    return isVisible;
};

interface LiveWidgetOverlayProps {
    configurationId: string;
    eventId: string;
    language: string;
    onToggle: () => void;
}

const LiveWidgetOverlay: FC<LiveWidgetOverlayProps> = ({ configurationId, eventId, language, onToggle }) => (
    <div className="relative mb-2">
        <StatscoreWidget
            configurationId={configurationId}
            eventId={eventId}
            language={language}
            minHeightClass="min-h-0"
            className="aspect-361/251 flex items-center justify-center"
        />
        <button type="button" onClick={onToggle} className={cn(LIVE_WIDGET_CONTROL_BUTTON_CLASS, 'left-1')}>
            <LiveOverlayBack className="h-[17px] w-[11px]" />
        </button>
        <button type="button" onClick={onToggle} className={cn(LIVE_WIDGET_CONTROL_BUTTON_CLASS, 'right-1')}>
            <LiveOverlayClose className="size-[15px]" />
        </button>
    </div>
);

interface MobileMatchToolbarProps {
    liveSwitch: {
        available: boolean;
        onToggle: () => void;
        label?: string;
    };
}

const MobileMatchToolbar: FC<MobileMatchToolbarProps> = ({ liveSwitch }) => (
    <div className="flex h-10 w-full items-center justify-between gap-2">
        <Link href="/sports" className="flex h-10 shrink-0 items-center pr-2">
            <ArrowLeft className="size-4 text-filltext-ft-g" />
        </Link>
        <button
            type="button"
            onClick={liveSwitch.onToggle}
            disabled={!liveSwitch.available}
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
                liveSwitch.available ? 'cursor-pointer' : 'cursor-not-allowed',
            )}
        >
            <DetailLiveSwitch
                className={cn('h-5 w-10 transition-colors', liveSwitch.available ? 'text-func-win' : 'text-func-void')}
            />
        </button>
    </div>
);

const MOBILE_PLACEHOLDER_META: Partial<Record<MatchDetailTopTab, { title: string; body: string; accent: string }>> = {
    chat: {
        title: 'Chat',
        body: 'El chat en vivo queda reservado como placeholder hasta conectar el servicio real.',
        accent: '9,999+',
    },
    live: {
        title: 'En Vivo',
        body: 'La transmision de video no esta incluida en esta fase. Se mantiene el espacio visual de Betbus.',
        accent: 'LIVE',
    },
    lineups: {
        title: 'Alineaciones',
        body: 'Alineaciones y suplentes se mostraran aqui cuando el backend entregue esos datos.',
        accent: 'XI',
    },
    stats: {
        title: 'Estadisticas',
        body: 'Estadisticas de partido pendientes de integracion. El tab conserva la navegacion movil.',
        accent: '%',
    },
    preview: {
        title: 'Previa',
        body: 'Vista previa del partido pendiente de contenido editorial o feed dedicado.',
        accent: 'PRE',
    },
};

const MobileTabPlaceholder: FC<{ active: MatchDetailTopTab }> = ({ active }) => {
    const meta = MOBILE_PLACEHOLDER_META[active];

    if (!meta) return null;

    if (active === 'chat') {
        const messages = [
            ['V2', 'Guest602601', '1-2'],
            ['V3', 'PapaYa PokPok', 'Vamos equipo!'],
            ['V1', 'Simon Zerozeroseven', 'No def'],
        ];

        return (
            <div className="rounded-sm bg-surface-1 md:hidden">
                <div className="flex h-11 items-center justify-between border-filltext-ft-c border-b px-3">
                    <div className="text-title-sm font-bold text-filltext-ft-h">Chat</div>
                    <span className="rounded-full bg-brand-primary-0 px-2 py-0.5 text-auxiliary-sm font-bold text-neutral-white-h">
                        9,999+
                    </span>
                </div>
                <div className="space-y-2 px-3 py-3">
                    {messages.map(([level, name, message]) => (
                        <div key={`${level}-${name}`} className="flex gap-2 text-[13px] leading-5 text-filltext-ft-h">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-white-c text-auxiliary-xxs text-filltext-ft-f" />
                            <div className="min-w-0 flex-1">
                                <span className="mr-1 rounded-full bg-neutral-white-c px-1 text-auxiliary-xxs font-bold text-filltext-ft-g">
                                    {level}
                                </span>
                                <span className="mr-1 font-bold text-auxiliary-blue">{name}</span>
                                <span className="break-words">{message}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-3 pb-3">
                    <div className="flex h-11 items-center gap-2 rounded-xl bg-filltext-ft-b px-3">
                        <span className="text-body-sm text-filltext-ft-e">Enviar un mensaje</span>
                        <span className="ml-auto flex size-7 items-center justify-center rounded bg-neutral-white-b text-filltext-ft-f">
                            &gt;
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (active === 'live') {
        return (
            <div className="rounded-sm bg-surface-1 p-3 md:hidden">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-sm bg-black">
                    <span className="absolute left-3 top-3 rounded bg-brand-primary-0 px-2 py-0.5 text-auxiliary-sm font-bold text-neutral-white-h">
                        LIVE
                    </span>
                    <div className="text-center">
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-neutral-white-h/25 text-neutral-white-h">
                            &gt;
                        </div>
                        <div className="text-body-sm text-filltext-ft-f">{meta.body}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-sm bg-surface-1 px-4 py-5 md:hidden">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-title-md font-bold text-filltext-ft-h">{meta.title}</div>
                <span className="rounded-full bg-brand-primary-0 px-3 py-1 text-auxiliary-sm font-bold text-neutral-white-h">
                    {meta.accent}
                </span>
            </div>
            <div className="flex min-h-[190px] items-center justify-center rounded-sm border border-filltext-ft-c bg-filltext-ft-b px-6 text-center text-body-sm leading-6 text-filltext-ft-f">
                {meta.body}
            </div>
        </div>
    );
};

export const MatchDetail: FC<MatchDetailProps> = ({ matchId }) => {
    const locale = useLocale();
    const t = useTranslations('matches');
    const tCommon = useTranslations('common');
    const queryClient = useQueryClient();
    const isDesktop = useIsDesktop();
    /** 是否显示 statscore 小部件 */
    const isShowStatscoreWidget = useShowStatscoreWidget();
    const tooltipLocale: Locale = isValidLocale(locale) ? locale : 'en';

    const [topTab, setTopTab] = useState<MatchDetailTopTab>('apuesta');
    const [isLiveWidgetActive, setIsLiveWidgetActive] = useState(false);
    /** 当前详情页每个盘口 tab 的“全部展开”开关。 */
    const [expandedMarketTabs, setExpandedMarketTabs] = useState<Record<number, boolean>>({});
    const isCompactCardVisible = useCompactCardVisibility(isLiveWidgetActive, matchId);
    const matchFetchCycleRef = useRef(0);
    const handledMatchFetchCycleRef = useRef(0);
    const marketStickyContentRef = useRef<HTMLDivElement | null>(null);
    const marketContentRef = useRef<HTMLDivElement | null>(null);
    const marketScrollFrameRef = useRef<number | null>(null);

    const isAnalyticView = topTab === 'analytic';
    const isMarketsView = topTab === 'apuesta';
    const isMobilePlaceholderView = !isMarketsView && !isAnalyticView;

    // ─── Breadcrumb (shared cache with <Breadcrumb> component) ───
    const { data: breadcrumb, isPending: isBreadcrumbPending } = useBreadcrumb({ matchId });
    const sportId = breadcrumb?.sport_id;
    const tournamentId = breadcrumb?.tournament_id ?? '';

    // ─── Market tabs (depends on sportId from breadcrumb) ───
    const { data: marketTabs, isPending: isMarketTabsPending } = useQuery({
        queryKey: ['market-tabs', sportId],
        queryFn: () => GetMarketTabsInterface({ sport_id: sportId }),
        enabled: !!sportId,
    });
    const { data: marketTooltipConfig } = useMarketTooltipConfig();

    const { data: statscoreEvent, isPending: isStatscoreEventPending } = useQuery({
        queryKey: ['statscore-event-id', matchId],
        queryFn: () => GetStatscoreEventIdInterface({ event_id: matchId }),
        enabled: !!matchId && isShowStatscoreWidget,
        staleTime: Number.POSITIVE_INFINITY,
    });

    // Fetch match detail + markets, merge with WS-updated cache to preserve fresher specifiers
    const matchDetailKey = ['match-detail', matchId] as const;
    const {
        data: matchData,
        isLoading: isMatchLoading,
        isFetching: isMatchFetching,
    } = useQuery({
        queryKey: matchDetailKey,
        queryFn: async () => {
            const incoming = await GetMatchInterface({ event_id: matchId });
            const prev = queryClient.getQueryData<MatchWithMarkets>(matchDetailKey);
            return mergeMatchData(prev, incoming);
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: keepPreviousData,
        enabled: !!matchId,
    });
    const categoryId = breadcrumb?.category_id ?? matchData?.category_id;

    useEffect(() => {
        if (!matchId) {
            return;
        }

        if (isMatchFetching) {
            matchFetchCycleRef.current += 1;
            useBetSlipStore.getState().setOddsAnimationSuspended(true);
            return;
        }

        const currentCycle = matchFetchCycleRef.current;
        if (currentCycle === 0 || handledMatchFetchCycleRef.current === currentCycle) {
            return;
        }

        handledMatchFetchCycleRef.current = currentCycle;

        const settleMatchDetailFetch = async () => {
            await useBetSlipStore.getState().recheckSelections();

            if (matchFetchCycleRef.current === currentCycle) {
                useBetSlipStore.getState().setOddsAnimationSuspended(false);
            }
        };

        settleMatchDetailFetch().catch((error) => {
            reportError(error, {
                tags: {
                    module: 'match-detail',
                    action: 'recheck-bet-slip',
                    trigger: 'http-merge',
                },
            });
        });
    }, [isMatchFetching, matchId]);

    useEffect(() => {
        return () => {
            useBetSlipStore.getState().setOddsAnimationSuspended(false);
        };
    }, []);

    // ─── WebSocket observers (odds change, bet stop, match status, fixture) ───
    useGameSubscription(useMemo(() => [matchId], [matchId]));
    useMatchLiveScoreObserver({ matchId, key: matchDetailKey });
    useMatchItemObserver({ matchId, key: matchDetailKey });
    useDetailMatchStatusObserver({ matchId });
    useMatchItemFixtureObserver({ matchId, key: matchDetailKey });

    const isMatchEnded = matchData?.status === MatchStatus.Ended;
    const isLiveMatch = matchData?.status === MatchStatus.Live;
    const [marketNow, setMarketNow] = useState(() => Date.now());

    useInterval(() => setMarketNow(Date.now()), isLiveMatch ? LIVE_MARKET_STALE_TICK_MS : undefined, {
        immediate: true,
    });

    // 详情页赛中只展示滚球 product=1，避免状态切 live 后继续露出赛前盘口。
    const visibleMarketProduct = isLiveMatch ? ProductEnum.Live : undefined;
    const markets = useMemo(
        () =>
            isMatchEnded
                ? []
                : filterMarkets(matchData?.markets ?? [], {
                      now: isLiveMatch ? marketNow : undefined,
                      visibleProduct: visibleMarketProduct,
                  }),
        [isLiveMatch, isMatchEnded, marketNow, matchData?.markets, visibleMarketProduct],
    );

    const matchTitle = `${matchData?.home_competitor?.name ?? ''} vs ${matchData?.away_competitor?.name ?? ''}`;
    const areMarketTabsResolved = !isBreadcrumbPending && (!sportId || !isMarketTabsPending);

    const {
        visibleTabs,
        resolvedTabId,
        selectedMarketTab,
        filteredMarketsByTab,
        handleTabChange,
        isTabFilteringPending,
    } = useMarketTabs({
        matchId,
        marketTabs,
        markets,
        areTabsResolved: areMarketTabsResolved,
        isMatchLoading,
    });

    useLayoutEffect(() => {
        if (!matchId) {
            return;
        }

        setExpandedMarketTabs({});
    }, [matchId]);

    const sportCode = (matchData?.sport_code || matchData?.sport_id?.match(/:(\d+)$/)?.[1]) as SportCode;
    const statscoreLanguage = isValidLocale(locale) ? locale : 'en';
    const statscoreEventId = statscoreEvent?.id;
    const normalizedStatscoreEventId = isNullish(statscoreEventId) ? '' : `${statscoreEventId}`.trim();
    const hasStatscoreEventId = normalizedStatscoreEventId !== '' && normalizedStatscoreEventId !== '0';
    const resolvedStatscoreEventId = hasStatscoreEventId ? normalizedStatscoreEventId : null;
    const statscoreConfigurationId = hasStatscoreEventId
        ? getStatscoreConfigurationId(sportCode, matchData?.status)
        : null;
    const statscoreLiveScoreConfigurationId = hasStatscoreEventId
        ? getStatscoreLiveScoreConfigurationId(sportCode)
        : null;

    const hasLiveScoreWidget =
        isShowStatscoreWidget &&
        isLiveMatch &&
        !!statscoreLiveScoreConfigurationId &&
        resolvedStatscoreEventId !== null;
    const hasAnalyticWidget = isShowStatscoreWidget && !!statscoreConfigurationId && resolvedStatscoreEventId !== null;
    const isDesktopStatscorePending = isShowStatscoreWidget && (isMatchLoading || isStatscoreEventPending);
    const selectedTabExpandOverride = selectedMarketTab ? expandedMarketTabs[selectedMarketTab.id] : undefined;
    const isAllMarketsExpanded = selectedTabExpandOverride !== false;

    const resolveMarketForceExpanded = useCallback(
        (index: number) => {
            if (selectedTabExpandOverride === true) return true;
            if (selectedTabExpandOverride === false) return false;
            return index < DEFAULT_EXPANDED_MARKET_COUNT;
        },
        [selectedTabExpandOverride],
    );

    useEffect(() => {
        if (!hasLiveScoreWidget) setIsLiveWidgetActive(false);
    }, [hasLiveScoreWidget]);
    useEffect(() => {
        if (!hasAnalyticWidget && topTab === 'analytic') setTopTab('apuesta');
    }, [hasAnalyticWidget, topTab]);

    const handleTopTabChange = useCallback(
        (tab: MatchDetailTopTab) => {
            if (window.scrollY > 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (tab !== topTab) {
                setTopTab(tab);
            }
        },
        [topTab],
    );

    const handleToggleLiveWidget = useCallback(() => {
        setIsLiveWidgetActive((prev) => !prev);
    }, []);

    /** 盘口区高度突变时，将视口拉回盘口内容顶部，避免浏览器停留在 footer。 */
    const restoreMarketViewport = useCallback((): void => {
        const marketContent = marketContentRef.current;
        if (!marketContent) return;

        const stickyContentBottom = marketStickyContentRef.current?.getBoundingClientRect().bottom ?? 0;
        const viewportOffset = Math.max(stickyContentBottom, 0) + MARKET_VIEWPORT_RESTORE_OFFSET;
        const targetTop = Math.max(0, marketContent.getBoundingClientRect().top + window.scrollY - viewportOffset);

        if (window.scrollY <= targetTop) return;

        if (marketScrollFrameRef.current !== null) {
            window.cancelAnimationFrame(marketScrollFrameRef.current);
        }

        marketScrollFrameRef.current = window.requestAnimationFrame(() => {
            marketScrollFrameRef.current = null;
            window.scrollTo({ top: targetTop, behavior: 'auto' });
        });
    }, []);

    useEffect(() => {
        return () => {
            if (marketScrollFrameRef.current !== null) {
                window.cancelAnimationFrame(marketScrollFrameRef.current);
            }
        };
    }, []);

    const handleMarketTabChange = useCallback(
        (tabId: number): void => {
            restoreMarketViewport();
            handleTabChange(tabId);
        },
        [handleTabChange, restoreMarketViewport],
    );

    const handleToggleAllMarkets = useCallback(() => {
        if (!selectedMarketTab) return;

        restoreMarketViewport();
        setExpandedMarketTabs((prev) => ({
            ...prev,
            [selectedMarketTab.id]: !(prev[selectedMarketTab.id] ?? true),
        }));
    }, [restoreMarketViewport, selectedMarketTab]);

    const breadcrumbLiveSwitch = {
        available: hasLiveScoreWidget,
        onToggle: handleToggleLiveWidget,
        label: t('live1'),
    };

    const handleFavoriteClick = useCallback(() => {
        Toast.info(tCommon('message.coming'), { id: 'coming-soon', duration: 650 });
    }, [tCommon]);

    const renderDesktopHeader = () => (
        <div className="hidden flex-col gap-4 md:flex">
            <DesktopMatchBreadcrumb
                breadcrumb={breadcrumb}
                onFavoriteClick={handleFavoriteClick}
                favoriteLabel={tCommon('sidebar.favorite')}
                homeLabel={tCommon('navigation.home')}
            />
            {isMatchLoading ? (
                <DesktopMatchCardSkeleton />
            ) : matchData ? (
                <DesktopMatchCard match={matchData} breadcrumb={breadcrumb} />
            ) : null}
            {/* ⚠️ MOCK：天气/场馆信息头（后端就绪后改用真实字段） */}
            {matchData && <MatchConditionsBar eventId={matchData.event_id} />}
        </div>
    );

    const renderDesktopStatscoreColumn = () => {
        if (!isShowStatscoreWidget) {
            return null;
        }

        if (isDesktopStatscorePending) {
            return <DesktopStatscoreSkeleton />;
        }

        if (resolvedStatscoreEventId === null) return null;
        if (!statscoreLiveScoreConfigurationId && !statscoreConfigurationId) return null;

        return (
            <aside className="hidden md:flex w-[429px] shrink-0 flex-col gap-4">
                {hasLiveScoreWidget && statscoreLiveScoreConfigurationId && (
                    <StatscoreWidget
                        configurationId={statscoreLiveScoreConfigurationId}
                        eventId={resolvedStatscoreEventId}
                        language={statscoreLanguage}
                        minHeightClass="min-h-0"
                        className="aspect-361/251 flex items-center justify-center"
                    />
                )}
                {statscoreConfigurationId && (
                    <StatscoreWidget
                        configurationId={statscoreConfigurationId}
                        eventId={resolvedStatscoreEventId}
                        language={statscoreLanguage}
                    />
                )}
            </aside>
        );
    };

    const renderMobileStickyCard = () => {
        if (isShowStatscoreWidget && isLiveWidgetActive && hasLiveScoreWidget && statscoreLiveScoreConfigurationId) {
            return (
                <div className="md:hidden w-full">
                    <LiveWidgetOverlay
                        configurationId={statscoreLiveScoreConfigurationId}
                        eventId={resolvedStatscoreEventId}
                        language={statscoreLanguage}
                        onToggle={handleToggleLiveWidget}
                    />
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2 md:hidden">
                <MobileMatchToolbar liveSwitch={breadcrumbLiveSwitch} />
                <motion.div
                    layout="size"
                    transition={{ layout: { duration: 0.18, ease: 'easeOut' } }}
                    style={{ overflow: 'hidden' }}
                    className="relative will-change-transform"
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={isCompactCardVisible && matchData ? 'compact' : 'full'}
                            initial={{ opacity: 0, y: isCompactCardVisible ? 4 : -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: isCompactCardVisible ? -4 : 4 }}
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            className="will-change-transform"
                        >
                            {isCompactCardVisible && matchData ? (
                                <CardCompact match={matchData} />
                            ) : isMatchLoading ? (
                                <CardSkeleton />
                            ) : matchData ? (
                                <Card match={matchData} breadcrumb={breadcrumb} />
                            ) : null}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
                {/* ⚠️ MOCK：移动端天气/场馆信息头（紧凑态隐藏） */}
                {matchData && !isCompactCardVisible && <MatchConditionsBar eventId={matchData.event_id} />}
            </div>
        );
    };

    return (
        <section className="relative px-2 pb-6 md:px-3 md:pt-0">
            {markets.length > 0 ? (
                <Chips
                    chips={selectedMarketTab?.chips}
                    filteredMarkets={filteredMarketsByTab}
                    resetKey={resolvedTabId}
                    surface="detail"
                >
                    {(chipButtons, displayedMarkets) => {
                        const displayMarkets = buildDisplayMarkets(displayedMarkets, t('marketAdditional'));

                        return (
                            <>
                                {renderDesktopHeader()}

                                <div className="flex flex-col-reverse items-center gap-3 md:pt-4 @min-[52rem]:flex-row @min-[52rem]:items-start">
                                    {renderDesktopStatscoreColumn()}
                                    <div className="w-full flex-1 min-w-0">
                                        <StickyBlurHeader
                                            className="pt-0 pb-2 md:pt-0 md:pb-4"
                                            innerClassName="w-full"
                                            fullBleed={false}
                                        >
                                            <div
                                                ref={marketStickyContentRef}
                                                className="flex flex-col gap-y-2 md:gap-y-4"
                                            >
                                                {!isDesktop && renderMobileStickyCard()}

                                                {isTabFilteringPending ? (
                                                    <DetailControlsSkeleton />
                                                ) : (
                                                    <>
                                                        <MatchDetailTopTabs
                                                            className="md:hidden"
                                                            active={topTab}
                                                            onChange={handleTopTabChange}
                                                            apuestaLabel={t('bet')}
                                                            analyticLabel={t('analytic')}
                                                            showAnalytic={hasAnalyticWidget}
                                                        />

                                                        {isMarketsView && (
                                                            <div className="flex w-full items-center md:h-10 md:border-b md:border-filltext-ft-c md:bg-transparent">
                                                                <div className="min-w-0 flex-1">
                                                                    <Filters
                                                                        tabs={visibleTabs}
                                                                        selectedTabId={resolvedTabId}
                                                                        onTabChange={handleMarketTabChange}
                                                                        surface="detail"
                                                                    />
                                                                </div>
                                                                {visibleTabs && visibleTabs.length > 0 && (
                                                                    <MarketTabExpandToggle
                                                                        isExpanded={isAllMarketsExpanded}
                                                                        onToggle={handleToggleAllMarkets}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}

                                                        {isMarketsView && chipButtons}
                                                    </>
                                                )}
                                            </div>
                                        </StickyBlurHeader>

                                        {isShowStatscoreWidget &&
                                            isAnalyticView &&
                                            statscoreConfigurationId &&
                                            resolvedStatscoreEventId !== null && (
                                                <div className="md:hidden mb-6">
                                                    <StatscoreWidget
                                                        configurationId={statscoreConfigurationId}
                                                        eventId={resolvedStatscoreEventId}
                                                        language={statscoreLanguage}
                                                    />
                                                </div>
                                            )}

                                        {isMobilePlaceholderView && <MobileTabPlaceholder active={topTab} />}

                                        <div
                                            ref={marketContentRef}
                                            className={cn(
                                                !isMarketsView && 'hidden md:block',
                                                'md:pt-0 [overflow-anchor:none]',
                                            )}
                                        >
                                            {!isTabFilteringPending && matchData && (
                                                <div className="mb-2 md:mb-4">
                                                    <BetBuilder match={matchData} />
                                                </div>
                                            )}
                                            {isTabFilteringPending ? (
                                                <MarketsSkeleton />
                                            ) : displayMarkets.length ? (
                                                <>
                                                    <AnimatePresence initial={false}>
                                                        <motion.div
                                                            initial={false}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                            className="w-full"
                                                        >
                                                            <div className="mb-6 flex flex-col gap-y-2 md:gap-y-4 rounded-b-xl">
                                                                {/* ⚠️ MOCK：Bet Builder 自建注（同场组合，后端就绪后接 SGP 接口） */}
                                                                {displayMarkets.map(({ market, key }, index) => (
                                                                    <div key={key}>
                                                                        <BetItem
                                                                            market={market}
                                                                            eventId={matchId}
                                                                            eventIdType={matchData?.event_id_type ?? ''}
                                                                            tournamentId={tournamentId}
                                                                            categoryId={categoryId}
                                                                            sportId={sportId ?? ''}
                                                                            matchTitle={matchTitle}
                                                                            forceExpanded={resolveMarketForceExpanded(
                                                                                index,
                                                                            )}
                                                                            showAllLines
                                                                            surface="detail"
                                                                            tooltipDesc={
                                                                                marketTooltipConfig?.[
                                                                                    market.id.toString()
                                                                                ]?.[tooltipLocale]
                                                                            }
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    </AnimatePresence>
                                                    <div className="flex h-4 pb-10 leading-4 justify-center items-center text-filltext-ft-f text-body-sm text-center">
                                                        {t('noMoreMarkets')}
                                                    </div>
                                                </>
                                            ) : (
                                                <Empty desc={t('noMarketAvailable')} />
                                            )}
                                        </div>
                                    </div>
                                    <DesktopChatPlaceholder />
                                </div>
                            </>
                        );
                    }}
                </Chips>
            ) : (
                <>
                    {renderDesktopHeader()}
                    <div className="flex flex-col-reverse items-center gap-3 md:pt-4 @min-[52rem]:flex-row @min-[52rem]:items-start">
                        {renderDesktopStatscoreColumn()}
                        <div className="w-full flex-1 min-w-0">
                            <div className="md:hidden">
                                <StickyBlurHeader
                                    className="pt-0 pb-2"
                                    innerClassName="flex flex-col gap-y-2"
                                    fullBleed={false}
                                >
                                    {!isDesktop && renderMobileStickyCard()}
                                    {isMatchLoading && <DetailControlsSkeleton />}
                                </StickyBlurHeader>
                            </div>
                            {isMatchLoading ? (
                                <div className="flex flex-col gap-y-2 md:gap-y-4">
                                    <div className="hidden md:block">
                                        <DetailControlsSkeleton />
                                    </div>
                                    <MarketsSkeleton />
                                </div>
                            ) : (
                                <Empty desc={t('noMarketAvailable')} />
                            )}
                        </div>
                        <DesktopChatPlaceholder />
                    </div>
                </>
            )}
        </section>
    );
};
