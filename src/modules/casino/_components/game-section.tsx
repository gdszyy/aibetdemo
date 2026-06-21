'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import type { FC, ReactNode } from 'react';
import { CarouselNavButton } from '@/components/carousel-nav-button';
import { useCarousel } from '@/hooks/use-carousel';
import { useIsMobile } from '@/hooks/use-media-query';

export interface GameSectionProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    /** 隐藏左右箭头 */
    hideCarouse?: boolean;
}

/**
 * Horizontal scrollable game section with title and prev/next arrows.
 * Uses Embla Carousel for smooth scroll + WheelGesturesPlugin for PC mouse wheel.
 */
export const GameSection: FC<GameSectionProps> = ({ title, icon, children, footer, hideCarouse = false }) => {
    const isMobile = useIsMobile();

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { dragFree: true, containScroll: 'trimSnaps', slidesToScroll: isMobile ? 2 : 3, align: 'start' },
        [WheelGesturesPlugin()],
    );
    const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel(emblaApi);

    return (
        <section className="flex flex-col gap-1.5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-headline-sm text-filltext-ft-h">{title}</h2>
                </div>
                {!hideCarouse && (
                    <CarouselNavButton
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                        onPrevClick={scrollPrev}
                        onNextClick={scrollNext}
                        variant="compact"
                    />
                )}
            </div>

            {/* Embla carousel viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                {children}
            </div>
            {footer && <div className="mt-4">{footer}</div>}
        </section>
    );
};
