'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image, { type StaticImageData } from 'next/image';
import type { FC, MouseEvent } from 'react';
import { CarouselOverlayNav } from '@/components/carousel-nav-controls';
import { useCarousel } from '@/hooks/use-carousel';
import { useIsMobile } from '@/hooks/use-media-query';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';

export interface BannerItem {
    id: number;
    bgColor?: string;
    title: string;
    subtitle?: string;
    link?: string;
    imageUrl?: string | StaticImageData;
    mobileImageUrl?: string | StaticImageData;
    type?: 'promotion' | 'event' | 'announcement';
}

interface BannerCarouselProps {
    banners: BannerItem[];
    className?: string;
    autoplayInterval?: number;
    startIndex?: number;
    /** banner 展示布局：默认多卡片，single 用于整屏横幅。 */
    variant?: 'multi' | 'single';
    onBannerClick?: (banner: BannerItem) => void;
}

/**
 * Pure UI banner carousel component.
 * Data is provided externally via `banners` prop.
 */
export const BannerCarousel: FC<BannerCarouselProps> = ({
    banners,
    className,
    autoplayInterval = 3000,
    startIndex = 0,
    variant = 'multi',
    onBannerClick,
}) => {
    const isMobile = useIsMobile();
    const isSingle = variant === 'single';

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1, startIndex }, [
        Autoplay({ delay: autoplayInterval, stopOnInteraction: false, stopOnMouseEnter: true }),
    ]);
    const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel(emblaApi);
    const handleBannerClick = (banner: BannerItem) => (event: MouseEvent<HTMLAnchorElement>) => {
        if (!onBannerClick) return;

        event.preventDefault();
        onBannerClick(banner);
    };

    if (banners.length === 0) return null;

    return (
        <div className={cn('flex w-full shrink-0 flex-col', className)}>
            <div className="group relative">
                <div ref={emblaRef} className={cn('overflow-x-clip overflow-y-visible', 'rounded-lg overflow-hidden')}>
                    <div className="flex">
                        {banners.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={cn(
                                    'relative w-full min-w-0 shrink-0 grow-0 basis-full',
                                    isSingle
                                        ? 'aspect-369/130 md:aspect-970/200'
                                        : 'mr-4 aspect-360/128 md:aspect-360/128 md:basis-[calc((100%-2rem)/3)]',
                                )}
                            >
                                {/* Background card: fixed height + rounded + bgColor */}
                                {banner.link && onBannerClick ? (
                                    <a
                                        href={banner.link}
                                        onClick={handleBannerClick(banner)}
                                        className={cn(
                                            'block w-full h-full cursor-pointer rounded-lg overflow-hidden',
                                            banner.bgColor,
                                        )}
                                    >
                                        <span className="sr-only">{banner.title}</span>
                                    </a>
                                ) : banner.link ? (
                                    <Link
                                        href={banner.link}
                                        className={cn(
                                            'block w-full h-full cursor-pointer rounded-lg overflow-hidden',
                                            banner.bgColor,
                                        )}
                                    />
                                ) : (
                                    <div
                                        className={cn('block w-full h-full rounded-lg overflow-hidden', banner.bgColor)}
                                    />
                                )}
                                {/* Image: overlays the card, allowed to overflow top/bottom */}
                                {(() => {
                                    const resolvedImageUrl = (isMobile && banner.mobileImageUrl) || banner.imageUrl;
                                    if (!resolvedImageUrl) return null;

                                    const image = (
                                        <Image
                                            src={resolvedImageUrl}
                                            alt={banner.title}
                                            quality={100}
                                            width={isSingle ? 970 : 360}
                                            height={isSingle ? 200 : 128}
                                            className={cn('w-full', 'h-full object-cover rounded-lg')}
                                            priority={index === startIndex}
                                            loading={index === startIndex ? 'eager' : 'lazy'}
                                        />
                                    );

                                    return banner.link && onBannerClick ? (
                                        <a
                                            href={banner.link}
                                            onClick={handleBannerClick(banner)}
                                            className={cn(
                                                'absolute inset-x-0 bottom-0 pointer-events-auto cursor-pointer',
                                                isSingle && 'top-0',
                                            )}
                                        >
                                            {image}
                                        </a>
                                    ) : banner.link ? (
                                        <Link
                                            href={banner.link}
                                            className={cn(
                                                'absolute inset-x-0 bottom-0 pointer-events-auto cursor-pointer',
                                                isSingle && 'top-0',
                                            )}
                                        >
                                            {image}
                                        </Link>
                                    ) : (
                                        <div
                                            className={cn(
                                                'absolute inset-x-0 bottom-0 pointer-events-none',
                                                isSingle && 'top-0',
                                            )}
                                        >
                                            {image}
                                        </div>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>
                </div>
                <CarouselOverlayNav
                    canScrollPrev={canScrollPrev}
                    canScrollNext={canScrollNext}
                    onPrev={() => {
                        scrollPrev();
                        emblaApi?.plugins()?.autoplay?.reset();
                    }}
                    onNext={() => {
                        scrollNext();
                        emblaApi?.plugins()?.autoplay?.reset();
                    }}
                    prevClassName={cn(
                        'left-2 top-1/2 hidden md:flex rounded-full size-7.5',
                        isSingle ? 'bg-neutral-white-e' : 'bg-surface-1',
                    )}
                    nextClassName={cn(
                        'right-2 top-1/2 hidden md:flex rounded-full size-7.5',
                        isSingle ? 'bg-neutral-white-e' : 'bg-surface-1',
                    )}
                    iconClassName={isSingle ? 'text-neutral-white-h' : 'text-filltext-ft-e'}
                />
            </div>
        </div>
    );
};
