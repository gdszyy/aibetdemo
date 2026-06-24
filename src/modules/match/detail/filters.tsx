'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MarketTabResponse } from '@/api/models/match-game';
import { CarouselInlineNav } from '@/components/carousel-nav-controls';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';

type dataItem = {
    id: number;
    name: string;
};
interface FilterItemProps {
    data: dataItem;
    isActive?: boolean;
    onClick?: () => void;
    surface?: FiltersProps['surface'];
    treatment?: 'flat' | 'pill' | 'table';
}

type FilterSurface = NonNullable<FiltersProps['surface']>;

const BETBUS_DETAIL_TAB_LABELS: Record<string, string> = {
    all: 'Todos',
    popular: 'Mercados Principales',
    main: 'Mercados Principales',
    bet_builder: 'Crear Apuesta',
    quick: 'Mercados Rapidos',
    goals: 'Goles',
    scorer: 'Goleadores',
    corners: 'Corners',
    cards: 'Tarjetas',
    specials: 'Especiales',
    combinations: 'Combinadas',
    others: 'Otros',
};

function toBetbusDetailTabLabel(tab: MarketTabResponse[number]): string {
    const byKey = BETBUS_DETAIL_TAB_LABELS[tab.tab_key];
    if (byKey) return byKey;

    const normalizedName = tab.tab_name.trim().toLowerCase();
    return BETBUS_DETAIL_TAB_LABELS[normalizedName.replace(/\s+/g, '_')] ?? tab.tab_name;
}

const FILTER_SURFACE_CLASS: Record<
    FilterSurface,
    {
        root: string;
        track: string;
        itemWrap: string;
        activeIndicator: string;
        labelWrap: string;
        label: string;
        nav: string;
        navButtonVariant: 'compact' | 'mini';
        navButton?: string;
        navIcon?: string;
    }
> = {
    default: {
        root: 'gap-4',
        track: 'gap-4',
        itemWrap:
            'group/filter-item h-9 md:h-10 px-4 py-3 bg-surface-1 hover:text-brand-red transition-all duration-200 border border-surface-3 text-auxiliary-md leading-3.5 text-filltext-ft-g whitespace-nowrap flex items-center rounded-sm shrink-0',
        activeIndicator: '',
        labelWrap: '',
        label: '',
        nav: 'hidden md:flex',
        navButtonVariant: 'compact',
    },
    detail: {
        root: 'gap-2',
        track: 'gap-4 md:gap-6',
        itemWrap:
            'group/filter-item flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-[var(--component-detail-tab-radius,0.125rem)] px-4 transition-colors md:h-10 md:flex-col md:px-0',
        activeIndicator:
            'hidden md:block h-0.5 w-full min-w-3 rounded-lg bg-[var(--component-detail-tab-indicator-bg,var(--brand-primary-0))] transition-opacity',
        labelWrap: 'flex shrink-0 items-center justify-center md:flex-1 md:items-end md:px-2',
        label: 'max-w-full text-center whitespace-nowrap transition-colors text-auxiliary-md md:text-body-lg md:rounded-sm md:px-2 md:py-1',
        nav: 'hidden md:flex gap-4 text-filltext-ft-e',
        navButtonVariant: 'mini',
        navButton: 'size-4 bg-transparent p-0 shadow-none hover:bg-transparent active:scale-100',
        navIcon: 'size-4',
    },
} as const;

const FilterItem: FC<FilterItemProps> = ({
    data,
    isActive = false,
    onClick,
    surface = 'default',
    treatment = 'flat',
}) => {
    const surfaceClasses = FILTER_SURFACE_CLASS[surface];
    const isDetailPill = surface === 'detail' && treatment === 'pill';

    if (surface === 'detail') {
        return (
            <button
                type="button"
                onClick={() => onClick?.()}
                className={cn(
                    surfaceClasses.itemWrap,
                    isDetailPill &&
                        'h-8 rounded-[var(--component-detail-tab-radius,999px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-1))] px-3 md:h-8 md:flex-row md:px-3',
                    isActive
                        ? '[background:var(--component-detail-tab-active-bg,var(--odds-selected-bg))] text-[var(--component-detail-tab-active-text,var(--odds-selected-text))] md:[background:var(--component-detail-tab-desktop-active-bg,transparent)] md:text-[var(--component-detail-tab-desktop-active-text,var(--accent-warm))]'
                        : cn(
                              'bg-surface-1 text-filltext-ft-g hover:bg-filltext-ft-c hover:text-filltext-ft-h md:bg-transparent md:text-filltext-ft-f md:hover:bg-transparent md:hover:text-filltext-ft-f',
                              isDetailPill &&
                                  'text-[var(--brand-match-muted,var(--filltext-ft-g))] hover:bg-[var(--brand-odds-hover-bg,var(--surface-2))] hover:text-[var(--brand-match-team-text,var(--filltext-ft-h))] md:bg-[var(--brand-odds-bg,var(--surface-1))] md:hover:bg-[var(--brand-odds-hover-bg,var(--surface-2))]',
                          ),
                )}
            >
                <span
                    className={cn('hidden flex-1 items-end justify-center px-2 md:flex', isDetailPill && 'md:hidden')}
                >
                    <span className="h-1 w-full min-w-4 rounded-lg bg-brand-primary-0 opacity-0" />
                </span>
                <span className={cn(surfaceClasses.labelWrap, isDetailPill && 'md:flex-none md:items-center md:px-0')}>
                    <span
                        className={cn(
                            surfaceClasses.label,
                            isDetailPill && 'md:px-0 md:py-0',
                            !isActive && !isDetailPill && 'md:group-hover/filter-item:bg-filltext-ft-c',
                        )}
                    >
                        {data.name}
                    </span>
                </span>
                <span
                    className={cn(
                        'hidden h-2 w-full items-end justify-center px-4 pb-0 md:flex',
                        isDetailPill && 'md:hidden',
                    )}
                >
                    <span className={cn(surfaceClasses.activeIndicator, isActive ? 'opacity-100' : 'opacity-0')} />
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => onClick?.()}
            className={cn(
                surfaceClasses.itemWrap,
                isActive ? 'border-brand-primary-0 text-brand-red' : 'cursor-pointer',
            )}
        >
            {data.name}
        </button>
    );
};

/**
 * Market tab filter bar (controlled component).
 *
 * Horizontal scrollable list of tab buttons using a simple custom scroller (no third-party).
 */
interface FiltersProps {
    tabs?: MarketTabResponse;
    /** ID of the currently selected tab */
    selectedTabId: number | null;
    /** Callback when user clicks a tab */
    onTabChange: (tabId: number) => void;
    /** IDs of tabs that should only be visible on mobile (hidden on lg+) */
    mobileOnlyTabIds?: number[];
    surface?: 'default' | 'detail';
}

export const Filters: FC<FiltersProps> = ({
    tabs,
    selectedTabId,
    onTabChange,
    mobileOnlyTabIds,
    surface = 'default',
}) => {
    const surfaceClasses = FILTER_SURFACE_CLASS[surface];
    const isDesktop = useIsDesktop();
    const componentProfile = useThemeComponentProfile();
    const treatment = surface === 'detail' ? componentProfile.marketCard.headerTreatment : 'flat';
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hasMountedRef = useRef(false);

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [maskImage, setMaskImage] = useState<string | undefined>(undefined);

    const filters: dataItem[] = useMemo(
        () =>
            tabs
                ? tabs.map((tab) => ({
                      id: tab.id,
                      name: surface === 'detail' ? toBetbusDetailTabLabel(tab) : tab.tab_name,
                  }))
                : [],
        [surface, tabs],
    );

    const updateScrollState = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const scrollLeft = container.scrollLeft;
        const cw = container.clientWidth;
        const sw = container.scrollWidth;
        const prev = scrollLeft > 1;
        const next = scrollLeft + cw < sw - 1;
        setCanScrollPrev(prev);
        setCanScrollNext(next);

        // compute mask image similar to previous hook
        const fadeWidth = 48;
        if (!prev && !next) {
            setMaskImage(undefined);
        } else {
            const left = prev ? `transparent, black ${fadeWidth}px` : 'black, black 0px';
            const right = next ? `black calc(100% - ${fadeWidth}px), transparent` : 'black 100%, black';
            setMaskImage(`linear-gradient(to right, ${left}, ${right})`);
        }
    }, []);

    useLayoutEffect(() => {
        updateScrollState();
        const container = containerRef.current;
        if (!container) return;
        const onScroll = () => updateScrollState();
        const onResize = () => updateScrollState();
        container.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            container.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [updateScrollState]);

    const scrollPrev = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const amount = Math.max(100, Math.floor(container.clientWidth * 0.6));
        container.scrollBy({ left: -amount, behavior: 'smooth' });
    }, []);

    const scrollNext = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const amount = Math.max(100, Math.floor(container.clientWidth * 0.6));
        container.scrollBy({ left: amount, behavior: 'smooth' });
    }, []);

    const scrollItemToCenter = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
        const container = containerRef.current;
        if (!container) return;
        const el = container.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
        if (!el) return;
        const elLeft = el.offsetLeft;
        const elWidth = el.offsetWidth;
        const target = elLeft + elWidth / 2 - container.clientWidth / 2;
        const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
        const left = Math.max(0, Math.min(maxScrollLeft, target));
        container.scrollTo({ left, behavior });
    }, []);

    const scrollTabToCenter = useCallback((tabId: number, behavior: ScrollBehavior = 'smooth') => {
        const container = containerRef.current;
        if (!container) return;
        const el = container.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement | null;
        if (!el) return;
        const elLeft = el.offsetLeft;
        const elWidth = el.offsetWidth;
        const target = elLeft + elWidth / 2 - container.clientWidth / 2;
        const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
        const left = Math.max(0, Math.min(maxScrollLeft, target));
        container.scrollTo({ left, behavior });
    }, []);

    // Auto-scroll only when the selected tab changes; odds updates can refresh tab data without changing selection.
    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }
        if (selectedTabId == null) return;
        scrollTabToCenter(selectedTabId, 'smooth');
    }, [selectedTabId, scrollTabToCenter]);

    if (filters.length === 0) return null;

    return (
        <div className={cn('flex items-center w-full', surfaceClasses.root)}>
            <div
                ref={containerRef}
                className="flex-1 min-w-0 overflow-x-auto hidden-scrollbar"
                style={isDesktop && maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
            >
                <div className={cn('flex', surfaceClasses.track)}>
                    {filters.map((item, idx) => (
                        <div
                            key={item.id}
                            className={cn('shrink-0', mobileOnlyTabIds?.includes(item.id) && 'md:hidden')}
                            data-index={idx}
                            data-tab-id={item.id}
                        >
                            <FilterItem
                                data={item}
                                isActive={selectedTabId === item.id}
                                surface={surface}
                                treatment={treatment}
                                onClick={() => {
                                    // center clicked item, then notify
                                    scrollItemToCenter(idx, 'smooth');
                                    onTabChange(item.id);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <CarouselInlineNav
                canScrollPrev={canScrollPrev}
                canScrollNext={canScrollNext}
                onPrev={scrollPrev}
                onNext={scrollNext}
                className={surfaceClasses.nav}
                buttonVariant={surfaceClasses.navButtonVariant}
                buttonClassName={surfaceClasses.navButton}
                iconClassName={surfaceClasses.navIcon}
            />
        </div>
    );
};
