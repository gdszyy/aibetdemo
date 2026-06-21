'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ArrowRight } from '@/components/icons';
import { useIsLogin } from '@/stores/session-store';
import { cn } from '@/utils/common';
import { useVipBaseInfoStore } from '../../services/store';
import { tierIconMap } from '../../services/useVipStaticConfGetter';
import { CommonButton } from '../CommonButton';
import { LevelRequirementsModal } from '../LevelRequirementsModal';
import { BenefitCard } from './benefit-card';

/**
 * 我的 VIP 信息
 */
export const MyVIPInfo = () => {
    const isLogin = useIsLogin();
    const [levelRequireModalOpen, setLevelRequireModalOpen] = useState(false);
    const t = useTranslations('vip');
    const userVipInfo = useVipBaseInfoStore((state) => state.userVipInfo);
    const tierInfo = useVipBaseInfoStore((state) => state.tierInfo);
    const currentTierIndex = tierInfo.findIndex((item) => item.tierName === userVipInfo?.tier);
    const tierIcon = tierIconMap[currentTierIndex >= 0 ? currentTierIndex + 1 : 1];

    const progressPercent = useMemo((): number => {
        if (!userVipInfo) {
            return 0;
        }

        if (userVipInfo.nextLevelExp === 0) {
            return 100;
        }

        return Math.min((userVipInfo.currentLevelExp / userVipInfo.nextLevelExp) * 100, 100);
    }, [userVipInfo]);

    if (!isLogin) return null;

    return (
        <>
            <section className="w-full bg-surface-1 p-4 rounded-md">
                {/* 当前等级 */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Image src={tierIcon} alt={'level icon'} width={125} height={125} />
                        <div className="flex gap-1 items-end">
                            <p className="text-headline-md font-roboto-flex text-filltext-ft-h">
                                {userVipInfo?.currentLevelName}
                            </p>
                            <p className="text-body-md font-poppins text-filltext-ft-f uppercase relative top-[-2]">
                                {userVipInfo?.tier}
                            </p>
                        </div>
                    </div>
                    <CommonButton
                        className="inline-flex max-md:hidden"
                        variant="secondary"
                        onClick={() => setLevelRequireModalOpen(true)}
                        icon
                        size="large"
                    >
                        {t('myVIPInfo.viewButton')}
                    </CommonButton>
                </div>

                {/* vip进度条 */}
                <div className="mt-2 mb-4">
                    <div className="mb-3 flex flex-row items-center justify-between gap-2 ">
                        <p className="text-body-lg text-filltext-ft-h">{t('myVIPInfo.currentVip')}</p>
                        <p className="flex items-center self-auto max-md:self-end gap-1">
                            <span className="font-poppins text-body-lg text-filltext-ft-h">
                                {userVipInfo?.currentLevelExp ?? 0}
                            </span>
                            <span className="font-poppins text-body-md text-filltext-ft-f max-md:text-body-sm">/</span>
                            <span className="font-poppins text-body-md text-filltext-ft-f max-md:text-body-sm">{`${userVipInfo?.nextLevelExp ?? 0} ${t('myVIPInfo.xp')}`}</span>
                        </p>
                    </div>

                    <div className="relative h-4 w-full rounded-full bg-filltext-ft-b shadow-[inset_0_1px_4px_rgba(46,46,46,0.08)] max-md:h-3">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-brand-red transition-[width] duration-300 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                        <div
                            className={cn(
                                'absolute top-1/2 size-4 -translate-y-1/2 rounded-full border border-brand-red bg-surface-1 shadow-[0_1px_3px_rgba(46,46,46,0.18)] transition-[left] duration-300 ease-out max-md:size-3',
                                progressPercent === 0 && 'left-0',
                                progressPercent > 0 && progressPercent < 100 && '-translate-x-[70%]',
                                progressPercent >= 100 && '-translate-x-full',
                            )}
                            style={{ left: `${progressPercent}%` }}
                        />
                    </div>

                    <CommonButton
                        className="hidden max-md:mt-4 max-md:flex max-md:w-full"
                        variant="secondary"
                        onClick={() => setLevelRequireModalOpen(true)}
                    >
                        {t('myVIPInfo.viewButton')}
                    </CommonButton>
                </div>

                {/* 当前权益列表 */}
                <div className="mt-4 p-4 rounded-md bg-filltext-ft-a border border-filltext-ft-c">
                    <div className="flex flex-row items-center justify-between gap-4 max-md:flex-col max-md:items-stretch max-md:justify-start">
                        <div>
                            <p className="font-poppins text-title-sm text-filltext-ft-h mb-1">
                                {t('myVIPInfo.benefitsTitle')}
                            </p>
                            <p className="text-body-sm font-poppins text-filltext-ft-e">
                                {t('myVIPInfo.benefitsDesc')}
                            </p>
                        </div>
                        {/* Button: level > next level */}
                        <div className="w-fit flex items-center gap-1 rounded-full bg-surface-1 px-4 py-2 border border-filltext-ft-c">
                            <p className="text-title-md font-poppins text-filltext-ft-h">
                                {userVipInfo?.currentLevelName}
                            </p>
                            <ArrowRight className="size-3" color="var(--filltext-ft-e)" />
                            <p className="text-title-md font-poppins text-brand-primary-0">
                                {userVipInfo?.nextLevelName}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid w-full grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
                        {userVipInfo?.benefits.map((benefit) => (
                            <BenefitCard key={benefit.type} item={benefit} />
                        ))}
                    </div>
                </div>
            </section>
            {levelRequireModalOpen && (
                <LevelRequirementsModal
                    visible={levelRequireModalOpen}
                    onClose={() => setLevelRequireModalOpen(false)}
                />
            )}
        </>
    );
};
