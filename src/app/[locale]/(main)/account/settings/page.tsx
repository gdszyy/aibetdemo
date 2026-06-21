import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell } from '@/modules/user-center';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.setting') };
}

export default async function SettingsPage() {
    const t = await getTranslations('common');
    return (
        <AccountPageShell titleKey="menus.setting">
            <div className="flex h-[400px] items-center justify-center text-auxiliary-sm text-filltext-ft-e">
                {t('message.TBC')}
            </div>
        </AccountPageShell>
    );
}
