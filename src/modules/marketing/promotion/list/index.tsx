'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { ClientOnly } from '@/components/client-only';
import { StickyBlurHeader } from '@/components/sticky-blur-header';
import { cn } from '@/utils/common';
import { PromotionCard } from './components/PromotionCard';
import { type PromotionCategory, usePromotionItems } from './hooks/usePromotionItems';

/** 促销列表页支持的筛选标签。 */
type PromotionTab = 'sport' | 'casino';

interface PromotionsListPageProps {
    type: 'sports' | 'casino';
}

/**
 * 根据促销入口类型获取列表默认激活标签。
 * @param type 当前促销入口类型
 * @returns 当前入口默认展示的标签
 */
const getDefaultPromotionTab = (type: PromotionsListPageProps['type']): PromotionCategory =>
    type === 'sports' ? 'sport' : 'casino';

/**
 * 促销列表页，按活动类型切换展示范围。
 * @param type 当前入口来源，用于决定默认激活标签
 */
export const PromotionsListPage: FC<PromotionsListPageProps> = ({ type }) => {
    const t = useTranslations('promotion');
    const [activeTab, setActiveTab] = useState<PromotionTab>(() => getDefaultPromotionTab(type));

    useEffect((): void => {
        setActiveTab(getDefaultPromotionTab(type));
    }, [type]);

    const promotionItems = usePromotionItems();
    const filteredPromotions = promotionItems.filter((promotion) => promotion.category === activeTab);
    const visiblePromotions = [...filteredPromotions].sort((a, b) => Number(b.isHot) - Number(a.isHot));

    const tabs: Array<{ value: PromotionTab; label: string }> = [
        {
            value: 'sport',
            label: t('list.tabs.sport'),
        },
        {
            value: 'casino',
            label: t('list.tabs.casino'),
        },
    ];

    return (
        <section className="px-4 pb-6">
            <StickyBlurHeader className="pt-6 pb-2" innerClassName="px-4">
                <div className={cn('mb-2 text-headline-lg text-brand-primary-4 text-left')}>{t('list.title')}</div>
                <div className="flex h-10 mb-2 flex-row items-center justify-between gap-x-4 border-b-[0.5px] border-filltext-ft-d">
                    <div className="h-full flex-1 min-w-0 overflow-x-auto hidden-scrollbar overscroll-x-contain">
                        <div className="flex h-full w-max flex-row items-center gap-x-6 pr-2">
                            {tabs.map((tab) => {
                                const isFirstTab = tab.value === 'sport';
                                const isActive = activeTab === tab.value;

                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => setActiveTab(tab.value)}
                                        className={cn(
                                            'group flex h-10 shrink-0 cursor-pointer flex-col items-center justify-center text-body-lg transition-colors',
                                            isActive ? 'text-filltext-ft-h' : 'text-filltext-ft-f',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex min-h-0 w-full flex-1 items-end justify-center',
                                                isFirstTab ? 'pl-0 pr-2' : 'px-2',
                                            )}
                                        >
                                            <span className="h-0.5 w-full rounded-lg opacity-0" />
                                        </span>
                                        <span
                                            className={cn(
                                                'flex shrink-0 items-center gap-2 py-1 transition-colors',
                                                isFirstTab ? 'pl-0 pr-2' : 'px-2',
                                                isFirstTab ? 'rounded-r-sm' : 'rounded-sm',
                                                !isActive && 'group-hover:bg-filltext-ft-c',
                                            )}
                                        >
                                            {tab.label}
                                        </span>
                                        <span
                                            className={cn(
                                                'flex h-2 w-full shrink-0 items-end justify-center',
                                                isFirstTab ? 'pl-0 pr-2' : 'px-2',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'h-0.5 w-full rounded-lg bg-brand-primary-0 transition-opacity',
                                                    isActive ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </StickyBlurHeader>
            <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-2">
                <ClientOnly>
                    {visiblePromotions.map((promotion) => (
                        <PromotionCard key={promotion.id} promotion={promotion} />
                    ))}
                </ClientOnly>
            </div>
        </section>
    );
};
