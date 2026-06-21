'use client';

import { useTranslations } from 'next-intl';
import type { FC, FunctionComponent } from 'react';
import { StickyBlurHeader } from '@/components/sticky-blur-header';
import { APP_NAME } from '@/constants';
import { useIsDesktop, useIsMobile } from '@/hooks/use-media-query';
import { AdPlacementAnnouncementBar } from '@/modules/ad-placement';
import { cn } from '@/utils/common';
import { GameCard } from '../_components/game-card';
import { GameSection } from '../_components/game-section';
import { getTagBadge, getTagIconV2, isTagFeatured } from '../_constants/filter-tags';
import { Banner } from './components/banner';
import { CasinoHomeSkeleton } from './components/casino-home-skeleton';
import { KeywordFilter } from './components/keyword-filter';
import { KeywordFilterH5 } from './components/keyword-filter-h5';
import { MerchantFilter } from './components/merchant-filter';
import { MerchantFilterH5 } from './components/merchant-filter-h5';
import { PageStore, usePageStore } from './components/page-store';
import { TagsFilter } from './components/tags-filter';
import { TagsFilterH5 } from './components/tags-filter-h5';

/** 游戏为空 */
const EmptyGame: FunctionComponent<{
    dataDevId?: string;
}> = ({ dataDevId }) => {
    const t = useTranslations('casino');

    return (
        <p className="col-span-full text-center text-body-sm text-filltext-ft-e py-8" data-dev-id={dataDevId}>
            {t('noGames')}
        </p>
    );
};

const Main: FunctionComponent = () => {
    const { listMode, lobby, filterGames, isPageLoading } = usePageStore();
    const lobbyId = lobby?.id || 0;

    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();

    return (
        <>
            {lobby?.lobby_name && <title>{`${lobby?.lobby_name} - ${APP_NAME}`}</title>}
            <div className="flex flex-col p-2 pb-4 gap-y-4 md:p-6 md:gap-8">
                <AdPlacementAnnouncementBar className="mt-2 mb-2" />

                <Banner />

                {/* Filter pills — sticky with backdrop blur on scroll */}
                <StickyBlurHeader innerClassName="px-2 md:px-4">
                    {isMobile && <TagsFilterH5 />}
                    {isDesktop && <TagsFilter />}
                </StickyBlurHeader>

                {/* Search functionality */}
                {isMobile && (
                    <div className="flex gap-x-2">
                        <MerchantFilterH5 />
                        <KeywordFilterH5 />
                    </div>
                )}
                {isDesktop && (
                    <div className="flex gap-4">
                        <MerchantFilter />
                        <KeywordFilter />
                    </div>
                )}

                {isPageLoading ? (
                    <CasinoHomeSkeleton />
                ) : (
                    <>
                        {(Boolean(listMode.merchant) || Boolean(listMode.tag)) && (
                            <div className="flex flex-col gap-4 md:gap-8">
                                {filterGames.length > 0 ? (
                                    filterGames.map((v, k) => {
                                        if (!v.games.length) {
                                            return (
                                                <EmptyGame
                                                    key={`empty-game-${v.key}`}
                                                    dataDevId={`game-empty-1-${v.key}`}
                                                />
                                            );
                                        }

                                        return (
                                            <GameSection key={`section-${k}-${v.title}`} title={v.title} hideCarouse>
                                                <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(135px,100%),1fr))] gap-3">
                                                    {v.games.map((game) => {
                                                        return (
                                                            <GameCard
                                                                key={`game-card-${game.id}-${v.key}`}
                                                                game={game}
                                                                lobbyId={lobbyId}
                                                                size="medium"
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </GameSection>
                                        );
                                    })
                                ) : (
                                    <EmptyGame key="empty-game" dataDevId={'game-empty-2'} />
                                )}
                            </div>
                        )}

                        {Boolean(listMode.lobby) && !listMode.merchant && (
                            <div className="flex flex-col gap-4 md:gap-8">
                                {filterGames.length > 0 ? (
                                    filterGames.map((v, k) => {
                                        const tagCode = v.tag?.tag_code || '';
                                        const TagIcon = getTagIconV2(tagCode);
                                        const badge = getTagBadge(tagCode);
                                        const featured = isTagFeatured(tagCode);

                                        if (!v.games?.length) {
                                            return null;
                                        }

                                        return (
                                            <GameSection
                                                key={`section-${k}-${v.title}`}
                                                title={v.title}
                                                icon={
                                                    TagIcon && (
                                                        <TagIcon className="size-7 text-brand-red drop-shadow-[0_2px_3px_color-mix(in_srgb,var(--brand-red)_35%,transparent)]" />
                                                    )
                                                }
                                            >
                                                <div className="flex gap-4">
                                                    {v.games.map((game) => (
                                                        <GameCard
                                                            key={`game-card-${game.id}-${v.key}`}
                                                            game={game}
                                                            lobbyId={lobbyId}
                                                            size={featured ? 'large' : 'medium'}
                                                            badge={badge?.text}
                                                            badgeVariant={badge?.variant}
                                                            className={cn(
                                                                featured ? 'w-[170px]' : 'w-[135px]',
                                                                'shrink-0',
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </GameSection>
                                        );
                                    })
                                ) : (
                                    <EmptyGame key="empty-game" dataDevId={'game-empty-3'} />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export const CasinoHome: FC<{
    lobbyId: string;
}> = ({ lobbyId }) => {
    return (
        <PageStore key={lobbyId} lobbyId={lobbyId}>
            <Main />
        </PageStore>
    );
};
