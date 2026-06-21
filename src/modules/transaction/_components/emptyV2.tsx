'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import noContentImg from '@/assets/images/no-content.png';

export const EmptyV2: FC = () => {
    const t = useTranslations('transaction');

    return (
        <div className="w-full px-4 pt-4 pb-12 md:px-12 md:py-auto bg-surface-1 flex justify-center gap-y-3 flex-col items-center rounded-md">
            <div className="text-body-lg leading-4 text-filltext-ft-d">{t('noDataText')}</div>
            <Image src={noContentImg} alt="empty" width={114} height={72} className="object-contain" />
        </div>
    );
};
