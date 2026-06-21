'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { RechargeCodeValidationResult } from '@/api/models/recharge-code';
import { PromotionOutlined } from '@/components/icons2/PromotionOutlined';
import { PromoValidationResult } from './promo-validation-result';

interface PromoCodeInputProps {
    value: string;
    onChange: (code: string) => void;
    validation: RechargeCodeValidationResult | null;
    isValidating: boolean;
}

export const PromoCodeInput: FC<PromoCodeInputProps> = ({ value, onChange, validation, isValidating }) => {
    const t = useTranslations('deposit.promoCode');

    return (
        <div className="flex flex-col gap-2">
            {/* Input field */}
            <div className="flex items-center gap-1 rounded-sm bg-neutral-black-a p-2">
                <PromotionOutlined className="size-5 shrink-0 text-func-bonus" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('placeholder')}
                    className="min-w-0 flex-1 overflow-hidden bg-transparent text-body-md text-filltext-ft-g text-ellipsis text-nowrap placeholder:overflow-hidden placeholder:text-ellipsis placeholder:text-filltext-ft-e placeholder:whitespace-nowrap"
                    autoComplete="off"
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="shrink-0 px-1 text-filltext-ft-e hover:text-filltext-ft-f"
                    >
                        ×
                    </button>
                )}
                {isValidating && (
                    <div className="size-4 shrink-0 animate-spin rounded-full border-2 border-filltext-ft-d border-t-filltext-ft-f" />
                )}
            </div>

            {/* Validation result */}
            {validation && !isValidating && <PromoValidationResult validation={validation} />}
        </div>
    );
};
