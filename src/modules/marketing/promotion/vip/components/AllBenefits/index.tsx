'use client';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { VipBenefitTypeEnum } from '@/api/models/vip';
import { Title } from '../Title';
import { BenefitCard, type BenefitItem } from './benefit-card';

/**
 * 全部权益组件
 */
export const AllBenefits = () => {
    const t = useTranslations('vip');

    const benefits: BenefitItem[] = useMemo(
        () => [
            {
                id: VipBenefitTypeEnum.SportCashback,
                description: t(`allBenefits.items.sportCashback.description`),
            },
            {
                id: VipBenefitTypeEnum.CasinoCashback,
                description: t(`allBenefits.items.casinoCashback.description`),
            },
            {
                id: VipBenefitTypeEnum.LevelUpReward,
                description: t(`allBenefits.items.levelUpBonus.description`),
            },
            {
                id: VipBenefitTypeEnum.WeeklyReward,
                description: t(`allBenefits.items.weeklyBonus.description`),
            },
            {
                id: 5,
                description: t(`allBenefits.items.birthdayBonus.description`),
            },
            {
                id: 6,
                description: t(`allBenefits.items.vipSupport.description`),
            },
            {
                id: 7,
                description: t(`allBenefits.items.withdrawalBenefits.description`),
            },
            {
                id: 8,
                description: t(`allBenefits.items.premiumGiveaways.description`),
            },
        ],
        [t],
    );

    return (
        <section id="vip-all-benefits" className="w-full scroll-mt-20 md:scroll-mt-28">
            <div className="mx-auto flex w-full max-w-(--main-content-max-width) flex-col items-center">
                {/* 区块标题 */}
                <Title title={t('allBenefits.title')} />

                {/* 权益卡片网格 */}
                <div className="mt-10 grid w-full grid-cols-4 gap-6 max-md:grid-cols-1 max-md:gap-4">
                    {benefits.map((item) => (
                        <BenefitCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};
