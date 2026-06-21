'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { useState } from 'react';
import { GetFrontFaqListInterface } from '@/api/handlers/faq';
import { FaqDisplayPlaceEnum, type FaqFrontItem } from '@/api/models/faq';
import { Empty } from '@/components/empty';
import { getFaqLanguageByLocale } from '@/modules/user-center/faq';
import { Title } from '../Title';
import { FAQItem } from './item';

/**
 * VIP FAQ 区块，使用前台 FAQ 接口按 VIP 展示位拉取内容。
 */
export const FAQ = () => {
    const t = useTranslations('vip');
    const locale = useLocale();
    const language = getFaqLanguageByLocale(locale);
    const [openItemValue, setOpenItemValue] = useState<string>('');

    const { data, isError, isPending } = useQuery({
        queryKey: ['faq', 'front', 'vip', FaqDisplayPlaceEnum.Vip],
        queryFn: () =>
            GetFrontFaqListInterface({
                display_place: FaqDisplayPlaceEnum.Vip,
                language,
            }),
        staleTime: 5 * 60 * 1000,
    });

    const faqItems: FaqFrontItem[] = Array.isArray(data) ? data : (data?.list ?? []);

    return (
        <section className="w-full">
            <div className="flex w-full max-w-(--main-content-max-width) flex-col items-center">
                <Title title={t('faq.title')} />

                <div className="mt-10 w-full">
                    {isPending ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div
                                    key={`vip-faq-skeleton-${index + 1}`}
                                    className="h-24 animate-pulse rounded-md bg-filltext-ft-a"
                                />
                            ))}
                        </div>
                    ) : null}

                    {isError ? (
                        <div className="rounded-md border border-filltext-ft-c bg-surface-1 py-8 text-center text-body-md text-filltext-ft-e">
                            {t('faq.loadFailed')}
                        </div>
                    ) : null}

                    {!isPending && !isError && faqItems.length === 0 ? (
                        <div className="rounded-md border border-filltext-ft-c bg-surface-1">
                            <Empty desc={t('faq.empty')} className="pb-8 pt-8" />
                        </div>
                    ) : null}

                    {!isPending && !isError && faqItems.length > 0 ? (
                        <Accordion.Root
                            type="single"
                            collapsible
                            className="flex flex-col gap-2"
                            value={openItemValue}
                            onValueChange={setOpenItemValue}
                        >
                            {faqItems.map((item) => (
                                <FAQItem key={item.id} item={item} isOpen={openItemValue === String(item.id)} />
                            ))}
                        </Accordion.Root>
                    ) : null}
                </div>
            </div>
        </section>
    );
};
