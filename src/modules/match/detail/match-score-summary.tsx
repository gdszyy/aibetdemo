'use client';

import type { FC } from 'react';
import type { MatchWithMarkets } from '@/api/models/match';
import { MatchStatus } from '@/api/models/match';
import type { BreadcrumbResponse } from '@/api/models/match-game';
import { ArrowRight } from '@/components/icons';
import { LeagueHeaderIconFilled } from '@/components/icons2/LeagueHeaderIconFilled';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { ConditionalTooltip } from '@/components/tooltip';
import { Link } from '@/i18n';
import { MatchStatusLabel } from '@/modules/match/_components/match-status-label';
import { PeriodScoreTable } from '@/modules/match/_components/period-score-table';
import { getSportPeriodScoreCells, PeriodScoreDisplayMode } from '@/modules/match/_utils/match-utils';
import { cn } from '@/utils/common';

interface MatchScoreSummaryProps {
    match: MatchWithMarkets;
    breadcrumb?: BreadcrumbResponse;
}

const LeagueDotSeparator: FC = () => (
    <svg className="size-3 shrink-0 text-filltext-ft-f" viewBox="0 0 12 12" fill="none">
        <path
            d="M8 6C8 6.56 7.80667 7.03333 7.42 7.42C7.03333 7.80667 6.56 8 6 8C5.44 8 4.96667 7.80667 4.58 7.42C4.19333 7.03333 4 6.56 4 6C4 5.44 4.19333 4.96667 4.58 4.58C4.96667 4.19333 5.44 4 6 4C6.56 4 7.03333 4.19333 7.42 4.58C7.80667 4.96667 8 5.44 8 6Z"
            fill="currentColor"
        />
    </svg>
);

const LeagueStrip: FC<{ breadcrumb?: BreadcrumbResponse }> = ({ breadcrumb }) => (
    <div className="flex h-8 w-full items-center bg-black/15 px-3 text-filltext-ft-h">
        <LeagueHeaderIconFilled className="mr-1 size-4 shrink-0" />
        {breadcrumb?.sport_name && (
            <span className="shrink-0 text-auxiliary-sm text-filltext-ft-h">{breadcrumb.sport_name}</span>
        )}
        {breadcrumb?.sport_name && breadcrumb?.tournament_name && <LeagueDotSeparator />}
        {breadcrumb?.tournament_name && (
            <ConditionalTooltip content={breadcrumb.tournament_name} side="top">
                <Link
                    href={`/leagues/${breadcrumb.tournament_id}`}
                    className="min-w-0 truncate text-auxiliary-sm text-filltext-ft-h transition-colors hover:text-brand-primary-0"
                >
                    {breadcrumb.tournament_name}
                </Link>
            </ConditionalTooltip>
        )}
        {breadcrumb?.tournament_name && <ArrowRight className="ml-1 size-3 shrink-0 text-filltext-ft-h" />}
    </div>
);

const TeamName: FC<{ name?: string; strong?: boolean }> = ({ name, strong = false }) => (
    <ConditionalTooltip content={name ?? ''} side="top">
        <span className={cn('min-w-0 truncate text-body-lg text-filltext-ft-h', strong && 'font-bold')}>{name}</span>
    </ConditionalTooltip>
);

export const MatchScoreSummary: FC<MatchScoreSummaryProps> = ({ match, breadcrumb }) => {
    const componentProfile = useThemeComponentProfile();
    const isLive = match.status === MatchStatus.Live;
    const homeIsLeading = isLive && (match.home_competitor?.score ?? 0) > (match.away_competitor?.score ?? 0);
    const awayIsLeading = isLive && (match.away_competitor?.score ?? 0) > (match.home_competitor?.score ?? 0);
    const homeScore = match.home_competitor?.score ?? 0;
    const awayScore = match.away_competitor?.score ?? 0;
    const homeScoreCells = getSportPeriodScoreCells({
        periodScores: match.period_score,
        side: 'home',
        total: homeScore,
        opponentTotal: awayScore,
        matchStatus: match.status,
        sportId: match.sport_id,
        mode: PeriodScoreDisplayMode.FullPeriods,
    });
    const awayScoreCells = getSportPeriodScoreCells({
        periodScores: match.period_score,
        side: 'away',
        total: awayScore,
        opponentTotal: homeScore,
        matchStatus: match.status,
        sportId: match.sport_id,
        mode: PeriodScoreDisplayMode.FullPeriods,
    });
    const showPeriods = isLive;
    const visibleHomeScoreCells = showPeriods ? homeScoreCells : [];
    const visibleAwayScoreCells = showPeriods ? awayScoreCells : [];

    if (componentProfile.matchCard.profile === 'superbet-promo-card') {
        const scoreLabel = isLive ? `${homeScore} - ${awayScore}` : 'VS';

        return (
            <div
                className="overflow-hidden rounded-[var(--brand-match-card-radius,10px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,var(--style-card-shadow))]"
                data-detail-hero-profile="superbet"
                style={componentProfile.style}
            >
                <div className="flex h-8 w-full items-center border-[color:var(--brand-match-divider,var(--border-subtle))] border-b bg-black/10 px-3 text-[var(--brand-match-league-text,var(--filltext-ft-h))]">
                    <LeagueHeaderIconFilled className="mr-1 size-4 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                    {breadcrumb?.sport_name && (
                        <span className="shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-sm">
                            {breadcrumb.sport_name}
                        </span>
                    )}
                    {breadcrumb?.sport_name && breadcrumb?.tournament_name && <LeagueDotSeparator />}
                    {breadcrumb?.tournament_name && (
                        <ConditionalTooltip content={breadcrumb.tournament_name} side="top">
                            <Link
                                href={`/leagues/${breadcrumb.tournament_id}`}
                                className="min-w-0 truncate text-[var(--brand-match-league-text,var(--filltext-ft-h))] text-auxiliary-sm transition-colors hover:text-brand-primary-0"
                            >
                                {breadcrumb.tournament_name}
                            </Link>
                        </ConditionalTooltip>
                    )}
                    {breadcrumb?.tournament_name && (
                        <ArrowRight className="ml-1 size-3 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                    )}
                </div>

                <div className="flex min-h-[96px] flex-col justify-center gap-3 px-3 py-3">
                    <div className="flex h-4 min-w-0 items-center">
                        <MatchStatusLabel
                            sportId={match.sport_id}
                            status={match.status}
                            matchStatus={match.match_status}
                            startTime={match.start_time}
                            matchClock={match.match_clock}
                            matchClockOffset={match.match_clock_offset}
                            className="min-w-0"
                        />
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex h-[18px] min-w-0 items-center">
                                <TeamName name={match.home_competitor?.name} strong={homeIsLeading} />
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center">
                                <TeamName name={match.away_competitor?.name} strong={awayIsLeading} />
                            </div>
                        </div>

                        <div className="flex min-w-14 shrink-0 items-center justify-center rounded-[var(--component-odds-radius,5px)] bg-[var(--brand-odds-bg,var(--surface-selected))] px-3 py-1 text-body-lg font-bold tabular-nums text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                            {scoreLabel}
                        </div>

                        {showPeriods && (
                            <PeriodScoreTable
                                homeCells={visibleHomeScoreCells}
                                awayCells={visibleAwayScoreCells}
                                className="hidden shrink-0 sm:block"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (componentProfile.matchCard.profile === 'betano-ticket-row') {
        const scoreLabel = isLive ? `${homeScore} - ${awayScore}` : 'VS';

        return (
            <div
                className="overflow-hidden rounded-[var(--brand-match-card-radius,12px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))]"
                data-detail-hero-profile="betano"
                style={componentProfile.style}
            >
                <div className="flex h-8 w-full items-center border-[color:var(--brand-match-card-border,var(--border-subtle))] border-b px-3 text-[var(--brand-match-league-text,var(--filltext-ft-h))]">
                    <LeagueHeaderIconFilled className="mr-1 size-4 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                    {breadcrumb?.sport_name && (
                        <span className="shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-sm">
                            {breadcrumb.sport_name}
                        </span>
                    )}
                    {breadcrumb?.sport_name && breadcrumb?.tournament_name && <LeagueDotSeparator />}
                    {breadcrumb?.tournament_name && (
                        <ConditionalTooltip content={breadcrumb.tournament_name} side="top">
                            <Link
                                href={`/leagues/${breadcrumb.tournament_id}`}
                                className="min-w-0 truncate text-[var(--brand-match-league-text,var(--filltext-ft-h))] text-auxiliary-sm transition-colors hover:text-brand-primary-0"
                            >
                                {breadcrumb.tournament_name}
                            </Link>
                        </ConditionalTooltip>
                    )}
                    {breadcrumb?.tournament_name && (
                        <ArrowRight className="ml-1 size-3 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                    )}
                </div>

                <div className="flex min-h-[98px] flex-col justify-center gap-3 px-3 py-3 md:min-h-[98px]">
                    <div className="flex h-4 min-w-0 items-center">
                        <MatchStatusLabel
                            sportId={match.sport_id}
                            status={match.status}
                            matchStatus={match.match_status}
                            startTime={match.start_time}
                            matchClock={match.match_clock}
                            matchClockOffset={match.match_clock_offset}
                            className="min-w-0"
                        />
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex h-[18px] min-w-0 items-center">
                                <TeamName name={match.home_competitor?.name} strong={homeIsLeading} />
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center">
                                <TeamName name={match.away_competitor?.name} strong={awayIsLeading} />
                            </div>
                        </div>

                        <div className="flex min-w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-odds-bg,var(--surface-selected))] px-3 py-1 text-body-lg font-bold tabular-nums text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                            {scoreLabel}
                        </div>

                        {showPeriods && (
                            <PeriodScoreTable
                                homeCells={visibleHomeScoreCells}
                                awayCells={visibleAwayScoreCells}
                                className="hidden shrink-0 sm:block"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-sm bg-[#2f7348] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <LeagueStrip breadcrumb={breadcrumb} />
            <div className="flex h-[86px] items-center justify-between gap-3 px-3 pb-2 pt-2">
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <div className="flex h-4 min-w-0 items-center">
                        <MatchStatusLabel
                            sportId={match.sport_id}
                            status={match.status}
                            matchStatus={match.match_status}
                            startTime={match.start_time}
                            matchClock={match.match_clock}
                            matchClockOffset={match.match_clock_offset}
                            className="min-w-0"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                            <TeamName name={match.home_competitor?.name} strong={homeIsLeading} />
                        </div>
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                            <TeamName name={match.away_competitor?.name} strong={awayIsLeading} />
                        </div>
                    </div>
                </div>
                {showPeriods && (
                    <PeriodScoreTable homeCells={visibleHomeScoreCells} awayCells={visibleAwayScoreCells} />
                )}
            </div>
        </div>
    );
};
