'use client';

import { useQuery } from '@tanstack/react-query';
import type { StaticImageData } from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { GetWorldCupPassInfoInterface } from '@/api/handlers/world-cup-pass';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import { WorldCupPassCategory, type WorldCupPassInfo } from '@/api/models/world-cup-pass';
import { APP_NAME } from '@/constants';
import { generateQueryKey, ModuleKeys, WorldCupPassActions } from '@/constants/query-keys';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { useFirstRechargeCode, useRechargeCodeStore } from '@/hooks/use-recharge-code';
import type { RegionCode } from '@/i18n';
import { useRegionConfig } from '@/i18nV2';
import { useRegionCode } from '@/stores/region-store';
import { getSortedParlayBoostLadder, isActiveParlayBoostRule, toParlayBoostNumber } from '@/utils/parlay-boost-preview';
import { getCampaignStatus } from '../../_utils/campaign-time';
import { useAmount } from '../../_utils/useAmount';
import { getChampionHandicapPromotionListMeta } from '../../champion-handicap';
import { useFirstRechargeTotalReward } from '../../first-deposit-bonus/services/use-first-recharge';
import { getLuckyBetCodeTimeRange } from '../../lucky-bet-code/constants';
import { PARLAY_BOOST_PROMOTION_PATH } from '../../parlay-boost/constants';
import { getWordCupPassActivityId } from '../../world-cup-2026-pass/constants';
import ChampionHandicapBr from '../assets/champion-handicap-br.png';
import ChampionHandicapBrH5 from '../assets/champion-handicap-br-h5.png';
import ChampionHandicapMx from '../assets/champion-handicap-mx.png';
import ChampionHandicapMxH5 from '../assets/champion-handicap-mx-h5.png';
import FirstDepositBonus from '../assets/first-deposit-bonus.png';
import FirstDepositBonusH5 from '../assets/first-deposit-bonus-h5.png';
import LuckyBetCodeCasino from '../assets/lucky-bet-code-casino.png';
import LuckyBetCodeCasinoH5 from '../assets/lucky-bet-code-casino-h5.png';
import LuckyBetCodeSports from '../assets/lucky-bet-code-sports.png';
import LuckyBetCodeSportsH5 from '../assets/lucky-bet-code-sports-h5.png';
import ParlayBoost from '../assets/parlay-boost.png';
import ParlayBoostH5 from '../assets/parlay-boost-h5.png';
import WorldCupPass from '../assets/world-cup-pass.png';
import WorldCupPassH5 from '../assets/world-cup-pass-h5.png';
import type { PromotionCardItem } from '../components/PromotionCard';

/** 格式化串关加赔促销卡片的最高倍率。 */
const formatParlayBoostPromotionMultiplier = (multiplier: number, locale: string): string => {
    const formatterLocale = locale === 'pt' ? 'pt-BR' : 'en-US';

    return `${new Intl.NumberFormat(formatterLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
    }).format(multiplier)}x`;
};

/** 促销卡片支持的业务分类。 */
export type PromotionCategory = 'sport' | 'casino';

/** 促销详情页所属业务线。 */
type PromotionRoutePrefix = 'sports' | 'casino';

/**
 * 根据业务分类获取促销详情页前缀。
 * @param category 促销所属业务分类
 * @returns 对应业务线的详情页前缀
 */
const getPromotionRoutePrefix = (category: PromotionCategory): PromotionRoutePrefix =>
    category === 'sport' ? 'sports' : 'casino';

/**
 * 将通行证接口分类列表转换为促销卡片分类列表。
 * @param categories 后端返回的通行证活动分类列表
 * @returns 促销列表内部使用的业务分类列表
 */
const getPromotionCategoriesByWorldCupPassCategories = (categories: WorldCupPassCategory[]): PromotionCategory[] =>
    categories.map((category) => (category === WorldCupPassCategory.Sport ? 'sport' : 'casino'));

/** 获取活动规则最高档倍率。 */
const getParlayBoostMaxMultiplier = (rule: ParlayBoostRule): number => {
    const maxTier = getSortedParlayBoostLadder(rule).at(-1);
    if (!maxTier) return 1;

    const multiplier = toParlayBoostNumber(maxTier.multiplier);
    if (multiplier > 0) return multiplier;

    return 1 + toParlayBoostNumber(maxTier.boost);
};

/**
 * 根据活动起止时间计算展示状态。
 * @param startTime 活动开始时间
 * @param endTime 活动结束时间
 * @returns 活动展示状态
 */
const getPromotionStatusByRange = (startTime?: Date, endTime?: Date): PromotionCardItem['status'] => {
    if (!startTime || !endTime) return 'upcoming';

    const now = Date.now();
    if (now < startTime.getTime()) return 'upcoming';
    if (now > endTime.getTime()) return 'ended';
    return 'active';
};

/**
 * 组装促销列表页展示所需的活动卡片数据。
 * @returns 当前地区、语言和接口数据下的活动卡片列表
 */
export const usePromotionItems = (): PromotionCardItem[] => {
    const t = useTranslations('promotion');
    const locale = useLocale();
    const regionCode = useRegionCode();
    const worldCupPassActivityId = getWordCupPassActivityId(regionCode);

    const { data: worldCupPassInfo, isPending: isWorldCupPassLoading } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.WORLD_CUP_PASS, WorldCupPassActions.INFO, {
            activityId: worldCupPassActivityId,
        }),
        queryFn: (): Promise<WorldCupPassInfo> =>
            GetWorldCupPassInfoInterface({
                activityId: worldCupPassActivityId,
            }),
    });

    const formatAmount = useAmount();
    const regionConfig = useRegionConfig();

    const formatTime = useCallback(
        (date: Date): string => {
            return new Intl.DateTimeFormat(locale, {
                timeZone: regionConfig?.timezone || 'UTC',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }).format(date);
        },
        [locale, regionConfig?.timezone],
    );

    const isCampaignTimeLoading = useRechargeCodeStore((s) => s.loading);
    const firstActiveCampaign = useFirstRechargeCode();
    const totalReward = useFirstRechargeTotalReward();
    const { data: parlayBoostRule = null } = useParlayBoostRule();

    return useMemo((): PromotionCardItem[] => {
        const campaignStatus = getCampaignStatus(firstActiveCampaign);
        const passStartTime = worldCupPassInfo ? new Date(worldCupPassInfo.startTime * 1000) : undefined;
        const passEndTime = worldCupPassInfo ? new Date(worldCupPassInfo.endTime * 1000) : undefined;
        const passStatus = getPromotionStatusByRange(passStartTime, passEndTime);
        const luckyBetCodeTimeRange = getLuckyBetCodeTimeRange(regionCode);
        const luckyBetCodeStartTime = new Date(luckyBetCodeTimeRange.startTimestamp);
        const luckyBetCodeEndTime = new Date(luckyBetCodeTimeRange.endTimestamp);
        const luckyBetCodeStatus = getPromotionStatusByRange(luckyBetCodeStartTime, luckyBetCodeEndTime);
        const championHandicapImage: Record<RegionCode, StaticImageData> = {
            MX: ChampionHandicapMx,
            BR: ChampionHandicapBr,
        };
        const championHandicapImageH5: Record<RegionCode, StaticImageData> = {
            MX: ChampionHandicapMxH5,
            BR: ChampionHandicapBrH5,
        };
        const championHandicapMeta = getChampionHandicapPromotionListMeta(locale, regionCode);
        const worldCupPassCategories = worldCupPassInfo
            ? getPromotionCategoriesByWorldCupPassCategories(worldCupPassInfo.categories)
            : [];

        const firstDepositItems = (['sport'] as const).map((category): PromotionCardItem => {
            const routePrefix = getPromotionRoutePrefix(category);

            return {
                id: `first-deposit-bonus-${category}`,
                category,
                title: t('list.cards.firstDeposit.title', { appName: APP_NAME }),
                description: t('list.cards.firstDeposit.description', { amount: formatAmount(totalReward || 0) }),
                isHot: true,
                status: campaignStatus ?? 'upcoming',
                isCampaignTimeLoading,
                startDate: firstActiveCampaign?.start_time ? formatTime(new Date(firstActiveCampaign.start_time)) : '',
                endDate: firstActiveCampaign?.end_time ? formatTime(new Date(firstActiveCampaign.end_time)) : '',
                image: FirstDepositBonus,
                imageH5: FirstDepositBonusH5,
                href: `/${routePrefix}/promotions/first-deposit-bonus`,
            };
        });

        const worldCupPassItems = worldCupPassCategories.map((category): PromotionCardItem => {
            const routePrefix = getPromotionRoutePrefix(category);

            return {
                id: `world-cup-pass-${category}`,
                category,
                title: t('list.cards.WorldCupPass.title', { appName: APP_NAME }),
                description: t('list.cards.WorldCupPass.description', { amount: formatAmount(2000) }),
                isHot: true,
                status: passStatus,
                isCampaignTimeLoading: isWorldCupPassLoading,
                startDate: passStartTime ? formatTime(new Date(passStartTime)) : '',
                endDate: passEndTime ? formatTime(new Date(passEndTime)) : '',
                image: WorldCupPass,
                imageH5: WorldCupPassH5,
                href: `/${routePrefix}/promotions/world-cup-2026-pass`,
            };
        });

        const championHandicapItems = (['sport'] as const).map((category): PromotionCardItem => {
            const routePrefix = getPromotionRoutePrefix(category);
            const countryName = regionCode === 'BR' ? t(`list.countryNames.BR`) : t(`list.countryNames.MX`);

            return {
                id: `champion-handicap-${category}`,
                category,
                title: t('list.cards.championHandicap.title', { countryName }),
                description: t('list.cards.championHandicap.description', { countryName }),
                isHot: true,
                status: championHandicapMeta.status,
                isCampaignTimeLoading: false,
                startDate: championHandicapMeta.startDate,
                endDate: championHandicapMeta.endDate,
                image: championHandicapImage[regionCode],
                imageH5: championHandicapImageH5[regionCode],
                href: `/${routePrefix}/promotions/champion-handicap`,
            };
        });

        const luckyBetCodeItems = (['sport', 'casino'] as const).map((category): PromotionCardItem => {
            const routePrefix = getPromotionRoutePrefix(category);
            const isSport = category === 'sport';

            return {
                id: `lucky-bet-code-${category}`,
                category,
                title: t('list.cards.luckyBetCode.title'),
                description: t('list.cards.luckyBetCode.description'),
                isHot: true,
                status: luckyBetCodeStatus,
                isCampaignTimeLoading: false,
                startDate: formatTime(luckyBetCodeStartTime),
                endDate: formatTime(luckyBetCodeEndTime),
                image: isSport ? LuckyBetCodeSports : LuckyBetCodeCasino,
                imageH5: isSport ? LuckyBetCodeSportsH5 : LuckyBetCodeCasinoH5,
                href: `/${routePrefix}/promotions/lucky-bet-code`,
            };
        });

        // the sort: firstDepositItems、championHandicapItems、worldCupPassItems，parlayBoostItems、luckyBetCodeItems
        const parlayBoostItems = isActiveParlayBoostRule(parlayBoostRule)
            ? (['sport'] as const).map((category): PromotionCardItem => {
                  const startTime = new Date(parlayBoostRule.start_time * 1000);
                  const endTime = new Date(parlayBoostRule.end_time * 1000);

                  return {
                      id: `parlay-boost-${category}`,
                      category,
                      title: t('list.cards.parlayBoost.title'),
                      description: t('list.cards.parlayBoost.description', {
                          multiplier: formatParlayBoostPromotionMultiplier(
                              getParlayBoostMaxMultiplier(parlayBoostRule),
                              locale,
                          ),
                      }),
                      isHot: true,
                      status: 'active',
                      isCampaignTimeLoading: false,
                      startDate: formatTime(startTime),
                      endDate: formatTime(endTime),
                      image: ParlayBoost,
                      imageH5: ParlayBoostH5,
                      href: PARLAY_BOOST_PROMOTION_PATH,
                  };
              })
            : [];

        const res = [...firstDepositItems];
        res.push(...championHandicapItems);
        res.push(...worldCupPassItems);
        res.push(...parlayBoostItems);
        res.push(...luckyBetCodeItems);

        return res;
    }, [
        isWorldCupPassLoading,
        locale,
        regionCode,
        t,
        worldCupPassInfo,
        formatAmount,
        formatTime,
        firstActiveCampaign,
        isCampaignTimeLoading,
        totalReward,
        parlayBoostRule,
    ]);
};
