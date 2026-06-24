'use client';

import type { CSSProperties, FC, WheelEvent } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard, RecommendCardSelection } from '@/api/models/recommend-card';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import type { SchemeMode } from '@/components/theme-provider/scheme-meta';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { BoostMotif } from './boost-motif';
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
export const CardTitle: FC<CardTitleProps> = ({
    title,
    skin = 'superbet',
    mode = 'dark',
    className,
}) => {
    const skinConfig = getRecommendSectionSkin(skin, mode);
    const componentProfile = useThemeComponentProfile();

    return (
        <div className={cn('pb-2', className)}>
            <p
                className={cn(
                    'break-words text-body-lg',
                    componentProfile.homeRecommend.sectionLayout === 'ticket-feed' ? 'text-left' : 'text-center',
                    skinConfig.cardTitleClassName,
                )}
            >
                {title}
            </p>
        </div>
    );
};

/** 推荐串关加赔卡片分隔线。 */
export const CardDivider: FC<{
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    className?: string;
}> = ({ skin = 'superbet', mode = 'dark', className }) => {
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
    const componentProfile = useThemeComponentProfile();
    const selectionLayout = componentProfile.homeRecommend.selectionLayout;

    return (
        <div
            className={cn(
                'flex flex-col',
                selectionLayout === 'event-first' && 'gap-y-3',
                selectionLayout === 'ticket-line' && 'gap-y-1.5',
                selectionLayout === 'market-stack' && 'gap-y-2',
                className,
            )}
            style={{ ...componentProfile.style, ...style }}
            onWheel={onWheel}
        >
            {selections.map((selection) => {
                const description = getSelectionDescription(selection, oddsFormat);

                return (
                    <div
                        key={`${selection.event_id}-${selection.market_id}-${selection.outcome_id}`}
                        className={cn(
                            'flex flex-col gap-y-0.5',
                            selectionLayout === 'event-first' &&
                                'rounded-[var(--component-recommend-card-radius,8px)] bg-[var(--surface-1)] px-2.5 py-2',
                            selectionLayout === 'ticket-line' &&
                                'rounded-[var(--component-odds-radius,8px)] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] px-2.5 py-2',
                        )}
                    >
                        <span
                            className={cn(
                                'break-words',
                                selectionLayout === 'ticket-line' ? 'text-body-md font-bold' : 'text-body-lg',
                                skinConfig.selectionTitleClassName,
                            )}
                        >
                            {selection.title}
                        </span>
                        <span
                            className={cn(
                                'break-words text-auxiliary-xs leading-4',
                                selectionLayout === 'ticket-line' &&
                                    'mt-1 border-t border-[color:var(--brand-match-divider,var(--border-subtle))] pt-1',
                                skinConfig.selectionMetaClassName,
                            )}
                        >
                            {description}
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
    const componentProfile = useThemeComponentProfile();
    const recommendProfile = componentProfile.homeRecommend;
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
                    recommendProfile.selectionLayout === 'event-first' && 'mb-3',
                    recommendProfile.selectionLayout === 'ticket-line' && 'mb-2 justify-between',
                    showMoreButton ? 'justify-between' : 'justify-start',
                )}
            >
                <span
                    className={cn(
                        'inline-flex shrink-0 items-center justify-center gap-1 self-start',
                        skinConfig.badgeClassName,
                    )}
                >
                    <BoostMotif
                        kind={skinConfig.boostMotif}
                        className={cn('size-3', skinConfig.boostMotifClassName)}
                    />
                    <span className={skinConfig.badgeTextClassName}>{badgeLabel}</span>
                </span>
                {showMoreButton && (
                    <button
                        type="button"
                        onClick={onShowMore}
                        className="cursor-pointer rounded-[var(--component-odds-radius,4px)] px-2 py-1 text-auxiliary-sm text-filltext-ft-f transition-colors hover:text-filltext-ft-g"
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
