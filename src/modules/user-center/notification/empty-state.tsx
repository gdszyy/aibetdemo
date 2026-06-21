'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import noMessageImg from '@/assets/images/no-message.png';

/**
 * Empty state component for notifications
 */
export const EmptyState: FC = () => {
    const t = useTranslations('user');
    return (
        <div className="flex flex-col items-center justify-center pt-20 pb-0 px-2 flex-1 min-h-0 w-full gap-2">
            <p className="text-sm font-bold text-filltext-ft-d text-center">{t('notification.empty')}</p>
            <div className="w-[180px] h-[100px] flex items-center justify-center relative">
                <Image src={noMessageImg} alt="empty" width={114} height={72} className="object-contain" />
            </div>
        </div>
    );
};
