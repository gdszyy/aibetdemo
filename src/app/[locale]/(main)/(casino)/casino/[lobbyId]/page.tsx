import { CasinoHome } from '@/modules/casino/home/casino-home';

type Params = Promise<{ lobbyId: string }>;

export default async function CasinoLobbyPage({ params }: { params: Params }) {
    const { lobbyId } = await params;
    return <CasinoHome lobbyId={lobbyId} />;
}
