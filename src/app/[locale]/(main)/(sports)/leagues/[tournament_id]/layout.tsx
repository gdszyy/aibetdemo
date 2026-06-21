import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import { LeaguesBanner } from '@/modules/marketing/promotion/world-cup-league/leagues-banner';
import { TournamentShell } from '@/modules/match/list/tournament-shell';

type Params = Promise<{ tournament_id: string }>;

export default async function TournamentLayout({ children, params }: { children: React.ReactNode; params: Params }) {
    const { tournament_id } = await params;
    const tournamentId = decodeURIComponent(tournament_id);
    const banner = WORLD_CUP_LEAGUE_ID === tournamentId ? <LeaguesBanner /> : undefined;

    return (
        <TournamentShell tournamentId={tournamentId} banner={banner}>
            {children}
        </TournamentShell>
    );
}
