import { useCountDown } from 'ahooks';
import { type FC, useEffect, useState } from 'react';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { cn } from '@/utils/common';

/** Trend direction for odds change */
type TrendDir = 'up' | 'down';

/**
 * Corner triangle SVG from Figma odds button states.
 * The short list button uses a 19px marker on the right corner.
 */
const TREND_VARIANTS = {
    standard: true,
    short: true,
} as const;

const CornerTriangle: FC<{ color: string; dir: TrendDir; variant: keyof typeof TREND_VARIANTS }> = ({
    color,
    dir,
    variant,
}) => {
    if (variant === 'short') {
        const isUp = dir === 'up';
        const path = isUp
            ? 'M17.8283 4C17.8283 2.34315 16.4852 1 14.8283 1H2.41421L17.8283 16.4141V4Z'
            : 'M17.8283 14.8283C17.8283 16.4852 16.4852 17.8283 14.8283 17.8283H2.41421L17.8283 2.41421V14.8283Z';

        return (
            <svg
                className={cn(
                    'pointer-events-none absolute -right-[3px] z-10 size-[19px] overflow-visible',
                    isUp ? '-top-[3px]' : '-bottom-[3px]',
                )}
                viewBox="0 0 18.8283 18.8283"
                fill="none"
            >
                <path d={path} fill={color} stroke="white" strokeWidth={2} />
            </svg>
        );
    }

    return (
        <svg className="pointer-events-none absolute bottom-0 right-0 size-6" viewBox="0 0 24 24" fill="none">
            <path d="M24 16V0L0 24H16C20.4183 24 24 20.4183 24 16Z" fill={color} />
        </svg>
    );
};

/**
 * Trend arrow (chevron) — sits inside the corner triangle area.
 * Up: points up with bounce-up animation. Down: points down with bounce-down.
 */
const TrendArrow: FC<{
    dir: TrendDir;
    fill: string;
    glowColor: string;
    variant: keyof typeof TREND_VARIANTS;
}> = ({ dir, fill, glowColor, variant }) => {
    const isUp = dir === 'up';
    if (variant === 'short') return null;

    return (
        <svg
            className="absolute bottom-[3px] right-[3px] size-[8.5px] pointer-events-none"
            viewBox="0 0 8 8"
            fill="none"
            style={{
                animation: `${isUp ? 'bounce-trend-up' : 'bounce-trend-down'} 1s ease-in-out infinite`,
                filter: `drop-shadow(0 0 1px ${glowColor})`,
            }}
        >
            <path
                d={
                    isUp
                        ? 'M3.578 0.111C3.652-0.037 3.862-0.037 3.936 0.111L7.492 7.222C7.593 7.425 7.332 7.613 7.171 7.453L3.899 4.179C3.820 4.101 3.694 4.101 3.616 4.179L0.343 7.452C0.183 7.613-0.079 7.425 0.023 7.222L3.578 0.111Z'
                        : 'M4.422 7.889C4.348 8.037 4.138 8.037 4.064 7.889L0.508 0.778C0.407 0.575 0.668 0.387 0.829 0.547L4.101 3.821C4.180 3.899 4.306 3.899 4.384 3.821L7.657 0.548C7.817 0.387 8.079 0.575 7.977 0.778L4.422 7.889Z'
                }
                fill={fill}
            />
        </svg>
    );
};

interface TrendBubbleProps {
    value: number;
    /** Kept for call-site compatibility; selected buttons use the same trend colors as unselected buttons. */
    selected?: boolean;
    /** Button shape variant */
    variant?: keyof typeof TREND_VARIANTS;
}

export const TrendBubble: FC<TrendBubbleProps> = ({ value, variant = 'short' }) => {
    const isOddsAnimationSuspended = useBetSlipStore((state) => state.isOddsAnimationSuspended);

    const [obj, setObj] = useState({
        prev: value,
        curr: value,
    });
    const [targetDate, setTargetDate] = useState<number>();
    const [countdown] = useCountDown({
        targetDate,
    });

    useEffect(() => {
        if (isOddsAnimationSuspended) {
            setObj({
                prev: value,
                curr: value,
            });
            setTargetDate(undefined);
            return;
        }

        if (value === obj.curr) return;
        setObj({
            prev: obj.curr,
            curr: value,
        });
        setTargetDate(Date.now() + 5000);
    }, [isOddsAnimationSuspended, value, obj.curr]);

    const isUp = obj.prev ? obj.curr > obj.prev : false;
    const isChanged = obj.prev !== obj.curr;
    const isActive = countdown > 0 && isChanged;

    if (!isActive) return null;

    const dir: TrendDir = isUp ? 'up' : 'down';
    const dirColor = isUp ? 'var(--func-win)' : 'var(--func-lost)';

    return (
        <>
            <CornerTriangle color={dirColor} dir={dir} variant={variant} />
            <TrendArrow dir={dir} fill="white" glowColor={dirColor} variant={variant} />
        </>
    );
};
