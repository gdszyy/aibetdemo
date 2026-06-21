'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { GetSupportPhoneInterface } from '@/api/handlers/support';
import { Toast } from '@/components/toast';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';

export const OnlineCall = () => {
    const t = useTranslations('user');
    const isMobile = useIsMobile();

    const { data: phoneData } = useQuery({
        queryKey: ['support', 'phone'],
        queryFn: GetSupportPhoneInterface,
    });

    const phone = phoneData?.ref_number || '';

    const handleCopy = () => {
        if (phone) {
            navigator.clipboard.writeText(phone);
            Toast.success(t('support.copyAll'), { id: 'copy-success' });
        }
    };

    const handleConfirm = () => {
        if (!phone) return;
        if (isMobile) {
            window.location.href = `tel:${phone}`;
        } else {
            handleCopy();
        }
    };

    return (
        <div className="h-full bg-filltext-ft-a rounded-md p-4 flex flex-col gap-4 items-center justify-start">
            {/* Conversation */}
            <div className="flex gap-4 items-start w-full justify-start">
                <div className="relative w-8 h-8 shrink-0">
                    {typeof phoneData?.avatar === 'string' && phoneData.avatar.length > 0 ? (
                        <Image
                            src={phoneData.avatar}
                            alt="Customer Support"
                            fill
                            sizes="32px"
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-filltext-ft-g" />
                    )}
                </div>
                <div className="bg-surface-1 rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-2 max-w-[80%]">
                    <span className="text-body-sm text-filltext-ft-g">{t('support.callPrompt')}</span>
                </div>
            </div>

            <span className="text-auxiliary-sm text-filltext-ft-f text-center">
                {t.rich('support.callConfirmation', {
                    phone,
                    tel: (chunks) =>
                        isMobile ? (
                            <a href={`tel:${phone}`} className="font-bold underline text-filltext-ft-g">
                                {chunks}
                            </a>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="font-bold underline text-filltext-ft-g cursor-pointer"
                            >
                                {chunks}
                            </button>
                        ),
                })}
            </span>
            {/* Action Buttons */}
            <div className="flex gap-8 items-center justify-center">
                <button
                    type="button"
                    className="cursor-pointer bg-func-lost text-neutral-white-h rounded-lg px-4 h-8 text-body-lg w-[90px] hover:opacity-90 transition-opacity"
                >
                    {t('support.no')}
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!phone}
                    className={cn(
                        'bg-func-win text-neutral-white-h rounded-lg px-4 h-8 text-body-lg w-[90px] transition-opacity',
                        phone ? 'cursor-pointer hover:opacity-90' : 'cursor-not-allowed opacity-50',
                    )}
                >
                    {t('support.yes')}
                </button>
            </div>
        </div>
    );
};
