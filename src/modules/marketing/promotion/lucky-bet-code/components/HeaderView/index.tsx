import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { cn } from '@/utils/common';
import HeaderBackground from '../../assets/header-bg.png';
import HeaderBackgroundMobile from '../../assets/header-bg-h5.png';

/** 幸运投注码活动头部横幅。 */
export const HeaderView: FC = () => {
    const t = useTranslations('promotionLuckyBetCode');

    return (
        <header className="@container relative aspect-97/20 overflow-hidden rounded-md bg-neutral-black-h max-md:aspect-359/120">
            <Image
                src={HeaderBackground}
                alt={t('hero.title')}
                fill
                priority
                sizes="(max-width: 767px) 0px, 100vw"
                className="object-cover max-md:hidden"
            />
            <Image
                src={HeaderBackgroundMobile}
                alt={t('hero.title')}
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 16px), 0px"
                className="hidden object-cover max-md:block"
            />
            <div className="flex w-fit flex-col items-center gap-[clamp(0.25rem,0.8cqw,0.5rem)] pt-[clamp(1rem,4cqw,2.5rem)] pl-[clamp(1rem,3.2cqw,2rem)] max-md:max-w-[72cqw] max-md:gap-[clamp(0.125rem,1.1cqw,0.25rem)] max-md:pt-[clamp(1rem,8.35cqw,1.875rem)] max-md:pl-[clamp(0.5rem,3.6cqw,0.8125rem)]">
                <h1 className="w-fit whitespace-nowrap text-center font-racing-sans-one text-[clamp(1.5rem,4.8cqw,3rem)] leading-none font-normal text-neutral-white-h drop-shadow-md max-md:text-wrap max-md:text-[clamp(0.875rem,6.1cqw,1.375rem)] max-md:leading-[1.05]">
                    {t('hero.title')}
                </h1>
                <p
                    className={cn(
                        'w-fit whitespace-nowrap text-center font-racing-sans-one text-[clamp(1.25rem,3.8cqw,2.25rem)] leading-none font-normal drop-shadow-md max-md:text-wrap max-md:text-[clamp(0.8125rem,5.57cqw,1.25rem)] max-md:leading-[1.05]',
                        'bg-linear-to-b from-[#FFF49E] to-[#FFE307] bg-clip-text text-transparent',
                    )}
                >
                    {t('hero.subtitle')}
                </p>
            </div>
        </header>
    );
};
