'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useCallback } from 'react';
import { SportAllOutlined } from '@/components/icons2/SportAllOutlined';
import { getSportConfig } from '@/constants/sports-config';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useTopSports } from '@/hooks/use-sports';
import { usePathname, useRouter } from '@/i18n';
import {
    ALL_SPORT_FILTER_ID,
    getSelectedSportIdFromParams,
    updateQueryParams,
} from '@/modules/match/_utils/filter-utils';
import { cn } from '@/utils/common';

type FilterSport = { sport_id: string; name: string };

const MATCH_LIST_ROOT_SELECTOR = '[data-match-list-root]';

interface FiltersProps {
    /** Called after a sport is selected so consumers can refresh related data. */
    onSportChange?: (sportId?: string) => void;
}

interface FilterItemProps {
    sport: FilterSport;
    isActive?: boolean;
    isAll?: boolean;
    onClick?: (el: HTMLButtonElement) => void;
}

const FilterItem: FC<FilterItemProps> = ({ sport, isActive = false, isAll = false, onClick }) => {
    const sportConfig = getSportConfig(sport.sport_id);
    const Icon = isAll ? SportAllOutlined : sportConfig?.icon;
    const isDesktop = useIsDesktop();

    return (
        <button
            type="button"
            onClick={(e) => onClick?.(e.currentTarget)}
            className={cn(
                'group/filter-item flex shrink-0 items-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                isDesktop ? 'h-10 gap-2 px-3 py-2' : 'size-10 justify-center p-0',
                isActive
                    ? 'bg-brand-primary-0 text-on-brand hover:bg-brand-primary-4'
                    : 'cursor-pointer bg-filltext-ft-c text-filltext-ft-g hover:bg-[image:linear-gradient(var(--neutral-black-a),var(--neutral-black-a))]',
            )}
        >
            {Icon && (
                <div className="flex size-6 shrink-0 items-center justify-center">
                    <Icon className={cn(isAll ? 'h-[22px] w-7' : 'size-5')} />
                </div>
            )}
            {/* name */}
            {isDesktop && <span className="text-body-lg whitespace-nowrap">{sport.name}</span>}
        </button>
    );
};

/**
 * Hot matches filter component
 *
 * Horizontally scrollable sport type filter list.
 */
export const Filters: FC<FiltersProps> = ({ onSportChange }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, watchDrag: true, slidesToScroll: 'auto' }, [
        WheelGesturesPlugin(),
    ]);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isDesktop = useIsDesktop();
    const t = useTranslations('matches');

    const topSports = useTopSports();

    // Empty state selects All, while All currently queries Football.
    const selectedSportId = getSelectedSportIdFromParams(searchParams);
    const allSport = { sport_id: ALL_SPORT_FILTER_ID, name: t('all') };

    const handleSportClick = useCallback(
        (sport: FilterSport, el: HTMLButtonElement | null) => {
            const querySportId = sport.sport_id === ALL_SPORT_FILTER_ID ? undefined : sport.sport_id;

            onSportChange?.(querySportId);
            updateQueryParams({ sport_id: sport.sport_id }, router, pathname, searchParams, 'replace', {
                scroll: false,
            });
            el?.closest(MATCH_LIST_ROOT_SELECTOR)?.scrollIntoView({ block: 'start', behavior: 'auto' });
            if (!emblaApi || !el) return;
            const viewport = emblaApi.rootNode();
            // el.offsetLeft is relative to container (not affected by Embla's transform)
            const targetOffset = el.offsetLeft - viewport.offsetWidth / 2 + el.offsetWidth / 2;
            const container = emblaApi.containerNode();
            const maxScroll = container.scrollWidth - viewport.offsetWidth;
            if (maxScroll <= 0) return;
            const targetProgress = Math.max(0, Math.min(1, targetOffset / maxScroll));
            // find closest snap index by progress
            const snapList = emblaApi.scrollSnapList();
            const closestIndex = snapList.reduce(
                (best, snap, i) =>
                    Math.abs(snap - targetProgress) < Math.abs(snapList[best] - targetProgress) ? i : best,
                0,
            );
            emblaApi.scrollTo(closestIndex);
        },
        [router, pathname, searchParams, emblaApi, onSportChange],
    );

    // Don't render when there's no data
    if (topSports.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 w-full">
            {/* Outer clip wrapper — right padding creates peek zone for next item */}
            <div
                data-test-id="aaaaaa"
                className="flex-1 min-w-0 overflow-hidden py-2 -my-2 pl-2 -ml-2 -mr-2"
                style={{
                    paddingRight: isDesktop ? 40 : 8,
                }}
            >
                {/* Embla viewport — overflow:visible so items leak into outer padding (peek zone) */}
                <div ref={emblaRef} style={{ overflow: 'visible' }}>
                    <div className="flex gap-4">
                        <FilterItem
                            sport={allSport}
                            isActive={selectedSportId === ALL_SPORT_FILTER_ID}
                            isAll
                            onClick={(el) => handleSportClick(allSport, el)}
                        />
                        {topSports.map((sportNode) => (
                            <FilterItem
                                key={sportNode.sport_id}
                                sport={sportNode}
                                isActive={selectedSportId === sportNode.sport_id}
                                onClick={(el) => handleSportClick(sportNode, el)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
