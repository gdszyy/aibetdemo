import type { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { VipBenefitTypeEnum } from '@/api/models/vip';
import { VipBenefitsBirthday } from '@/components/icons2/VipBenefitsBirthday';
import { VipBenefitsCasino } from '@/components/icons2/VipBenefitsCasino';
import { VipBenefitsLeveup } from '@/components/icons2/VipBenefitsLeveup';
import { VipBenefitsPremium } from '@/components/icons2/VipBenefitsPremium';
import { VipBenefitsSport } from '@/components/icons2/VipBenefitsSport';
import { VipBenefitsVip } from '@/components/icons2/VipBenefitsVip';
import { VipBenefitsWeekly } from '@/components/icons2/VipBenefitsWeekly';
import { VipBenefitsWithdraw } from '@/components/icons2/VipBenefitsWithdraw';
import tierIcon1 from '../assets/tier-1.png';
import tierIcon2 from '../assets/tier-2.png';
import tierIcon3 from '../assets/tier-3.png';
import tierIcon4 from '../assets/tier-4.png';
import tierIcon5 from '../assets/tier-5.png';
import tierIcon6 from '../assets/tier-6.png';
import tierIcon7 from '../assets/tier-7.png';
import tierIcon8 from '../assets/tier-8.png';
import tierIcon9 from '../assets/tier-9.png';
import tierIcon10 from '../assets/tier-10.png';
import tierIcon11 from '../assets/tier-11.png';
import tierIcon12 from '../assets/tier-12.png';
import tierIcon13 from '../assets/tier-13.png';
import tierIcon14 from '../assets/tier-14.png';

/**
 * VIP 段位图标映射
 */
export const tierIconMap: Record<number | string, StaticImageData> = {
    1: tierIcon1,
    2: tierIcon2,
    3: tierIcon3,
    4: tierIcon4,
    5: tierIcon5,
    6: tierIcon6,
    7: tierIcon7,
    8: tierIcon8,
    9: tierIcon9,
    10: tierIcon10,
    11: tierIcon11,
    12: tierIcon12,
    13: tierIcon13,
    14: tierIcon14,
};

/**
 * VIP 静态配置获取
 *
 * @returns 返回静态配置的标题和图标映射
 */
export const useVipStaticConfGetter = () => {
    const t = useTranslations('vip');

    const benefitTitleMap = useMemo(
        () => ({
            [VipBenefitTypeEnum.SportCashback]: t('allBenefits.items.sportCashback.title'),
            [VipBenefitTypeEnum.CasinoCashback]: t('allBenefits.items.casinoCashback.title'),
            [VipBenefitTypeEnum.LevelUpReward]: t('allBenefits.items.levelUpBonus.title'),
            [VipBenefitTypeEnum.WeeklyReward]: t('allBenefits.items.weeklyBonus.title'),
            5: t('allBenefits.items.birthdayBonus.title'),
            6: t('allBenefits.items.vipSupport.title'),
            7: t('allBenefits.items.withdrawalBenefits.title'),
            8: t('allBenefits.items.premiumGiveaways.title'),
        }),
        [t],
    );

    const benefitIconMap = useMemo(
        () => ({
            [VipBenefitTypeEnum.SportCashback]: VipBenefitsSport,
            [VipBenefitTypeEnum.CasinoCashback]: VipBenefitsCasino,
            [VipBenefitTypeEnum.LevelUpReward]: VipBenefitsLeveup,
            [VipBenefitTypeEnum.WeeklyReward]: VipBenefitsWeekly,
            5: VipBenefitsBirthday,
            6: VipBenefitsVip,
            7: VipBenefitsWithdraw,
            8: VipBenefitsPremium,
        }),
        [],
    );

    return {
        benefitTitleMap,
        benefitIconMap,
    };
};
