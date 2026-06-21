'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { CartStatus } from '@/api/models/cart';
import { OrderType } from '@/api/models/order';
import { OrderPlacedStatus, type OrderPlacedStatusPayload } from '@/api/models/ws';
import { Toast } from '@/components/toast';
import { config } from '@/constants/config';
import { CartActions, generateQueryKey, ModuleKeys, OrderActions } from '@/constants/query-keys';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useEventObserver } from '@/hooks/use-socket-listener';
import { useWalletDispatchBalance } from '@/hooks/use-wallet';
import { OrderPlacedStatusEvent } from '@/libs/event-constants';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { clearSelectionSnapshot } from '@/modules/bet-slip/stores/internal/selection-snapshot';
import { useUIStore } from '@/stores/ui-store';
import { STORAGE_KEYS } from '../cart/_constants';

/**
 * Order result handler hook.
 *
 * Responsibilities:
 * 1. Listen for WebSocket order status messages
 * 2. Handle UI lock state release
 * 3. Show success/failure toasts
 * 4. Trigger global data refresh
 */
export const useOrderResultHandler = () => {
    const t = useTranslations('betSlip');
    const isDesktop = useIsDesktop();
    const setCartStatus = useBetSlipStore((state) => state.setCartStatus);
    const closeBetSlipDrawer = useUIStore((state) => state.closeBetSlipDrawer);
    const queryClient = useQueryClient();
    const dispatchBalance = useWalletDispatchBalance();

    useEventObserver<OrderPlacedStatusPayload>(
        OrderPlacedStatusEvent.getUpdateEventName(),
        (data: OrderPlacedStatusPayload) => {
            if (config.isDev) console.log('[useOrderResultHandler] OrderPlacedStatusEvent:', data);

            // 1. Release lock state
            setCartStatus(CartStatus.Normal);

            // 2. Handle based on status
            if (data.status === OrderPlacedStatus.Accepted) {
                Toast.success(t('message.orderPlacedSuccessfully'), { id: 'order-result' });
                // After order success, server has cleared cart — reset local state and fetch latest
                // Don't call clearAll() to avoid triggering unnecessary syncToServer
                clearSelectionSnapshot(useBetSlipStore, {
                    cartStatus: null,
                });
                useBetSlipStore.getState().fetchLatest(true);
                // Clear stake amounts from localStorage
                window.localStorage.removeItem(STORAGE_KEYS.SINGLE_STAKES);
                window.localStorage.removeItem(STORAGE_KEYS.PARLAY_STAKE);

                // Only close drawer on mobile (Desktop keeps it open)
                if (!isDesktop) {
                    closeBetSlipDrawer();
                }
            } else {
                const m = (
                    <>
                        <span>{t('message.orderRejected') + (data.message ? `: ${data.message}` : '')}</span>
                        {/* {
                            // 提示接受赔率变化
                            data.biz_code === '200005' && <AcceptOddsChange msg={t('message.gotoSetting')} />
                        } */}
                    </>
                );
                Toast.error(m, { id: 'order-result' });
            }

            // 3. Refresh related data
            // Refresh cart
            queryClient.invalidateQueries({ queryKey: generateQueryKey(ModuleKeys.CART, CartActions.GET_CART) });
            // Refresh order list
            queryClient.invalidateQueries({
                queryKey: generateQueryKey(ModuleKeys.ORDER, OrderActions.GET_ORDERS, { tab: OrderType.Open }),
            });
            // Refresh balance
            dispatchBalance();
        },
    );
};
