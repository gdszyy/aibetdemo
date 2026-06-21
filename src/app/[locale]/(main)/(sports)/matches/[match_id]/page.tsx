import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { GetMatchInterface } from '@/api/handlers/match';
import { MatchDetail } from '@/modules/match/detail';

type Params = Promise<{ match_id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { match_id } = await params;
    const locale = await getLocale();
    const t = await getTranslations('common');

    // TODO 为了metadata，请求接口，导致 FCP+800ms。这个收益不行，需要优化：要么增加接口缓存，要么取消ssr meta，改成浏览器端设置meta

    try {
        const decodedMatchId = decodeURIComponent(match_id);

        const match = await GetMatchInterface({ event_id: decodedMatchId }, { headers: { 'Accept-Language': locale } });

        if (match) {
            const home = match.home_competitor?.name;
            const away = match.away_competitor?.name;
            if (home && away) {
                return { title: `${home} vs ${away}` };
            }
        }

        return { title: t('metadata.matchDetail') };
    } catch {
        return { title: t('metadata.matchDetail') };
    }
}

const MatchDetailPage = async ({ params }: { params: Params }) => {
    const { match_id } = await params;
    return <MatchDetail matchId={decodeURIComponent(match_id)} />;
};

export default MatchDetailPage;
