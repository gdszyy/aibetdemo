'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useSearchParams } from 'next/navigation';
import { useTimeZone, useTranslations } from 'next-intl';
import { type FC, type ReactNode, useMemo, useState } from 'react';
import { MatchStatus } from '@/api/models/match';
import { StickyBlurHeader } from '@/components/sticky-blur-header';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useLiveMatchTotalData, useLiveMatchTotalRefresh } from '@/hooks/use-live-match-total';
import type { Timezone } from '@/i18n';
import { Link } from '@/i18n';
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

interface MatchListShellProps {
    sportId: string;
    children: ReactNode;
}

const formatLiveCount = (count: number) => (count > 99 ? '99+' : String(count));

export const MatchListShell: FC<MatchListShellProps> = ({ sportId, children }) => {
    const t = useTranslations('matches');
    const searchParams = useSearchParams();
    const tz = useTimeZone();
    // 只有 superbet 用这套外层头部（面包屑 + All/Live/Today）；其余主题用 SportTopicPanel 自带的 hero + tabs，
    // 避免「体育标题 + tab」在专题页重复。
    const { brand } = useThemeComponentProfile();
    const isSuperbet = brand === 'superbet';
    const { data: liveCount = 0 } = useLiveMatchTotalData(sportId);
    const refreshLiveMatchTotal = useLiveMatchTotalRefresh();

    const [isCollapsed, setIsCollapsed] = useState(false);

    // --- URL-driven filter (source of truth: searchParams) ---
    const currentFilter = useMemo(() => {
        if (searchParams.get('status') === String(MatchStatus.Live)) return FilterType.Live;
        if (searchParams.get('from') && searchParams.get('to')) return FilterType.Today;
        return FilterType.All;
    }, [searchParams]);

    const basePath = `/sports/${sportId}`;

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
                count: liveCount,
            },
            {
                filterType: FilterType.Today,
                title: t('today'),
                href: `${basePath}?from=${todayStart}&to=${todayEnd}`,
            },
        ];
    }, [t, basePath, tz, liveCount]);

    return (
        <CollapseContext value={{ isCollapsed, setIsCollapsed }}>
            <section className="px-4 pb-6">
                {/* top — 仅 superbet 渲染这套面包屑 + All/Live/Today 头部 */}
                {isSuperbet && (
                    <StickyBlurHeader className="pt-6 pb-2" innerClassName="px-4">
                    <BreadcrumbTitle sportId={sportId} className="mb-1" />
                    {/* tabs */}
                    <div className="flex h-10 mb-2 flex-row items-center justify-between gap-x-4 border-b-[0.5px] border-filltext-ft-d">
                        <div className="h-full flex-1 min-w-0 overflow-x-auto hidden-scrollbar overscroll-x-contain">
                            <div className="flex h-full w-max flex-row items-center gap-x-6 pr-2">
                                {/* tab items */}
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
                                            replace
                                            onClick={() => {
                                                if (tab.filterType !== FilterType.Live) {
                                                    return;
                                                }

                                                refreshLiveMatchTotal(sportId);
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
                                                    'flex shrink-0 items-center gap-2 py-1 transition-colors',
                                                    tabPaddingClass,
                                                    labelRadiusClass,
                                                    currentFilter !== tab.filterType && 'group-hover:bg-filltext-ft-c',
                                                )}
                                            >
                                                {tab.title}
                                                {tab.filterType === FilterType.Live && Boolean(tab.count) && (
                                                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-xs bg-brand-primary-0 px-0.5 text-auxiliary-md text-on-brand tabular-nums">
                                                        {formatLiveCount(tab.count ?? 0)}
                                                    </span>
                                                )}
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
                )}

                {/* content */}
                {children}
            </section>
        </CollapseContext>
    );
};
