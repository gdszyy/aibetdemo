import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SecurityCenter } from '@/modules/security-center/security-center';
import { AccountPageShell } from '@/modules/user-center';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.securityCenter') };
}

export default function SecurityPage() {
    return (
        <AccountPageShell titleKey="menus.securityCenter">
            <SecurityCenter />
        </AccountPageShell>
    );
}
