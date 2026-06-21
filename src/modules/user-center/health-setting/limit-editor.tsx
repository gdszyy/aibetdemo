'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import type { LimitConfigItem } from '@/api/models/health-setting';
import { Button } from '@/components/button/button';
import { CurrencyInput } from '@/components/currency-input/currency-input';
import { CloseBold } from '@/components/icons';

interface LimitEditorProps {
    /** Editor type */
    type: 'deposit' | 'loss';
    /** Currently effective value */
    currentValue?: LimitConfigItem | null;
    /** Close callback */
    onClose: () => void;
    /** Confirm callback (triggers password modal) */
    onConfirm: (params: { limit: number }) => void;
}

/**
 * Limit editor component (shared by Deposit/Loss)
 *
 * Inline expanded form, not a modal.
 */
export const LimitEditor: FC<LimitEditorProps> = ({ type, currentValue, onClose, onConfirm }) => {
    const t = useTranslations('user');

    const [amount, setAmount] = useState<number | undefined>();
    const [error, setError] = useState('');

    // Sync with current value
    useEffect(() => {
        if (currentValue?.limit) {
            setAmount(Number.parseFloat(currentValue.limit));
        } else {
            setAmount(undefined);
        }
        setError('');
    }, [currentValue]);

    const handleAmountChange = (val: number | undefined) => {
        setAmount(val);
        if (val && val > 0) {
            setError('');
        }
    };

    const handleConfirm = () => {
        if (!amount || amount <= 0) {
            setError(t('healthSetting.limitModal.amountRequired'));
            return;
        }

        onConfirm({
            limit: Math.trunc(amount),
        });
    };

    const title = type === 'deposit' ? t('healthSetting.depositLimit') : t('healthSetting.lossLimit');

    return (
        <div className="p-4 bg-filltext-ft-a rounded-sm mt-3">
            {/* Title row - centered layout */}
            <div className="flex items-center justify-center relative mb-4">
                <h4 className="text-body-lg text-filltext-ft-g text-center">{title}</h4>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-0 p-1 hover:opacity-70 transition-opacity cursor-pointer"
                >
                    <CloseBold className="size-[14px] text-filltext-ft-e" />
                </button>
            </div>

            {/* Period label */}
            <label className="text-filltext-ft-g mb-2 block text-auxiliary-md">
                {t('healthSetting.limitModal.weekly')}
            </label>

            {/* Amount input */}
            <CurrencyInput
                value={amount}
                onChange={handleAmountChange}
                error={Boolean(error)}
                allowDecimals={false}
                placeholder=""
            />

            {/* Error message */}
            {error && <p className="text-auxiliary-sm text-brand-red mt-2">{error}</p>}

            {/* Confirm button */}
            <Button block className="mt-4 rounded-full" onClick={handleConfirm}>
                {t('healthSetting.confirm')}
            </Button>
        </div>
    );
};
