import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { HotOutlined } from '@/components/icons2/HotOutlined';

export const WorldCupGroupHeader: FC = () => {
    const t = useTranslations('matches');

    return (
        <div className="flex w-full flex-row gap-2 items-center pb-3">
            <HotOutlined className="size-7 shrink-0 text-brand-primary-0" />

            <span className="mt-0.5 font-roboto-flex text-title-lg text-neutral-black-h">{t('worldCupHotMatch')}</span>
        </div>
    );
};
