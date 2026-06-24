'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { type FunctionComponent, useEffect, useMemo, useState } from 'react';
import { GetFrontFaqListInterface } from '@/api/handlers/faq';
import { FaqDisplayPlaceEnum, type FaqFrontItem } from '@/api/models/faq';
import { Empty } from '@/components/empty';
import FaqQuestionBadge from '@/components/FaqQuestionBadge';
import { ArrowDown } from '@/components/icons';
import { getFaqLanguageByLocale } from '@/modules/user-center/faq/faq.constants';
import { cn } from '@/utils/common';

// ─── Strategy: region → payment method image ───

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

/** Withdrawal Questions — FAQ accordion by language */
const QuestionsCard: FunctionComponent = () => {
    const tWithdraw = useTranslations('withdraw');
    const tUser = useTranslations('user');
    const locale = useLocale();
    const language = getFaqLanguageByLocale(locale);
    const [openItemValue, setOpenItemValue] = useState<string>('');
    const [hasInitializedDefaultOpen, setHasInitializedDefaultOpen] = useState(false);

    const { data, isPending, isError } = useQuery({
        queryKey: ['faq', 'front', 'withdraw', FaqDisplayPlaceEnum.Withdraw],
        queryFn: () =>
            GetFrontFaqListInterface({
                display_place: FaqDisplayPlaceEnum.Withdraw,
                language,
            }),
        staleTime: 5 * 60 * 1000,
    });

    const faqItems = useMemo(() => normalizeFaqItems(data), [data]);

    useEffect(() => {
        if (faqItems.length === 0 || hasInitializedDefaultOpen) {
            return;
        }

        setOpenItemValue(String(faqItems[0].id));
        setHasInitializedDefaultOpen(true);
    }, [faqItems, hasInitializedDefaultOpen]);

    return (
        <div className="account-card flex flex-col">
            <span className="mb-2 text-auxiliary-md text-filltext-ft-g">{tWithdraw('infoPanel.questionsTitle')}</span>

            {isPending ? (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={`withdraw-faq-skeleton-${index + 1}`}
                            className="h-10 animate-pulse rounded-sm bg-filltext-ft-a"
                        />
                    ))}
                </div>
            ) : null}

            {isError ? <div className="py-6 text-body-sm text-filltext-ft-e">{tUser('faqPage.loadFailed')}</div> : null}

            {!isPending && !isError && faqItems.length === 0 ? (
                <Empty desc={tUser('faqPage.empty')} className="pb-0 pt-6" />
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
                                                className="group flex w-full cursor-pointer items-center gap-2 py-2 text-left"
                                            >
                                                <FaqQuestionBadge active={isOpen} />
                                                <span
                                                    className={cn(
                                                        'flex-1 text-auxiliary-md transition-colors',
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
                                            'pb-2 pl-7 text-auxiliary-sm text-filltext-ft-e',
                                            '[&_a]:text-brand-primary-0 [&_a]:underline',
                                            '[&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:ml-4',
                                        )}
                                        // biome-ignore lint/security/noDangerouslySetInnerHtml: FAQ answers are trusted CMS/localized HTML content.
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </Accordion.Root>
            ) : null}
        </div>
    );
};

/** Right panel — payment methods + FAQ */
export const InfoPanel: FunctionComponent = () => {
    return (
        <div className="flex flex-col gap-4 mt-8">
            <QuestionsCard />
        </div>
    );
};
