import { useMount } from 'ahooks';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { type TabItem, Tabs } from '@/components/tabs/tabs';
import { useWithdrawStore } from '../stores/use-withdraw-store';
import { BankAccountList } from './bank-account';
import { usePageStore } from './page-store';
import { WithdrawForm } from './withdraw-form';

export const Home: FC = () => {
    const { tab, setTab } = usePageStore();

    const { dispatchBankAccounts } = useWithdrawStore();

    const t = useTranslations('withdraw');

    const tabs: TabItem<typeof tab>[] = [
        {
            value: 'withdraw',
            label: t('withdraw.title'),
            content: <WithdrawForm />,
        },
        {
            value: 'bankAccount',
            label: t('bankAccount.title'),
            content: <BankAccountList />,
        },
    ];

    useMount(() => {
        dispatchBankAccounts();
    });

    return <Tabs items={tabs} value={tab} onChange={(e) => setTab(e as typeof tab)} className="h-full gap-2" />;
};
