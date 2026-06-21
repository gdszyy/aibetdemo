'use client';

import { useTranslations } from 'next-intl';
import { Dialog } from 'radix-ui';
import type { FC } from 'react';
import { Close } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { useIsMobile } from '@/hooks/use-media-query';
import { useVipBaseInfoStore } from '../../services/store';
import { MobileDetailContent } from './mobile-content';
import { DetailTable } from './table';

interface TierBenefitDetailModalProps {
    onClose: () => void;
    visible: boolean;
}

export const TierBenefitDetailModal: FC<TierBenefitDetailModalProps> = ({ onClose, visible }) => {
    const t = useTranslations('vip');
    const isMobile = useIsMobile();
    const levelInfo = useVipBaseInfoStore((state) => state.levelInfo);
    const tierInfo = useVipBaseInfoStore((state) => state.tierInfo);
    const userVipInfo = useVipBaseInfoStore((state) => state.userVipInfo);
    const currentLevelNo = userVipInfo?.currentLevelNo ?? null;

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            withBg={false}
            contentClassName="max-w-[1092px] w-full p-2"
            closeButton={false}
            maskClosable
        >
            <div className="overflow-hidden rounded-md bg-filltext-ft-a shadow-lg">
                <div className="px-4">
                    <div className="border-filltext-ft-c border-b pt-3 pb-2 md:pb-5 md:mt-3 flex items-center justify-between">
                        <h2 className="text-body-md md:text-title-md text-filltext-ft-h">
                            {t('tierBenefits.detailedValues.title')}
                        </h2>

                        <Dialog.Close className="size-6 flex cursor-pointer items-center justify-center rounded-xs bg-transparent text-filltext-ft-e transition-colors stroke-filltext-ft-e hover:bg-filltext-ft-b hover:text-filltext-ft-g hover:stroke-filltext-ft-g">
                            <Close className="size-3.5 text-current" />
                        </Dialog.Close>
                    </div>
                </div>

                {isMobile ? (
                    <MobileDetailContent currentLevelNo={currentLevelNo} levels={levelInfo} tiers={tierInfo} />
                ) : (
                    <div className="max-h-[calc(100vh-140px)] overflow-auto p-4">
                        <DetailTable currentLevelNo={currentLevelNo} levels={levelInfo} />
                    </div>
                )}
            </div>
        </Modal>
    );
};
