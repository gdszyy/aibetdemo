'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { BetType, CartStatus } from '@/api/models/cart';
import { RecommendOutlined } from '@/components/icons2/RecommendOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import { UserOutlined } from '@/components/icons2/UserOutlined';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Toast } from '@/components/toast';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useBetSlipStore, useCartStatus } from '@/modules/bet-slip/stores/bet-slip-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { convertRecommendCardSelectionsToOddsEntities } from '@/utils/recommend-card-to-odds-entity';
import type { SmartActivityCardSkin } from './card-skin';
import type { FollowBetProfile } from './types';

interface FollowBetCardProps {
    profile: FollowBetProfile;
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

/** 用户跟单推荐卡片。 */
export const FollowBetCard: FC<FollowBetCardProps> = ({ componentProfile, profile, skin }) => {
    const t = useTranslations('home.smartCards');
    const tBetSlip = useTranslations('betSlip');
    const activityProfile = componentProfile.activityCards;
    const cartStatus = useCartStatus();

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
                'flex min-h-[248px] flex-col p-2.5 transition-[background-color,border-color,transform]',
                activityProfile.cardDensity === 'featured' && 'md:min-h-[276px]',
                activityProfile.interaction === 'promo-lift' && 'hover:-translate-y-0.5',
                activityProfile.interaction !== 'promo-lift' && 'hover:border-[color:var(--brand-primary-0)]',
            )}
            data-smart-activity-card-profile={activityProfile.profile}
            data-smart-activity-card-density={activityProfile.cardDensity}
            data-bet-slip-profile={componentProfile.betSlip.profile}
            style={{ ...componentProfile.style, ...skin.heroStyle }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] bg-[var(--brand-odds-bg,var(--surface-2))] text-[var(--brand-primary-0)]">
                        <UserOutlined className="size-6" />
                    </div>
                    <div className="min-w-0">
                        <div className="truncate text-title-md font-bold text-content-primary">{profile.name}</div>
                        <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>{profile.tag}</div>
                    </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-xs bg-[var(--status-success-surface)] px-2 py-1 text-auxiliary-xs font-bold text-[var(--status-success-text)]">
                    <StarFilled className="size-3" />
                    {profile.streak}
                </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
                {[
                    { label: t('followBet.winRate'), value: profile.winRate },
                    { label: t('followBet.roi'), value: profile.roi },
                    { label: t('followBet.followers'), value: profile.followers },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] px-2 py-2"
                    >
                        <div className="text-title-md font-black text-content-primary">{item.value}</div>
                        <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>{item.label}</div>
                    </div>
                ))}
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col justify-between gap-3 rounded-[var(--component-smart-card-radius,var(--brand-match-card-radius,4px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-1)] p-2.5">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-[var(--brand-primary-0)]">
                        <RecommendOutlined className="size-4" />
                        <span className="text-auxiliary-xs font-bold uppercase">{t('followBet.pick')}</span>
                    </div>
                    <h3 className="line-clamp-2 text-title-sm font-bold text-content-primary">{profile.pickTitle}</h3>
                    <p className={cn('mt-1 line-clamp-1 text-body-sm', skin.mutedTextClassName)}>{profile.pickMeta}</p>
                </div>
                <button
                    type="button"
                    className={skin.ctaClassName}
                    data-mobile-bet-flow={componentProfile.betSlip.mobileFlow}
                    onClick={handleFollow}
                >
                    <RecommendOutlined className="size-4" />
                    {t('followBet.cta')}
                </button>
            </div>
        </article>
    );
};
