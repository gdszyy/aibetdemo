'use client';

import type { FC } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible/collapsible';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const FAQItem: FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
    return (
        <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
            <CollapsibleTrigger asChild>
                <button type="button" className="group flex w-full cursor-pointer items-center gap-2 py-2 text-left">
                    <span
                        className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full text-auxiliary-md text-neutral-white-h transition-all',
                            isOpen ? 'faq-badge-active' : 'faq-badge-default group-hover:faq-badge-active',
                        )}
                    >
                        Q
                    </span>
                    <span
                        className={cn(
                            'flex-1 text-auxiliary-md transition-colors',
                            isOpen ? 'text-filltext-ft-g' : 'text-filltext-ft-f group-hover:text-filltext-ft-g',
                        )}
                    >
                        {question}
                    </span>
                    <ArrowDown
                        className={cn(
                            'size-3 shrink-0 text-filltext-ft-e transition-transform duration-200',
                            isOpen && 'rotate-180',
                        )}
                    />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="pb-2 pl-7 text-auxiliary-sm text-filltext-ft-e">{answer}</div>
            </CollapsibleContent>
        </Collapsible>
    );
};
