import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AccountPageShell, UserProfile } from '@/modules/user-center';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.profile') };
}

export default function ProfilePage() {
    return (
        <AccountPageShell titleKey="menus.profile">
            <UserProfile />
        </AccountPageShell>
    );
}
