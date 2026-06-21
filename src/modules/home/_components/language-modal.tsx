'use client';

import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { Close, Search } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { CacheKey } from '@/constants/cache';
import { LANGUAGE_DICT, type Locale, usePathname } from '@/i18n';
import { regionConfigs, useRegionCode } from '@/i18nV2';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';

export const LanguageModal: FC = () => {
    const t = useTranslations('common');
    const region = useRegionCode();
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const languageModalOpen = useUIStore((s) => s.languageModalOpen);
    const closeLanguageModal = useUIStore((s) => s.closeLanguageModal);
    const [search, setSearch] = useState('');

    const filtered =
        regionConfigs[region]?.supportLanguages
            ?.map((v) => {
                return {
                    language: v,
                    displayName: LANGUAGE_DICT[v],
                };
            })
            .filter((l) => {
                return l.displayName.toLowerCase().includes(search.toLowerCase());
            }) || [];

    const handleSelect = (lang: Locale) => {
        if (lang === locale) {
            closeLanguageModal();
            return;
        }
        closeLanguageModal();
        Cookies.set(CacheKey.I18nLanguage, lang);
        const nextUrl = new URL(window.location.href);
        nextUrl.pathname = `/${lang}${pathname}`;
        window.location.assign(nextUrl.toString());
    };

    return (
        <Modal visible={languageModalOpen} onClose={closeLanguageModal} withBg={false} closeButton={false} maskClosable>
            <div className="w-[calc(100vw-2rem)] max-w-[400px] rounded-2xl overflow-hidden bg-gradient-to-b from-brand-primary-2 from-0% to-filltext-ft-a to-[10%] p-4 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 text-center text-title-sm text-filltext-ft-g">
                        {t('languageModal.title')}
                    </div>
                    <button
                        type="button"
                        onClick={closeLanguageModal}
                        className="shrink-0 cursor-pointer text-filltext-ft-e hover:text-filltext-ft-g transition-colors"
                    >
                        <Close className="size-3.5" />
                    </button>
                </div>

                {/* Content Card */}
                <div className="bg-surface-1 rounded-2xl px-2 py-4 flex-1 flex flex-col gap-2">
                    {/* Search */}
                    <div className="group flex items-center gap-4 h-10 px-3 rounded-full bg-filltext-ft-a border border-filltext-ft-b">
                        <Search className="size-4 shrink-0 text-filltext-ft-e group-focus-within:text-filltext-ft-g" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-body-sm text-filltext-ft-g placeholder:text-filltext-ft-d"
                            placeholder={t('languageModal.search')}
                        />
                    </div>

                    {/* Selected Indicator */}
                    <div className="flex items-center h-4 text-body-sm">
                        <span className="text-filltext-ft-d">{t('languageModal.selectedLabel')}&nbsp;</span>
                        <span className="text-filltext-ft-g">{LANGUAGE_DICT[locale]}</span>
                    </div>

                    {/* Language List */}
                    <div className="flex flex-col">
                        {filtered.map((lang) => {
                            const isSelected = lang.language === locale;
                            return (
                                <button
                                    key={lang.language}
                                    type="button"
                                    onClick={() => handleSelect(lang.language)}
                                    className={cn(
                                        'flex items-center justify-between h-10 px-4 rounded-lg cursor-pointer transition-colors',
                                        isSelected ? 'bg-filltext-ft-a' : 'hover:bg-brand-primary-1',
                                    )}
                                >
                                    <span className="text-body-md text-filltext-ft-g">{lang.displayName}</span>
                                    {/* Radio indicator */}
                                    <span
                                        className={cn(
                                            'size-3.5 rounded-full border-[1.6px] border-filltext-ft-g flex items-center justify-center',
                                        )}
                                    >
                                        {isSelected && <span className="size-1.5 rounded-full bg-brand-red" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
