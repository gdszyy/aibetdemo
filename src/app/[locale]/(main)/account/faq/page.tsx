import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell } from '@/modules/user-center';
import { FAQ } from '@/modules/user-center/faq';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.faq') };
}

export default function FaqPage() {
    return (
        <AccountPageShell titleKey="menus.faq">
            <FAQ />
        </AccountPageShell>
    );
}
