import { Decimal } from 'decimal.js-light';
import type {
    WorldCupPassMissionInfo,
    WorldCupPassMissionStatus,
    WorldCupPassRewardInfo,
} from '@/api/models/world-cup-pass';
import { WorldCupPassMissionPeriodType, WorldCupPassRewardStatus } from '@/api/models/world-cup-pass';
import type { RegionCode } from '@/i18n';
import type { TranslationFunction } from '@/i18nV2/types';

export interface MissionCardItem {
    id: string;
    title: string;
    description: string;
    current: number;
    total: number;
    currentText?: string;
    totalText?: string;
    unit: string;
    exp: number;
    status: WorldCupPassMissionStatus;
}

export interface RewardTrackItem {
    level: number;
    normalReward?: WorldCupPassRewardInfo;
    premiumReward?: WorldCupPassRewardInfo;
}

/** 带有效优惠券定义的世界杯通行证奖励。 */
export type WorldCupPassRewardWithCoupon = WorldCupPassRewardInfo & {
    /** 奖励关联的优惠券定义 */
    coupon: NonNullable<WorldCupPassRewardInfo['coupon']>;
};

const getConditionValue = (condition: number[], index = 0) => condition[index] ?? 0;

type FormatNumberFunction = (value: number) => string;
type FormatAmountFunction = (value: number) => string;

interface WorldCupPassMissionContent {
    title: string;
    description: string;
    total: number;
    unit: string;
    isAmount?: boolean;
}

const parseMissionProgress = (progress: string): number => {
    const normalizedProgress = progress.replaceAll(',', '');

    if (normalizedProgress.includes('/')) {
        const [currentValue] = normalizedProgress.split('/');
        const parsedValue = Number(currentValue);
        return Number.isFinite(parsedValue) ? parsedValue : 0;
    }

    const match = normalizedProgress.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 0;

    const parsedValue = Number(match[1]);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getDailyMissionContent = (
    missionType: number,
    condition: number[],
    t: TranslationFunction<'promotionWorldCupPass'>,
    formatNumber: FormatNumberFunction,
    formatAmount: FormatAmountFunction,
): WorldCupPassMissionContent => {
    const amount = formatAmount(getConditionValue(condition));

    switch (missionType) {
        case 1:
            return {
                title: t('missions.daily.completeSportsBet.title'),
                description: t('missions.daily.completeSportsBet.description', { amount }),
                total: 1,
                unit: t('missions.units.bets'),
            };
        case 2:
            return {
                title: t('missions.daily.sportsTurnover.title'),
                description: t('missions.daily.sportsTurnover.description', { amount }),
                total: getConditionValue(condition),
                unit: '',
                isAmount: true,
            };
        case 3:
            return {
                title: t('missions.daily.highTurnoverBonus.title'),
                description: t('missions.daily.highTurnoverBonus.description', { amount }),
                total: getConditionValue(condition),
                unit: '',
                isAmount: true,
            };
        case 4:
            return {
                title: t('missions.daily.login.title'),
                description: t('missions.daily.login.description'),
                total: 1,
                unit: t('missions.units.times'),
            };
        case 5:
            return {
                title: t('missions.daily.betsTarget.title'),
                description: t('missions.daily.betsTarget.description', {
                    count: formatNumber(getConditionValue(condition)),
                }),
                total: getConditionValue(condition),
                unit: t('missions.units.bets'),
            };
        case 6:
            return {
                title: t('missions.daily.depositTarget.title'),
                description: t('missions.daily.depositTarget.description', { amount }),
                total: getConditionValue(condition),
                unit: '',
                isAmount: true,
            };
        default:
            return {
                title: t('missions.fallbackDailyTitle', { missionType }),
                description: t('missions.fallbackCondition', { condition: condition.join(', ') }),
                total: getConditionValue(condition) || 1,
                unit: '',
            };
    }
};

const getWeeklyMissionContent = (
    missionType: number,
    condition: number[],
    t: TranslationFunction<'promotionWorldCupPass'>,
    formatNumber: FormatNumberFunction,
    formatAmount: FormatAmountFunction,
): WorldCupPassMissionContent => {
    const amount = formatAmount(getConditionValue(condition));

    switch (missionType) {
        case 1:
            return {
                title: t('missions.weekly.turnover.title'),
                description: t('missions.weekly.turnover.description', { amount }),
                total: getConditionValue(condition),
                unit: '',
                isAmount: true,
            };
        case 2:
            return {
                title: t('missions.weekly.betsTarget.title'),
                description: t('missions.weekly.betsTarget.description', {
                    count: formatNumber(getConditionValue(condition)),
                }),
                total: getConditionValue(condition),
                unit: t('missions.units.bets'),
            };
        case 3:
            return {
                title: t('missions.weekly.consecutiveDailyTasks.title'),
                description: t('missions.weekly.consecutiveDailyTasks.description', {
                    count: formatNumber(getConditionValue(condition)),
                }),
                total: getConditionValue(condition),
                unit: t('missions.units.days'),
            };
        case 4:
            return {
                title: t('missions.weekly.consecutiveBettingDays.title'),
                description: t('missions.weekly.consecutiveBettingDays.description', {
                    days: formatNumber(getConditionValue(condition)),
                    amount: formatAmount(getConditionValue(condition, 1)),
                }),
                total: getConditionValue(condition),
                unit: t('missions.units.days'),
            };
        case 5:
            return {
                title: t('missions.weekly.consecutiveLogins.title'),
                description: t('missions.weekly.consecutiveLogins.description', {
                    count: formatNumber(getConditionValue(condition)),
                }),
                total: getConditionValue(condition),
                unit: t('missions.units.days'),
            };
        case 6:
            return {
                title: t('missions.weekly.depositTarget1.title'),
                description: t('missions.weekly.depositTarget1.description', { amount }),
                total: getConditionValue(condition),
                unit: '',
                isAmount: true,
            };
        case 7:
            return {
                title: t('missions.weekly.depositTarget2.title'),
                description: t('missions.weekly.depositTarget2.description', { amount }),
                total: getConditionValue(condition),
                unit: '',
                isAmount: true,
            };
        default:
            return {
                title: t('missions.fallbackWeeklyTitle', { missionType }),
                description: t('missions.fallbackCondition', { condition: condition.join(', ') }),
                total: getConditionValue(condition) || 1,
                unit: '',
            };
    }
};

export const buildMissionItems = (
    missions: WorldCupPassMissionInfo[],
    t: TranslationFunction<'promotionWorldCupPass'>,
    formatNumber: FormatNumberFunction,
    formatAmount: FormatAmountFunction,
): MissionCardItem[] => {
    return missions.map((mission, index) => {
        const content =
            mission.periodType === WorldCupPassMissionPeriodType.Daily
                ? getDailyMissionContent(mission.missionType, mission.condition, t, formatNumber, formatAmount)
                : getWeeklyMissionContent(mission.missionType, mission.condition, t, formatNumber, formatAmount);
        const current = parseMissionProgress(mission.progress);
        const total = content.total;

        return {
            id: `${mission.periodType}-${mission.missionType}-${index}`,
            title: content.title,
            description: content.description,
            current,
            total,
            currentText: content.isAmount ? formatAmount(current) : undefined,
            totalText: content.isAmount ? formatAmount(total) : undefined,
            unit: content.unit,
            exp: mission.exp,
            status: mission.status,
        };
    });
};

export const buildRewardTrack = (
    normalRewards: WorldCupPassRewardInfo[],
    premiumRewards: WorldCupPassRewardInfo[],
): RewardTrackItem[] => {
    const rewardTrackMap = new Map<number, RewardTrackItem>();

    normalRewards.forEach((reward) => {
        rewardTrackMap.set(reward.level, {
            level: reward.level,
            normalReward: reward,
            premiumReward: rewardTrackMap.get(reward.level)?.premiumReward,
        });
    });

    premiumRewards.forEach((reward) => {
        rewardTrackMap.set(reward.level, {
            level: reward.level,
            normalReward: rewardTrackMap.get(reward.level)?.normalReward,
            premiumReward: reward,
        });
    });

    return Array.from(rewardTrackMap.values()).sort((left, right) => left.level - right.level);
};

/** 判断奖励是否包含可展示、可领取的优惠券定义。 */
export const isWorldCupPassRewardAvailable = (
    reward: WorldCupPassRewardInfo | undefined,
): reward is WorldCupPassRewardWithCoupon => {
    return Boolean(reward?.coupon && new Decimal(reward.amount).gt(0) && new Decimal(reward.count).gt(0));
};

export const isRewardUnlocked = (reward: WorldCupPassRewardInfo | undefined, currentLevel: number) => {
    if (!reward) return false;

    if (typeof reward.status === 'number') {
        return reward.status !== WorldCupPassRewardStatus.Locked;
    }

    return currentLevel >= reward.level;
};

export const isWorldCupPassRewardClaimed = (reward: WorldCupPassRewardInfo | undefined) => {
    return reward?.status === WorldCupPassRewardStatus.Claimed;
};

/** 世界杯通行证活动 ID 按地区区分，巴西和墨西哥分别配置。 */
const WORLD_CUP_PASS_ACTIVITY_ID_MAP: Record<RegionCode, number> = {
    BR: Number(process.env.NEXT_PUBLIC_ACTIVITY_WORLD_CUP_PASS_ID_BR) || -1,
    MX: Number(process.env.NEXT_PUBLIC_ACTIVITY_WORLD_CUP_PASS_ID_MX) || -1,
};

/**
 * 获取当前地区的世界杯通行证活动 ID。
 * @param regionCode 当前用户地区代码
 * @returns 对应地区的活动 ID
 */
export const getWordCupPassActivityId = (regionCode: RegionCode): number => WORLD_CUP_PASS_ACTIVITY_ID_MAP[regionCode];
