'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { getRegionByCode } from '@/i18n';
import { useRegionCode } from '@/stores/region-store';
import { cn } from '@/utils/common';

interface KYCStepChipProps {
    currentStep?: number;
    steps?: string[];
    className?: string;
}

/**
 * KYC Step Progress Indicator Component
 * Displays the current step in the KYC verification process
 */
export const KYCStepChip: FC<KYCStepChipProps> = ({ currentStep = 1, steps, className }) => {
    const code = useRegionCode();
    const region = getRegionByCode(code);

    const t = useTranslations('user.kyc.steps');
    const localizedSteps = steps || [t('id', { label: region?.idLabel }), t('verify')];

    if (currentStep === 0) return null;
    return (
        <div className={cn('flex items-center gap-4 w-full overflow-x-auto hidden-scrollbar', className)}>
            {localizedSteps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div
                        key={step}
                        className={cn(
                            'flex items-center gap-2 px-2 py-2 rounded-full border shrink-0',
                            isActive && 'bg-surface-1 border-brand-red',
                            isCompleted && 'bg-surface-1 border-func-win',
                            !isActive && !isCompleted && 'bg-filltext-ft-b border-filltext-ft-d',
                        )}
                    >
                        {/* Step Number Badge */}
                        <div
                            className={cn(
                                'flex items-center justify-center size-3.5 rounded-xs text-auxiliary-sm leading-none text-white',
                                isActive && 'bg-brand-red',
                                isCompleted && 'bg-func-win',
                                !isActive && !isCompleted && 'bg-mini-sbd',
                            )}
                        >
                            <span className="leading-3.5 mt-px">{stepNumber}</span>
                        </div>

                        {/* Step Label */}
                        <span className="text-auxiliary-sm">{step}</span>
                    </div>
                );
            })}
        </div>
    );
};
