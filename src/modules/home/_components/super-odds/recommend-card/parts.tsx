'use client';

import type { CSSProperties, FC, WheelEvent } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard, RecommendCardSelection } from '@/api/models/recommend-card';
import { ParlayBadge } from '@/components/parlay-badge';
import type { SchemeMode } from '@/components/theme-provider/scheme-meta';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { CARD_SELECTION_LIMIT } from './constants';
import { getRecommendSectionSkin, type RecommendCardSkin } from './skin';
import { getRecommendCardQualifiedSelections, getSelectionDescription } from './utils';

/** 列表可滚动时阻止 wheel 冒泡到外层 Embla carousel。 */
const handleScrollableListWheel = (event: WheelEvent<HTMLDivElement>): void => {
    const element = event.currentTarget;
    if (element.scrollHeight <= element.clientHeight) {
        return;
    }

    const canScrollUp = element.scrollTop > 0;
    const canScrollDown = element.scrollTop + element.clientHeight < element.scrollHeight - 1;

    if ((event.deltaY < 0 && canScrollUp) || (event.deltaY > 0 && canScrollDown)) {
        event.stopPropagation();
    }
};

interface CardTitleProps {
    /** 卡片标题 */
    title: string;
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    /** 自定义类名 */
    className?: string;
}

/** 推荐串关加赔卡片标题。 */
export const CardTitle: FC<CardTitleProps> = ({ title, skin = 'superbet', mode = 'dark', className }) => {
    const skinConfig = getRecommendSectionSkin(skin, mode);

    return (
        <div className={cn('pb-2', className)}>
            <p className={cn('break-words text-center text-body-lg', skinConfig.cardTitleClassName)}>{title}</p>
        </div>
    );
};

/** 推荐串关加赔卡片分隔线。 */
export const CardDivider: FC<{ skin?: RecommendCardSkin; mode?: SchemeMode; className?: string }> = ({
    skin = 'superbet',
    mode = 'dark',
    className,
}) => {
    const skinConfig = getRecommendSectionSkin(skin, mode);

    return <div className={cn('h-px w-full', className)} style={skinConfig.dividerStyle} />;
};

interface SelectionListProps {
    /** 展示的投注项 */
    selections: RecommendCardSelection[];
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: CSSProperties;
    /** 滚轮事件，用于阻止外层 carousel 抢占滚动 */
    onWheel?: (event: WheelEvent<HTMLDivElement>) => void;
}

/** 推荐串关加赔投注项列表。 */
export const SelectionList: FC<SelectionListProps> = ({
    selections,
    skin = 'superbet',
    mode = 'dark',
    className,
    style,
    onWheel,
}) => {
    const oddsFormat = useOddsFormat();
    const skinConfig = getRecommendSectionSkin(skin, mode);

    return (
        <div className={cn('flex flex-col gap-y-2.5', className)} style={style} onWheel={onWheel}>
            {selections.map((selection) => {
                return (
                    <div
                        key={`${selection.event_id}-${selection.market_id}-${selection.outcome_id}`}
                        className="flex flex-col gap-y-0.5"
                    >
                        <span className={cn('break-words text-body-lg', skinConfig.selectionTitleClassName)}>
                            {selection.title}
                        </span>
                        <span
                            className={cn('break-words text-auxiliary-xs leading-4', skinConfig.selectionMetaClassName)}
                        >
                            {getSelectionDescription(selection, oddsFormat)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

interface CardBodyProps {
    /** 推荐卡片数据 */
    card: RecommendCard;
    /** 当前串关加赔活动规则 */
    rule: ParlayBoostRule | null;
    /** 串关加赔角标文案 */
    badgeLabel: string;
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    /** 展示场景 */
    variant: 'desktop' | 'mobile' | 'sheet';
    /** 等高测量是否完成；完成前列 4 条腿量高度，完成后列表占 flex 剩余高度并可滚动 */
    isUniformHeightReady: boolean;
    /** Show More 点击回调，仅 mobile 使用 */
    onShowMore?: () => void;
    /** Show More 文案，仅 mobile 使用 */
    showMoreLabel?: string;
    /** 自定义类名 */
    className?: string;
}

/** 推荐串关加赔卡片主体：列表可视区由 flex 剩余高度决定，超出可滚动。 */
export const CardBody: FC<CardBodyProps> = ({
    card,
    rule,
    badgeLabel,
    skin = 'superbet',
    mode = 'dark',
    variant,
    isUniformHeightReady,
    onShowMore,
    showMoreLabel,
    className,
}) => {
    const selections = getRecommendCardQualifiedSelections(card.json_list, rule);
    const skinConfig = getRecommendSectionSkin(skin, mode);
    const isScrollableCardList = (variant === 'desktop' || variant === 'mobile') && isUniformHeightReady;
    const displayedSelections =
        variant === 'sheet' || isUniformHeightReady ? selections : selections.slice(0, CARD_SELECTION_LIMIT);
    const showMoreButton =
        variant === 'mobile' &&
        Boolean(onShowMore) &&
        Boolean(showMoreLabel) &&
        selections.length > CARD_SELECTION_LIMIT;

    return (
        <div className={cn('flex min-h-0 flex-col', isScrollableCardList && 'h-full', className)}>
            <div
                className={cn(
                    'mb-2 flex shrink-0 items-center gap-2',
                    showMoreButton ? 'justify-between' : 'justify-start',
                )}
            >
                {skin === 'superbet' ? (
                    <ParlayBadge variant="boost" label={badgeLabel} />
                ) : (
                    <span
                        className={cn(
                            'inline-flex shrink-0 items-center justify-center self-start',
                            skinConfig.badgeClassName,
                        )}
                    >
                        <span className={skinConfig.badgeTextClassName}>{badgeLabel}</span>
                    </span>
                )}
                {showMoreButton && (
                    <button
                        type="button"
                        onClick={onShowMore}
                        className="cursor-pointer rounded-xs py-1 text-auxiliary-sm text-filltext-ft-f transition-colors hover:text-filltext-ft-g"
                    >
                        {showMoreLabel}
                    </button>
                )}
            </div>
            <SelectionList
                selections={displayedSelections}
                skin={skin}
                mode={mode}
                className={cn(
                    isScrollableCardList &&
                        'min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-2 hidden-scrollbar touch-pan-y',
                    variant === 'sheet' && 'px-0',
                )}
                onWheel={variant === 'desktop' && isScrollableCardList ? handleScrollableListWheel : undefined}
            />
        </div>
    );
};
