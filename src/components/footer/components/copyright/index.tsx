'use client';

import { useLocale } from 'next-intl';
import type { FunctionComponent } from 'react';
import { ArrowDown, I18N } from '@/components/icons';
import { APP_NAME } from '@/constants';
import { useIsDesktop } from '@/hooks/use-media-query';
import { LANGUAGE_DICT, type Locale } from '@/i18n';
import { useUIStore } from '@/stores/ui-store';

export const Copyright: FunctionComponent = () => {
    const locale = useLocale() as Locale;
    const isDesktop = useIsDesktop();
    const openLanguageModal = useUIStore((s) => s.openLanguageModal);

    return (
        !isDesktop && (
            <div className="mt-0 flex items-center justify-center">
                <span className="text-auxiliary-sm text-filltext-ft-e uppercase">&copy; 2026 {APP_NAME}</span>
                {false && (
                    <button
                        type="button"
                        onClick={openLanguageModal}
                        className="flex items-center gap-2 rounded-sm border border-filltext-ft-c px-4 py-2 text-auxiliary-sm text-filltext-ft-e hover:text-filltext-ft-g transition-colors cursor-pointer w-fit"
                    >
                        <I18N className="size-4" />
                        <span>{LANGUAGE_DICT[locale]}</span>
                        <ArrowDown className="size-3" />
                    </button>
                )}
            </div>
        )
    );
};
