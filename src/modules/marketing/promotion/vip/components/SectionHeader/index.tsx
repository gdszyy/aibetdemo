import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useState } from 'react';
import { cn } from '@/utils/common';

import { DetailButton } from '../DetailButton';
import { TierBenefitDetailModal } from '../TierBenefitDetailModal';

interface SectionHeaderProps {
    className?: string;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ className }) => {
    const t = useTranslations('vip');
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    return (
        <>
            <section className={cn('flex flex-row gap-6', className)}>
                <div className="flex-1">
                    <span className="text-headline-sm text-filltext-ft-h">{t('tierBenefits.title')}</span>
                    <p className="text-auxiliary-sm text-filltext-ft-f mt-1">{t('tierBenefits.description')}</p>
                </div>

                <DetailButton onClick={() => setDetailModalOpen(true)} />
            </section>

            <TierBenefitDetailModal visible={detailModalOpen} onClose={() => setDetailModalOpen(false)} />
        </>
    );
};
