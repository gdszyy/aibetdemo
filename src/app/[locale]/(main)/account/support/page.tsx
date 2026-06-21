import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell } from '@/modules/user-center';
import { SupportHome } from '@/modules/user-center/support';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.support') };
}

export default function SupportPage() {
    return (
        <AccountPageShell titleKey="menus.support">
            <SupportHome />
        </AccountPageShell>
    );
}
