import type { FC } from 'react';
import { PromoParlayBoostLightning } from '@/components/icons2/PromoParlayBoostLightning';
import { cn } from '@/utils/common';

type ParlayBadgeVariant = 'boost' | 'icon' | 'protected';
type ParlayBadgeSize = 'lg' | 'sm';

interface ParlayBadgeProps {
    /** 角标类型：串关加赔、纯闪电、保护提示 */
    variant: ParlayBadgeVariant;
    /** 串关加赔角标尺寸 */
    size?: ParlayBadgeSize;
    /** 角标文案，boost/protected 使用 */
    label?: string;
    className?: string;
}

const PARLAY_BOOST_BG = 'var(--promo-parlay-boost-bg)';

/** Figma 黄底 path（与原先 clip-path 一致） */
const BOOST_BADGE_SVG: Record<ParlayBadgeSize, { viewBox: string; path: string }> = {
    lg: {
        viewBox: '0 0 121 20',
        path: 'M2.95225 3.07795C3.37961 1.27393 4.99058 0 6.84452 0H120.944L116.935 16.9221C116.507 18.7261 114.896 20 113.043 20H4.0018C1.41991 20 -0.485632 17.5903 0.109528 15.0779L2.95225 3.07795Z',
    },
    sm: {
        viewBox: '0 0 84 15',
        path: 'M2.09727 2.22803C2.38009 0.927551 3.53104 0 4.86192 0H83.3197L80.5421 12.772C80.2593 14.0724 79.1083 15 77.7774 15H2.83037C1.02561 15 -0.317798 13.333 0.0657305 11.5695L2.09727 2.22803Z',
    },
};

interface BoostBadgeSvgProps {
    size: ParlayBadgeSize;
}

/** 黄底随外层宽度拉伸（preserveAspectRatio=none），无需 JS 测量。 */
const BoostBadgeSvg: FC<BoostBadgeSvgProps> = ({ size }) => {
    const { viewBox, path } = BOOST_BADGE_SVG[size];
    const isLarge = size === 'lg';

    return (
        <svg
            viewBox={viewBox}
            preserveAspectRatio="none"
            className={cn('pointer-events-none absolute left-0 w-full', isLarge ? 'top-1 h-5' : 'top-0.75 h-3.75')}
            aria-hidden
        >
            <path d={path} fill={PARLAY_BOOST_BG} />
        </svg>
    );
};

/** 串关相关角标，统一 Figma 中的 boost、纯闪电和 protected 三种形式 */
export const ParlayBadge: FC<ParlayBadgeProps> = ({ variant, size = 'lg', label, className }) => {
    if (variant === 'icon') {
        return (
            <span
                className={cn(
                    'relative inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-promo-parlay-boost-bg text-neutral-black-h',
                    className,
                )}
            >
                <PromoParlayBoostLightning
                    className="absolute left-[2.4px] top-[-2.4px] h-[20.8px] w-[11.2px]"
                    color={['currentColor', PARLAY_BOOST_BG]}
                />
            </span>
        );
    }

    if (variant === 'protected') {
        return (
            <span
                className={cn(
                    'inline-flex h-4 shrink-0 items-center justify-center gap-0.5 rounded-xs bg-promo-parlay-boost-bg px-1 py-0.5 text-neutral-black-h',
                    className,
                )}
            >
                <span className="relative size-2.5 shrink-0 rounded-full">
                    <PromoParlayBoostLightning
                        className="absolute left-[1.5px] top-[-1.5px] h-3.25 w-1.75"
                        color={['currentColor', PARLAY_BOOST_BG]}
                    />
                </span>
                <span className="text-auxiliary-xxs font-semibold leading-4 whitespace-nowrap">{label}</span>
            </span>
        );
    }

    const isLarge = size === 'lg';

    return (
        <span
            className={cn(
                'relative inline-flex w-fit shrink-0 items-center self-start text-neutral-black-h',
                isLarge ? 'h-7 pl-5.25 pr-3' : 'h-5.5 pl-3.75 pr-2.5',
                className,
            )}
        >
            <BoostBadgeSvg size={size} />
            <PromoParlayBoostLightning
                className={cn('absolute top-px', isLarge ? 'left-[5px] h-6.5 w-3.5' : 'left-1 h-4.75 w-2.5')}
                color={['currentColor', PARLAY_BOOST_BG]}
            />
            <span
                className={cn(
                    'relative font-roboto-flex font-black italic uppercase whitespace-nowrap',
                    isLarge ? 'text-auxiliary-md leading-none' : 'text-auxiliary-xxs leading-none',
                )}
            >
                {label}
            </span>
        </span>
    );
};
