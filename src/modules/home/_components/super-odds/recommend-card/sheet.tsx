'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard } from '@/api/models/recommend-card';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { CloseOutlined } from '@/components/icons2/CloseOutlined';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import type { SchemeMode } from '@/components/theme-provider/scheme-meta';
import { cn } from '@/utils/common';
import { OddsFooter } from './odds-footer';
import { CardBody, CardDivider, CardTitle } from './parts';
import { getRecommendSectionSkin, type RecommendCardSkin } from './skin';

interface SheetProps {
    /** 是否展示 sheet */
    open: boolean;
    /** sheet 开关回调 */
    onOpenChange: (open: boolean) => void;
    /** 推荐卡片数据 */
    card: RecommendCard;
    /** 串关加赔规则 */
    rule: ParlayBoostRule | null;
    /** 串关加赔角标文案 */
    badgeLabel: string;
    skin?: RecommendCardSkin;
    mode?: SchemeMode;
    /** 加入购物车成功后的回调 */
    onAdded?: () => void;
}

/** 移动端推荐串关加赔详情 sheet。 */
export const Sheet: FC<SheetProps> = ({
    open,
    onOpenChange,
    card,
    rule,
    badgeLabel,
    skin = 'superbet',
    mode = 'dark',
    onAdded,
}) => {
    const t = useTranslations('matches');
    const componentProfile = useThemeComponentProfile();
    const recommendProfile = componentProfile.homeRecommend;
    const skinConfig = getRecommendSectionSkin(skin, mode);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent
                overlayClassName="bg-black/55"
                className={cn(
                    'mx-auto flex max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden px-2 pb-3 pt-7',
                    skinConfig.cardClassName,
                    'rounded-t-[24px] shadow-floating',
                    recommendProfile.interaction === 'ticket-sheet' && 'px-3',
                    recommendProfile.interaction === 'cta-sheet' && 'pb-4',
                    '[&>div:first-child]:hidden',
                )}
                data-home-recommend-profile={recommendProfile.profile}
                data-home-recommend-interaction={recommendProfile.interaction}
                style={componentProfile.style}
            >
                <DrawerTitle className="sr-only">{card.title}</DrawerTitle>

                <div className="absolute left-1/2 top-2 h-[5px] w-[35px] -translate-x-1/2 rounded-[30px] bg-filltext-ft-d" />

                <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-xs text-filltext-ft-f active:scale-95"
                >
                    <CloseOutlined className="size-3" />
                    <span className="sr-only">{t('superOdd.sheetClose')}</span>
                </button>

                <div
                    data-vaul-no-drag
                    className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain transaction-scrollbar px-2 pb-3 pt-5"
                >
                    <CardTitle title={card.title} skin={skin} mode={mode} className="px-2" />
                    <CardDivider skin={skin} mode={mode} />
                    <CardBody
                        card={card}
                        rule={rule}
                        isUniformHeightReady
                        badgeLabel={badgeLabel}
                        skin={skin}
                        mode={mode}
                        variant="sheet"
                        className="px-2"
                    />
                    <div className="px-2 py-3">
                        <OddsFooter card={card} rule={rule} skin={skin} mode={mode} onAdded={onAdded} />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
