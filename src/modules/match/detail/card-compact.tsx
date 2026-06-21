'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { MatchWithMarkets } from '@/api/models/match';
import { MatchStatus } from '@/api/models/match';
import { CompactCardNotch } from '@/components/icons';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { getMatchClockRenderKey } from '@/modules/match/_utils/match-clock-utils';
import { isBasketballSport, isMatchBreakTime } from '@/modules/match/_utils/match-utils';
import { useMatchStatusStr } from '@/stores/app-info-store';
import { cn } from '@/utils/common';
import { LiveClock } from '../_components/match-status-label';

interface CardCompactProps {
    match: MatchWithMarkets;
    className?: string;
}
export const CardCompact: FC<CardCompactProps> = ({ match, className }) => {
    const home = match.home_competitor;
    const away = match.away_competitor;
    const isLive = match.status === MatchStatus.Live;
    const matchClock = match.match_clock;
    const startDate = match.start_time ? new Date(match.start_time * 1000) : null;
    const isBreakTime = isMatchBreakTime(match.match_status);
    const clockDirection = isBasketballSport(match.sport_id) ? 'down' : 'up';
    const showLiveClock = matchClock != null && !isBreakTime;

    const t = useTranslations('matches');
    const { formatRelativeShortDate, formatShortTime } = useIntlFormatter();
    const liveStatusLabel = useMatchStatusStr(match.sport_id, match.match_status, t('live'));

    const score = isLive ? `${home?.score ?? 0}:${away?.score ?? 0}` : '-';

    const renderNotchLabel = () => {
        if (isLive) {
            return (
                <>
                    <span className="text-auxiliary-md text-func-win">{liveStatusLabel}</span>
                    {showLiveClock && (
                        <>
                            <span className="size-1 rounded-full bg-func-win" />
                            <LiveClock
                                key={getMatchClockRenderKey({
                                    match_clock: matchClock,
                                    match_clock_offset: match.match_clock_offset,
                                })}
                                matchClock={matchClock}
                                matchClockOffset={match.match_clock_offset}
                                frozen={isBreakTime}
                                direction={clockDirection}
                                className="text-func-win [&_span]:text-func-win"
                            />
                        </>
                    )}
                    <MatchBroadcastFilled
                        className={cn('size-4 shrink-0', isBreakTime ? 'text-func-pending' : 'text-brand-primary-0')}
                    />
                </>
            );
        }
        if (!isLive && startDate) {
            const dateLabel = formatRelativeShortDate(startDate).toLocaleLowerCase();

            return (
                <span className="truncate text-filltext-ft-f text-[12px] leading-4">
                    {dateLabel}, {formatShortTime(startDate)}
                </span>
            );
        }
        return null;
    };

    return (
        <div className={cn('relative h-[46px] w-full pt-5', className)}>
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-5">
                <CompactCardNotch className="absolute bottom-0 left-1/2 h-5 w-[200px] -translate-x-1/2 text-neutral-black-b" />
                <div className="absolute top-[3px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap">
                    {renderNotchLabel()}
                </div>
            </div>

            <div className="flex h-7 w-full items-center justify-between rounded-lg bg-neutral-black-b px-2 py-1.5">
                <ConditionalTooltip content={home?.name || ''} side="top">
                    <div className="w-[120px] truncate text-[12px] leading-4 text-filltext-ft-h">{home?.name}</div>
                </ConditionalTooltip>

                <span className="text-[12px] leading-4 font-semibold text-filltext-ft-h tabular-nums">{score}</span>

                <ConditionalTooltip content={away?.name || ''} side="top">
                    <div className="w-[120px] truncate text-right text-[12px] leading-4 text-filltext-ft-h">
                        {away?.name}
                    </div>
                </ConditionalTooltip>
            </div>
        </div>
    );
};
