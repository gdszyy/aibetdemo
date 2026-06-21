import { Accordion } from 'radix-ui';
import type { FC } from 'react';
import type { FaqFrontItem } from '@/api/models/faq';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';

interface FAQItemProps {
    isOpen: boolean;
    item: FaqFrontItem;
}

export const FAQItem: FC<FAQItemProps> = ({ isOpen, item }) => {
    return (
        <Accordion.Item
            value={String(item.id)}
            className={cn(
                'overflow-hidden rounded-md border-[0.5px] transition-colors',
                isOpen
                    ? 'border-filltext-ft-h bg-surface-1'
                    : 'border-filltext-ft-f bg-filltext-ft-b hover:border-filltext-ft-h hover:bg-filltext-ft-b',
            )}
        >
            <Accordion.Header asChild>
                <div>
                    <Accordion.Trigger asChild>
                        <button
                            type="button"
                            className={cn(
                                'group flex min-h-24 w-full cursor-pointer items-center gap-4 px-8 py-6.5 text-left',
                                isOpen && 'pb-4.5',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex-1 text-title-sm transition-colors',
                                    isOpen ? 'text-filltext-ft-h' : 'text-filltext-ft-f group-hover:text-filltext-ft-g',
                                )}
                            >
                                {item.question}
                            </span>
                            <span
                                className={cn(
                                    'flex size-8 shrink-0 items-center justify-center rounded-full transition-colors',
                                    isOpen ? 'bg-filltext-ft-b' : 'bg-transparent group-hover:bg-filltext-ft-b',
                                )}
                            >
                                <ArrowDown
                                    className={cn(
                                        'size-4 text-filltext-ft-f transition-[color,transform] duration-200',
                                        isOpen
                                            ? 'rotate-180 group-hover:text-filltext-ft-g'
                                            : 'group-hover:text-filltext-ft-h',
                                    )}
                                />
                            </span>
                        </button>
                    </Accordion.Trigger>
                </div>
            </Accordion.Header>

            <Accordion.Content className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]">
                <div className="min-h-0">
                    <div className="px-8 pb-8">
                        <div className="border-filltext-ft-c border-t-[0.5px] pt-5">
                            <p className="whitespace-pre-line text-body-sm leading-6 text-filltext-ft-f">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                </div>
            </Accordion.Content>
        </Accordion.Item>
    );
};
