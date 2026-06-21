'use client';

import type { FC } from 'react';
import { ClientOnly } from '@/components/client-only';
import { ArrowLeft } from '@/components/icons';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePathname, useRouter } from '@/i18n';
import { DetailsView } from './components/DetailsView';
import { HeaderView } from './components/HeaderView';
import { RulesView } from './components/RulesView';

/** 幸运投注码活动详情页。 */
export const LuckyBetCodeView: FC = () => {
    const isDesktop = useIsDesktop();
    const pathname = usePathname();
    const router = useRouter();
    const promotionListPath = pathname.startsWith('/casino/promotions') ? '/casino/promotions' : '/sports/promotions';

    return (
        <ClientOnly>
            <div className="px-4 py-6 max-md:p-2 max-md:pb-6">
                {!isDesktop && (
                    <div className="sticky top-2 z-10 h-0 w-fit pl-2">
                        <button
                            type="button"
                            onClick={() => router.push(promotionListPath)}
                            className="flex size-7.5 translate-y-2 cursor-pointer items-center justify-center rounded-full bg-surface-1 shadow-sm"
                        >
                            <ArrowLeft className="size-3 text-filltext-ft-e transition-colors" />
                        </button>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <HeaderView />
                    <DetailsView />
                    <RulesView />
                </div>
            </div>
        </ClientOnly>
    );
};
