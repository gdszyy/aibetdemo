import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountMenuClient } from './account-menu-client';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.profile') };
}

export default function AccountMenuPage() {
    return <AccountMenuClient />;
}
