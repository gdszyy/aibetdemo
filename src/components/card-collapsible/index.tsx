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
        <Accordion.Root className="bg-neutral-h rounded-sm px-4" type="single" defaultValue="1" collapsible>
            <Accordion.Item value="1">
                <Accordion.Header asChild>
                    <div className="h-12 flex items-center justify-between">
                        <span className="text-text-e text-title-xl">{title}</span>
                        <Accordion.Trigger asChild>
                            <span className="p-1 cursor-pointer transition-transform data-[state=open]:rotate-0 data-[state=closed]:rotate-180">
                                <ArrowUp className="size-4 text-text-c" />
                            </span>
                        </Accordion.Trigger>
                    </div>
                </Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    );
};
