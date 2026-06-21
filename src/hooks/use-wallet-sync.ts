import { useEffect } from 'react';
import { globalEventObserver } from '@/hooks/use-socket-listener';
import { useWallet, useWalletDispatchBalance } from '@/hooks/use-wallet';
import { useIsLogin } from '@/stores/session-store';

/** SSE balance_update event payload */
interface SSEBalancePayload {
    data: {
        balance: {
            total: string;
            main: string;
            sport_bonus: string;
            cash_bonus: string;
            free_spin: string;
            free_sport: string;
        };
    };
}

/**
 * Synchronizes wallet balance with SSE events.
 * Listens to `sse:balance_update` and updates the wallet store directly.
 */
export function useWalletSync() {
    const isLogin = useIsLogin();
    const dispatchBalance = useWalletDispatchBalance();

    useEffect(() => {
        if (!isLogin) return;

        const unsubscribe = globalEventObserver.subscribe('sse:balance_update', (payload: unknown) => {
            const { data } = payload as SSEBalancePayload;
            if (!data?.balance) return;

            const { balance } = data;
            useWallet.setState({
                totalBalance: Number(balance.total || 0),
                mainBalance: Number(balance.main || 0),
                sportBonus: Number(balance.sport_bonus || 0),
                casinoBonus: Number(balance.cash_bonus || 0),
                freeSpin: Number(balance.free_spin || 0),
                freeSport: Number(balance.free_sport || 0),
            });
        });

        return unsubscribe;
    }, [isLogin]);

    useEffect(() => {
        if (!isLogin) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                dispatchBalance().catch(() => undefined);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [dispatchBalance, isLogin]);
}
