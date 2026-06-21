import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MarketingVIP } from '@/modules/marketing/promotion/vip';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common');

    return {
        title: t('sidebar.vip'),
    };
}

export default function SportsVipPage() {
    return <MarketingVIP />;
}
