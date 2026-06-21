'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { useMemo, useState } from 'react';
import { GetFrontFaqListInterface } from '@/api/handlers/faq';
import { FaqDisplayPlaceEnum, type FaqFrontItem } from '@/api/models/faq';
import { Empty } from '@/components/empty';
import FaqQuestionBadge from '@/components/FaqQuestionBadge';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';
import { getFaqLanguageByLocale } from '../faq/faq.constants';

const normalizeFaqItems = (data: unknown): FaqFrontItem[] => {
    const candidateList = Array.isArray(data)
        ? data
        : typeof data === 'object' && data !== null
          ? 'list' in data && Array.isArray(data.list)
              ? data.list
              : 'data' in data &&
                  typeof data.data === 'object' &&
                  data.data !== null &&
                  'list' in data.data &&
                  Array.isArray(data.data.list)
                ? data.data.list
                : []
          : [];

    return candidateList.filter((item): item is FaqFrontItem => {
        if (typeof item !== 'object' || item === null) {
            return false;
        }

        return (
            'id' in item &&
            'question' in item &&
            'answer' in item &&
            typeof item.id === 'number' &&
            typeof item.question === 'string' &&
            typeof item.answer === 'string'
        );
    });
};

export function AffiliateFAQ() {
    const tCommon = useTranslations('common');
    const tUser = useTranslations('user');
    const locale = useLocale();
    const language = getFaqLanguageByLocale(locale);
    const [openItemValue, setOpenItemValue] = useState<string>('');

    const { data, isPending, isError } = useQuery({
        queryKey: ['faq', 'front', 'affiliate', FaqDisplayPlaceEnum.Agent],
        queryFn: () =>
            GetFrontFaqListInterface({
                display_place: FaqDisplayPlaceEnum.Agent,
                language,
            }),
        staleTime: 5 * 60 * 1000,
    });

    const faqItems = useMemo(() => normalizeFaqItems(data), [data]);

    return (
        <section className="account-card flex flex-col pt-0">
            <div className="-mx-4 mb-3 flex h-10.5 items-center border-b-[0.5px] border-filltext-ft-c px-4">
                <h2 className="text-title-md text-filltext-ft-g">{tCommon('footer.links.faq')}</h2>
            </div>

            {isPending ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div
                            key={`affiliate-faq-skeleton-${index + 1}`}
                            className="h-10 animate-pulse rounded-sm bg-filltext-ft-a"
                        />
                    ))}
                </div>
            ) : null}

            {isError ? (
                <div className="py-8 text-center text-body-md text-filltext-ft-e">{tUser('faqPage.loadFailed')}</div>
            ) : null}

            {!isPending && !isError && faqItems.length === 0 ? (
                <Empty desc={tUser('faqPage.empty')} className="pb-0 pt-8" />
            ) : null}

            {!isPending && !isError && faqItems.length > 0 ? (
                <Accordion.Root
                    type="single"
                    collapsible
                    className="flex flex-col"
                    value={openItemValue}
                    onValueChange={setOpenItemValue}
                >
                    {faqItems.map((item) => {
                        const isOpen = openItemValue === String(item.id);

                        return (
                            <Accordion.Item key={item.id} value={String(item.id)} className="border-none">
                                <Accordion.Header asChild>
                                    <div>
                                        <Accordion.Trigger asChild>
                                            <button
                                                type="button"
                                                className="group flex w-full appearance-none cursor-pointer items-center gap-2 border-none bg-transparent py-2 text-left shadow-none"
                                            >
                                                <FaqQuestionBadge active={isOpen} />
                                                <span
                                                    className={cn(
                                                        'flex-1 text-body-lg leading-5 transition-colors',
                                                        isOpen
                                                            ? 'text-filltext-ft-g'
                                                            : 'text-filltext-ft-f group-hover:text-filltext-ft-g',
                                                    )}
                                                >
                                                    {item.question}
                                                </span>
                                                <ArrowDown
                                                    className={cn(
                                                        'size-3 shrink-0 text-filltext-ft-e transition-transform duration-200',
                                                        isOpen && 'rotate-180',
                                                    )}
                                                />
                                            </button>
                                        </Accordion.Trigger>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                    <div
                                        className={cn(
                                            'pb-2 pl-9 pr-3 text-body-sm leading-5 text-filltext-ft-e',
                                            '[&_a]:text-brand-primary-0 [&_a]:underline',
                                            '[&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:ml-4',
                                        )}
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </Accordion.Root>
            ) : null}
        </section>
    );
}
