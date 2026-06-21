import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { GetBreadcrumbInterface } from '@/api/handlers/matches';
import { HotLeagues } from '@/modules/home';
import { HotLeagueMatchCarousel } from '@/modules/match/home/hot-league-match-carousel';
import { SportTopicPanel } from '@/modules/match/home/sport-topic-panel';
import { MatchListContent } from '@/modules/match/list';

type Params = Promise<{ sport_id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { sport_id } = await params;
    const locale = await getLocale();
    const t = await getTranslations('common');
    try {
        const breadcrumb = await GetBreadcrumbInterface(
            { sport_id: decodeURIComponent(sport_id) },
            { headers: { 'Accept-Language': locale } },
        );
        return { title: breadcrumb.sport_name || t('mainMenu.sport') };
    } catch {
        return { title: t('mainMenu.sport') };
    }
}

const SportsPage = async ({ params }: { params: Params }) => {
    const { sport_id } = await params;
    const sportId = decodeURIComponent(sport_id);

    return (
        <>
            {/* ⚠️ betbus 对比：运动专题页（仅 topic 模式渲染，sidebar 模式为 null） */}
            <SportTopicPanel sportId={sportId} />
            <div className="mb-10 flex flex-col gap-10">
                <HotLeagueMatchCarousel variant="upcoming" sportId={sportId} />
                <HotLeagues sportId={sportId} />
            </div>
            <MatchListContent sportId={sportId} />
        </>
    );
};

export default SportsPage;
