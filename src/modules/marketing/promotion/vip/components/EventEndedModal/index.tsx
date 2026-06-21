'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Button } from '@/components/button/button';
import { EmptyOutlined } from '@/components/icons2/EmptyOutlined';
import { Modal } from '@/components/modal/modal';

interface EventEndedModalProps {
    /** 是否显示活动结束弹窗 */
    visible: boolean;
    /** 确认并跳转活动大厅 */
    onConfirm: () => void;
}

/** VIP 活动结束提示弹窗。 */
export const EventEndedModal: FC<EventEndedModalProps> = ({ visible, onConfirm }) => {
    const t = useTranslations('vip');

    return (
        <Modal visible={visible} onClose={onConfirm} withBg={false} closeButton={false} maskClosable={false}>
            <div className="flex w-89.75 flex-col items-center gap-6 rounded-lg bg-surface-1 px-6 py-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex size-15 items-center justify-center rounded-full bg-filltext-ft-b text-filltext-ft-f">
                        <EmptyOutlined className="size-7.5" />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <h3 className="text-title-md uppercase text-filltext-ft-h">{t('eventEnded.title')}</h3>
                        <p className="text-body-sm text-filltext-ft-g">{t('eventEnded.description')}</p>
                    </div>
                </div>
                <Button block onClick={onConfirm}>
                    {t('eventEnded.confirm')}
                </Button>
            </div>
        </Modal>
    );
};
