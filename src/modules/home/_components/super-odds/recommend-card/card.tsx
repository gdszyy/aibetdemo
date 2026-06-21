'use client';

import type { FC } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard } from '@/api/models/recommend-card';
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

    return (
        <div
            className={cn(
                'flex h-full shrink-0 flex-col gap-2 overflow-hidden py-4 md:w-97.5',
                fullWidthOnMobile ? 'w-full' : 'w-70',
                className,
            )}
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
