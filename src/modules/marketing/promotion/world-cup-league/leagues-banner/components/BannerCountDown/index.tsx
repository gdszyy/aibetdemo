'use client';

import { useCountDown } from 'ahooks';
import { useTranslations } from 'next-intl';
import { type FC, useMemo, useState } from 'react';
import { IconButton } from '@/components/icon-button';
import { Close } from '@/components/icons';
import { useIsMobile } from '@/hooks/use-media-query';
import { Link, usePathname } from '@/i18n';
import { cn } from '@/utils/common';
import { WORLD_CUP_KICKOFF_TIME, WORLD_CUP_LEAGUE_ID } from '../../../constants';
import bgImg from './assets/time-bg.png';
import bgH5Img from './assets/time-bg-h5.png';

interface CloseCountDownProps {
    setIsDismissed: (show: boolean) => void;
    label: string;
    className?: string;
}

export const CloseCountDown: FC<CloseCountDownProps> = ({ label, setIsDismissed, className }) => {
    return (
        <IconButton
            aria-label={label}
            icon={Close}
            size="sm"
            shape="round"
            variant="subtle"
            type="button"
            iconClassName="size-3.5 text-neutral-white-h"
            className={cn('size-7.5 bg-neutral-black-e hover:bg-neutral-black-f', className)}
            onClick={(e) => {
                e.preventDefault();
                setIsDismissed(true);
            }}
        />
    );
};

export const CountDown: FC<{
    className?: string;
    onEnd?: () => void;
}> = ({ className, onEnd }) => {
    const t = useTranslations('promotionWorldCupLeague');
    const targetDate = useMemo(() => new Date(WORLD_CUP_KICKOFF_TIME).getTime(), []);
    const [leftTime] = useCountDown({
        targetDate,
        interval: 10 * 1000, // 10s 刷新一次
        onEnd,
    });
    const safeLeftTime = Math.max(leftTime, 0);
    const totalMinutes = Math.ceil(safeLeftTime / (60 * 1000));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return (
        <div
            className={cn(
                'bg-neutral-black-e backdrop-blur-xs text-neutral-white-h flex items-center justify-around px-10 lg:px-8 xl:px-10 py-2 rounded-sm h-13.5 w-auto max-md:mt-1 max-md:px-6 max-md:justify-between max-md:w-full',
                className,
            )}
        >
            <div className="text-center">
                <div
                    className={cn(
                        'font-roboto-flex text-2xl font-semibold leading-7 text-neutral-white-h max-md:text-lg max-md:font-poppins max-md:leading-5.5',
                    )}
                >
                    {days}
                </div>
                <div className="font-poppins text-neutral-white-f text-sm max-md:text-xs">
                    {t('worldCupCountdown.days')}
                </div>
            </div>
            <div className={cn('mx-18 w-px bg-neutral-white-f h-full max-md:mx-auto')}></div>
            <div className="text-center">
                <div
                    className={cn(
                        'font-roboto-flex text-2xl font-semibold leading-7 text-neutral-white-h max-md:text-lg max-md:font-poppins max-md:leading-5.5',
                    )}
                >
                    {hours}
                </div>
                <div className="font-poppins text-neutral-white-f text-sm max-md:text-xs">
                    {t('worldCupCountdown.hours')}
                </div>
            </div>
            <div className={cn('mx-18 w-px bg-neutral-white-f h-full max-md:mx-auto')}></div>
            <div className="text-center">
                <div
                    className={cn(
                        'font-roboto-flex text-2xl font-semibold leading-7 text-neutral-white-h max-md:text-lg max-md:font-poppins max-md:leading-5.5',
                    )}
                >
                    {minutes}
                </div>
                <div className="font-poppins text-neutral-white-f text-sm max-md:text-xs">
                    {t('worldCupCountdown.minutes')}
                </div>
            </div>
        </div>
    );
};

export const BannerCountDown: FC<{
    className?: string;
}> = ({ className }) => {
    const t = useTranslations('promotionWorldCupLeague');
    const isMobile = useIsMobile();
    const [isDismissed, setIsDismissed] = useState(false);
    const targetDate = useMemo(() => new Date(WORLD_CUP_KICKOFF_TIME).getTime(), []);
    const pathname = usePathname();
    const isWorldCupPage = pathname.startsWith(`/leagues/${WORLD_CUP_LEAGUE_ID}`);

    if (isDismissed || Date.now() >= targetDate) {
        return null;
    }

    return (
        <section
            className={cn('mb-4 overflow-hidden rounded-lg', className)}
            style={{
                backgroundImage: `url(${isMobile ? bgH5Img.src : bgImg.src})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <Link
                className={cn(
                    'flex items-center gap-x-10 px-4 py-3',
                    'max-md:py-2 max-md:flex-col lg:px-6 xl:px-8 2xl:px-11.5',
                )}
                href={`/leagues/${WORLD_CUP_LEAGUE_ID}`}
            >
                <div className={cn('flex min-w-0 flex-1 shrink-0 items-center w-full')}>
                    <div
                        className={cn(
                            'flex w-full items-center justify-between',
                            'max-md:relative max-md:justify-center',
                        )}
                    >
                        <div
                            className={cn(
                                'shrink-0 font-roboto-flex text-2xl font-semibold text-neutral-white-h',
                                'max-md:font-poppins max-md:text-lg max-md:leading-5.5',
                            )}
                        >
                            {t('worldCupCountdown.title')}
                        </div>
                        <CountDown className="flex max-md:hidden" onEnd={() => setIsDismissed(true)} />

                        <CloseCountDown
                            label={t('worldCupCountdown.close')}
                            setIsDismissed={setIsDismissed}
                            className={cn(' hidden size-6 absolute right-1', isWorldCupPage ? 'hidden' : 'max-md:flex')}
                        />
                    </div>
                </div>

                <CloseCountDown
                    label={t('worldCupCountdown.close')}
                    setIsDismissed={setIsDismissed}
                    className={cn('flex', isWorldCupPage ? 'hidden' : ' max-md:hidden')}
                />

                <CountDown className="hidden max-md:flex" onEnd={() => setIsDismissed(true)} />
            </Link>
        </section>
    );
};
