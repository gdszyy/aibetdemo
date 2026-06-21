import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Deposit } from '@/modules/deposit';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.deposit') };
}

export default function DepositPage() {
    return <Deposit />;
}
