'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { GetVipSupportListInterface } from '@/api/handlers/support';
import type { VipSupportModel } from '@/api/models/support';
import VIPBadge from '@/assets/images/VIP-badge.png';
import { AvatarBorder, Support } from '@/components/icons';
import { Loading } from '@/components/loading/loading';
import { cn } from '@/utils/common';
import { EmptyState } from '../notification/empty-state';

interface VipSupportItemProps {
    support: VipSupportModel;
    onContact: (support: VipSupportModel) => void;
}

const VipSupportItem = ({ support, onContact }: VipSupportItemProps) => {
    const t = useTranslations('user');

    return (
        <div className="bg-surface-1 rounded-md p-4 flex items-center justify-between">
            <div className="flex gap-4 items-center relative">
                {/* Avatar */}
                <div className="relative w-12 h-12 shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden p-[1.5px]">
                        {typeof support.avatar === 'string' && support.avatar.length > 0 ? (
                            <Image
                                src={support.avatar}
                                alt={support.introduction}
                                fill
                                sizes="48px"
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-filltext-ft-c" />
                        )}
                    </div>
                    {/* Avatar Border */}
                    <AvatarBorder className="absolute inset-0 w-full h-full pointer-events-none" />
                    {/* VIP Badge */}
                    <div className="absolute right-[-10px] bottom-[-2px] flex items-center h-4 w-[42px]">
                        <Image src={VIPBadge} alt="VIP Level" fill sizes="42px" className="object-contain" />
                        <span className="absolute right-1.5 text-white text-[11px] font-bold leading-[14px]">
                            {support.support_level}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 ml-1">
                    <div className="text-filltext-ft-g text-body-lg leading-4">{support.welcome}</div>
                    <div className="text-filltext-ft-g text-xs font-medium leading-4 opacity-60">
                        {support.introduction}
                    </div>
                </div>
            </div>

            {/* Contact Button */}
            <a
                href={support.ref_number}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (!support.is_working) {
                        e.preventDefault();
                    } else {
                        onContact(support);
                    }
                }}
                className={cn(
                    'flex items-center justify-center gap-1.5 px-4 h-10 rounded-full shrink-0 w-[119px]',
                    support.is_working
                        ? 'bg-func-bonus cursor-pointer'
                        : 'bg-func-void cursor-not-allowed pointer-events-none',
                )}
            >
                <Support className="shrink-0 size-5 text-neutral-white-h" />
                <span className="text-neutral-white-h text-body-lg leading-4">{t('support.contact')}</span>
            </a>
        </div>
    );
};

export const VipSupport = () => {
    const tCommon = useTranslations('common');

    const { data, isLoading, error } = useQuery({
        queryKey: ['vipSupportList'],
        queryFn: async () => {
            const response = await GetVipSupportListInterface();
            return response;
        },
    });

    const handleContact = (_support: VipSupportModel) => {
        // TODO: Implement contact logic
    };

    if (isLoading) {
        return (
            <div className="h-full bg-filltext-ft-a rounded-md p-2 flex items-center justify-center min-h-[200px]">
                <Loading className="size-5" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full bg-filltext-ft-a rounded-md p-2 flex items-center justify-center min-h-[200px]">
                <div className="text-filltext-ft-g text-sm">{tCommon('message.networkError')}</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-full bg-filltext-ft-a rounded-md flex items-center justify-center min-h-[200px] [&>div]:pt-0">
                <EmptyState />
            </div>
        );
    }

    return (
        <div className="h-full bg-filltext-ft-a rounded-md p-2 flex flex-col gap-4 overflow-y-auto">
            {data?.map((support) => (
                <VipSupportItem key={support.id} support={support} onContact={handleContact} />
            ))}
        </div>
    );
};
