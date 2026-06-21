import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { GetBreadcrumbInterface } from '@/api/handlers/matches';
import { MatchListContent } from '@/modules/match/list/match-list-content';

type Params = Promise<{ tournament_id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { tournament_id } = await params;
    const locale = await getLocale();
    const t = await getTranslations('common');

    try {
        const decodedId = decodeURIComponent(tournament_id);
        const breadcrumb = await GetBreadcrumbInterface(
            { tournament_id: decodedId },
            { headers: { 'Accept-Language': locale } },
        );
        return { title: breadcrumb.tournament_name || t('metadata.tournament') };
    } catch {
        return { title: t('metadata.tournament') };
    }
}

const LeaguesPage = async ({ params }: { params: Params }) => {
    const { tournament_id } = await params;
    return <MatchListContent tournamentId={decodeURIComponent(tournament_id)} />;
};

export default LeaguesPage;
