'use client';

import { useTranslations } from 'next-intl';
import type { ButtonHTMLAttributes, FC } from 'react';
import { IconButton } from '@/components/icon-button';
import { ArrowDoubleDown, ArrowLeft } from '@/components/icons';
import { cn } from '@/utils/common';

interface SlipCloseActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const SlipCloseIconButton: FC<SlipCloseActionProps> = ({ className, type = 'button', ...props }) => {
    return (
        <IconButton
            icon={ArrowLeft}
            size="sm"
            shape="round"
            variant="subtle"
            type={type}
            iconClassName="size-3"
            className={cn('size-7.5', className)}
            {...props}
        />
    );
};

export const SlipClosePillButton: FC<SlipCloseActionProps> = ({ className, type = 'button', ...props }) => {
    const t = useTranslations('common');

    return (
        <button
            type={type}
            className={cn(
                'flex h-10 w-full items-center justify-center gap-2 rounded-full bg-filltext-ft-b px-4 text-body-lg text-filltext-ft-e',
                className,
            )}
            {...props}
        >
            <ArrowDoubleDown className="size-3.5" />
            <span className="uppercase">{t('action.close')}</span>
        </button>
    );
};
