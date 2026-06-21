'use client';

import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { Collapse } from '../collapse';

export const License: FunctionComponent = () => {
    const t = useTranslations('common');
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Collapse title={t('footer.licenseTitle1')}>
                <p className="text-filltext-ft-f text-body-sm font-normal leading-4.5 whitespace-pre-line">
                    {t('footer.licenseText1')}
                </p>
            </Collapse>
        );
    }

    return (
        <div className="flex-1 min-w-0 basis-1/2 flex flex-col gap-2">
            <p className="mt-4 text-body-sm text-filltext-ft-f whitespace-pre-line">
                {t('footer.licenseTitle1')}
                <br />
                {t('footer.licenseText1')}
            </p>
        </div>
    );
};
