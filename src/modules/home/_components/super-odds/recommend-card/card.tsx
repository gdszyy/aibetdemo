'use client';

import type { FC } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard } from '@/api/models/recommend-card';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import type { SchemeMode } from '@/components/theme-provider/scheme-meta';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';
import { OddsFooter } from './odds-footer';
import { CardBody, CardDivider, CardTitle } from './parts';
import type { RecommendCardSkin } from './skin';

interface CardProps {
    /** 推荐串关加赔卡片数据 */
    card: RecommendCard;
    /** 当前串关加赔活动规则 */
    rule: ParlayBoostRule | null;
    /** 等高测量是否完成 */
    isUniformHeightReady: boolean;
    /** 串关加赔角标文案 */
    badgeLabel: string;
    /** Show More 文案 */
    showMoreLabel: string;
    /** Show More 点击回调 */
    onShowMore: () => void;
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    /** 自定义类名 */
    className?: string;
    /** H5 单卡场景占满轮播视口宽度。 */
    fullWidthOnMobile?: boolean;
}

/** 首页推荐串关加赔单卡：列表占 flex 剩余高度，超出可滚动；H5 超出时 Show More 打开 Sheet。 */
export const Card: FC<CardProps> = ({
    card,
    rule,
    isUniformHeightReady,
    badgeLabel,
    showMoreLabel,
    onShowMore,
    skin = 'superbet',
    mode = 'dark',
    className,
    fullWidthOnMobile = false,
}) => {
    const isDesktop = useIsDesktop();
    const componentProfile = useThemeComponentProfile();
    const recommendProfile = componentProfile.homeRecommend;
    const cardWidthClassName = fullWidthOnMobile
        ? 'w-full md:w-[var(--component-recommend-card-width,390px)]'
        : 'w-[min(var(--component-recommend-card-width,300px),calc(100vw-48px))] md:w-[var(--component-recommend-card-width,390px)]';

    return (
        <div
            className={cn(
                'flex h-full shrink-0 flex-col overflow-hidden',
                cardWidthClassName,
                recommendProfile.cardDensity === 'featured' && 'gap-3 py-5',
                recommendProfile.cardDensity === 'ticket' && 'gap-2 py-3',
                recommendProfile.cardDensity === 'compact' && 'gap-2 py-4',
                className,
                'rounded-[var(--component-recommend-card-radius,var(--brand-match-card-radius,8px))]',
            )}
            data-home-recommend-card-profile={recommendProfile.profile}
            data-home-recommend-card-density={recommendProfile.cardDensity}
            data-home-recommend-selection-layout={recommendProfile.selectionLayout}
            style={componentProfile.style}
        >
            <CardTitle title={card.title} skin={skin} mode={mode} className="shrink-0 px-4" />
            <CardDivider skin={skin} mode={mode} className="shrink-0" />
            <div className="flex min-h-0 flex-1 flex-col px-4">
                <CardBody
                    card={card}
                    rule={rule}
                    isUniformHeightReady={isUniformHeightReady}
                    badgeLabel={badgeLabel}
                    skin={skin}
                    mode={mode}
                    variant={isDesktop ? 'desktop' : 'mobile'}
                    onShowMore={onShowMore}
                    showMoreLabel={showMoreLabel}
                    className="h-full"
                />
            </div>
            <div className="shrink-0 px-4 py-3">
                <OddsFooter card={card} rule={rule} skin={skin} mode={mode} />
            </div>
        </div>
    );
};
