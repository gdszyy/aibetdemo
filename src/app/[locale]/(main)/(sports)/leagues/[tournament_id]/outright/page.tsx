import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { GetBreadcrumbInterface } from '@/api/handlers/matches';
import { OutrightContent } from '@/modules/match/outright/outright-content';

type Params = Promise<{ tournament_id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { tournament_id } = await params;
    const locale = await getLocale();
    try {
        const [breadcrumb, t] = await Promise.all([
            GetBreadcrumbInterface(
                { tournament_id: decodeURIComponent(tournament_id) },
                { headers: { 'Accept-Language': locale } },
            ),
            getTranslations('matches'),
        ]);
        return { title: `${breadcrumb.tournament_name} ${t('outright')}` };
    } catch {
        const t = await getTranslations('matches');
        return { title: t('outright') };
    }
}

export default async function OutrightPage({ params }: { params: Params }) {
    const { tournament_id } = await params;
    return <OutrightContent tournamentId={decodeURIComponent(tournament_id)} />;
}
