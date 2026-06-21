'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { BetType, CartStatus } from '@/api/models/cart';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCard } from '@/api/models/recommend-card';
import { Toast } from '@/components/toast';
import { dedupeSelectionsByUniqueId } from '@/modules/bet-slip/_logic/cart-sync';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useBetSlipStore, useCartStatus } from '@/modules/bet-slip/stores/bet-slip-store';
import { useUIStore } from '@/stores/ui-store';
import {
    convertRecommendCardSelectionsToOddsEntities,
    getRecommendCardQualifiedSelections,
} from '@/utils/recommend-card-to-odds-entity';
import { checkParlaySelectionLimit } from '@/utils/selection-limit';

interface UseRecommendCardAddToCartOptions {
    /** 加入购物车成功后的回调 */
    onAdded?: () => void;
}

/** 首页推荐串关加赔卡片一键加购：清空购物车、写入有效推荐腿并切串关模式。 */
export const useRecommendCardAddToCart = ({ onAdded }: UseRecommendCardAddToCartOptions = {}) => {
    const t = useTranslations('betSlip');
    const cartStatus = useCartStatus();

    const addRecommendCardToCart = useCallback(
        (card: RecommendCard, rule: ParlayBoostRule | null) => {
            if (cartStatus === CartStatus.Locked) {
                Toast.loading(t('message.waitOrderComplete'), { id: 'wait-order', duration: 3000 });
                return;
            }

            const qualifiedSelections = getRecommendCardQualifiedSelections(card.json_list, rule);
            const legCount = qualifiedSelections.length;
            if (legCount === 0) return;

            const { canAdd, maxLimit } = checkParlaySelectionLimit(legCount - 1);
            if (!canAdd) {
                Toast.error(t('toast.maxSelectionsReached', { count: maxLimit }), { id: 'max-selections' });
                return;
            }

            const oddsEntities = dedupeSelectionsByUniqueId(
                convertRecommendCardSelectionsToOddsEntities(qualifiedSelections),
            );
            const store = useBetSlipStore.getState();

            store.clearAll();
            store.setSelections(oddsEntities, { pendingSync: true });
            useBetCartStore.getState().setBetMode(BetType.Parlay);
            store.syncToServer();

            const { betSlipDrawerOpen, openBetSlipDrawer } = useUIStore.getState();
            if (!betSlipDrawerOpen) {
                openBetSlipDrawer();
            }

            onAdded?.();
        },
        [cartStatus, onAdded, t],
    );

    return { addRecommendCardToCart };
};
