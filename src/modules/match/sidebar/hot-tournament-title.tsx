'use client';

import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { cn } from '@/utils/common';

/** 热门联赛的标题 */
export const HotTournamentTitle: FunctionComponent = () => {
    const t = useTranslations('common');

    return (
        <div className={cn('w-full h-6 flex items-center justify-center cursor-pointer')}>
            <span className={'text-filltext-ft-f text-auxiliary-xxs font-light ellipsis'}>
                -&nbsp;
                {t('sidebar.hotTournament')}
                &nbsp;-
            </span>
        </div>
    );
};
