'use client';

import type { FC, ReactNode, SVGProps } from 'react';
import { useState } from 'react';
import { IconButton } from '@/components/icon-button';
import { Close, Question } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { Tooltip } from '@/components/tooltip';
import { useIsDesktop } from '@/hooks/use-media-query';

interface QuestionTooltipProps {
    title: string;
    items?: ReactNode[];
    content?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    hideTitle?: boolean;
    icon?: FC<SVGProps<SVGSVGElement>>;
}

function ContentBody({
    title,
    items,
    content,
    variant,
    hideTitle,
}: {
    title: string;
    items?: ReactNode[];
    content?: string;
    variant: 'tooltip' | 'modal';
    hideTitle?: boolean;
}) {
    const isDark = variant === 'tooltip';
    const titleClass = isDark ? 'text-auxiliary-md text-white' : 'text-auxiliary-md text-filltext-ft-g';
    const bodyClass = isDark ? 'text-auxiliary-sm text-white' : 'text-auxiliary-sm text-filltext-ft-g';
    const bulletBg = isDark ? 'bg-white' : 'bg-filltext-ft-g';

    return (
        <div className="flex flex-col gap-1">
            {!hideTitle && <p className={titleClass}>{title}:</p>}
            {items ? (
                <ul className="flex flex-col">
                    {items.map((item, index) => (
                        <li key={index.toString()} className={`flex items-start gap-2 ${bodyClass}`}>
                            <span className={`mt-1.5 size-1 shrink-0 rounded-full ${bulletBg}`} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : content ? (
                <p className={`whitespace-pre-wrap ${bodyClass}`}>{content}</p>
            ) : null}
        </div>
    );
}

export const QuestionTooltip: FC<QuestionTooltipProps> = ({
    title,
    items,
    content,
    side = 'bottom',
    hideTitle = false,
    icon = Question,
}) => {
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);

    if (isDesktop) {
        return (
            <Tooltip
                side={side}
                content={
                    <ContentBody
                        title={title}
                        items={items}
                        content={content}
                        variant="tooltip"
                        hideTitle={hideTitle}
                    />
                }
            >
                <IconButton icon={icon} size="xs" variant="ghost" shape="square" />
            </Tooltip>
        );
    }

    return (
        <>
            <IconButton icon={icon} size="xs" variant="ghost" shape="square" onClick={() => setOpen(true)} />

            <Modal visible={open} onClose={() => setOpen(false)} withBg={false} closeButton={false} blur maskClosable>
                <div className="relative w-[calc(100vw-2rem)] max-w-77 overflow-hidden rounded-md bg-surface-1 px-6 pb-8 pt-8 shadow-floating backdrop-blur-[2.5px]">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-3 top-3 inline-flex size-3.5 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g"
                    >
                        <Close className="size-3.5" />
                    </button>
                    <ContentBody title={title} items={items} content={content} variant="modal" hideTitle={hideTitle} />
                </div>
            </Modal>
        </>
    );
};
