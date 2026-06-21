'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { GlobalModalAdPlacement } from '@/api/models/ad-placement';
import { Button } from '@/components/button/button';
import { Modal } from '@/components/modal/modal';
import { useAdPlacementNavigation } from '../_hooks/use-ad-placement-navigation';

interface AdPlacementModalProps {
    item: GlobalModalAdPlacement | null;
    onClose: () => void;
}

/**
 * 全局广告弹窗。
 *
 * item 为 null 时不渲染；有数据时展示标题、正文和操作按钮。
 * 主按钮会走统一广告跳转逻辑，完成跳转后关闭弹窗；无跳转广告点击主按钮时仅关闭弹窗。
 */
export const AdPlacementModal: FC<AdPlacementModalProps> = ({ item, onClose }) => {
    const t = useTranslations('common');
    const navigate = useAdPlacementNavigation();

    if (!item) return null;

    const handlePrimaryClick = () => {
        navigate(item);
        onClose();
    };

    return (
        <Modal visible={!!item} onClose={onClose} withBg={false}>
            <div className="w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-sm bg-surface-1 shadow-[0_8px_24px_0_var(--filltext-ft-d)]">
                <div className="flex flex-col gap-3 p-5">
                    <h2 className="text-title-md text-filltext-ft-g">{item.data.title ?? item.activity_name}</h2>
                    <p className="text-body-md text-filltext-ft-e whitespace-pre-wrap">
                        {item.data.content ?? item.data.text}
                    </p>
                    <div className="mt-2 flex gap-2">
                        <button
                            type="button"
                            className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-filltext-ft-a font-poppins text-body-lg text-filltext-ft-g"
                            onClick={onClose}
                        >
                            {t('dialog.cancelBtnText')}
                        </button>
                        <Button className="h-10 flex-1 p-0" onClick={handlePrimaryClick}>
                            {item.data.primary_button_text || item.data.button_text || t('dialog.confirmBtnText')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
