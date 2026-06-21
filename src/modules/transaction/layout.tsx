'use client';

import { useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Toast } from '@/components/toast';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useOpenDepositModal } from '@/hooks/use-open-deposit-modal';
import { useCommonTranslations } from '@/hooks/use-translations';
import { useWallet } from '@/hooks/use-wallet';
import { cn } from '@/utils/common';
import { BalanceOverview } from './_components/balance-overview';
import { TransactionTabNav, type TransactionTabNavItem } from './_components/transaction-tab-nav';
import { TransactionTab as Tab } from './_constants';
import { useTransactionParams } from './_hooks/use-transaction-params';
import { useTotalBetWin } from './_hooks/use-transaction-queries';
import { useTransactionTitle } from './_hooks/use-transaction-title';
import { BalanceList } from './balance/balance-list';
import { BetHistory } from './betHistory';
import { Transactions } from './transactions/transactions';
import { TransferOrder } from './transferOrder/transfer-order';

/**
 * Transaction page layout.
 * PillTabs + card-based Balance overview.
 * Tab/filter state is driven by URL searchParams (single source of truth).
 */
export const Transaction: FC = () => {
    const tCommon = useCommonTranslations();
    const t = useTranslations('transaction');
    const isDesktop = useIsDesktop();
    const { openDepositModal } = useOpenDepositModal();
    const { mainBalance, casinoBonus, sportBonus, freeSpin, freeSport, dispatchBalance } = useWallet(
        useShallow((s) => ({
            mainBalance: s.mainBalance,
            casinoBonus: s.casinoBonus,
            sportBonus: s.sportBonus,
            freeSpin: s.freeSpin,
            freeSport: s.freeSport,
            dispatchBalance: s.dispatchBalance,
        })),
    );
    const { data: totalBetWin } = useTotalBetWin();

    const { tab: activeTab, setTab } = useTransactionParams();

    // Dynamic document.title based on active tab
    useTransactionTitle(activeTab);

    // Balance drilldown is transient UI state — not worth persisting in URL
    const [balanceDrilldown, setBalanceDrilldown] = useState<string | null>(null);

    const tabs: TransactionTabNavItem<Tab>[] = useMemo(
        () => [
            { value: Tab.BALANCE, label: t('tabsBalance') },
            { value: Tab.TRANSACTIONS, label: t('tabsTransactions') },
            { value: Tab.BET_HISTORY, label: t('tabsBetHistory') },
            { value: Tab.TRANSFER_ORDER, label: t('tabsTransferOrder') },
        ],
        [t],
    );

    const handleTabChange = useCallback(
        (tab: Tab) => {
            dispatchBalance();
            setTab(tab);
            setBalanceDrilldown(null);
        },
        [dispatchBalance, setTab],
    );

    const handleBalanceCardClick = useCallback(
        (type: string) => {
            if (!['sportBonus'].includes(type)) {
                Toast.info(tCommon('message.coming'));
                return;
            }
            setBalanceDrilldown(type);
        },
        [tCommon],
    );

    const handleBalanceDrilldownBack = useCallback(() => {
        dispatchBalance();
        setBalanceDrilldown(null);
    }, [dispatchBalance]);

    const balanceData = useMemo(
        () => ({
            mainBalance,
            totalBuy: Number(totalBetWin?.total_bet ?? 0),
            totalWin: Number(totalBetWin?.total_win ?? 0),
            sportBonus,
            casinoBonus,
            freeSport: freeSport ?? 0,
            freeSpin: freeSpin ?? 0,
        }),
        [mainBalance, totalBetWin, sportBonus, casinoBonus, freeSport, freeSpin],
    );

    return (
        <div
            className={cn(
                'flex min-w-0 flex-col',
                isDesktop ? 'min-h-[300px] gap-6' : 'flex-1 min-h-0 overflow-hidden pt-0 gap-2',
            )}
        >
            <div className={cn(isDesktop ? '' : 'sticky top-0 z-10 pt-1')}>
                <TransactionTabNav items={tabs} value={activeTab} onChange={handleTabChange} />
            </div>

            <div
                key={`${activeTab}-${balanceDrilldown}`}
                className={cn(
                    'min-w-0',
                    isDesktop ? 'flex-1 min-h-0' : 'flex-1 min-h-0 overflow-y-auto hidden-scrollbar',
                )}
            >
                {activeTab === Tab.BALANCE && (
                    <>
                        {!balanceDrilldown && (
                            <BalanceOverview
                                data={balanceData}
                                onCardClick={handleBalanceCardClick}
                                onDepositClick={openDepositModal}
                            />
                        )}
                        {balanceDrilldown && (
                            <BalanceList from={balanceDrilldown} onBack={handleBalanceDrilldownBack} />
                        )}
                    </>
                )}

                {activeTab === Tab.TRANSACTIONS && <Transactions />}
                {activeTab === Tab.BET_HISTORY && <BetHistory />}
                {activeTab === Tab.TRANSFER_ORDER && <TransferOrder />}
            </div>
        </div>
    );
};
