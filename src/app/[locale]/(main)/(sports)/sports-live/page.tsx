import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LivePage } from '@/modules/home/live-page';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('matches');
    return {
        title: t('liveTitle'),
    };
}

export default function Page() {
    return <LivePage />;
}
