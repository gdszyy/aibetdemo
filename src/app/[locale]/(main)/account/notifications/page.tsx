import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell } from '@/modules/user-center';
import { NotificationHome } from '@/modules/user-center/notification/home';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.notification') };
}

export default function NotificationsPage() {
    return (
        <AccountPageShell titleKey="menus.notification">
            <NotificationHome />
        </AccountPageShell>
    );
}
