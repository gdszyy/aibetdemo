'use client';

import { Accordion } from 'radix-ui';
import type { ReactNode } from 'react';
import type { FaqFrontItem } from '@/api/models/faq';
import FaqQuestionBadge from '@/components/FaqQuestionBadge';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';

interface FaqAccordionItemProps {
    item: FaqFrontItem;
    isOpen: boolean;
    badge?: ReactNode;
    triggerClassName?: string;
    questionClassName?: string;
    answerClassName?: string;
    arrowClassName?: string;
}

export const FaqAccordionItem = ({
    item,
    isOpen,
    badge,
    triggerClassName,
    questionClassName,
    answerClassName,
    arrowClassName,
}: FaqAccordionItemProps) => {
    return (
        <Accordion.Item value={String(item.id)} className="border-none">
            <Accordion.Header asChild>
                <div>
                    <Accordion.Trigger asChild>
                        <button
                            type="button"
                            className={cn(
                                'group flex min-h-10 w-full cursor-pointer items-center gap-2 py-1.5 text-left',
                                triggerClassName,
                            )}
                        >
                            {badge ?? <FaqQuestionBadge active={isOpen} />}
                            <span
                                className={cn(
                                    'flex-1 text-body-lg leading-5 transition-colors',
                                    'text-filltext-ft-f group-hover:text-filltext-ft-g',
                                    'group-data-[state=open]:text-filltext-ft-g',
                                    questionClassName,
                                )}
                            >
                                {item.question}
                            </span>
                            <ArrowDown
                                className={cn(
                                    'size-3 shrink-0 text-filltext-ft-e transition-transform duration-200',
                                    'group-data-[state=open]:rotate-180',
                                    arrowClassName,
                                )}
                            />
                        </button>
                    </Accordion.Trigger>
                </div>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div
                    className={cn(
                        'pb-4 pl-7 pr-6 text-body-sm leading-5 text-filltext-ft-e',
                        '[&_a]:text-brand-primary-0 [&_a]:underline',
                        '[&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:ml-4',
                        answerClassName,
                    )}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
};
