'use client';

import Image from 'next/image';
import type { FC } from 'react';
import { Button } from '@/components/button/button';
import { EmptyOutlined } from '@/components/icons2/EmptyOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import { Modal } from '@/components/modal/modal';
import ModalHeader from '../../assets/modal-header.png';

export type PassUnavailableStatus = 'notStarted' | 'ended';

interface PassUnavailableModalProps {
    /** 是否显示活动不可用弹窗 */
    visible: boolean;
    /** 活动不可用状态 */
    status: PassUnavailableStatus;
    /** 弹窗标题 */
    title: string;
    /** 弹窗说明 */
    description: string;
    /** 确认按钮文案 */
    confirmLabel: string;
    /** 确认并关闭弹窗 */
    onConfirm: () => void;
}

/** 世界杯通行证活动不可用提示弹窗。 */
export const PassUnavailableModal: FC<PassUnavailableModalProps> = ({
    visible,
    status,
    title,
    description,
    confirmLabel,
    onConfirm,
}) => {
    const isEnded = status === 'ended';

    return (
        <Modal visible={visible} onClose={onConfirm} withBg={false} closeButton={false} maskClosable={false}>
            <div className="relative flex w-105 flex-col items-center gap-6 rounded-lg bg-surface-1 px-6 py-8 text-center">
                {!isEnded && (
                    <Image
                        className="absolute -top-9.25 w-26.25 h-10 object-cover"
                        src={ModalHeader}
                        alt="Modal Header"
                    />
                )}
                <div className="flex flex-col items-center gap-4">
                    {isEnded && (
                        <div className="flex size-15 items-center justify-center rounded-full bg-filltext-ft-b text-filltext-ft-f">
                            <EmptyOutlined className="size-7.5" />
                        </div>
                    )}
                    <div className="flex flex-col gap-2 text-center">
                        {!isEnded && (
                            <div className="flex items-center justify-center gap-2">
                                <i className="flex-1 h-0.5 bg-linear-to-r from-transparent to-func-bonus" />
                                <StarFilled className="size-4 text-func-bonus" />
                                <h3 className="text-title-md uppercase text-filltext-ft-h">{title}</h3>
                                <StarFilled className="size-4 text-func-bonus" />
                                <i className="flex-1 h-0.5 bg-linear-to-l from-transparent to-func-bonus" />
                            </div>
                        )}
                        {isEnded && <h3 className="text-title-md uppercase text-filltext-ft-h">{title}</h3>}
                        <p className="whitespace-pre-line text-body-sm text-filltext-ft-g">{description}</p>
                    </div>
                </div>
                <Button block onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
};
