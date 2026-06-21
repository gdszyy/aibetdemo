import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell } from '@/modules/user-center';
import { HealthSettingHome } from '@/modules/user-center/health-setting';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.gambling') };
}

export default function GamblingGamesPage() {
    return (
        <AccountPageShell titleKey="menus.gambling">
            <HealthSettingHome />
        </AccountPageShell>
    );
}
