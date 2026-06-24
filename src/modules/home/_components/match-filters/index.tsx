'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import type { FC } from 'react';
import type { MenuSport } from '@/api/models/menu';
import { LSPORTS_SPORT_ID_BY_TYPE } from '@/constants/sports';
import { getSportConfig } from '@/constants/sports-config';
import { useTopSports } from '@/hooks/use-sports';
import { Link } from '@/i18n';
import { useLiveStatusSuffix } from '@/modules/match/_hooks/use-live-status-suffix';
import { cn } from '@/utils/common';

interface FilterItemProps {
    sport: MenuSport;
}

const MOCK_TOP_SPORTS: MenuSport[] = [
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.football, name: 'Football' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.basketball, name: 'Basketball' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.tennis, name: 'Tennis' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.baseball, name: 'Baseball' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.volleyball, name: 'Volleyball' },
];

const FilterItem: FC<FilterItemProps> = ({ sport }) => {
    const liveStatusSuffix = useLiveStatusSuffix();

    const sportConfig = getSportConfig(sport.sport_id);
    const Icon = sportConfig?.icon ?? sportConfig?.shadowIcon;

    return (
        <Link
            className={cn(
                'inline-flex h-15 w-18 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border px-1.5 text-center transition-colors md:h-[72px] md:w-[86px] md:gap-1.5 md:px-2',
                'border-[color:var(--brand-mobile-sport-nav-border,var(--border-subtle))] [background:var(--brand-mobile-sport-nav-bg,var(--surface-1))] [box-shadow:var(--brand-mobile-sport-nav-shadow,none)]',
                'hover:[background:var(--brand-mobile-sport-nav-hover-bg,var(--surface-2))]',
            )}
            href={`/sports/${sport.sport_id}${liveStatusSuffix}`}
            aria-label={sport.name}
        >
            <span className="grid size-8 place-items-center rounded-sm bg-[var(--brand-mobile-sport-nav-icon-bg,var(--surface-2))] text-[var(--brand-mobile-sport-nav-icon,var(--brand-primary-0))] md:size-9">
                {Icon ? <Icon className="size-5" /> : <span className="text-body-lg font-bold">{sport.name[0]}</span>}
            </span>
            <span className="w-full truncate text-[var(--brand-mobile-sport-nav-text,var(--filltext-ft-h))] text-[10px] font-semibold leading-3 md:text-auxiliary-2xs">
                {sport.name}
            </span>
        </Link>
    );
};

export const MatchFilter: FC = () => {
    const [emblaRef] = useEmblaCarousel({ dragFree: true }, [WheelGesturesPlugin()]);

    const topSports = useTopSports();
    const sports = topSports.length > 0 ? topSports : MOCK_TOP_SPORTS;

    return (
        <div className="group relative w-full">
            <div ref={emblaRef} className="overflow-hidden ">
                <div className="flex items-start flex-nowrap gap-2.5">
                    {sports.map((sportNode) => (
                        <FilterItem key={sportNode.sport_id} sport={sportNode} />
                    ))}
                </div>
            </div>
        </div>
    );
};
