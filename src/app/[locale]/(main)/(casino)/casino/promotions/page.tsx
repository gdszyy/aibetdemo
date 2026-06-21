import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PromotionsListPage } from '@/modules/marketing/promotion/list';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('promotion');
    return { title: t('list.title') };
}

export default function CasinoPromotionsPage() {
    return <PromotionsListPage type="casino" />;
}
