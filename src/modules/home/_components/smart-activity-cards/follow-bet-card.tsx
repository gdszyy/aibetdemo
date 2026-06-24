'use client';

import { useTranslations } from 'next-intl';
import type { CSSProperties, FC } from 'react';
import { useMemo } from 'react';
import { BetType, CartStatus } from '@/api/models/cart';
import { HotOutlined } from '@/components/icons2/HotOutlined';
import { RecommendOutlined } from '@/components/icons2/RecommendOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Toast } from '@/components/toast';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useBetSlipStore, useCartStatus } from '@/modules/bet-slip/stores/bet-slip-store';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat } from '@/utils/odds-format';
import { convertRecommendCardSelectionsToOddsEntities } from '@/utils/recommend-card-to-odds-entity';
import type { SmartActivityCardSkin } from './card-skin';
import { InitialAvatar } from './initial-avatar';
import type { FollowBetProfile } from './types';

interface FollowBetCardProps {
    profile: FollowBetProfile;
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

/** 顶部品牌色高光条，强化"精选卡片"质感（品牌色全主题安全）。 */
const ACCENT_BAR_STYLE: CSSProperties = {
    background: 'linear-gradient(90deg, var(--brand-primary-0) 0%, var(--accent-warm) 70%, transparent 100%)',
};

/** 用户跟单推荐卡片。 */
export const FollowBetCard: FC<FollowBetCardProps> = ({ componentProfile, profile, skin }) => {
    const t = useTranslations('home.smartCards');
    const tBetSlip = useTranslations('betSlip');
    const activityProfile = componentProfile.activityCards;
    const cartStatus = useCartStatus();
    const oddsFormat = useOddsFormat();

    const totalOdds = useMemo(
        () => profile.selections.reduce((acc, selection) => acc * Number(selection.outcome_odds), 1),
        [profile.selections],
    );

    const stats = [
        { key: 'win', label: t('followBet.winRate'), value: profile.winRate, highlight: false },
        { key: 'roi', label: t('followBet.roi'), value: profile.roi, highlight: true },
        { key: 'followers', label: t('followBet.followers'), value: profile.followers, highlight: false },
    ];

    const handleFollow = (): void => {
        if (cartStatus === CartStatus.Locked) {
            Toast.loading(tBetSlip('message.waitOrderComplete'), { id: 'follow-card-wait-order', duration: 3000 });
            return;
        }

        const store = useBetSlipStore.getState();
        store.clearAll();
        store.setSelections(convertRecommendCardSelectionsToOddsEntities(profile.selections), { pendingSync: true });
        useBetCartStore.getState().setBetMode(BetType.Parlay);
        store.syncToServer();
        useUIStore.getState().openBetSlipDrawer();
        Toast.success(t('slipAdded'), { id: `follow-card-added-${profile.id}` });
    };

    return (
        <article
            className={cn(
                skin.raisedClassName,
                'relative flex min-h-[248px] flex-col gap-3 overflow-hidden p-2.5 transition-[background-color,border-color,transform]',
                activityProfile.cardDensity === 'featured' && 'md:min-h-[276px]',
                activityProfile.interaction === 'promo-lift' && 'hover:-translate-y-0.5',
                activityProfile.interaction !== 'promo-lift' && 'hover:border-[color:var(--brand-primary-0)]',
            )}
            data-smart-activity-card-profile={activityProfile.profile}
            data-smart-activity-card-density={activityProfile.cardDensity}
            data-bet-slip-profile={componentProfile.betSlip.profile}
            style={{ ...componentProfile.style, ...skin.heroStyle }}
        >
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={ACCENT_BAR_STYLE} />

            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="relative shrink-0">
                        <InitialAvatar
                            name={profile.name}
                            className="size-12 shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                            textClassName="text-title-md"
                        />
                        <span
                            className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-[color:var(--surface-raised)] bg-[var(--brand-primary-0)] text-[var(--on-brand)]"
                            title={profile.tag}
                        >
                            <StarFilled className="size-2.5" />
                        </span>
                    </div>
                    <div className="min-w-0">
                        <div className="truncate text-title-md font-bold text-content-primary">{profile.name}</div>
                        <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>{profile.tag}</div>
                    </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--status-success-surface)] px-2 py-1 text-auxiliary-xs font-bold text-[var(--status-success-text)]">
                    <HotOutlined className="size-3" />
                    {profile.streak}
                </span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[color:var(--brand-odds-border,var(--border-subtle))] overflow-hidden rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))]">
                {stats.map((stat) => (
                    <div key={stat.key} className="flex flex-col gap-0.5 px-2 py-2">
                        <div
                            className={cn(
                                'truncate text-title-md font-black',
                                stat.highlight ? 'text-[var(--status-success-text)]' : 'text-content-primary',
                            )}
                        >
                            {stat.value}
                        </div>
                        <div className={cn('truncate text-auxiliary-xxs font-bold uppercase', skin.mutedTextClassName)}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-[var(--component-smart-card-radius,var(--brand-match-card-radius,4px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-1)] p-2.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[var(--brand-primary-0)]">
                        <RecommendOutlined className="size-4" />
                        <span className="text-auxiliary-xs font-bold uppercase">{t('followBet.pick')}</span>
                    </div>
                    <span className="inline-flex items-center rounded-xs bg-[var(--brand-odds-bg,var(--surface-2))] px-1.5 py-0.5 text-auxiliary-xxs font-black text-content-secondary">
                        {profile.selections.length}x
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    {profile.selections.map((selection) => (
                        <div
                            key={`${selection.event_id}-${selection.outcome_id}`}
                            className="flex h-8 items-center justify-between gap-2 rounded-xs bg-[var(--surface-2)] px-2"
                        >
                            <span className="min-w-0 truncate text-body-sm">
                                <span className="font-bold text-content-primary">{selection.outcome_name}</span>
                                <span className={cn('ml-1.5', skin.mutedTextClassName)}>{selection.market_name}</span>
                            </span>
                            <span className="shrink-0 text-body-sm font-black text-content-primary">
                                {formatOddsByFormat(Number(selection.outcome_odds), oddsFormat)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-0.5">
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className={cn('text-auxiliary-xxs font-bold uppercase', skin.mutedTextClassName)}>
                            {t('followBet.totalOdds')}
                        </span>
                        <span className="text-title-md font-black text-[var(--accent-warm)]">
                            {formatOddsByFormat(totalOdds, oddsFormat)}
                        </span>
                    </div>
                    <button
                        type="button"
                        className={cn(skin.ctaClassName, 'shrink-0')}
                        data-mobile-bet-flow={componentProfile.betSlip.mobileFlow}
                        onClick={handleFollow}
                    >
                        <RecommendOutlined className="size-4" />
                        {t('followBet.cta')}
                    </button>
                </div>
            </div>
        </article>
    );
};
