import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures';
import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import {
    GetCasinoGameLobbiesV2Interface,
    GetCasinoGamesV2Interface,
    GetCasinoGameTagsInterface,
} from '@/api/handlers/casino';
import type { CasinoGame, CasinoGameLobby, CasinoGameTag } from '@/api/models/casino';
import imageCup from '@/assets/images/gold-cup.png';
import { BlockTitle2 } from '@/components/block-title-2';
import { CarouselMask } from '@/components/carousel-mask';
import { useCarousel } from '@/hooks/use-carousel';
import { Link } from '@/i18n';
import { GameCard } from '@/modules/casino/_components/game-card';

interface GameRes {
    lobby: CasinoGameLobby;
    tag: CasinoGameTag;
    games: CasinoGame[];
}

const Main: FunctionComponent<{ gameRes: GameRes }> = ({ gameRes }) => {
    const tCommon = useTranslations('common');
    const t = useTranslations('casino');

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true }, [WheelGesturesPlugin()]);
    const { enable, canScrollPrev, canScrollNext } = useCarousel(emblaApi);

    return (
        <div>
            <BlockTitle2
                title={t('hotGames.title')}
                titleClassName="uppercase"
                iconImage={imageCup}
                right={
                    <Link
                        className="text-brand-primary-0 text-body-lg capitalize"
                        href={`/casino/${gameRes.lobby.id}?tag_id=${gameRes.tag.id}`}
                    >
                        {tCommon('action.viewAll')}
                    </Link>
                }
            />
            <div className="mt-2 overflow-hidden relative" ref={emblaRef}>
                <div className="flex items-center gap-3 flex-nowrap">
                    {gameRes?.games?.map((v, k) => {
                        return (
                            <GameCard
                                key={`${v.id}_${k}`}
                                className="w-29.5 md:w-33.5 shrink-0"
                                game={v}
                                lobbyId={gameRes.lobby.id}
                                size="medium"
                            />
                        );
                    })}
                </div>
                {enable && (
                    <CarouselMask
                        className="hidden md:block"
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                )}
            </div>
        </div>
    );
};

/** 
热门casino game模块
// 复用 Casino 热门游戏模块或接口能力，使用 locale-aware navigation 跳转 /casino 或默认 lobby。
 */
export const HotCasinoGames: FunctionComponent = () => {
    const { data: gameRes } = useQuery({
        queryKey: ['casino', 'hotGames'],
        queryFn: () => {
            return GetCasinoGameLobbiesV2Interface().then((res) => {
                const lobby = res?.[0];
                if (!lobby) {
                    return null;
                }

                return GetCasinoGameTagsInterface(lobby.id).then(async (res2) => {
                    const tag = res2?.[0];
                    if (!tag) {
                        return null;
                    }
                    return GetCasinoGamesV2Interface([tag.id])
                        .then((res) => {
                            return res.find((v) => v.tag_id === Number(tag.id))?.game_list || [];
                        })
                        .then((res3) => {
                            return { lobby, tag, games: res3 };
                        });
                });
            });
        },
        staleTime: 60 * 60 * 1000,
    });

    if (!gameRes?.games?.length) {
        return null;
    }

    return <Main gameRes={gameRes} />;
};
