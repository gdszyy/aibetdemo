import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Transaction } from '@/modules/transaction';
import { AccountPageShell } from '@/modules/user-center';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.transaction') };
}

export default function TransactionsPage() {
    return (
        <AccountPageShell titleKey="menus.transaction">
            <Transaction />
        </AccountPageShell>
    );
}
