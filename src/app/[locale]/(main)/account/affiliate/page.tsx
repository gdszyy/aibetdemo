import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell } from '@/modules/user-center';
import { AffiliateFAQ } from '@/modules/user-center/affiliate/affiliate-faq';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.affiliate') };
}

export default async function AffiliatePage() {
    return (
        <AccountPageShell titleKey="menus.affiliate">
            <AffiliateFAQ />
        </AccountPageShell>
    );
}
