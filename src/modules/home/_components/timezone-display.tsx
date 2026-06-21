'use client';

import { useInterval } from 'ahooks';
import { useLocale, useTranslations } from 'next-intl';
import { type FunctionComponent, useState } from 'react';
import { Toast } from '@/components/toast';
import { config } from '@/constants/config';
import { useRouter } from '@/i18n';
import { useTimezoneStore } from '@/stores/timezone-store';
import { cn } from '@/utils/common';

/** Timezone clock display */
export const TimezoneDisplay: FunctionComponent<{ className?: string }> = ({ className }) => {
    const locale = useLocale();
    const router = useRouter();
    const timezone = useTimezoneStore((state) => state.timezone);

    const [timeStr, setTimeStr] = useState('--:--');

    useInterval(
        () => {
            if (!locale || !timezone) {
                return;
            }
            setTimeStr(
                new Intl.DateTimeFormat(locale, {
                    timeZone: timezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }).format(new Date()),
            );
        },
        1000,
        { immediate: true },
    );

    const t = useTranslations('common');

    const handleClick = () => {
        if (config.isDev) {
            router.push('/test1/i18n');
        } else {
            Toast.info(t('message.coming'), { id: 'coming-soon', duration: 650 });
        }
    };

    return (
        <div className={cn('text-auxiliary-md text-filltext-ft-g cursor-pointer', className)} onClick={handleClick}>
            {timeStr}
        </div>
    );
};
