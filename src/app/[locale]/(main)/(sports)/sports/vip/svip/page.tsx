import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SVIPPage } from '@/modules/marketing/promotion/vip/svip';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('vip');

    return {
        title: t('banner.svipTitle'),
    };
}

export default function SportsSvipPage() {
    return <SVIPPage />;
}
