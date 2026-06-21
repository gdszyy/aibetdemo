'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { useDeferredValue, useMemo, useState } from 'react';
import { GetFrontFaqListInterface } from '@/api/handlers/faq';
import { FaqDisplayPlaceEnum, type FaqFrontItem, type StandardFaqDisplayPlace } from '@/api/models/faq';
import { Empty } from '@/components/empty';
import { Search } from '@/components/icons';
import { Input } from '@/components/input/input';
import { Select } from '@/components/select/select';
import { cn } from '@/utils/common';
import { getFaqLanguageByLocale } from './faq.constants';
import { FaqAccordionItem } from './faq-accordion-item';

interface FAQProps {
    className?: string;
}

interface FaqGroup {
    title: string;
    items: FaqFrontItem[];
}

const FAQ_SKELETON_GROUP_KEYS = ['group-1', 'group-2', 'group-3'] as const;
const FAQ_SKELETON_ITEM_KEYS = ['item-1', 'item-2', 'item-3', 'item-4'] as const;

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
            'title' in item &&
            'question' in item &&
            'answer' in item &&
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.question === 'string' &&
            typeof item.answer === 'string'
        );
    });
};

const groupFaqItemsByTitle = (items: FaqFrontItem[]): FaqGroup[] => {
    const groupMap = new Map<string, FaqGroup>();

    items.forEach((item) => {
        const groupTitle = item.title.trim();
        const normalizedTitle = groupTitle.length > 0 ? groupTitle : 'Untitled';
        const existingGroup = groupMap.get(normalizedTitle);

        if (existingGroup) {
            existingGroup.items.push(item);
            return;
        }

        groupMap.set(normalizedTitle, {
            title: normalizedTitle,
            items: [item],
        });
    });

    return Array.from(groupMap.values());
};

export const FAQ = ({ className }: FAQProps) => {
    const t = useTranslations('user');
    const locale = useLocale();
    const language = getFaqLanguageByLocale(locale);
    const [displayPlace, setDisplayPlace] = useState<StandardFaqDisplayPlace>(FaqDisplayPlaceEnum.All);
    const [keyword, setKeyword] = useState('');
    const [openItemValue, setOpenItemValue] = useState<string>('');
    const deferredKeyword = useDeferredValue(keyword.trim());

    const displayPlaceOptions = useMemo(
        () => [
            {
                value: String(FaqDisplayPlaceEnum.All),
                label: t('faqPage.displayPlaces.all'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Site),
                label: t('faqPage.displayPlaces.site'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Login),
                label: t('faqPage.displayPlaces.login'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Vip),
                label: t('faqPage.displayPlaces.vip'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Cs),
                label: t('faqPage.displayPlaces.cs'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Agent),
                label: t('faqPage.displayPlaces.agent'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Deposit),
                label: t('faqPage.displayPlaces.deposit'),
            },
            {
                value: String(FaqDisplayPlaceEnum.Withdraw),
                label: t('faqPage.displayPlaces.withdraw'),
            },
        ],
        [t],
    );

    const { data, isPending, isError } = useQuery({
        queryKey: ['faq', 'front', 'faq', displayPlace, deferredKeyword],
        queryFn: () =>
            GetFrontFaqListInterface({
                display_place: displayPlace,
                language,
                keyword: deferredKeyword,
            }),
        staleTime: 5 * 60 * 1000,
    });

    const faqItems = useMemo(() => normalizeFaqItems(data), [data]);
    const groupedFaqs = useMemo(() => groupFaqItemsByTitle(faqItems), [faqItems]);

    return (
        <div className={cn('account-card flex w-full flex-col gap-4 md:min-h-75 md:h-[calc(100dvh-202px)]', className)}>
            <div className="flex items-center gap-2">
                <Select
                    value={String(displayPlace)}
                    onValueChange={(value) => setDisplayPlace(Number(value) as StandardFaqDisplayPlace)}
                    options={displayPlaceOptions}
                    className="h-9 w-35 shrink-0 rounded-full px-4 py-0 text-body-md text-filltext-ft-g md:h-10 md:w-35 md:px-5 md:text-body-lg"
                    contentClassName="w-60"
                />
                <Input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder={t('faqPage.searchPlaceholder')}
                    className="h-9 min-w-0 flex-1 rounded-full border-none bg-filltext-ft-b hover:bg-filltext-ft-b focus-within:bg-filltext-ft-b md:h-10"
                    addonBefore={
                        <div className="flex h-full items-center pl-3 text-filltext-ft-e md:pl-4">
                            <Search className="size-4 md:size-5" />
                        </div>
                    }
                />
            </div>

            <div className="flex flex-col overflow-x-hidden md:user-center-scrollbar md:min-h-0 md:flex-1 md:overflow-y-auto md:pr-3">
                {isPending ? (
                    <div className="flex flex-col gap-6">
                        {FAQ_SKELETON_GROUP_KEYS.map((groupKey) => (
                            <div key={groupKey} className="flex flex-col gap-3">
                                {FAQ_SKELETON_ITEM_KEYS.map((itemKey) => (
                                    <div
                                        key={`${groupKey}-${itemKey}`}
                                        className="h-9 animate-pulse rounded-sm bg-filltext-ft-a"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : null}

                {isError ? (
                    <div className="flex flex-1 items-center justify-center py-10 text-center text-body-md text-filltext-ft-e">
                        {t('faqPage.loadFailed')}
                    </div>
                ) : null}

                {!isPending && !isError && groupedFaqs.length === 0 ? (
                    <Empty desc={t('faqPage.empty')} className="pb-0 pt-10" />
                ) : null}

                {!isPending && !isError && groupedFaqs.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {groupedFaqs.map((group) => (
                            <section key={group.title} className="flex flex-col gap-1.5">
                                <h2 className="text-title-lg text-filltext-ft-g">{group.title}</h2>
                                <Accordion.Root
                                    type="single"
                                    collapsible
                                    className="flex flex-col"
                                    value={openItemValue}
                                    onValueChange={setOpenItemValue}
                                >
                                    {group.items.map((item) => (
                                        <FaqAccordionItem
                                            key={item.id}
                                            item={item}
                                            isOpen={openItemValue === String(item.id)}
                                        />
                                    ))}
                                </Accordion.Root>
                            </section>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
