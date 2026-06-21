'use client';
import { useDebounceFn } from 'ahooks';
import type useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

/** Embla 滚动的状态. */
export function useCarousel(emblaApi: EmblaApi | undefined) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [snapCount, setSnapCount] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [enable, setEnable] = useState(false);

    const updateOrigin = useCallback(() => {
        if (!emblaApi) return;
        setEnable((emblaApi.scrollSnapList().length || 0) > 1);
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setSnapCount(emblaApi.scrollSnapList().length);
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    const updateDebounce = useDebounceFn(updateOrigin, { wait: 20 });
    const update = updateDebounce.run;

    useEffect(() => {
        if (!emblaApi) return;
        update();
        // 不要用scroll，太卡了
        // emblaApi.on('scroll', update);
        emblaApi.on('select', update);
        emblaApi.on('resize', update);
        emblaApi.on('reInit', update);
        return () => {
            // emblaApi.on('scroll', update);
            emblaApi.off('select', update);
            emblaApi.off('resize', update);
            emblaApi.off('reInit', update);
        };
    }, [emblaApi, update]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    return { enable, selectedIndex, snapCount, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo };
}
