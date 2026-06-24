'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import { ParlayBoostMark } from '@/components/parlay-boost-mark';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { cn } from '@/utils/common';
import {
    formatParlayBoostMultiplier,
    getParlayBoostProgressLegs,
    getSortedParlayBoostLadder,
    type ParlayBoostPreview,
    toParlayBoostNumber,
} from '@/utils/parlay-boost-preview';
import { ModeTooltipTrigger } from './mode-tooltip-trigger';

interface ParlayBoostProgressProps {
    /** 当前串关加赔规则 */
    rule: ParlayBoostRule;
    /** 当前串关加赔预览 */
    preview: ParlayBoostPreview;
    /** 加赔卡片适配端 */
    variant?: 'desktop' | 'mobile';
    /** 点击闪电角标打开规则弹窗 */
    onOpenRules?: () => void;
    className?: string;
}

interface ParlayBoostVariantConfig {
    /** 外层尺寸 */
    rootClassName: string;
    /** 文案行高度 */
    promptRowClassName: string;
    /** 文案字号 */
    promptTextClassName: string;
}

const PARLAY_BOOST_MIN_ODDS_BG_PATH =
    'path("M8 10C9.91739 5.20652 12.9634 0 18.1261 0H161.874C167.037 0 170.083 5.20652 172 10C173.976 14.9398 176 19 180 20C178 20 2.00002 20 0 20C4 19 6.02408 14.9398 8 10Z")';

const PARLAY_BOOST_VARIANT_CONFIG: Record<
    NonNullable<ParlayBoostProgressProps['variant']>,
    ParlayBoostVariantConfig
> = {
    desktop: {
        rootClassName: 'h-25 w-67.5',
        promptRowClassName: 'min-h-7',
        promptTextClassName: 'text-auxiliary-2xs',
    },
    mobile: {
        rootClassName: 'h-20 w-full',
        promptRowClassName: 'min-h-5',
        promptTextClassName: 'text-auxiliary-xxs',
    },
};

const PARLAY_BOOST_SKIN = {
    superbet: {
        root: 'border-promo-parlay-boost-accent bg-surface-1',
        activeTier: 'bg-promo-parlay-boost-accent text-neutral-black-h',
        inactiveTier: 'text-filltext-ft-e',
        activeArrow: 'border-t-promo-parlay-boost-accent',
        inactiveArrow: 'border-t-filltext-ft-c',
        filledSegment: 'bg-promo-parlay-boost-accent shadow-[0_0_2px_0_var(--promo-parlay-boost-bg)]',
        emptySegment: 'bg-filltext-ft-c',
        minOddsBg: 'bg-promo-parlay-boost-accent',
        minOddsText: 'text-neutral-black-h',
        emphasisText: 'text-neutral-black-h',
    },
    betano: {
        root: 'border-[#ffd4c1] bg-[#fff8f4]',
        activeTier: 'bg-[#ff5a1f] text-white',
        inactiveTier: 'text-[#7b849c]',
        activeArrow: 'border-t-[#ff5a1f]',
        inactiveArrow: 'border-t-[#dde1ef]',
        filledSegment: 'bg-[#ff5a1f] shadow-[0_0_8px_rgba(255,90,31,0.35)]',
        emptySegment: 'bg-[#dde1ef]',
        minOddsBg: 'bg-[#fff0e8]',
        minOddsText: 'text-[#101426]',
        emphasisText: 'text-[#ff5a1f]',
    },
    betbus: {
        root: 'border-border-strong bg-surface-muted',
        activeTier: 'bg-brand-primary-0 text-on-brand',
        inactiveTier: 'text-content-muted',
        activeArrow: 'border-t-brand-primary-0',
        inactiveArrow: 'border-t-border-strong',
        filledSegment: 'bg-brand-primary-0 shadow-[0_0_7px_color-mix(in_srgb,var(--brand-primary-0)_35%,transparent)]',
        emptySegment: 'bg-surface-3',
        minOddsBg: 'bg-surface-3',
        minOddsText: 'text-content-primary',
        emphasisText: 'text-brand-primary-0',
    },
    match: {
        root: 'border-border-strong bg-surface-muted',
        activeTier: 'bg-brand-primary-0 text-on-brand',
        inactiveTier: 'text-content-muted',
        activeArrow: 'border-t-brand-primary-0',
        inactiveArrow: 'border-t-border-strong',
        filledSegment: 'bg-brand-primary-0 shadow-[0_0_7px_color-mix(in_srgb,var(--brand-primary-0)_35%,transparent)]',
        emptySegment: 'bg-surface-3',
        minOddsBg: 'bg-surface-3',
        minOddsText: 'text-content-primary',
        emphasisText: 'text-brand-primary-0',
    },
    // iOS26 液态玻璃：沿用 match 的全变量驱动皮肤。这些 token（--brand-primary-0、--surface-*、
    // --content-* 等）在 glass-light / glass-dark scheme 内被覆盖为紫→粉玻璃色，亮暗共用同一份即可。
    // 缺这一项时 PARLAY_BOOST_SKIN[brand] 对 glass 取到 undefined → 加赔进度条崩/错色（红残留根因之一）。
    glass: {
        root: 'border-border-strong bg-surface-muted',
        activeTier: 'bg-brand-primary-0 text-on-brand',
        inactiveTier: 'text-content-muted',
        activeArrow: 'border-t-brand-primary-0',
        inactiveArrow: 'border-t-border-strong',
        filledSegment: 'bg-brand-primary-0 shadow-[0_0_7px_color-mix(in_srgb,var(--brand-primary-0)_35%,transparent)]',
        emptySegment: 'bg-surface-3',
        minOddsBg: 'bg-surface-3',
        minOddsText: 'text-content-primary',
        emphasisText: 'text-brand-primary-0',
    },
} as const;

const getFilledSegmentCount = (qualifyingCount: number, maxLegs: number): number => {
    if (maxLegs <= 0) return 0;
    return Math.min(qualifyingCount, maxLegs);
};

/** 购物车串关模式下方的加赔进度展示 */
export const ParlayBoostProgress: FC<ParlayBoostProgressProps> = ({
    rule,
    preview,
    variant = 'desktop',
    onOpenRules,
    className,
}) => {
    const t = useTranslations('betSlip.parlayBoost');
    const { brand } = useSchemeMeta();
    const skin = PARLAY_BOOST_SKIN[brand];
    const variantConfig = PARLAY_BOOST_VARIANT_CONFIG[variant];
    const ladder = getSortedParlayBoostLadder(rule);
    const firstTier = ladder[0];

    if (!firstTier) {
        return null;
    }

    const highlightedTier = preview.currentTier;
    const progressLegs = getParlayBoostProgressLegs(rule);
    const filledSegmentCount = getFilledSegmentCount(preview.qualifyingCount, progressLegs);
    const neededCount = preview.nextTier ? Math.max(preview.nextTier.legs - preview.qualifyingCount, 0) : 0;
    const promptKey = preview.currentTier ? (preview.nextTier ? 'nextTier' : 'maxTier') : 'unlock';
    const promptMiddleKey = preview.currentTier ? 'nextTier.middle' : 'unlock.middle';
    const promptMultiplier = formatParlayBoostMultiplier(preview.nextTier ?? highlightedTier);
    const minOdds = toParlayBoostNumber(rule.min_odds_per_leg)
        .toFixed(2)
        .replace(/\.?0+$/, '');

    return (
        <div
            className={cn(
                'relative isolate mx-auto flex shrink-0 flex-col items-center overflow-hidden rounded-sm border-[0.5px] px-3 pt-2',
                skin.root,
                variantConfig.rootClassName,
                className,
            )}
        >
            <div className="relative z-20 flex w-full shrink-0 flex-col items-start gap-1">
                <div className={cn('flex w-full shrink-0 items-center gap-0.5', variantConfig.promptRowClassName)}>
                    <div className="flex shrink-0 items-center justify-center px-1">
                        {onOpenRules ? (
                            <button
                                type="button"
                                onClick={onOpenRules}
                                className="inline-flex cursor-pointer items-center justify-center rounded-xs active:scale-95"
                            >
                                <ParlayBoostMark />
                            </button>
                        ) : (
                            <ParlayBoostMark />
                        )}
                    </div>
                    <div
                        className={cn(
                            'flex min-w-px flex-1 items-center text-filltext-ft-h [word-break:break-word]',
                            variantConfig.promptTextClassName,
                        )}
                    >
                        <p className="m-0 leading-4">
                            <span>{t(`${promptKey}.prefix`)}</span>
                            {neededCount > 0 && (
                                <>
                                    <span className={cn('text-auxiliary-md leading-4', skin.emphasisText)}>
                                        {' '}
                                        {neededCount}{' '}
                                    </span>
                                    <span>
                                        {t(promptMiddleKey, {
                                            count: neededCount,
                                        })}
                                    </span>
                                </>
                            )}
                            <span className={cn('text-auxiliary-md leading-4', skin.emphasisText)}>
                                {' '}
                                {promptMultiplier}{' '}
                            </span>
                            <span>{t(`${promptKey}.suffix`)}</span>
                        </p>
                    </div>
                </div>

                <div className="flex w-full shrink-0 flex-col items-start gap-0.5">
                    <div
                        className="grid h-4 w-full shrink-0 gap-px"
                        style={{ gridTemplateColumns: `repeat(${progressLegs}, minmax(0, 1fr))` }}
                    >
                        {ladder.map((tier) => {
                            const isActive = tier.legs === highlightedTier?.legs;

                            return (
                                <div
                                    key={tier.legs}
                                    className="flex h-4 flex-col items-center justify-center"
                                    style={{ gridColumn: tier.legs }}
                                >
                                    <div
                                        className={cn(
                                            'flex items-center justify-center px-1 py-0.5',
                                            isActive ? cn('rounded-[2px]', skin.activeTier) : 'rounded-sm',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex h-2.25 w-6.5 items-center justify-center text-center text-auxiliary-xxs font-semibold leading-4',
                                                isActive ? '' : skin.inactiveTier,
                                            )}
                                        >
                                            {formatParlayBoostMultiplier(tier)}
                                        </span>
                                    </div>
                                    <span
                                        className={cn(
                                            'h-0 w-0 border-x-[3px] border-x-transparent border-t-[3px]',
                                            isActive ? skin.activeArrow : skin.inactiveArrow,
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex w-full shrink-0 items-end gap-px">
                        {Array.from({ length: progressLegs }, (_, index) => {
                            const isFilled = index < filledSegmentCount;

                            return (
                                <span
                                    key={index.toString()}
                                    className={cn(
                                        'h-1 min-w-0 flex-1 rounded-[1px]',
                                        index === 0 && 'rounded-l-xs rounded-r-[1px]',
                                        index === progressLegs - 1 && 'rounded-l-[1px] rounded-r-xs',
                                        isFilled ? skin.filledSegment : skin.emptySegment,
                                    )}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex min-h-px flex-1 flex-col items-center justify-end">
                <div className="relative flex h-5 w-45 items-center justify-center">
                    <div
                        className={cn('pointer-events-none absolute inset-0', skin.minOddsBg)}
                        style={{ clipPath: PARLAY_BOOST_MIN_ODDS_BG_PATH }}
                    />
                    <div
                        className={cn(
                            'relative flex h-full w-full items-center justify-center gap-1 text-center text-auxiliary-xxs font-bold',
                            skin.minOddsText,
                        )}
                    >
                        <ParlayBoostMark className="size-3" innerClassName="text-[9px]" />
                        <span className="leading-3">{t('minOdds', { odds: minOdds })}</span>

                        <ModeTooltipTrigger
                            title={t('minOdds', { odds: minOdds })}
                            content={t('rules', {
                                minLegs: firstTier.legs,
                                maxLegs: progressLegs,
                                minOdds,
                            })}
                            className={cn('size-4 hover:bg-black/10', skin.minOddsText)}
                            iconClassName="size-2.5 shrink-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
