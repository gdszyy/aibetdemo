'use client';

import Image from 'next/image';
import type { FC } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard } from '@/api/models/recommend-card';
import type { SchemeMode } from '@/components/theme-provider/scheme-meta';
import { useRecommendCardAddToCart } from '@/hooks/use-recommend-card-add-to-cart';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat } from '@/utils/odds-format';
import imageFlashSmall from '../assets/flash-small.png';
import { getRecommendSectionSkin, type RecommendCardSkin } from './skin';
import { getRecommendCardParlayBoostDisplayOdds } from './utils';

interface OddsFooterProps {
    /** 推荐卡片数据 */
    card: RecommendCard;
    /** 串关加赔规则 */
    rule: ParlayBoostRule | null;
    /** 加入购物车成功后的回调 */
    onAdded?: () => void;
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    /** 自定义类名 */
    className?: string;
}

/** 推荐串关加赔卡片底部赔率区。 */
export const OddsFooter: FC<OddsFooterProps> = ({
    card,
    rule,
    onAdded,
    skin = 'superbet',
    mode = 'dark',
    className,
}) => {
    const oddsFormat = useOddsFormat();
    const { addRecommendCardToCart } = useRecommendCardAddToCart({ onAdded });
    const skinConfig = getRecommendSectionSkin(skin, mode);
    const { parlayOdds, effectiveTotalOdds, showBoostedOdds } = getRecommendCardParlayBoostDisplayOdds(
        card.json_list,
        rule,
    );

    return (
        <button
            type="button"
            className={cn(
                'group/betBtn flex h-8 w-full shrink-0 cursor-pointer flex-col border p-px transition-colors',
                skinConfig.footerButtonClassName,
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                className,
            )}
            onClick={() => {
                addRecommendCardToCart(card, rule);
            }}
        >
            <span
                className={cn(
                    'flex h-7.5 w-full items-center justify-center gap-1 px-2 transition-colors',
                    skinConfig.footerInnerClassName,
                )}
            >
                {showBoostedOdds && (
                    <span className="text-auxiliary-sm text-filltext-ft-g line-through">
                        {formatOddsByFormat(parlayOdds, oddsFormat)}
                    </span>
                )}
                {skin === 'superbet' ? (
                    <Image className="size-5 shrink-0" src={imageFlashSmall} loading="eager" alt="" />
                ) : (
                    <span
                        className={cn(
                            'flex size-4 shrink-0 items-center justify-center rounded-full text-auxiliary-xxs font-black leading-none',
                            skinConfig.footerIconClassName,
                        )}
                        aria-hidden
                    >
                        +
                    </span>
                )}
                <span className={cn('text-body-lg font-bold', skinConfig.footerOddsClassName)}>
                    {formatOddsByFormat(effectiveTotalOdds, oddsFormat)}
                </span>
            </span>
        </button>
    );
};
