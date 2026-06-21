'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { ArrowLeft, DetailLiveSwitch } from '@/components/icons';
import { FavoriteOutlined } from '@/components/icons2/FavoriteOutlined';
import { Toast } from '@/components/toast';
import { useIsDesktop } from '@/hooks/use-media-query';
import { Link } from '@/i18n';
import { useBreadcrumb } from '@/modules/match/_hooks/use-breadcrumb';
import { cn } from '@/utils/common';

type BreadcrumbProps = {
    sportId?: string;
    tournamentId?: string;
    matchId?: string;
    /**
     * When provided on a match page, replaces the favorite button (mobile)
     * with a live-widget toggle. The button always renders; `available`
     * controls whether it is active (clickable, brand-colored) or grayed
     * out (no live widget id mapped from backend).
     */
    liveSwitch?: {
        available: boolean;
        onToggle: () => void;
        label?: string;
    };
};

export const Breadcrumb: FC<BreadcrumbProps> = ({ sportId, tournamentId, matchId, liveSwitch }) => {
    const matchType = matchId ? 'matches' : tournamentId ? 'leagues' : 'sports';
    const tCommon = useTranslations('common');

    // Fetch breadcrumb data (shared cache with other consumers)
    const { data } = useBreadcrumb({ sportId, tournamentId, matchId });
    const isDesktop = useIsDesktop();

    const handleFavoriteClick = () => {
        // Placeholder for favorite functionality
        Toast.info(tCommon('message.coming'), { id: 'coming-soon', duration: 650 });
    };

    // Common pill style
    const pill = 'bg-surface-1 flex h-10 items-center justify-center px-4';
    const pillText = 'text-body-lg leading-4';

    // Build breadcrumb segments based on matchType and API data
    const segments: { label: string; href?: string; isLast: boolean }[] = [];

    if (data) {
        // Sport
        if (data.sport_name) {
            segments.push({
                label: data.sport_name,
                href: matchType !== 'sports' ? `/sports/${data.sport_id}` : undefined,
                isLast: matchType === 'sports',
            });
        }
        // Category (leagues / games only)
        if (matchType !== 'sports' && data.category_name) {
            segments.push({ label: data.category_name, isLast: false });
        }
        // Tournament (leagues / games only)
        if (matchType !== 'sports' && data.tournament_name) {
            segments.push({
                label: data.tournament_name,
                href: matchType === 'matches' ? `/leagues/${data.tournament_id}` : undefined,
                isLast: matchType === 'leagues',
            });
        }
        // Match (games only)
        if (matchType === 'matches' && data.home_name && data.away_name) {
            segments.push({ label: `${data.home_name} vs ${data.away_name}`, isLast: true });
        }
    }

    const getRoundedClass = (index: number, total: number) => {
        if (total === 1) return 'rounded-lg';
        if (index === 0) return 'rounded-l-lg rounded-r-xs';
        if (index === total - 1) return 'rounded-l-xs rounded-r-lg';
        return 'rounded-xs';
    };

    // Mobile match pages move the breadcrumb info into the <Card> header strip,
    // so we hide the standalone segments here and keep only the back button + actions.
    const hideSegmentsOnMobile = matchType === 'matches';

    return (
        <div className="group mb-2 relative w-full flex items-center justify-between">
            {/* Left section: back button + breadcrumb items */}
            <div className="flex items-center gap-4 min-w-0">
                {/* Back button */}
                <Link href={'/sports'}>
                    <button
                        type="button"
                        className={cn(
                            'group/back flex items-center justify-center cursor-pointer shrink-0',
                            hideSegmentsOnMobile
                                ? 'size-auto md:size-10 md:bg-surface-1 md:rounded-full md:px-2 md:py-0.5'
                                : 'size-10 bg-surface-1 rounded-full px-2 py-0.5',
                        )}
                    >
                        <ArrowLeft
                            className={cn(
                                'text-filltext-ft-e group-hover/back:text-filltext-ft-g transition-colors',
                                hideSegmentsOnMobile ? 'text-filltext-ft-g size-4 md:size-3' : 'size-3',
                            )}
                        />
                    </button>
                </Link>
                {/* Breadcrumb items */}
                {segments.length > 0 && (
                    <div className={cn('flex items-center gap-1 min-w-0', hideSegmentsOnMobile && 'hidden md:flex')}>
                        {(() => {
                            const visible = isDesktop ? segments : segments.length <= 1 ? segments : [segments[0]];
                            return visible.map((seg, idx) => {
                                const isLastItem = idx === visible.length - 1;
                                const rounded = getRoundedClass(idx, visible.length);
                                const content = (
                                    <div
                                        className={cn(
                                            pill,
                                            rounded,
                                            seg.href && 'cursor-pointer',
                                            isLastItem && 'min-w-0',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                pillText,
                                                seg.isLast ? 'text-filltext-ft-g' : 'text-filltext-ft-f',
                                                seg.href && 'hover:text-filltext-ft-g transition-colors',
                                                isLastItem && 'truncate',
                                            )}
                                        >
                                            {seg.label}
                                        </span>
                                    </div>
                                );
                                if (seg.href) {
                                    return (
                                        <Link key={seg.label} href={seg.href} className={cn(isLastItem && 'min-w-0')}>
                                            {content}
                                        </Link>
                                    );
                                }
                                return (
                                    <div key={seg.label} className={cn(isLastItem && 'min-w-0')}>
                                        {content}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>

            {/* Right section: actions */}
            {matchType === 'matches' && (
                <div className="flex items-center gap-2">
                    {liveSwitch && (
                        <button
                            type="button"
                            onClick={liveSwitch.onToggle}
                            disabled={!liveSwitch.available}
                            className={cn(
                                'md:hidden flex items-center justify-center rounded-full size-10 transition-colors',
                                liveSwitch.available
                                    ? 'bg-surface-1 cursor-pointer'
                                    : 'bg-transparent cursor-not-allowed',
                            )}
                        >
                            <DetailLiveSwitch
                                className={cn(
                                    'h-5 w-10 transition-colors',
                                    liveSwitch.available ? 'text-func-win' : 'text-func-void',
                                )}
                            />
                        </button>
                    )}
                    {/* Favorite (desktop always; mobile only when live switch is unavailable) */}
                    <button
                        type="button"
                        onClick={handleFavoriteClick}
                        className={cn(
                            'bg-surface-1 flex items-center justify-center rounded-sm cursor-pointer size-10 px-2.25 py-2.5',
                            liveSwitch && 'hidden md:flex',
                        )}
                    >
                        <FavoriteOutlined className="w-5 h-5 text-filltext-ft-e" />
                    </button>
                </div>
            )}
        </div>
    );
};
