import { useTranslations } from 'next-intl';
import type { FC, MouseEvent } from 'react';
import { ArrowRight } from '@/components/icons';
import { FavoriteOutlined } from '@/components/icons2/FavoriteOutlined';
import { LeagueHeaderIconFilled } from '@/components/icons2/LeagueHeaderIconFilled';
import { Toast } from '@/components/toast';
import { Link } from '@/i18n';
import { useLiveStatusSuffix } from '@/modules/match/_hooks/use-live-status-suffix';

interface TournamentGroupHeaderProps {
    tournamentId: string;
    tournamentName: string;
    subtitle: string;
    isCurrentTournament?: boolean;
}

/**
 * Tournament group header aligned to Figma league block.
 */
export const TournamentGroupHeader: FC<TournamentGroupHeaderProps> = ({
    tournamentId,
    tournamentName,
    subtitle,
    isCurrentTournament = false,
}) => {
    const tCommon = useTranslations('common');
    const liveStatusSuffix = useLiveStatusSuffix();
    const leagueHref = `/leagues/${tournamentId}${liveStatusSuffix}`;
    const handleComingSoonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        Toast.info(tCommon('message.coming'), { id: 'coming-soon', duration: 650 });
    };

    const leagueTitle = (
        <>
            <div className="flex h-5 min-w-0 items-center gap-1">
                <LeagueHeaderIconFilled className="size-5 shrink-0 md:size-4" />

                <span className="min-w-0 truncate text-[var(--brand-match-league-text,var(--filltext-ft-h))] text-title-sm">
                    {tournamentName}
                </span>

                {!isCurrentTournament && (
                    <ArrowRight className="size-3 shrink-0 text-[var(--brand-match-league-text,var(--filltext-ft-h))]" />
                )}
            </div>

            <span className="hidden max-w-full truncate text-left text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-xs md:block">
                {subtitle}
            </span>
        </>
    );

    return (
        <div className="group/header flex w-full items-center justify-between gap-3 rounded-sm text-left md:items-start">
            {isCurrentTournament ? (
                <div className="flex min-w-0 flex-1 items-center gap-1 md:flex-col md:items-start">{leagueTitle}</div>
            ) : (
                <Link
                    href={leagueHref}
                    className="flex min-w-0 flex-1 items-center gap-1 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0 md:flex-col md:items-start"
                >
                    {leagueTitle}
                </Link>
            )}

            <button
                type="button"
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-filltext-ft-g focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                onClick={handleComingSoonClick}
            >
                <FavoriteOutlined className="size-5" />
            </button>
        </div>
    );
};
