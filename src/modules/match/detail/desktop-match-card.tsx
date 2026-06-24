'use client';

import Image from 'next/image';
import type { FC } from 'react';
import type { MatchWithMarkets } from '@/api/models/match';
import type { BreadcrumbResponse } from '@/api/models/match-game';
import imageGlobal from '@/assets/images/shared/global.png';
import { BreadcrumbSeparatorOutlined } from '@/components/icons2/BreadcrumbSeparatorOutlined';
import { FavoriteOutlined } from '@/components/icons2/FavoriteOutlined';
import { ConditionalTooltip } from '@/components/tooltip';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import { MatchScoreSummary } from './match-score-summary';

interface DesktopMatchCardProps {
    match: MatchWithMarkets;
    breadcrumb?: BreadcrumbResponse;
}

interface DesktopMatchBreadcrumbProps {
    breadcrumb?: BreadcrumbResponse;
    onFavoriteClick: () => void;
    favoriteLabel: string;
    homeLabel: string;
}

export const DesktopMatchFavoriteButton: FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
    <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-g transition-colors hover:text-func-favorite"
    >
        <FavoriteOutlined className="size-4" />
    </button>
);

export const DesktopMatchCard: FC<DesktopMatchCardProps> = ({ match, breadcrumb }) => (
    <MatchScoreSummary match={match} breadcrumb={breadcrumb} />
);

export const DesktopMatchCardSkeleton: FC = () => (
    <div className="h-[118px] overflow-hidden rounded-md bg-neutral-black-b animate-skeleton-pulse">
        <div className="flex h-8 items-center rounded-lg bg-neutral-black-b px-3">
            <div className="h-4 w-56 rounded bg-filltext-ft-e/25" />
        </div>
        <div className="flex h-[86px] flex-col justify-center gap-2.5 px-3">
            <div className="h-[18px] w-32 rounded bg-filltext-ft-e/25" />
            <div className="h-[18px] w-44 rounded bg-filltext-ft-e/25" />
            <div className="h-[18px] w-52 rounded bg-filltext-ft-e/20" />
        </div>
    </div>
);

const BreadcrumbSeparator: FC = () => <BreadcrumbSeparatorOutlined className="size-3.5 shrink-0 text-filltext-ft-e" />;

const breadcrumbSegmentClass =
    'flex min-w-0 items-center rounded-sm px-2 py-1 text-body-sm text-filltext-ft-f transition-colors hover:bg-filltext-ft-c';

const selectedBreadcrumbSegmentClass =
    'min-w-0 truncate rounded-sm px-2 py-1 text-body-lg text-filltext-ft-h transition-colors hover:bg-filltext-ft-c';

export const DesktopMatchBreadcrumb: FC<DesktopMatchBreadcrumbProps> = ({
    breadcrumb,
    onFavoriteClick,
    favoriteLabel,
    homeLabel,
}) => {
    const matchTitle =
        breadcrumb?.home_name && breadcrumb?.away_name ? `${breadcrumb.home_name} vs ${breadcrumb.away_name}` : '';

    return (
        <div className="flex h-[26px] w-full items-center justify-between gap-3">
            <nav className="flex min-w-0 items-center">
                <Link href="/sports" className={cn(breadcrumbSegmentClass, 'shrink-0')}>
                    {homeLabel}
                </Link>
                {breadcrumb?.sport_name && (
                    <>
                        <BreadcrumbSeparator />
                        <Link
                            href={`/sports/${breadcrumb.sport_id}`}
                            className={cn(breadcrumbSegmentClass, 'shrink-0')}
                        >
                            {breadcrumb.sport_name}
                        </Link>
                    </>
                )}
                {breadcrumb?.category_name && (
                    <>
                        <BreadcrumbSeparator />
                        <span className={cn(breadcrumbSegmentClass, 'shrink-0 gap-1')}>
                            <Image className="size-[18px] shrink-0" src={imageGlobal} alt="" width={18} height={18} />
                            {breadcrumb.category_name}
                        </span>
                    </>
                )}
                {breadcrumb?.tournament_name && (
                    <>
                        <BreadcrumbSeparator />
                        <Link
                            href={`/leagues/${breadcrumb.tournament_id}`}
                            className={cn(breadcrumbSegmentClass, 'shrink-0')}
                        >
                            {breadcrumb.tournament_name}
                        </Link>
                    </>
                )}
                {matchTitle && (
                    <>
                        <BreadcrumbSeparator />
                        <ConditionalTooltip content={matchTitle} side="top">
                            <span className={selectedBreadcrumbSegmentClass}>{matchTitle}</span>
                        </ConditionalTooltip>
                    </>
                )}
            </nav>
            <DesktopMatchFavoriteButton onClick={onFavoriteClick} label={favoriteLabel} />
        </div>
    );
};
