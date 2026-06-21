'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import noMatchesImg from '@/assets/images/no-matches.png';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';

/** 数据为空 */
export const Empty: FC<{ desc?: string; className?: string; showBackButton?: boolean }> = ({
    desc,
    className,
    showBackButton = false,
}) => {
    const t = useTranslations('matches');

    return (
        <div className={cn('flex flex-col items-center gap-11.5 pb-7.5 pt-14', className)}>
            <div className="relative">
                <div className="absolute top-3.25 text-nowrap left-1/2 text-headline-sm text-filltext-ft-d -translate-x-1/2">
                    {desc ?? t('noMatchesAvailable')}
                </div>
                <Image
                    src={noMatchesImg}
                    alt="no matches"
                    width={280}
                    height={160}
                    className="w-70 h-40"
                    loading="eager"
                />
            </div>
            {showBackButton && (
                <Link
                    href="/sports"
                    className="bg-brand-red flex items-center justify-center px-4 h-10 rounded-full cursor-pointer"
                >
                    <span className="text-body-lg text-neutral-white-h whitespace-nowrap">{t('backHome')}</span>
                </Link>
            )}
        </div>
    );
};
