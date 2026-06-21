import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HomePage } from '@/modules/home/home-page';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common');
    return {
        title: t('mainMenu.sport'),
    };
}

export default function Page() {
    return <HomePage />;
}
