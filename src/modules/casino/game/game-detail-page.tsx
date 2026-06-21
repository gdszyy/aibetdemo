'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoolean } from 'ahooks';
import { flatten, uniqBy, values } from 'lodash-es';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { type CSSProperties, type FC, type FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { GetCasinoGameInterface, GetCasinoGamesV2Interface, LaunchGameV2Interface } from '@/api/handlers/casino';
import type { ErrorReject, InterfaceResponse } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import type { CasinoGameLobby } from '@/api/models/casino';
import { Button } from '@/components/button/button';
import { ArrowLeft, CasinoFullscreenIn, CasinoFullscreenOut } from '@/components/icons';
import { Loading } from '@/components/loading/loading';
import { Modal } from '@/components/modal/modal';
import { Toast } from '@/components/toast';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { useIsMobile } from '@/hooks/use-media-query';
import { useRouter } from '@/i18n';
import { cn } from '@/utils/common';
import { GameCard } from '../_components/game-card';
import { GameSection } from '../_components/game-section';
import { useGameMessage } from './_hooks/use-game-message';

// 退出全屏的按钮
const ExitFullscreenButton: FunctionComponent<{
    enable: boolean;
    onClick: () => void;
}> = ({ enable, onClick }) => {
    const isDrag = useRef(false);

    return (
        <motion.div
            className={cn(
                'absolute z-10 right-4 top-4',
                'group inline-flex items-center justify-center size-10 rounded-full bg-surface-1 transition-colors',
                enable ? 'visible' : 'invisible',
            )}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => {
                isDrag.current = true;
            }}
            onDragEnd={() => {
                setTimeout(() => {
                    isDrag.current = false;
                }, 500);
            }}
            onClick={() => {
                if (isDrag.current) {
                    return;
                }
                onClick();
            }}
            // whileDrag={{ pointerEvents: 'none' }}
        >
            <CasinoFullscreenIn className="size-5 text-filltext-ft-e group-hover:text-filltext-ft-g transition-colors" />
        </motion.div>
    );
};

export const GameDetailPage: FC<{
    id: number;
}> = ({ id }) => {
    const searchParams = useSearchParams();
    const lobbyId = Number(searchParams.get('lobby_id')) || 0;

    const locale = useLocale();
    const router = useRouter();
    const queryClient = useQueryClient();

    const t = useTranslations('casino');
    const tCommon = useTranslations('common');

    const isMobile = useIsMobile();

    const [fullscreen, fullscreenAction] = useBoolean(false);

    const [launchInfo, setLaunchInfo] = useState<InterfaceResponse<typeof LaunchGameV2Interface> | null>(null);
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchError, setLaunchError] = useState<string | null>(null);

    const [isIframeLoading, setIsIframeLoading] = useState(true);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [isIframeVisible, setIsIframeVisible] = useState(false);

    const { data: game } = useQuery({
        queryKey: ['casino', 'game', id],
        queryFn: () => {
            return GetCasinoGameInterface(id);
        },
        enabled: Boolean(id),
    });

    // Fetch games for related section (reuses cached query)
    const { data: relatedGames = [] } = useQuery({
        queryKey: ['casino', 'relatedGames', game?.tag_ids],
        queryFn: () =>
            GetCasinoGamesV2Interface(game!.tag_ids).then((res) => {
                const res1 = uniqBy(flatten(values(res).map((v) => v.game_list)), 'id').filter(
                    (v) => v.id !== game!.id,
                );
                return res1;
            }),
        enabled: Boolean(game?.tag_ids?.length),
        placeholderData: [],
    });

    // Breadcrumb: resolve lobby name from React Query cache (no extra API call)
    const lobbies = queryClient.getQueryData<CasinoGameLobby[]>(['casino', 'lobbies']);
    const lobbyName = lobbyId ? lobbies?.find((v) => v.id === lobbyId)?.lobby_name || '' : '';

    const { checkKycRequired } = useKycRequiredToast();

    // Launch game — renders iframe in the cover area instead of navigating away
    const handleStartGame = useCallback(async () => {
        if (!checkKycRequired()) {
            return;
        }

        if (!game?.id || isLaunching) return;

        setIsLaunching(true);
        setLaunchError(null);
        try {
            const returnUrl = `${window.location.origin}/${locale}/casino/game/callback`;
            const result = await LaunchGameV2Interface({
                id,
                return_url: returnUrl,
            });
            if (result.game_type) {
                setIsIframeLoading(true);
                setLaunchInfo(result);
                // h5 下，默认全屏显示
                if (isMobile) {
                    fullscreenAction.setTrue();
                }
            } else {
                setLaunchError(t('game.noGameUrl'));
            }
        } catch (err) {
            const errorMsg = getRejectError(err as ErrorReject) || t('game.launchFailed');
            setLaunchError(errorMsg);
            Toast.error(errorMsg, { id: 'launch-error' });
        } finally {
            setIsLaunching(false);
        }
    }, [isLaunching, locale, t, checkKycRequired, isMobile, fullscreenAction.setTrue, id, game?.id]);

    const handleCloseGame = useCallback(() => {
        setLaunchInfo(null);
        setShowCloseConfirm(false);
    }, []);

    // 当游戏加载完成后显示 iframe
    useEffect(() => {
        if (launchInfo && !isIframeLoading) {
            setIsIframeVisible(true);
        } else {
            setIsIframeVisible(false);
        }
    }, [launchInfo, isIframeLoading]);

    // Listen for postMessage from callback page (game ended → iframe navigated to return_url)
    useGameMessage({ enabled: Boolean(launchInfo), onClose: handleCloseGame });

    const gameWrapperRef = useRef<HTMLDivElement>(null);
    // 在非全屏时，游戏容器的宽度要记录下来。防止全屏的时候，游戏容器丢失了高度，导致切换全屏看起来页面抖动。
    const [gameContainerWidth, setGameContainerWidth] = useState<CSSProperties['height']>('auto');
    /** 全屏态优先使用动态视口，并为移动端预留安全区，避免底部金额区域被系统区域挤压。 */
    const fullscreenWrapperClassName = isMobile
        ? 'fixed z-9999 inset-x-0 top-0 h-[100dvh] bg-black pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
        : 'fixed z-9999 inset-0 bg-black';
    /** 游戏画面在全屏态填满可用区域，非全屏态仍保持原有比例。 */
    const gameViewportClassName = fullscreen ? 'w-full h-full' : 'w-full max-h-full aspect-2/3 md:aspect-video';

    return (
        <div className="flex flex-col gap-6 px-4 md:px-6 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => router.push(lobbyId ? `/casino/${lobbyId}` : '/casino')}
                    className="group/back flex items-center justify-center size-10 shrink-0 cursor-pointer rounded-full bg-surface-1"
                >
                    <ArrowLeft className="size-3 text-filltext-ft-e group-hover/back:text-filltext-ft-g transition-colors" />
                </button>
                <div className="flex items-center gap-1">
                    {Boolean(lobbyName) && (
                        <button
                            type="button"
                            onClick={() => router.push(`/casino/${lobbyId}`)}
                            className="flex items-center h-10 px-4 rounded-l-lg rounded-r-xs bg-surface-1 text-body-lg text-filltext-ft-f whitespace-nowrap overflow-hidden cursor-pointer hover:text-filltext-ft-g transition-colors"
                        >
                            {lobbyName}
                        </button>
                    )}
                    <span className="flex items-center h-10 px-4 bg-surface-1 text-body-lg text-filltext-ft-g whitespace-nowrap overflow-hidden rounded-l-xs rounded-r-lg truncate">
                        {game?.name ?? t('game.defaultTitle')}
                    </span>
                </div>
            </div>

            <div style={{ height: gameContainerWidth }}>
                <div
                    ref={gameWrapperRef}
                    className={cn(
                        'flex justify-center items-center',
                        fullscreen ? fullscreenWrapperClassName : 'relative h-full rounded-md overflow-hidden',
                    )}
                >
                    {/* Game Cover or Inline game iframe */}
                    {launchInfo ? (
                        <div
                            className={cn(
                                'relative overflow-hidden bg-black transition-all duration-300',
                                gameViewportClassName,
                            )}
                        >
                            <iframe
                                title={game?.name ?? t('game.defaultTitle')}
                                className={cn(
                                    'w-full h-full border-none transition-opacity duration-300',
                                    // 'pointer-events-auto',
                                    isIframeVisible ? 'opacity-100' : 'opacity-0',
                                )}
                                allow="autoplay; fullscreen"
                                // allowFullScreen
                                onLoad={() => setIsIframeLoading(false)}
                                {...(launchInfo?.game_type === 'url' ? { src: launchInfo.game_url } : null)}
                                {...(launchInfo?.game_type === 'html' ? { srcDoc: launchInfo.game_html } : null)}
                            />
                            {isIframeLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loading className="size-6" variant="color-white" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'group/cover relative overflow-hidden bg-filltext-ft-c cursor-pointer transition-all duration-300',
                                gameViewportClassName,
                            )}
                            onClick={handleStartGame}
                        >
                            {game?.logo_url ? (
                                <>
                                    <Image
                                        src={game.logo_url}
                                        alt=""
                                        fill
                                        className="object-cover scale-110 blur-2xl"
                                        priority
                                    />
                                    <Image
                                        src={game.logo_url}
                                        alt={game.name ?? ''}
                                        fill
                                        className="object-contain transition-transform duration-300 group-hover/cover:scale-105"
                                        priority
                                    />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-title-lg text-filltext-ft-e">
                                        {game?.name ?? t('game.defaultTitle')}
                                    </span>
                                </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

                            <div className="absolute inset-x-0 bottom-6 flex justify-center">
                                {isLaunching ? (
                                    <div
                                        className="flex items-center justify-center h-12 px-[18px] py-3 rounded-full border-3 border-auxiliary-orange shadow-[0px_4px_4px_0px_var(--neutral-black-f)]"
                                        style={{ background: 'linear-gradient(162deg, #ffea00 3%, #ff0000 97%)' }}
                                    >
                                        <Loading className="size-5" variant="color-white" />
                                    </div>
                                ) : launchError ? (
                                    <span className="text-body-md text-white bg-black/50 px-4 py-2 rounded-full">
                                        {launchError}
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={!game?.id}
                                        className={cn(
                                            'relative flex items-center justify-center h-12 px-[18px] rounded-full text-title-md text-white cursor-pointer transition-all',
                                            'border-3 border-auxiliary-orange',
                                            'hover:brightness-110 active:brightness-95',
                                            'disabled:opacity-50 disabled:cursor-default',
                                            game?.id
                                                ? 'animate-game-launch-pulse'
                                                : 'shadow-[0px_4px_4px_0px_var(--neutral-black-f)]',
                                        )}
                                        style={{ background: 'linear-gradient(162deg, #ffea00 3%, #ff0000 97%)' }}
                                    >
                                        {t('game.startGame')}
                                        <span className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_1.2px_0px_#fff0be]" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Close button, 游戏优化v1.1 取消 */}
                    {/* Fullscreen toggle button，需要可以拖动 */}
                    <ExitFullscreenButton
                        enable={fullscreen}
                        onClick={() => {
                            fullscreenAction.setFalse();
                            window.requestAnimationFrame(() => {
                                setGameContainerWidth('auto');
                            });
                        }}
                    />
                </div>
            </div>

            {/* Game fullscreen toggle button */}
            <div className="flex justify-left gap-4">
                <button
                    type="button"
                    onClick={() => {
                        setGameContainerWidth(gameWrapperRef?.current?.getBoundingClientRect().height || 'auto');
                        window.requestAnimationFrame(() => {
                            fullscreenAction.setTrue();
                        });
                    }}
                    className="group flex items-center justify-center gap-2 size-9 rounded-full bg-surface-1 text-body-md text-filltext-ft-ftransition-colors cursor-pointer"
                >
                    <CasinoFullscreenOut className="size-4 text-filltext-ft-e group-hover:text-filltext-ft-g transition-colors" />
                </button>
            </div>

            {/* Exit game confirm modal */}
            <Modal
                visible={showCloseConfirm}
                onClose={() => setShowCloseConfirm(false)}
                closeButton={false}
                withBg={false}
            >
                <div className="w-[calc(100vw-2rem)] max-w-[435px] rounded-md bg-surface-raised p-6 flex flex-col gap-6">
                    <p className="text-title-md">{t('game.exitConfirm')}</p>
                    <div className="flex justify-end gap-[10px]">
                        <Button variant="secondary" onClick={() => setShowCloseConfirm(false)} className="flex-1 h-10">
                            {tCommon('dialog.cancelBtnText')}
                        </Button>
                        <Button variant="primary" onClick={handleCloseGame} className="flex-1 h-10">
                            {tCommon('dialog.confirmBtnText')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Game Info Panel */}
            {game && (
                <div className="flex flex-col gap-4 bg-filltext-ft-b rounded-md p-4">
                    <div className="flex items-center gap-4">
                        <span className="text-title-md text-filltext-ft-g">{game.name}</span>
                        <span className="px-4 py-0.5 rounded-full bg-surface-2 text-auxiliary-sm text-filltext-ft-e">
                            {game.game_type}
                        </span>
                    </div>
                    <p className="text-body-md text-filltext-ft-e leading-relaxed">
                        {game.description || t('game.noDescription')}
                    </p>
                </div>
            )}

            {/* Related Games */}
            {relatedGames.length > 0 && (
                <GameSection title={t('game.moreGames')}>
                    <div className="flex gap-4">
                        {relatedGames.map((g) => (
                            <GameCard
                                key={g.id}
                                className="w-[124px] shrink-0"
                                game={g}
                                lobbyId={lobbyId}
                                size="medium"
                                replace
                            />
                        ))}
                    </div>
                </GameSection>
            )}
        </div>
    );
};
