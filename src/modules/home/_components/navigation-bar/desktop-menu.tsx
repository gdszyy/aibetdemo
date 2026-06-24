'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FunctionComponent, useEffect, useMemo, useRef } from 'react';
import { GetCasinoGameLobbiesV2Interface } from '@/api/handlers/casino';
import { useCarousel } from '@/hooks/use-carousel';
import { useLiveMatchTotalData } from '@/hooks/use-live-match-total';
import { recordNavIntent, useResolvedNavLocation } from '@/hooks/use-nav-intent';
import { Link, usePathname } from '@/i18n';
import { WorldCupMenuItem } from '@/modules/marketing/promotion/world-cup-league/leagues-banner/components/WorldCupMenu';
import { cn } from '@/utils/common';
import { FIXED_NAV_ITEMS, getCasinoNavItem } from '../../_constants/nav-menus';

/** Desktop navigation menu */
export const DesktopMenu: FunctionComponent = () => {
    const t = useTranslations('common');
    const path = usePathname();
    const searchParams = useSearchParams();
    // Optimistic location: highlights the clicked tab before the route commits.
    const { path: activePath, searchParams: activeSearch } = useResolvedNavLocation();

    const { data: lobbies = [] } = useQuery({
        queryKey: ['casino', 'lobbies'],
        queryFn: GetCasinoGameLobbiesV2Interface,
        placeholderData: [],
    });

    // TODO allmenus未使用logo，是否尽量移除掉
    const allMenus = useMemo(() => {
        const sportItem = FIXED_NAV_ITEMS.find((item) => item.key === 'sport');
        const liveItem = FIXED_NAV_ITEMS.find((item) => item.key === 'sport-live');
        const transmisionItem = FIXED_NAV_ITEMS.find((item) => item.key === 'transmision');
        const myBetsItem = FIXED_NAV_ITEMS.find((item) => item.key === 'mybets');
        const casinoItem = {
            ...getCasinoNavItem(lobbies),
            label: 'Casino',
            labelKey: undefined,
        };

        return [
            ...(sportItem ? [sportItem] : []),
            ...(liveItem ? [liveItem] : []),
            casinoItem,
            ...(transmisionItem ? [transmisionItem] : []),
            ...(myBetsItem ? [myBetsItem] : []),
        ];
    }, [lobbies]);

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps', align: 'start' }, [
        WheelGesturesPlugin(),
    ]);
    const { scrollTo } = useCarousel(emblaApi);

    const hasScrollMenu = useRef(false);
    useEffect(() => {
        if (hasScrollMenu.current) {
            return;
        }
        if (!scrollTo) {
            return;
        }
        const slideIndex = allMenus.findIndex((item) => {
            const isActive = item.isActive?.(path, searchParams) ?? path.startsWith(item.link);
            return isActive;
        });
        if (slideIndex === -1) {
            return;
        }
        window.requestAnimationFrame(() => {
            scrollTo(slideIndex);
            hasScrollMenu.current = true;
        });
    }, [allMenus, path, searchParams, scrollTo]);

    // live matches count
    const { data: liveCount = 0 } = useLiveMatchTotalData();

    return (
        <div ref={emblaRef} className="h-full ml-0 mr-4 flex-1 overflow-hidden">
            <div className="flex items-center min-w-0 gap-3 h-full">
                {allMenus.map((item) => {
                    const isActive = item.isActive?.(activePath, activeSearch) ?? activePath.startsWith(item.link);
                    const displayLabel = item.label || (item.labelKey ? t(item.labelKey) : '');
                    const isSportLive = item.key === 'sport-live';

                    return (
                        <div key={item.key} className={cn('relative inline-flex items-center')}>
                            <Link
                                className={cn(
                                    isSportLive && 'inline-flex gap-x-2 items-center',
                                    'relative h-9 rounded-[var(--component-nav-item-radius,4px)] px-4 py-2',
                                    'whitespace-nowrap text-title-sm font-bold uppercase',
                                    'text-[var(--brand-nav-item-text,var(--filltext-ft-h))]',
                                    'transition-colors hover:bg-[var(--brand-nav-item-hover-bg,var(--neutral-white-b))]',
                                    "after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-full after:bg-transparent after:content-['']",
                                    isActive &&
                                        'bg-[var(--brand-nav-active-bg,var(--brand-primary-0))] text-[var(--brand-nav-active-text,var(--neutral-white-h))] hover:bg-[var(--brand-nav-active-hover-bg,var(--brand-primary-0))] after:bg-[var(--brand-nav-active-underline,transparent)]',
                                )}
                                href={item.link}
                                prefetch
                                onClick={() => recordNavIntent(item.link)}
                            >
                                {displayLabel}
                                {isSportLive && Boolean(liveCount) && (
                                    <span className="min-w-4 rounded-xs bg-[var(--brand-nav-live-badge-bg,var(--brand-primary-0))] px-0.5 text-center text-[var(--brand-nav-live-badge-text,var(--neutral-white-h))] text-auxiliary-md">
                                        {liveCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    );
                })}

                {/* 世界杯 menu icon */}
                <WorldCupMenuItem />
            </div>
        </div>
    );
};
