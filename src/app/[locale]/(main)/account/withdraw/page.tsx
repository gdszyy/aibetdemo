import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Withdraw } from '@/modules/withdraw';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.withdraw') };
}

export default function WithdrawPage() {
    return <Withdraw />;
}
