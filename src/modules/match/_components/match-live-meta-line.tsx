'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { MatchClock } from '@/api/models/match';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { getMatchClockRenderKey } from '@/modules/match/_utils/match-clock-utils';
import { isBasketballSport, isMatchBreakTime } from '@/modules/match/_utils/match-utils';
import { useMatchStatusStr } from '@/stores/app-info-store';
import { cn } from '@/utils/common';
import { LiveClock } from './match-status-label';

type MatchLiveMetaLineProps = {
    sportId: string;
    matchStatus: number;
    matchClock?: MatchClock | null;
    matchClockOffset?: number | null;
    className?: string;
};

export const MatchLiveMetaLine: FC<MatchLiveMetaLineProps> = ({
    sportId,
    matchStatus,
    matchClock,
    matchClockOffset = 0,
    className,
}) => {
    const t = useTranslations('matches');
    const localizedStatusName = useMatchStatusStr(sportId, matchStatus);
    const statusName = localizedStatusName || t('live');
    const isBreakTime = isMatchBreakTime(matchStatus);
    const clockDirection = isBasketballSport(sportId) ? 'down' : 'up';
    const showLiveClock = matchClock != null && !isBreakTime;

    return (
        <div className={cn('flex h-4 min-w-0 items-center gap-1 text-auxiliary-md text-func-win', className)}>
            <span className="shrink-0 truncate">{statusName}</span>
            {showLiveClock && (
                <>
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
                </>
            )}
            <MatchBroadcastFilled
                className={cn('size-4 shrink-0', isBreakTime ? 'text-func-pending' : 'text-brand-primary-0')}
            />
        </div>
    );
};
