import Image, { type StaticImageData } from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { type FC, useCallback } from 'react';
import { ClockOutlined } from '@/components/icons2/ClockOutlined';
import { useRegionConfig } from '@/i18nV2';
import { cn } from '@/utils/common';
import { useAmount } from '../../../_utils/useAmount';
import backgroundImage from '../../assets/bg.png';
import TitleEn from '../../assets/title-en.svg';
import TitleEs from '../../assets/title-es.svg';
import TitlePt from '../../assets/title-pt.svg';
import Trophy from '../../assets/trophy.png';
import TrophyShadow from '../../assets/trophy-shadow.png';

/**
 * 头部区域
 */
export const HeaderView: FC<{
    startTime?: number;
    endTime?: number;
}> = ({ startTime, endTime }) => {
    const t = useTranslations('promotionWorldCupPass');
    const locale = useLocale();
    const formatAmount = useAmount();
    let Title: StaticImageData;
    switch (locale) {
        case 'es':
            Title = TitleEs;
            break;
        case 'pt':
            Title = TitlePt;
            break;
        default:
            Title = TitleEn;
    }
    // 判断是否有有效的时间戳
    const hasSchedule = typeof startTime === 'number' && typeof endTime === 'number';

    const regionConfig = useRegionConfig();

    const formatTime = useCallback(
        (date: Date) => {
            return new Intl.DateTimeFormat(regionConfig?.regionCode || '', {
                timeZone: regionConfig?.timezone || '',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }).format(date);
        },
        [regionConfig?.regionCode, regionConfig?.timezone],
    );

    return (
        <div
            className="relative h-90.5 w-full bg-cover bg-center"
            style={{
                backgroundImage: `url(${backgroundImage.src})`,
            }}
        >
            <div
                className={cn(
                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                    'flex flex-col items-center pt-7.25',
                    'w-50 h-full',
                )}
            >
                <Image
                    className="z-10"
                    src={Trophy.src}
                    width={Trophy.width / 2}
                    height={Trophy.height / 2}
                    alt="trophy"
                />
                <Image
                    className="absolute left-1/2 top-57.5 -translate-x-1/2"
                    src={TrophyShadow.src}
                    width={TrophyShadow.width / 2}
                    height={TrophyShadow.height / 2}
                    alt="trophy shadow"
                />
            </div>
            <Image className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-4/6" src={Title} alt="title" />
            <div className="mx-4 flex h-full items-end justify-center pb-[25.5px]">
                <div className="h-31.25 flex flex-col justify-between items-center">
                    <div
                        className={cn(
                            'flex flex-col xl:flex-row items-center gap-0 md:gap-1',
                            'rounded-full border-[0.5px] border-solid border-[#3BFFAC] px-4 py-2',
                            'bg-neutral-white-b backdrop-blur-[3.75px]',
                            'text-white text-center text-shadow-[0_4px_20px_#000] text-auxiliary-xs md:text-[20px] md:leading-5 md:font-normal',
                        )}
                    >
                        <span>{t('hero.subtitlePrefix')}</span>
                        <span className="md:text-2xl text-xl font-semibold text-[#52FF9F]">
                            {t('hero.subtitleAmount', { amount: formatAmount(2000) })}
                        </span>
                    </div>
                    {hasSchedule && (
                        <div className="flex flex-row items-center gap-0.5 h-5 font-bold font-poppins text-[#4CFF9D]">
                            <ClockOutlined className="md:w-5 w-4 md:h-5 h-4" />
                            <div className="md:text-title-sm text-[12.8px]">
                                {formatTime(new Date(startTime * 1000))} - {formatTime(new Date(endTime * 1000))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
