import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SportsRulesPage } from '@/modules/docs/sports-rules/sports-rules-page';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('sportsRules');
    return { title: t('title') };
}

export default function Page() {
    return <SportsRulesPage />;
}
