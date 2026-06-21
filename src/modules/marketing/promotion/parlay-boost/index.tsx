'use client';

import type { FC } from 'react';
import { Loading } from '@/components/loading/loading';
import { ParlayBoostRulesContent } from '@/components/parlay-boost-rules-content';
import { useIsMobile } from '@/hooks/use-media-query';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { cn } from '@/utils/common';
import { PromotionBackButton } from '../_components/promotion-back-button';

/** 串关加赔促销详情页：复用活动规则说明内容（与弹窗 activity 模式一致）。 */
export const ParlayBoostView: FC = () => {
    const isMobile = useIsMobile();
    const { data: rule = null, isLoading } = useParlayBoostRule();

    return (
        <div
            className={cn(
                'relative flex w-full max-w-[1000px] flex-col overflow-x-hidden bg-surface-1',
                'md:my-6 md:mx-auto md:rounded-md',
            )}
        >
            <PromotionBackButton />
            <div className="min-h-[240px] px-4 py-6 md:px-6 md:py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loading className="h-6 w-6" variant="color-red" />
                    </div>
                ) : (
                    <ParlayBoostRulesContent mode="activity" layout={isMobile ? 'mobile' : 'desktop'} rule={rule} />
                )}
            </div>
        </div>
    );
};
