'use client';

import { useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import type { VipTierInfo } from '@/api/models/vip';
import type { ModalProps } from '@/components/base-modal/base-modal';
import { ArrowLeft, ArrowRight } from '@/components/icons';
import { WarningCircleOutlined } from '@/components/icons2/WarningCircleOutlined';
import { Modal } from '@/components/modal/modal';
import { useVipBaseInfoStore } from '../../services/store';
import { tierIconMap } from '../../services/useVipStaticConfGetter';
import { TierRequirementItem } from './tier-requirement-item';

const getDefaultOpenTierValue = (currentLevelNo: number | undefined, tierInfo: VipTierInfo[]) => {
    const currentTier = tierInfo.find(
        (tier) =>
            currentLevelNo !== undefined &&
            currentLevelNo >= tier.minLevel &&
            currentLevelNo <= tier.maxLevel &&
            tier.open,
    );

    return currentTier?.tierName ?? tierInfo.find((tier) => tier.open)?.tierName ?? '';
};

const getTierRequirementItemId = (tier: VipTierInfo) => `vip-tier-requirement-${tier.minLevel}-${tier.maxLevel}`;

const XpCalculationSection = () => {
    const t = useTranslations('vip');
    return (
        <section className="rounded-sm bg-filltext-ft-a p-5 max-md:p-4">
            <div className="flex items-start gap-3">
                <WarningCircleOutlined className="size-[14px] max-md:size-7 mt-0.5 max-md:mt-[-4px] text-filltext-ft-e " />
                <div>
                    <p className="text-title-sm font-poppins text-filltext-ft-h">
                        {t('levelRequirements.xpCalculation.title')}
                    </p>
                    <div className="mt-[6px] text-body-md font-poppins text-filltext-ft-g flex flex-col gap-[2px]">
                        <p>{t('levelRequirements.xpCalculation.validWager')}</p>
                        <ul className="ml-2">
                            <li className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:size-1 before:rounded-full before:bg-filltext-ft-g">
                                <span>{t('levelRequirements.xpCalculation.sportsValidWager')}</span>
                                <span className="text-body-sm text-filltext-ft-f">
                                    {t('levelRequirements.xpCalculation.sportsValidWagerValue')}
                                </span>
                            </li>
                            <li className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:size-1 before:rounded-full before:bg-filltext-ft-g">
                                <span>{t('levelRequirements.xpCalculation.casinoWager')}</span>
                                <span className="text-body-sm text-filltext-ft-f">
                                    {t('levelRequirements.xpCalculation.casinoWagerValue')}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CurrentLevelSection: FC<{ currentLevelName: string }> = ({ currentLevelName }) => {
    const t = useTranslations('vip');
    return (
        <section className="rounded-sm bg-brand-primary-1 p-4">
            <span className="text-auxiliary-md font-poppins text-filltext-ft-h">{t('levelRequirements.current')}</span>
            <span className="ml-2 text-body-lg font-poppins text-brand-primary-0">{currentLevelName}</span>
        </section>
    );
};

interface TierNavigationProps {
    canGoPrevious: boolean;
    canGoNext: boolean;
    onPreviousClick: () => void;
    onNextClick: () => void;
}

const TierNavigation: FC<TierNavigationProps> = ({ canGoPrevious, canGoNext, onPreviousClick, onNextClick }) => {
    const t = useTranslations('vip');
    const buttonClassName =
        'cursor-pointer flex size-8 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-filltext-ft-d bg-surface-1 text-filltext-ft-e hover:text-filltext-ft-g';

    return (
        <div className="absolute top-26 -right-10 flex -translate-y-1/2 flex-col gap-2 max-md:hidden">
            <button
                type="button"
                className={buttonClassName}
                disabled={!canGoPrevious}
                onClick={onPreviousClick}
                aria-label={t('levelRequirements.previousTier')}
            >
                <ArrowLeft className="size-4" />
            </button>
            <button
                type="button"
                className={buttonClassName}
                disabled={!canGoNext}
                onClick={onNextClick}
                aria-label={t('levelRequirements.nextTier')}
            >
                <ArrowRight className="size-4" />
            </button>
        </div>
    );
};

/**
 * 等级需求详情弹窗
 * @returns
 */
export const LevelRequirementsModal: FC<ModalProps> = ({ visible, onClose }) => {
    const t = useTranslations('vip');
    const userVipInfo = useVipBaseInfoStore((state) => state.userVipInfo);
    const tierInfo = useVipBaseInfoStore((state) => state.tierInfo);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const previousOpenTierValueRef = useRef('');
    const defaultOpenTierValue = useMemo(
        () => getDefaultOpenTierValue(userVipInfo?.currentLevelNo, tierInfo),
        [tierInfo, userVipInfo?.currentLevelNo],
    );
    const [openTierValue, setOpenTierValue] = useState(defaultOpenTierValue);

    useEffect(() => {
        setOpenTierValue(defaultOpenTierValue);
    }, [defaultOpenTierValue]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const nextTierIndex = tierInfo.findIndex((tier) => tier.tierName === openTierValue);

        const nextTier = tierInfo.find((tier) => tier.tierName === openTierValue);
        const tierItem = nextTier
            ? scrollContainer?.querySelector<HTMLElement>(`#${getTierRequirementItemId(nextTier)}`)
            : null;
        const previousOpenTierValue = previousOpenTierValueRef.current;

        if (!scrollContainer || !tierItem) {
            previousOpenTierValueRef.current = openTierValue;
            return;
        }

        if (nextTierIndex === 0) {
            previousOpenTierValueRef.current = openTierValue;
            scrollContainer.scrollTo({
                top: 0,
            });
            return;
        }

        const animationFrameId = requestAnimationFrame(() => {
            const previousTierIndex = tierInfo.findIndex((tier) => tier.tierName === previousOpenTierValue);
            const previousTier = tierInfo[previousTierIndex];
            const previousTierItem = previousTier
                ? scrollContainer.querySelector<HTMLElement>(`#${getTierRequirementItemId(previousTier)}`)
                : null;
            const previousExpandedHeight =
                previousTierIndex >= 0 && previousTierIndex < nextTierIndex
                    ? (previousTierItem?.querySelector('[data-tier-requirement-content]')?.scrollHeight ?? 0)
                    : 0;
            const containerRect = scrollContainer.getBoundingClientRect();
            const itemRect = tierItem.getBoundingClientRect();
            const scrollPadding = 16;

            scrollContainer.scrollTo({
                top:
                    scrollContainer.scrollTop +
                    itemRect.top -
                    containerRect.top -
                    previousExpandedHeight -
                    scrollPadding,
                behavior: 'smooth',
            });
        });

        previousOpenTierValueRef.current = openTierValue;

        return () => cancelAnimationFrame(animationFrameId);
    }, [openTierValue, tierInfo]);

    const currentTierIndex = tierInfo.findIndex((tier) => tier.tierName === openTierValue);
    const canGoPrevious = currentTierIndex > 0;
    const canGoNext = currentTierIndex >= 0 && currentTierIndex < tierInfo.length - 1;

    const handleTierNavigation = (offset: -1 | 1) => {
        const nextTier = tierInfo[currentTierIndex + offset];
        if (nextTier) {
            setOpenTierValue(nextTier.tierName);
        }
    };

    return (
        <Modal
            withBg={false}
            visible={visible}
            onClose={onClose}
            closeButton
            maskClosable
            contentClassName="w-[768px] max-h-[calc(100vh-32px)] max-md:w-[calc(100vw-16px)]"
        >
            <div className="relative">
                <div className="flex max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-md bg-surface-1">
                    <header className="border-filltext-ft-c border-b px-6 py-5 max-md:px-4 max-md:py-4">
                        <h2 className="font-roboto-flex text-headline-sm text-filltext-ft-h">
                            {t('levelRequirements.title')}
                        </h2>
                    </header>

                    <div
                        ref={scrollContainerRef}
                        className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-filltext-ft-d scrollbar-track-transparent max-md:p-4"
                    >
                        {/* XP 计算规则区域 */}
                        <XpCalculationSection />
                        {/* 当前等级 */}
                        <CurrentLevelSection currentLevelName={userVipInfo?.currentLevelName || ''} />
                        {/* 段位列表 */}
                        <Accordion.Root
                            className="flex flex-col gap-4"
                            type="single"
                            collapsible
                            value={openTierValue}
                            onValueChange={setOpenTierValue}
                        >
                            {tierInfo.map((tier, index) => (
                                <div
                                    key={`${tier.tierName}-${tier.minLevel}-${tier.maxLevel}`}
                                    id={getTierRequirementItemId(tier)}
                                >
                                    <TierRequirementItem
                                        icon={tierIconMap[index + 1]}
                                        tier={tier}
                                        value={tier.tierName}
                                    />
                                </div>
                            ))}
                        </Accordion.Root>
                    </div>
                </div>
                <TierNavigation
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                    onPreviousClick={() => handleTierNavigation(-1)}
                    onNextClick={() => handleTierNavigation(1)}
                />
            </div>
        </Modal>
    );
};
