'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';
import { useCarousel } from '@/hooks/use-carousel';
import { usePathname, useRouter } from '@/i18n';
import { cn } from '@/utils/common';
import { updateQueryParams } from '@/utils/url-params';
import { getTagIconV2, LOBBY_FILTER } from '../../_constants/filter-tags';
import { usePageStore } from './page-store';

/**
 * Casino filter pill bar — dynamically rendered from API tags.
 * URL `?tag_id=` as single source of truth.
 */
export const TagsFilter: FunctionComponent = () => {
    const { tags, activeTag } = usePageStore();
    const t = useTranslations('casino');

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps', align: 'start' }, [
        WheelGesturesPlugin(),
    ]);
    const { scrollTo } = useCarousel(emblaApi);

    const activeTagId = activeTag?.id || null;
    const isLobby = !activeTagId;

    // Scroll active tag into view using Embla API — avoids scrollLeft/transform conflict
    useEffect(() => {
        if (!scrollTo || !activeTagId || tags.length === 0) {
            return;
        }
        const slideIndex = tags.findIndex((v) => v.id === activeTagId);
        if (slideIndex === -1) {
            return;
        }
        scrollTo(slideIndex + 1); // +1: Lobby button occupies slide 0
    }, [activeTagId, tags, scrollTo]);

    const handleTagClick = useCallback(
        (tagId: number | null) => {
            updateQueryParams({ tag_id: tagId != null ? String(tagId) : null }, router, pathname, searchParams);
        },
        [router, pathname, searchParams],
    );

    const LobbyIcon = isLobby && LOBBY_FILTER.activeIcon ? LOBBY_FILTER.activeIcon : LOBBY_FILTER.icon;

    return (
        <div ref={emblaRef} className="overflow-hidden rounded-full bg-filltext-ft-b">
            <div className="flex items-center gap-4 p-2">
                {/* Static Lobby pill */}
                <button
                    type="button"
                    onClick={() => handleTagClick(null)}
                    className={cn(
                        'group/pill shrink-0 inline-flex items-center gap-2 px-3 h-10 rounded-full text-body-lg transition-colors cursor-pointer',
                        isLobby ? 'bg-surface-1 text-filltext-ft-h' : 'text-filltext-ft-g hover:bg-filltext-ft-c',
                    )}
                >
                    <span
                        className={cn(
                            'flex items-center justify-center size-6 shrink-0',
                            !isLobby && 'group-hover/pill:text-filltext-ft-h',
                        )}
                    >
                        <LobbyIcon
                            className={cn(
                                'size-5 transition-transform duration-200',
                                isLobby ? 'text-brand-red' : 'group-hover/pill:scale-110',
                            )}
                        />
                    </span>
                    {t(LOBBY_FILTER.labelKey)}
                </button>

                {/* Dynamic pills from API tags */}
                {tags.map((tag) => {
                    const isActive = activeTagId === tag.id;
                    const Icon = getTagIconV2(tag.tag_code);
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagClick(tag.id)}
                            className={cn(
                                'group/pill shrink-0 inline-flex items-center gap-2 px-3 h-10 rounded-full text-body-lg transition-colors cursor-pointer',
                                isActive
                                    ? 'bg-surface-1 text-filltext-ft-h'
                                    : 'text-filltext-ft-g hover:bg-filltext-ft-c',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex items-center justify-center size-6 shrink-0',
                                    !isActive && 'group-hover/pill:text-filltext-ft-h',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'size-5 transition-transform duration-200',
                                        isActive ? 'text-brand-red' : 'group-hover/pill:scale-110',
                                    )}
                                />
                            </span>
                            {tag.tag_name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
