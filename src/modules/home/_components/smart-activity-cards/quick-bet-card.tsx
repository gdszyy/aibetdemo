'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { BetType, CartStatus } from '@/api/models/cart';
import { PromoParlayBoostMinLightning } from '@/components/icons2/PromoParlayBoostMinLightning';
import { SlipOutlined } from '@/components/icons2/SlipOutlined';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Toast } from '@/components/toast';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { StakeInput } from '@/modules/bet-slip/cart/stake-input';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useBetSlipStore, useCartStatus } from '@/modules/bet-slip/stores/bet-slip-store';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat } from '@/utils/odds-format';
import { convertRecommendCardSelectionsToOddsEntities } from '@/utils/recommend-card-to-odds-entity';
import { checkParlaySelectionLimit } from '@/utils/selection-limit';
import type { SmartActivityCardSkin } from './card-skin';
import type { QuickBetItem } from './types';

interface QuickBetCardProps {
    item: QuickBetItem;
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

/** 快捷下注卡片：当前版本写入投注单并打开投注确认流程。 */
export const QuickBetCard: FC<QuickBetCardProps> = ({ componentProfile, item, skin }) => {
    const t = useTranslations('home.smartCards');
    const tBetSlip = useTranslations('betSlip');
    const activityProfile = componentProfile.activityCards;
    const { formatCurrency } = useIntlFormatter();
    const oddsFormat = useOddsFormat();
    const cartStatus = useCartStatus();
    const [stake, setStake] = useState(item.defaultStake);
    const totalPayout = useMemo(() => stake * item.odds, [item.odds, stake]);
    const isParlay = item.kind === 'parlay';

    const handleAddToSlip = (): void => {
        if (cartStatus === CartStatus.Locked) {
            Toast.loading(tBetSlip('message.waitOrderComplete'), { id: 'smart-card-wait-order', duration: 3000 });
            return;
        }

        if (stake <= 0) {
            Toast.error(tBetSlip('message.invalidStake'), { id: 'smart-card-invalid-stake' });
            return;
        }

        if (isParlay) {
            const { canAdd, maxLimit } = checkParlaySelectionLimit(item.selections.length - 1);
            if (!canAdd) {
                Toast.error(tBetSlip('toast.maxSelectionsReached', { count: maxLimit }), {
                    id: 'smart-card-max-selections',
                });
                return;
            }
        }

        const store = useBetSlipStore.getState();
        store.clearAll();
        store.setSelections(convertRecommendCardSelectionsToOddsEntities(item.selections), { pendingSync: true });
        useBetCartStore.getState().setBetMode(isParlay ? BetType.Parlay : BetType.Single);
        store.syncToServer();
        useUIStore.getState().openBetSlipDrawer();
        Toast.success(t('slipAdded'), { id: `smart-card-added-${item.id}` });
    };

    return (
        <article
            className={cn(
                skin.cardClassName,
                'flex min-h-[248px] flex-col p-2.5 transition-[background-color,border-color,transform]',
                activityProfile.cardDensity === 'featured' && 'md:min-h-[276px]',
                activityProfile.cardDensity === 'balanced' && 'md:min-h-[260px]',
                activityProfile.interaction === 'promo-lift' && 'hover:-translate-y-0.5',
                activityProfile.interaction !== 'promo-lift' && 'hover:border-[color:var(--brand-primary-0)]',
            )}
            data-smart-activity-card-profile={activityProfile.profile}
            data-smart-activity-card-density={activityProfile.cardDensity}
            data-mobile-bet-flow={componentProfile.betSlip.mobileFlow}
            style={{ ...componentProfile.style, ...skin.marketStyle }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <span className={skin.chipClassName}>{item.badge}</span>
                        {isParlay && (
                            <span className="inline-flex items-center gap-1 rounded-xs bg-[var(--status-success-surface)] px-2 py-1 text-auxiliary-xs font-bold text-[var(--status-success-text)]">
                                <PromoParlayBoostMinLightning className="size-3" />
                                {item.selections.length}x
                            </span>
                        )}
                    </div>
                    <h3 className="line-clamp-2 text-title-md font-bold text-content-primary">{item.title}</h3>
                    <p className={cn('mt-1 line-clamp-1 text-body-sm', skin.mutedTextClassName)}>{item.subtitle}</p>
                </div>
                <div className="rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] px-2 py-1 text-right">
                    <div className={cn('text-auxiliary-xs', skin.mutedTextClassName)}>{item.marketLabel}</div>
                    <div className="text-body-md font-bold text-content-primary">{item.outcomeLabel}</div>
                </div>
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5">
                {item.selections.slice(0, activityProfile.layout === 'ticket-hub' ? 2 : 3).map((selection) => (
                    <div
                        key={`${selection.event_id}-${selection.outcome_id}`}
                        className={cn(skin.subtleClassName, 'flex min-h-9 items-center justify-between gap-2 px-2.5')}
                    >
                        <span className="min-w-0 truncate text-body-sm text-content-primary">{selection.title}</span>
                        <span className={cn('shrink-0 text-auxiliary-xs', skin.mutedTextClassName)}>
                            {selection.market_name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-3 rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-1)] p-2">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className={cn('text-auxiliary-xs', skin.mutedTextClassName)}>{t('stake')}</span>
                    <span className="text-body-sm font-bold text-content-primary">
                        {t('potentialPayout', { amount: formatCurrency(totalPayout) })}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <StakeInput value={stake} onChange={setStake} className="h-9 flex-1" />
                    <button
                        type="button"
                        className={skin.ctaClassName}
                        data-odds-profile={componentProfile.oddsButton.profile}
                        onClick={handleAddToSlip}
                    >
                        <SlipOutlined className="size-4" />
                        <span>{formatOddsByFormat(item.odds, oddsFormat)}</span>
                    </button>
                </div>
            </div>
        </article>
    );
};
