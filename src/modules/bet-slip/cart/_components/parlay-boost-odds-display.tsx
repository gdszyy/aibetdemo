'use client';

import type { FC } from 'react';
import { AtOdds } from '@/components/icons';
import { ConditionalTooltip } from '@/components/tooltip';
import { cn } from '@/utils/common';
import { formatOddsByFormat, getFullOddsByFormat, hasOddsExtraPrecision, type OddsFormat } from '@/utils/odds-format';
import type { ParlayBoostDisplayOdds } from '@/utils/parlay-boost-preview';

interface ParlayBoostOddsDisplayProps extends ParlayBoostDisplayOdds {
    /** 赔率展示格式。 */
    oddsFormat: OddsFormat;
    /** 自定义类名。 */
    className?: string;
}

/** 串关 @ 赔率：展示等效总赔率（含加赔时与 payout 对齐，无加赔时为全腿连乘）。 */
export const ParlayBoostOddsDisplay: FC<ParlayBoostOddsDisplayProps> = ({
    parlayOdds,
    effectiveTotalOdds,
    showBoostedOdds,
    oddsFormat,
    className,
}) => {
    const displayOdds = showBoostedOdds ? effectiveTotalOdds : parlayOdds;

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <AtOdds className="size-3 shrink-0 text-filltext-ft-g" />
            <ConditionalTooltip
                content={getFullOddsByFormat(displayOdds, oddsFormat)}
                side="top"
                forceShow={hasOddsExtraPrecision(displayOdds)}
            >
                <span className="text-body-lg text-filltext-ft-g">{formatOddsByFormat(displayOdds, oddsFormat)}</span>
            </ConditionalTooltip>
        </div>
    );
};
