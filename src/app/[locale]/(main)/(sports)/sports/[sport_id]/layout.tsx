import { MatchListShell } from '@/modules/match/list';

type Params = Promise<{ sport_id: string }>;

export default async function SportsLayout({ children, params }: { children: React.ReactNode; params: Params }) {
    const { sport_id } = await params;
    return <MatchListShell sportId={decodeURIComponent(sport_id)}>{children}</MatchListShell>;
}
