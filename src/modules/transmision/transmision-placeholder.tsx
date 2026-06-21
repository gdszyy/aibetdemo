'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Live2Outlined } from '@/components/icons2/Live2Outlined';

/**
 * 直播（Transmisión）占位页。
 *
 * ⚠️ 占位：直播流需后端流媒体服务 + 版权，目前仅保留入口与页面框架，
 * 布局后续按 betbus 直播大厅再细化。
 */
export const TransmisionPlaceholder: FC = () => {
    const t = useTranslations('common');

    return (
        <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-surface-1">
                <Live2Outlined className="size-8 text-brand-primary-0" />
            </span>
            <h1 className="text-title-md font-bold text-filltext-ft-h">{t('mainMenu.transmision')}</h1>
            <p className="text-body-md text-filltext-ft-f">{t('message.coming')}</p>
        </div>
    );
};
