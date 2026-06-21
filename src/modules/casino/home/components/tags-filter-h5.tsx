'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { SportHomeFilled } from '@/components/icons2/SportHomeFilled';
import { useCarousel } from '@/hooks/use-carousel';
import { usePathname, useRouter } from '@/i18n';
import { cn } from '@/utils/common';
import { updateQueryParams } from '@/utils/url-params';
import { getTagIconV2 } from '../../_constants/filter-tags';
import { usePageStore } from './page-store';

/**
 * Casino filter pill bar — dynamically rendered from API tags.
 * URL `?tag_id=` as single source of truth.
 */
export const TagsFilterH5: FunctionComponent = () => {
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
        if (!scrollTo || isLobby || tags.length === 0) {
            return;
        }
        const slideIndex = tags.findIndex((v) => v.id === activeTagId);
        if (slideIndex === -1) {
            return;
        }
        scrollTo(slideIndex + 1); // +1: Lobby button occupies slide 0
    }, [activeTagId, tags, scrollTo, isLobby]);

    const handleTagClick = useCallback(
        (tagId: number | null) => {
            updateQueryParams({ tag_id: tagId != null ? String(tagId) : null }, router, pathname, searchParams);
        },
        [router, pathname, searchParams],
    );

    const allTags = useMemo(() => {
        const res = tags.map((v) => {
            return {
                ...v,
                icon: getTagIconV2(v.tag_code),
            };
        });

        res.unshift({
            id: -99,
            tag_name: t('filter.lobby'),
            tag_code: '',
            icon: SportHomeFilled,
        });

        return res;
    }, [tags, t]);

    return (
        <div ref={emblaRef} className="overflow-hidden rounded-full bg-filltext-ft-b">
            <div className="flex items-center gap-4">
                {allTags.map((tag) => {
                    const isLobby = tag.id < 0;
                    const isActive = (isLobby && !activeTagId) || activeTagId === tag.id;
                    const Icon = tag.icon;

                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagClick(isLobby ? null : tag.id)}
                            className={cn(
                                'shrink-0 w-10 h-10 inline-flex justify-center items-center gap-x-2.5',
                                'rounded-full overflow-hidden',
                                'w-auto px-3',
                                isActive
                                    ? 'bg-brand-primary-0 text-neutral-white-h'
                                    : 'bg-filltext-ft-c text-filltext-ft-g',
                            )}
                        >
                            <Icon className={cn('size-5 text-inherit')} />
                            <span className={cn('text-body-lg')}>{tag.tag_name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
