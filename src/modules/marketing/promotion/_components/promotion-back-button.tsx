'use client';

import { ArrowLeft } from '@/components/icons';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useRouter } from '@/i18n';

export const PromotionBackButton = () => {
    const router = useRouter();
    const isDesktop = useIsDesktop();

    if (isDesktop) return null;

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="group/back fixed left-4 top-[calc(3.5rem+1.5rem)] z-10 flex items-center justify-center size-10 rounded-full bg-surface-1 shadow-sm cursor-pointer"
        >
            <ArrowLeft className="size-3 text-filltext-ft-g group-hover/back:text-filltext-ft-g transition-colors" />
        </button>
    );
};
