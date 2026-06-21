'use client';

import useInterval from 'ahooks/lib/useInterval';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import type { MatchClock } from '@/api/models/match';
import { MatchStatus } from '@/api/models/match-game';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import {
    getMatchClockRenderKey,
    getMatchClockSeconds,
    isMatchClockStopped,
} from '@/modules/match/_utils/match-clock-utils';
import { isBasketballSport, isMatchBreakTime } from '@/modules/match/_utils/match-utils';
import { useMatchStatusStr } from '@/stores/app-info-store';
import { cn } from '@/utils/common';

interface MatchStatusLabelProps {
    sportId: string;
    status: number; // 0=not started, 1=live
    matchStatus: number; // match detail status code
    startTime: number; // in seconds
    matchClock?: MatchClock | null;
    /** 后端计时偏移秒数。 */
    matchClockOffset?: number | null;
    className?: string;
}

/** 内部比赛计时组件，基于后端 seconds + offset 做本地逐秒递增。 */
const formatMinuteValue = (seconds: number): string => {
    const minute = seconds <= 0 ? 0 : Math.ceil(seconds / 60);
    return String(minute);
};

type LiveClockDirection = 'up' | 'down';

/** 按运动计时方向计算展示秒数：足球递增，篮球倒计时递减。 */
const getDisplaySeconds = (baseSeconds: number, tick: number, direction: LiveClockDirection): number => {
    if (direction === 'down') {
        return Math.max(baseSeconds - tick, 0);
    }

    return baseSeconds + tick;
};

const formatLiveClockText = (baseSeconds: number, tick: number, direction: LiveClockDirection): string =>
    `${formatMinuteValue(getDisplaySeconds(baseSeconds, tick, direction))}'`;

const getLiveStatusIconClass = (isBreakTime: boolean): string =>
    isBreakTime ? 'text-func-pending' : 'text-brand-primary-0';

export const LiveClock: FC<{
    matchClock: MatchClock;
    matchClockOffset?: number | null;
    className?: string;
    frozen?: boolean;
    /** 本地逐秒修正方向：up=递增，down=递减。 */
    direction?: LiveClockDirection;
}> = ({ matchClock, matchClockOffset = 0, className, frozen = false, direction = 'up' }) => {
    const isPaused = isMatchClockStopped(matchClock);
    const baseSeconds = getMatchClockSeconds({
        match_clock: matchClock,
        match_clock_offset: matchClockOffset,
    });

    const [tick, setTick] = useState(0);
    useInterval(() => setTick((prev) => prev + 1), isPaused || frozen ? undefined : 1000);
    const displayText = formatLiveClockText(baseSeconds, tick, direction);

    return (
        <div className={cn('flex items-center text-auxiliary-md text-filltext-ft-g tabular-nums', className)}>
            <span>{displayText}</span>
        </div>
    );
};

/**
 * Standardized Match Status Label
 * Aligned with Figma and V1 dynamic logic.
 */
export const MatchStatusLabel: FC<MatchStatusLabelProps> = ({
    sportId,
    status,
    matchStatus,
    startTime,
    matchClock,
    matchClockOffset = 0,
    className,
}) => {
    const t = useTranslations('matches');
    const { formatRelativeShortDate, formatShortTime } = useIntlFormatter();
    const isLive = status === MatchStatus.Live;
    const isBreakTime = isMatchBreakTime(matchStatus);
    const clockDirection: LiveClockDirection = isBasketballSport(sportId) ? 'down' : 'up';
    const localizedStatusName = useMatchStatusStr(sportId, matchStatus);
    const liveStatusName = localizedStatusName || t('live');
    const showLiveClock = matchClock != null && !isBreakTime;

    const startDate = new Date(startTime * 1000);
    const formattedStartTime = `${formatRelativeShortDate(startDate).toLocaleLowerCase()}, ${formatShortTime(startDate)}`;

    return (
        <div className={cn('flex h-4 min-w-0 flex-row items-center gap-1', className)}>
            {isLive ? (
                <>
                    <span className="truncate text-auxiliary-md text-func-win">{liveStatusName}</span>
                    {showLiveClock && (
                        <div className="flex shrink-0 items-center gap-1">
                            <span className="size-1 shrink-0 rounded-full bg-func-win" />
                            <LiveClock
                                key={getMatchClockRenderKey({
                                    match_clock: matchClock,
                                    match_clock_offset: matchClockOffset,
                                })}
                                matchClock={matchClock}
                                matchClockOffset={matchClockOffset}
                                frozen={isBreakTime}
                                direction={clockDirection}
                                className="text-func-win"
                            />
                        </div>
                    )}
                    <MatchBroadcastFilled className={cn('size-4 shrink-0', getLiveStatusIconClass(isBreakTime))} />
                </>
            ) : status === MatchStatus.NotStarted ? (
                <span className="truncate text-auxiliary-md text-filltext-ft-f">{formattedStartTime}</span>
            ) : (
                <>
                    <MatchBroadcastFilled className="size-4 shrink-0 text-filltext-ft-f" />
                    <span className="truncate text-auxiliary-md text-filltext-ft-f">{localizedStatusName}</span>
                </>
            )}
        </div>
    );
};
