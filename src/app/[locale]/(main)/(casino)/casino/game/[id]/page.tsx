import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GetCasinoGameInterface } from '@/api/handlers/casino';
import { GameDetailPage } from '@/modules/casino/game/game-detail-page';

type Params = Promise<{ id: string; locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, id } = await params;
    const t = await getTranslations({ locale, namespace: 'casino' });

    try {
        const game = await GetCasinoGameInterface(Number(id));
        return { title: game.name };
    } catch {
        return { title: t('game.defaultTitle') };
    }
}

export default async function Page({ params }: { params: Params }) {
    const { id } = await params;
    return <GameDetailPage key={id} id={Number(id)} />;
}
