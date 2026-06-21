'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { CloseOutlined } from '@/components/icons2/CloseOutlined';
import { Modal } from '@/components/modal/modal';
import {
    ParlayBoostModalHero,
    ParlayBoostRulesBody,
    ParlayBoostRulesContent,
    type ParlayBoostRulesModalMode,
    ParlayBoostRulesSkeleton,
} from '@/components/parlay-boost-rules-content';
import { useIsMobile } from '@/hooks/use-media-query';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { cn } from '@/utils/common';
import type { ParlayBoostRulesBetContext } from '@/utils/parlay-boost-rules-context';

export type { ParlayBoostRulesBetContext };

export type { ParlayBoostRulesModalMode };
export { ParlayBoostRulesContent } from '@/components/parlay-boost-rules-content';

interface ParlayBoostRulesModalProps {
    /** 是否展示串关加赔规则弹窗 */
    visible: boolean;
    /** 关闭弹窗 */
    onClose: () => void;
    /** bet：投注场景完整规则；activity：活动说明（不含投注贡献与 payout 计算） */
    mode?: ParlayBoostRulesModalMode;
    /** 购物车实时数据；传入后展示当前合规腿数、命中档位与派彩计算。 */
    betContext?: ParlayBoostRulesBetContext;
    /** 是否请求当前活动规则。 */
    fetchRule?: boolean;
    /** 外部传入的活动规则（如订单 detail），优先于 fetchRule。 */
    rule?: ParlayBoostRule | null;
    /** 是否展示 Your bet's contribution 区块。 */
    showContributionSection?: boolean;
    /** 是否展示派彩计算区块（Open 注单列表关闭）。 */
    showPayoutCalculation?: boolean;
    /** 是否展示 Markets included in the boost 区块（Open 注单列表关闭）。 */
    showMarketsSection?: boolean;
    /** 外部详情状态，用于订单 detail 弹窗。 */
    detailState?: ParlayBoostRulesDetailState;
}

type ParlayBoostRulesDetailState = 'idle' | 'loading' | 'error';

/** 订单 detail 加载中 / 失败内容。 */
const ParlayBoostRulesAsyncContent: FC<{
    detailState: ParlayBoostRulesDetailState;
    layout: 'desktop' | 'mobile';
    mode: ParlayBoostRulesModalMode;
    showContributionSection: boolean;
    showPayoutCalculation: boolean;
    showMarketsSection: boolean;
    className?: string;
}> = ({ detailState, layout, mode, showContributionSection, showPayoutCalculation, showMarketsSection, className }) => {
    const t = useTranslations('common.parlayBoostModal');
    const minHeight = layout === 'mobile' ? 'min-h-[240px]' : 'min-h-[320px]';

    if (detailState === 'loading') {
        return (
            <ParlayBoostRulesSkeleton
                layout={layout}
                mode={mode}
                showContributionSection={showContributionSection}
                showPayoutCalculation={showPayoutCalculation}
                showMarketsSection={showMarketsSection}
                className={className}
            />
        );
    }

    if (detailState === 'error') {
        return (
            <div className={cn('flex flex-col items-center justify-center px-4 py-12', minHeight)}>
                <p className="text-center text-body-sm text-filltext-ft-f">{t('detailError')}</p>
            </div>
        );
    }

    return null;
};

/** H5 底部 sheet：拖拽条、标题栏、可滚动内容 */
const ParlayBoostRulesSheet: FC<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    mode: ParlayBoostRulesModalMode;
    rule: ParlayBoostRule | null;
    betContext?: ParlayBoostRulesBetContext;
    showContributionSection?: boolean;
    showPayoutCalculation?: boolean;
    showMarketsSection?: boolean;
    detailState?: ParlayBoostRulesDetailState;
}> = ({
    open,
    onOpenChange,
    onClose,
    mode,
    rule,
    betContext,
    showContributionSection = true,
    showPayoutCalculation = true,
    showMarketsSection = true,
    detailState = 'idle',
}) => {
    const t = useTranslations('common.parlayBoostModal');

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent
                overlayClassName="bg-black/55"
                className={cn(
                    'mx-auto flex max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden border border-neutral-white-h bg-surface-1 px-2 pb-3 pt-7',
                    'rounded-t-[24px] shadow-floating',
                    '[&>div:first-child]:hidden',
                )}
            >
                <DrawerTitle className="sr-only">{t('sheetTitle')}</DrawerTitle>

                <div className="absolute left-1/2 top-2 h-[5px] w-[35px] -translate-x-1/2 rounded-[30px] bg-filltext-ft-d" />

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-xs text-filltext-ft-f active:scale-95"
                >
                    <CloseOutlined className="size-3" />
                    <span className="sr-only">{t('close')}</span>
                </button>

                <div className="flex h-10 shrink-0 items-center justify-center border-b border-filltext-ft-c/50 pb-1">
                    <h2 className="text-title-md text-filltext-ft-h">{t('sheetTitle')}</h2>
                </div>

                <div
                    data-vaul-no-drag
                    className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain transaction-scrollbar"
                >
                    {detailState === 'idle' ? (
                        <ParlayBoostRulesContent
                            mode={mode}
                            layout="mobile"
                            rule={rule}
                            betContext={betContext}
                            showContributionSection={showContributionSection}
                            showPayoutCalculation={showPayoutCalculation}
                            showMarketsSection={showMarketsSection}
                            className="py-4"
                        />
                    ) : (
                        <ParlayBoostRulesAsyncContent
                            detailState={detailState}
                            layout="mobile"
                            mode={mode}
                            showContributionSection={showContributionSection}
                            showPayoutCalculation={showPayoutCalculation}
                            showMarketsSection={showMarketsSection}
                            className="py-4"
                        />
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

/** PC 居中弹窗：Hero 固定，正文区域滚动 */
const ParlayBoostRulesDesktopModal: FC<{
    visible: boolean;
    onClose: () => void;
    mode: ParlayBoostRulesModalMode;
    rule: ParlayBoostRule | null;
    betContext?: ParlayBoostRulesBetContext;
    showContributionSection?: boolean;
    showPayoutCalculation?: boolean;
    showMarketsSection?: boolean;
    detailState?: ParlayBoostRulesDetailState;
}> = ({
    visible,
    onClose,
    mode,
    rule,
    betContext,
    showContributionSection = true,
    showPayoutCalculation = true,
    showMarketsSection = true,
    detailState = 'idle',
}) => {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            withBg={false}
            closeButton
            contentClassName="w-[938px] max-w-[calc(100vw-48px)]"
            maskClosable
        >
            <div className="flex max-h-[calc(100dvh-48px)] flex-col overflow-hidden rounded-md bg-surface-1 px-4 pb-4 pt-14 shadow-lg">
                {detailState !== 'idle' ? (
                    <div className="min-h-0 overflow-y-auto pr-2 transaction-scrollbar">
                        <ParlayBoostRulesAsyncContent
                            detailState={detailState}
                            layout="desktop"
                            mode={mode}
                            showContributionSection={showContributionSection}
                            showPayoutCalculation={showPayoutCalculation}
                            showMarketsSection={showMarketsSection}
                        />
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-col gap-8 overflow-hidden">
                        <ParlayBoostModalHero layout="desktop" mode={mode} rule={rule} betContext={betContext} />
                        <div className="min-h-0 overflow-y-auto pr-2 transaction-scrollbar">
                            <div className="flex flex-col gap-6 pb-1">
                                <ParlayBoostRulesBody
                                    mode={mode}
                                    layout="desktop"
                                    rule={rule}
                                    betContext={betContext}
                                    showContributionSection={showContributionSection}
                                    showPayoutCalculation={showPayoutCalculation}
                                    showMarketsSection={showMarketsSection}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

/** 串关加赔规则弹窗：PC 用 Modal，H5 用 bottom sheet。 */
export const ParlayBoostRulesModal: FC<ParlayBoostRulesModalProps> = ({
    visible,
    onClose,
    mode = 'bet',
    betContext,
    fetchRule = true,
    rule: ruleProp,
    showContributionSection = true,
    showPayoutCalculation = true,
    showMarketsSection = true,
    detailState = 'idle',
}) => {
    const isMobile = useIsMobile();
    const { data: fetchedParlayBoostRule = null } = useParlayBoostRule({ enabled: fetchRule && visible });
    const parlayBoostRule = ruleProp ?? fetchedParlayBoostRule;

    const sheetProps = {
        mode,
        rule: parlayBoostRule,
        betContext,
        showContributionSection,
        showPayoutCalculation,
        showMarketsSection,
        detailState,
    };

    if (isMobile) {
        return (
            <ParlayBoostRulesSheet
                open={visible}
                onOpenChange={(open) => {
                    if (!open) {
                        onClose();
                    }
                }}
                onClose={onClose}
                {...sheetProps}
            />
        );
    }

    return <ParlayBoostRulesDesktopModal visible={visible} onClose={onClose} {...sheetProps} />;
};
