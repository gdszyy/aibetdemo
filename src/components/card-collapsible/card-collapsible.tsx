import { Accordion } from 'radix-ui';
import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { ArrowUp } from '../icons';

/** 手风琴 */
export const CardCollapsible: FunctionComponent<
    PropsWithChildren<{
        title: ReactNode;
    }>
> = ({ children, title }) => {
    return (
        <Accordion.Root className="bg-surface-1 rounded-sm" type="single" defaultValue="1" collapsible>
            <Accordion.Item value="1">
                <Accordion.Header asChild>
                    <div className="h-10 flex items-center justify-between">
                        <span className="text-filltext-ft-g text-title-md font-bold">{title}</span>
                        <Accordion.Trigger asChild>
                            <span className="h-full w-6 inline-flex items-center justify-center cursor-pointer transition-transform data-[state=open]:rotate-0 data-[state=closed]:rotate-180">
                                <ArrowUp className="size-3 text-filltext-ft-e" />
                            </span>
                        </Accordion.Trigger>
                    </div>
                </Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    );
};
