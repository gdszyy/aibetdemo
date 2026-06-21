'use client';

import { type FC, useState } from 'react';
import { IconButton } from '@/components/icon-button';
import { Close, Question } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { Tooltip } from '@/components/tooltip';
import { useIsDesktop } from '@/hooks/use-media-query';

interface ModeTooltipTriggerProps {
    /** 弹窗标题。 */
    title: string;
    /** tooltip / 弹窗正文。 */
    content: string;
    /** 触发按钮样式。 */
    className?: string;
    /** 图标样式。 */
    iconClassName?: string;
}

export const ModeTooltipTrigger: FC<ModeTooltipTriggerProps> = ({ title, content, className, iconClassName }) => {
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);

    if (isDesktop) {
        return (
            <Tooltip content={content}>
                <IconButton
                    icon={Question}
                    size="xs"
                    variant="ghost"
                    shape="square"
                    className={className}
                    iconClassName={iconClassName}
                />
            </Tooltip>
        );
    }

    return (
        <>
            <IconButton
                icon={Question}
                size="xs"
                variant="ghost"
                shape="square"
                onClick={() => setOpen(true)}
                className={className}
                iconClassName={iconClassName}
            />

            <Modal visible={open} onClose={() => setOpen(false)} withBg={false} closeButton={false} blur maskClosable>
                <div className="relative w-[calc(100vw-2rem)] max-w-[308px] overflow-hidden rounded-md bg-surface-1 px-6 pb-8 pt-8 shadow-floating backdrop-blur-[2.5px]">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-3 top-3 inline-flex size-3.5 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g"
                    >
                        <Close className="size-3.5" />
                    </button>

                    <div className="flex flex-col gap-3 text-left">
                        <p className="text-auxiliary-md text-filltext-ft-g whitespace-pre-wrap">{title}</p>
                        <p className="text-auxiliary-sm text-filltext-ft-g whitespace-pre-wrap">{content}</p>
                    </div>
                </div>
            </Modal>
        </>
    );
};
