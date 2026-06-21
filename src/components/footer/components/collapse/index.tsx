import { Accordion } from 'radix-ui';
import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { ArrowUp } from '@/components/icons';
import { cn } from '@/utils/common';

export const Collapse: FunctionComponent<
    PropsWithChildren<{
        title: ReactNode;
        titleBold?: boolean;
    }>
> = ({ children, title, titleBold = false }) => {
    return (
        <Accordion.Root className="pt-6" type="single" defaultValue="0" collapsible>
            <Accordion.Item value="1">
                <Accordion.Header asChild>
                    <Accordion.Trigger asChild>
                        <div className={cn('h-4.5 flex items-center justify-between group')}>
                            <span
                                className={cn(
                                    'text-filltext-ft-g text-body-lg',
                                    titleBold ? 'font-bold' : 'font-normal',
                                )}
                            >
                                {title}
                            </span>
                            <span
                                className={cn(
                                    'p-1 cursor-pointer transition-transform',
                                    'group-data-[state=open]:rotate-0 group-data-[state=open]:text-filltext-ft-g',
                                    'group-data-[state=closed]:rotate-180 group-data-[state=closed]:text-filltext-ft-e',
                                )}
                            >
                                <ArrowUp className="size-3" />
                            </span>
                        </div>
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="mt-4">{children}</Accordion.Content>
                <div className="mt-4 h-px w-full bg-filltext-ft-c" />
            </Accordion.Item>
        </Accordion.Root>
    );
};
