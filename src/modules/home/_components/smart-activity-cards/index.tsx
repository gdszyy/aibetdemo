'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { cn } from '@/utils/common';
import { ActivityStyleCard } from './activity-style-card';
import { getSmartActivityCardSkin } from './card-skin';
import { FollowBetCard } from './follow-bet-card';
import {
    buildActivityStyleItems,
    buildFollowBetProfile,
    buildLeaderboardRows,
    buildPopularBetItems,
    buildQuickBetItems,
} from './mock-data';
import { PopularBetCard } from './popular-bets-card';
import { QuickBetCard } from './quick-bet-card';
import { TurnoverLeaderboardCard } from './turnover-leaderboard-card';

interface SmartActivityCardsProps {
    className?: string;
}

const getActivityGridClassName = (layout: 'compact-grid' | 'promo-mosaic' | 'ticket-hub'): string => {
    if (layout === 'promo-mosaic') {
        return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,12px)] md:grid-cols-2 xl:grid-cols-4';
    }

    if (layout === 'ticket-hub') {
        return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,10px)] sm:grid-cols-2 lg:grid-cols-3';
    }

    return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,8px)] md:grid-cols-4';
};

const getQuickBetGridClassName = (layout: 'compact-grid' | 'promo-mosaic' | 'ticket-hub'): string => {
    if (layout === 'promo-mosaic') {
        return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,12px)] md:grid-cols-3';
    }

    if (layout === 'ticket-hub') {
        return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,10px)] md:grid-cols-2';
    }

    return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,8px)] md:grid-cols-3';
};

const getInsightGridClassName = (layout: 'compact-grid' | 'promo-mosaic' | 'ticket-hub'): string => {
    if (layout === 'ticket-hub') {
        return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,10px)] xl:grid-cols-[1.15fr_0.85fr]';
    }

    return 'grid grid-cols-1 gap-[var(--component-smart-section-gap,8px)] md:grid-cols-2';
};

/** 首页主题化活动卡片试验区，承载运营活动、跟单、快捷下注与排行榜。 */
export const SmartActivityCards: FC<SmartActivityCardsProps> = ({ className }) => {
    const t = useTranslations('home.smartCards');
    const schemeMeta = useSchemeMeta();
    const componentProfile = useThemeComponentProfile();
    const activityProfile = componentProfile.activityCards;
    const skin = useMemo(() => getSmartActivityCardSkin(schemeMeta), [schemeMeta]);
    const activityItems = useMemo(() => buildActivityStyleItems(t), [t]);
    const quickBetItems = useMemo(() => buildQuickBetItems(t), [t]);
    const followProfile = useMemo(() => buildFollowBetProfile(t), [t]);
    const leaderboardRows = useMemo(() => buildLeaderboardRows(t), [t]);
    const popularBetItems = useMemo(() => buildPopularBetItems(t), [t]);

    return (
        <section
            className={cn('flex min-w-0 flex-col gap-[var(--component-smart-section-gap,8px)]', className)}
            data-smart-activity-profile={activityProfile.profile}
            data-smart-activity-layout={activityProfile.layout}
            data-smart-activity-interaction={activityProfile.interaction}
            style={componentProfile.style}
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-auxiliary-xs font-bold uppercase text-[var(--brand-primary-0)]">
                        {t('eyebrow')}
                    </div>
                    <h2 className="text-headline-lg text-content-primary">{t('title')}</h2>
                </div>
                <span className={skin.chipClassName}>{t('refresh')}</span>
            </div>

            <div className={cn(skin.sectionClassName, getActivityGridClassName(activityProfile.layout))}>
                {activityItems.map((item) => (
                    <ActivityStyleCard key={item.id} item={item} skin={skin} componentProfile={componentProfile} />
                ))}
            </div>

            <div className={getQuickBetGridClassName(activityProfile.layout)}>
                {quickBetItems.map((item) => (
                    <QuickBetCard key={item.id} item={item} skin={skin} componentProfile={componentProfile} />
                ))}
            </div>

            <div className={getInsightGridClassName(activityProfile.layout)}>
                <FollowBetCard profile={followProfile} skin={skin} componentProfile={componentProfile} />
                <TurnoverLeaderboardCard rows={leaderboardRows} skin={skin} componentProfile={componentProfile} />
            </div>

            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-auxiliary-xs font-bold uppercase text-[var(--brand-primary-0)]">
                        {t('popularBets.eyebrow')}
                    </div>
                    <h3 className="text-headline-md text-content-primary">{t('popularBets.title')}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-[var(--component-smart-section-gap,8px)] md:grid-cols-3">
                {popularBetItems.map((item) => (
                    <PopularBetCard key={item.id} profile={item} skin={skin} componentProfile={componentProfile} />
                ))}
            </div>
        </section>
    );
};
