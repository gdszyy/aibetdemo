import { useTranslations } from 'next-intl';
import type { FC } from 'react';

import { ArrowRight } from '@/components/icons';

interface DetailButtonProps {
    onClick: () => void;
}

export const DetailButton: FC<DetailButtonProps> = ({ onClick }) => {
    const t = useTranslations('vip');

    return (
        <button
            type="button"
            className="group flex h-8 md:h-10 cursor-pointer flex-row items-center gap-1 rounded-full bg-filltext-ft-h md:bg-transparent border-[0.5px] border-filltext-ft-f px-4 transition-colors duration-300 hover:bg-filltext-ft-h"
            onClick={onClick}
        >
            <span className="text-body-lg text-neutral-white-h md:text-filltext-ft-f group-hover:text-neutral-white-h">
                {t('tierBenefits.detail')}
            </span>
            <ArrowRight className="text-neutral-white-h md:text-filltext-ft-f size-3 group-hover:text-neutral-white-h" />
        </button>
    );
};
