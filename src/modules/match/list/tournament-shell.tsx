'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useSearchParams, useSelectedLayoutSegment } from 'next/navigation';
import { useTimeZone, useTranslations } from 'next-intl';
import { type FC, type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MatchStatus } from '@/api/models/match';
import { StickyBlurHeader } from '@/components/sticky-blur-header';
import type { Timezone } from '@/i18n';
import { Link } from '@/i18n';
import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import { BreadcrumbTitle } from '@/modules/match/_components/breadcrumb-title';
import { FilterType } from '@/modules/match/_constants/types';
import { cn } from '@/utils/common';
import { CollapseContext } from './collapse-context';

dayjs.extend(utc);
dayjs.extend(timezone);

const FILTER_TAB_BASE_CLASS =
    'group flex h-10 shrink-0 flex-col items-center justify-center text-body-lg cursor-pointer transition-colors';
const FILTER_TAB_ACTIVE_CLASS = 'text-filltext-ft-h';
const FILTER_TAB_INACTIVE_CLASS = 'text-filltext-ft-f';
const FILTER_TAB_PADDING_CLASS = 'px-2';
const FILTER_TAB_FIRST_PADDING_CLASS = 'pl-0 pr-2';
const FILTER_TAB_LABEL_RADIUS_CLASS = 'rounded-sm';
const FILTER_TAB_FIRST_LABEL_RADIUS_CLASS = 'rounded-r-sm';

interface TournamentShellProps {
    tournamentId: string;
    banner?: ReactNode;
    children: ReactNode;
}

/**
 * Tournament shared shell — Breadcrumb + Tabs + Collapse toggle.
 *
 * Uses `useSelectedLayoutSegment()` to detect the outright sub-route.
 * Renders shell for list (segment=null) and outright (segment='outright').
 */
export const TournamentShell: FC<TournamentShellProps> = ({ tournamentId, banner, children }) => {
    const segment = useSelectedLayoutSegment();
    const isOutright = segment === 'outright';

    const t = useTranslations('matches');
    const tWorldCupLeague = useTranslations('promotionWorldCupLeague');
    const titleOverride = WORLD_CUP_LEAGUE_ID === tournamentId ? tWorldCupLeague('leagueTitle') : undefined;
    const searchParams = useSearchParams();
    const tz = useTimeZone();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const currentFilter = useMemo(() => {
        if (isOutright) return FilterType.Outright;
        if (searchParams.get('status') === String(MatchStatus.Live)) return FilterType.Live;
        if (searchParams.get('from') && searchParams.get('to')) return FilterType.Today;
        return FilterType.All;
    }, [searchParams, isOutright]);
    const routeScrollKey = useMemo(
        () => `${isOutright ? 'outright' : 'matches'}?${searchParams.toString()}`,
        [isOutright, searchParams],
    );

    const basePath = `/leagues/${tournamentId}`;

    const tabs = useMemo(() => {
        const todayStart = dayjs()
            .tz(tz as Timezone)
            .startOf('day')
            .valueOf();
        const todayEnd = dayjs()
            .tz(tz as Timezone)
            .endOf('day')
            .valueOf();

        return [
            { filterType: FilterType.All, title: t('all'), href: basePath },
            {
                filterType: FilterType.Live,
                title: t('live1'),
                href: `${basePath}?status=${MatchStatus.Live}`,
            },
            {
                filterType: FilterType.Today,
                title: t('today'),
                href: `${basePath}?from=${todayStart}&to=${todayEnd}`,
            },
            {
                filterType: FilterType.Outright,
                title: t('outright'),
                href: `${basePath}/outright`,
            },
        ];
    }, [t, basePath, tz]);

    // Ensure active tab is fully visible when tabs overflow horizontally.
    const tabsContainerRef = useRef<HTMLDivElement | null>(null);

    const ensureVisible = useCallback((el: HTMLElement | null, behavior: ScrollBehavior = 'auto') => {
        const container = tabsContainerRef.current;
        if (!container || !el) return;

        const elLeft = el.offsetLeft;
        const elWidth = el.offsetWidth;
        const elCenter = elLeft + elWidth / 2;
        const containerWidth = container.clientWidth;
        const maxScrollLeft = Math.max(0, container.scrollWidth - containerWidth);
        const target = Math.max(0, Math.min(maxScrollLeft, elCenter - containerWidth / 2));

        container.scrollTo({ left: target, behavior });
    }, []);

    useEffect(() => {
        const container = tabsContainerRef.current;
        if (!container) return;
        const activeEl = container.querySelector('[data-active="true"]') as HTMLElement | null;
        ensureVisible(activeEl, 'smooth');
    }, [ensureVisible]);

    const handleTabClick = useCallback(
        (el: HTMLElement): void => {
            ensureVisible(el, 'smooth');
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        },
        [ensureVisible],
    );

    useLayoutEffect(() => {
        if (!routeScrollKey) return undefined;

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        const frameId = window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [routeScrollKey]);

    return (
        <CollapseContext value={{ isCollapsed, setIsCollapsed }}>
            <section className="px-4 pb-6">
                <StickyBlurHeader className="pt-6 pb-2" innerClassName="px-4">
                    <BreadcrumbTitle tournamentId={tournamentId} titleOverride={titleOverride} />
                    {/* tabs + collapse */}
                    <div className="flex h-10 mb-2 flex-row items-center justify-between gap-x-4 border-b-[0.5px] border-filltext-ft-d">
                        <div
                            ref={tabsContainerRef}
                            className="h-full flex-1 min-w-0 overflow-x-auto hidden-scrollbar overscroll-x-contain"
                        >
                            <div className="flex h-full w-max flex-row items-center gap-x-6 pr-2">
                                {tabs.map((tab) => {
                                    const tabPaddingClass =
                                        tab.filterType === FilterType.All
                                            ? FILTER_TAB_FIRST_PADDING_CLASS
                                            : FILTER_TAB_PADDING_CLASS;
                                    const labelRadiusClass =
                                        tab.filterType === FilterType.All
                                            ? FILTER_TAB_FIRST_LABEL_RADIUS_CLASS
                                            : FILTER_TAB_LABEL_RADIUS_CLASS;

                                    return (
                                        <Link
                                            key={tab.filterType}
                                            href={tab.href}
                                            replace={!isOutright && tab.filterType !== FilterType.Outright}
                                            scroll
                                            data-active={currentFilter === tab.filterType}
                                            onClick={(e) => {
                                                handleTabClick(e.currentTarget as HTMLElement);
                                            }}
                                            className={cn(
                                                FILTER_TAB_BASE_CLASS,
                                                currentFilter === tab.filterType
                                                    ? FILTER_TAB_ACTIVE_CLASS
                                                    : FILTER_TAB_INACTIVE_CLASS,
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex min-h-0 w-full flex-1 items-end justify-center',
                                                    tabPaddingClass,
                                                )}
                                            >
                                                <span className="h-0.5 w-full rounded-lg opacity-0" />
                                            </span>
                                            <span
                                                className={cn(
                                                    'flex shrink-0 items-center py-1 transition-colors',
                                                    tabPaddingClass,
                                                    labelRadiusClass,
                                                    currentFilter !== tab.filterType && 'group-hover:bg-filltext-ft-c',
                                                )}
                                            >
                                                {tab.title}
                                            </span>
                                            <span
                                                className={cn(
                                                    'flex h-2 w-full shrink-0 items-end justify-center',
                                                    tabPaddingClass,
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'h-0.5 w-full rounded-lg bg-brand-primary-0 transition-opacity',
                                                        currentFilter === tab.filterType ? 'opacity-100' : 'opacity-0',
                                                    )}
                                                />
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </StickyBlurHeader>
                {currentFilter === FilterType.All && banner}
                {/* page content */}
                <div>{children}</div>
            </section>
        </CollapseContext>
    );
};
