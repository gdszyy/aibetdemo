import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, memo, useCallback, useState } from 'react';
import { CheckGameLaunchInterface } from '@/api/handlers/casino';
import type { ErrorReject } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import type { CasinoGame } from '@/api/models/casino';
import { Loading } from '@/components/loading/loading';
import { Toast } from '@/components/toast';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { useRouter } from '@/i18n';
import { cn } from '@/utils/common';
import type { BadgeVariant } from '../_constants/filter-tags';

const BADGE_VARIANT_STYLES: Record<BadgeVariant, string> = {
    dark: 'bg-filltext-ft-h text-white',
    red: 'bg-brand-red text-white',
};

const SIZE_CONFIG = {
    large: { width: 170, height: 188 },
    medium: { width: 135, height: 160 },
} as const;

/**
 * Individual game card with thumbnail and optional badge.
 */
export const GameCard: FC<{
    game: CasinoGame;
    /** Lobby ID — passed as query param for building return URL */
    lobbyId?: number | string;
    /** Use router.replace instead of push — prevents history stacking in related games */
    replace?: boolean;
    /** Badge text (e.g. "HOT", "NEW") */
    badge?: string;
    /** Badge visual variant */
    badgeVariant?: BadgeVariant;
    /** Card size variant */
    size?: 'large' | 'medium';
    className?: string;
}> = memo(({ game, lobbyId, replace, badge, badgeVariant = 'red', size = 'medium', className }) => {
    const { id, name, logo_url: thumbnail } = game;

    const { width: cardWidth, height: cardHeight } = SIZE_CONFIG[size];
    const t = useTranslations('casino');
    const router = useRouter();
    const [imageError, setImageError] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const { checkKycRequired } = useKycRequiredToast();

    const handleClick = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();

            if (!checkKycRequired()) {
                return;
            }

            if (isLaunching) return;

            if (!id) {
                Toast.error(t('game.launchFailed'), { id: 'game-missing-params' });
                return;
            }

            setIsLaunching(true);
            try {
                const result = await CheckGameLaunchInterface({
                    id,
                });

                if (result.canLaunch) {
                    const query = new URLSearchParams();
                    if (lobbyId != null) query.set('lobby_id', String(lobbyId));

                    const detailUrl = `/casino/game/${id}?${query.toString()}`;
                    if (replace) {
                        router.replace(detailUrl);
                    } else {
                        router.push(detailUrl);
                    }
                }
            } catch (err) {
                const errorMsg = getRejectError(err as ErrorReject) || t('game.launchFailed');
                Toast.error(
                    <div className="flex flex-col items-center gap-1">
                        <span>{errorMsg}</span>
                        <span className="animate-ellipsis" />
                    </div>,
                    { id: 'game-launch-error' },
                );
            } finally {
                setIsLaunching(false);
            }
        },
        [isLaunching, lobbyId, replace, router, t, checkKycRequired, id],
    );

    const handleImageError = useCallback(() => setImageError(true), []);

    const showFallback = !thumbnail || imageError;

    const content = (
        <div className="flex flex-col gap-1 transition-transform group-hover:-translate-y-2">
            <div
                className={cn(
                    'relative rounded-sm overflow-hidden',
                    showFallback ? 'bg-filltext-ft-c border border-neutral-white-f' : 'bg-surface-1',
                )}
                style={{ aspectRatio: `${cardWidth}/${cardHeight}` }}
            >
                {isLaunching && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-sm bg-black/30">
                        <Loading className="size-5" variant="color-red" />
                    </div>
                )}
                {thumbnail && !imageError ? (
                    <Image
                        src={thumbnail}
                        alt={name}
                        className="object-cover"
                        fill
                        loading="lazy"
                        sizes="135px"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                        <span className="text-body-md text-filltext-ft-g text-center line-clamp-2">{name}</span>
                    </div>
                )}
                {badge && (
                    <span
                        className={cn(
                            'absolute top-2 left-2 min-w-12 px-1 py-0.5 rounded-xs text-auxiliary-md text-center',
                            BADGE_VARIANT_STYLES[badgeVariant],
                        )}
                    >
                        {badge}
                    </span>
                )}
            </div>
            <span className="text-auxiliary-sm text-filltext-ft-g truncate">{name}</span>
        </div>
    );

    const sharedClassName = cn('pt-2 cursor-pointer group', className);

    return (
        <div className={sharedClassName} onClick={handleClick}>
            {content}
        </div>
    );
});
