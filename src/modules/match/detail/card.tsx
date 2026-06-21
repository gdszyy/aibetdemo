'use client';

import Image from 'next/image';
import type { FC } from 'react';
import type { MatchWithMarkets } from '@/api/models/match';
import { MatchStatus } from '@/api/models/match';
import type { BreadcrumbResponse } from '@/api/models/match-game';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';
import { MatchStatusLabel } from '../_components/match-status-label';
import { MatchScoreSummary } from './match-score-summary';

interface CardProps {
    match: MatchWithMarkets;
    breadcrumb?: BreadcrumbResponse;
}

export const CardSkeleton: FC = () => {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
        return (
            <div className="h-[118px] overflow-hidden rounded-md bg-neutral-black-b animate-skeleton-pulse">
                <div className="flex h-8 items-center rounded-lg bg-neutral-black-b px-3">
                    <div className="h-4 w-56 rounded bg-filltext-ft-e/25" />
                </div>
                <div className="flex h-[86px] flex-col justify-center gap-2.5 px-3">
                    <div className="h-[18px] w-32 rounded bg-filltext-ft-e/25" />
                    <div className="h-[18px] w-44 rounded bg-filltext-ft-e/25" />
                    <div className="h-[18px] w-52 rounded bg-filltext-ft-e/20" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-[118px] w-full overflow-hidden rounded-md bg-neutral-black-b animate-skeleton-pulse">
            <div className="flex h-8 items-center rounded-lg bg-neutral-black-b px-3">
                <div className="h-4 w-52 max-w-full rounded bg-filltext-ft-e/25" />
            </div>
            <div className="flex h-[86px] flex-col justify-center gap-2.5 px-3">
                <div className="h-[18px] w-28 rounded bg-filltext-ft-e/25" />
                <div className="h-[18px] w-44 max-w-full rounded bg-filltext-ft-e/25" />
                <div className="h-[18px] w-52 max-w-full rounded bg-filltext-ft-e/20" />
            </div>
        </div>
    );
};

export const Card: FC<CardProps> = ({ match, breadcrumb }) => {
    const isDesktop = useIsDesktop();
    const home = match.home_competitor;
    const away = match.away_competitor;
    const isNotStarted = match.status === MatchStatus.NotStarted;
    const { formatShortTime, formatRelativeShortDate } = useIntlFormatter();
    const startDate = match.start_time ? new Date(match.start_time * 1000) : null;
    const formattedTime = startDate ? formatShortTime(startDate) : '';
    const formattedDate = startDate ? formatRelativeShortDate(startDate) : '';

    // Desktop: original horizontal layout
    if (isDesktop) {
        return (
            <div className="group mb-2 relative w-full">
                <div
                    className={cn(
                        'bg-surface-1 flex flex-col h-40 items-center overflow-clip rounded-sm w-full',
                        isNotStarted ? 'justify-center' : 'gap-4 pt-4',
                    )}
                >
                    <div className="flex items-center justify-center w-full">
                        <MatchStatusLabel
                            sportId={match.sport_id}
                            status={match.status}
                            matchStatus={match.match_status}
                            startTime={match.start_time}
                            matchClock={match.match_clock}
                            matchClockOffset={match.match_clock_offset}
                        />
                    </div>
                    {isNotStarted ? (
                        <div className="flex items-center justify-center gap-14 self-stretch">
                            <div className="flex flex-col gap-4 items-center justify-center">
                                <div
                                    className={cn(
                                        'rounded-full shrink-0 size-10 flex items-center justify-center text-[20px] text-white relative overflow-hidden',
                                        !home?.logo && 'bg-brand-primary-0',
                                    )}
                                >
                                    {home?.logo ? (
                                        <Image
                                            src={home.logo}
                                            alt={home.name}
                                            width={40}
                                            height={40}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        home?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <ConditionalTooltip content={home?.name || ''} side="top">
                                    <div className="text-title-sm text-filltext-ft-g text-center">{home?.name}</div>
                                </ConditionalTooltip>
                            </div>

                            <div className="flex flex-col items-center justify-center text-filltext-ft-g">
                                <span className="text-headline-md text-center">{formattedTime}</span>
                                <span className="text-body-sm text-center">{formattedDate}</span>
                            </div>

                            <div className="flex flex-col gap-4 items-center justify-center">
                                <div
                                    className={cn(
                                        'rounded-full shrink-0 size-10 flex items-center justify-center text-[20px] text-white relative overflow-hidden',
                                        !away?.logo && 'bg-auxiliary-blue',
                                    )}
                                >
                                    {away?.logo ? (
                                        <Image
                                            src={away.logo}
                                            alt={away.name}
                                            width={40}
                                            height={40}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        away?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <ConditionalTooltip content={away?.name || ''} side="top">
                                    <div className="text-title-sm text-filltext-ft-g text-center">{away?.name}</div>
                                </ConditionalTooltip>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-14 items-center justify-center self-stretch">
                            {/* Left Team */}
                            <div className="flex flex-1 gap-4 items-center justify-end">
                                <div className="flex items-center justify-center gap-2">
                                    <ConditionalTooltip content={home?.name || ''} side="top">
                                        <div className="text-title-sm text-filltext-ft-g text-right justify-end">
                                            {home?.name}
                                        </div>
                                    </ConditionalTooltip>
                                </div>
                                <div
                                    className={cn(
                                        'rounded-full shrink-0 size-10 flex items-center justify-center text-[20px] text-white relative overflow-hidden',
                                        !home?.logo && 'bg-brand-primary-0',
                                    )}
                                >
                                    {home?.logo ? (
                                        <Image
                                            src={home.logo}
                                            alt={home.name}
                                            width={40}
                                            height={40}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        home?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>
                            {/* Score */}
                            <div className="flex items-center justify-between min-w-14 gap-4">
                                <div className="text-center justify-center text-filltext-ft-g text-headline-md">
                                    {home?.score ?? 0}
                                </div>
                                <div className="text-center justify-center text-filltext-ft-g text-headline-md">-</div>
                                <div className="text-center justify-center text-filltext-ft-g text-headline-md">
                                    {away?.score ?? 0}
                                </div>
                            </div>
                            {/* Right Team */}
                            <div className="flex flex-1 gap-4 items-center justify-start">
                                <div
                                    className={cn(
                                        'rounded-full shrink-0 size-10 flex items-center justify-center text-[20px] text-white relative overflow-hidden',
                                        !away?.logo && 'bg-auxiliary-blue',
                                    )}
                                >
                                    {away?.logo ? (
                                        <Image
                                            src={away.logo}
                                            alt={away.name}
                                            width={40}
                                            height={40}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        away?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <ConditionalTooltip content={away?.name || ''} side="top">
                                        <div className="text-title-sm text-filltext-ft-g justify-end">{away?.name}</div>
                                    </ConditionalTooltip>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <MatchScoreSummary match={match} breadcrumb={breadcrumb} />;
};
