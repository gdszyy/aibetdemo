'use client';

import Image from 'next/image';
import type { CSSProperties, FC } from 'react';
import noSlipImg from '@/assets/images/no-slip.png';
import { cn } from '@/utils/common';

interface EmptySlipProps {
    text: string;
    className?: string;
    style?: CSSProperties;
    card?: boolean;
}

export const EmptySlip: FC<EmptySlipProps> = ({ text, className, style, card = false }) => {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center',
                card ? 'rounded-sm border border-border-subtle bg-page-bg px-3 py-10' : 'py-6',
                className,
            )}
            style={style}
        >
            <div className="relative flex w-full max-w-[236px] flex-col items-center justify-center px-4">
                <div className="relative mb-4 flex size-[92px] items-center justify-center rounded-sm border border-border-subtle bg-surface-muted">
                    <Image src={noSlipImg} alt={text} fill sizes="126px" className="object-contain" />
                </div>
                <span className="z-10 text-center text-body-md font-bold text-filltext-ft-h">{text}</span>
                <span className="mt-2 text-center text-auxiliary-sm leading-4 text-filltext-ft-f">
                    Selecciona cuotas para crear tu apuesta
                </span>
            </div>
        </div>
    );
};
