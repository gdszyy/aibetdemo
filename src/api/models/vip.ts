/** VIP 用户信息奖励类型 */
export enum VipRewardTypeEnum {
    /** 体育返现 */
    SportCashback = 1,
    /** 娱乐场返现 */
    CasinoCashback = 2,
    /** 升级奖励 */
    LevelUpReward = 3,
    /** 周奖励 */
    WeeklyReward = 4,
}

/** VIP 活动状态 */
export enum VipActivityStatusEnum {
    /** 进行中 */
    Ongoing = 1,
    /** 未开始 */
    NotStarted = 2,
    /** 已结束 */
    Ended = 3,
    /** 活动暂停 */
    Paused = 4,
}

/** VIP 活动状态查询结果 */
export interface GetActivityStatusRes {
    /** 状态：1-进行中，2-未开始，3-已结束，4-活动暂停 */
    status: VipActivityStatusEnum;
}

/** VIP 用户信息奖励状态 */
export enum VipUserRewardStatusEnum {
    /** 未完成 */
    Incomplete = 0,
    /** 待领取 */
    PendingClaim = 1,
    /** 已领取 */
    Claimed = 2,
    /** 一键领取 */
    OneClickClaim = 3,
}

/** VIP 奖励记录状态 */
export enum VipRewardRecordStatusEnum {
    /** 待领取 */
    PendingClaim = 0,
    /** 已领取 */
    Claimed = 1,
}

/** VIP 流水上报来源类型 */
export enum VipSourceTypeEnum {
    /** 体育 */
    Sports = 1,
    /** 娱乐场 */
    Casino = 2,
}

/** VIP 等级信息 */
export interface VipLevelInfo {
    /** 等级序号 */
    levelNo: number;
    /** 等级名称 */
    levelName: string;
    /** 等级经验 */
    levelExp: number;
    /** 维持经验 */
    maintenanceExp: number;
    /** 体育返现 */
    sportCashback: string;
    /** 娱乐场返现 */
    casinoCashback: string;
    /** 升级奖励 */
    levelUpBonus: string;
    /** 周奖励 */
    weeklyBonus: string;
    /** 是否开启 */
    open: boolean;
}

/** VIP 段位信息 */
export interface VipTierInfo {
    /** 段位名称 */
    tierName: string;
    /** 段位描述 */
    tierDesc: string;
    /** 最小等级 */
    minLevel: number;
    /** 最大等级 */
    maxLevel: number;
    /** 是否开启 */
    open: boolean;
    /** 等级列表 */
    levels: VipLevelInfo[];
}

/** VIP 段位权益状态 */
export enum VipTierRewardStatusEnum {
    /** 未开启 */
    Unavailable = 0,
    /** 已开启 */
    Available = 1,
    /** 即将开放 */
    ComingSoon = 2,
}

/** VIP 段位权益信息 */
export interface VipTierRewards {
    /** 生日奖金状态：0-未开启，1-已开启，2-即将开放 */
    birthdayBonus: VipTierRewardStatusEnum;
    /** 娱乐场返现状态：0-未开启，1-已开启，2-即将开放 */
    casinoCashback: VipTierRewardStatusEnum;
    /** 升级奖励状态：0-未开启，1-已开启，2-即将开放 */
    levelUpBonus: VipTierRewardStatusEnum;
    /** 最大等级 */
    maxLevel: number;
    /** 最小等级 */
    minLevel: number;
    /** 是否开启 */
    open: boolean;
    /** 豪华抽奖状态：0-未开启，1-已开启，2-即将开放 */
    premiumGiveaways: VipTierRewardStatusEnum;
    /** 体育返现状态：0-未开启，1-已开启，2-即将开放 */
    sportCashback: VipTierRewardStatusEnum;
    /** 段位描述 */
    tierDesc: string;
    /** 段位名称 */
    tierName: string;
    /** VIP 专属客服状态：0-未开启，1-已开启，2-即将开放 */
    vipSupport: VipTierRewardStatusEnum;
    /** 每周奖励状态：0-未开启，1-已开启，2-即将开放 */
    weeklyBonus: VipTierRewardStatusEnum;
    /** 提款特权状态：0-未开启，1-已开启，2-即将开放 */
    withdrawalBenefits: VipTierRewardStatusEnum;
}

/** VIP 权益类型 */
export enum VipBenefitTypeEnum {
    /** 体育返现 */
    SportCashback = 1,
    /** 娱乐场返现 */
    CasinoCashback = 2,
    /** 升级奖励 */
    LevelUpReward = 3,
    /** 周奖励 */
    WeeklyReward = 4,
}

/** VIP 权益项 */
export interface VipBenefitItem {
    /** 权益类型：1-Sport CashBack, 2-Casino CashBack, 3-Level-Up Reward, 4-Weekly Reward */
    type: VipBenefitTypeEnum;
    /** 当前权益 */
    current: string;
    /** 下一级权益 */
    next: string;
    /** 是否开启 */
    on: boolean;
}

/** 用户 VIP 信息中的奖励项 */
export interface RewardItem {
    /** 1-Sport CashBack, 2-Casino CashBack, 3-Level Up, 4-Weekly Reward */
    type: VipRewardTypeEnum;
    /** 币种 */
    currency: string;
    /** 金额 */
    amount: string;
    /** 0-未完成，1-待领取，3-一键领取，2-已领取 */
    status: VipUserRewardStatusEnum;
    /** 未领取的奖励总数 */
    notReceived: number;
    /** 奖励的过期倒计时 */
    countDown: number;
    /** 领取倒计时 */
    claimAvailableCountDown: number;
    /** 解锁等级 */
    unlockLevel: number;
    /** 解锁tips */
    unlockRemark: string;
    /** 是否开启 */
    on: boolean;
}

/** 用户 VIP 信息 */
export interface GetUserVipResp {
    /** 活动名称 */
    activityName: string;
    /** 活动id */
    activityId: number;
    /** 活动开始时间 */
    startTime: number;
    /** 活动结束时间 */
    endTime: number;
    /** 用户id */
    uid: string;
    /** 当前等级序号 */
    currentLevelNo: number;
    /** 当前等级名称 */
    currentLevelName: string;
    /** 当前等级经验值 */
    currentLevelExp: number;
    /** 下一级等级序号 */
    nextLevelNo: number;
    /** 下一级等级名称 */
    nextLevelName: string;
    /** 下一级等级经验值 */
    nextLevelExp: number;
    /** 当前段位 */
    tier: string;
    /** 当前权益列表 */
    benefits: VipBenefitItem[];
    /** 奖励列表 */
    rewards: RewardItem[];
}

/** VIP 流水上报产生的奖励项 */
export interface VipBetSettleRewardItem {
    /** 奖励类型 */
    rewardType: number;
    /** VIP等级 */
    vipLevelNo: number;
    /** 奖励金额 */
    rewardAmount: number;
}

/** VIP 流水上报结果 */
export interface VipBetSettleRes {
    /** 经验变动 */
    expChange: number;
    /** 当前经验 */
    currentExp: number;
    /** 处理前等级 */
    levelBefore: number;
    /** 处理后等级 */
    levelAfter: number;
    /** 是否晋级 */
    isUpgraded: boolean;
    /** 本次产生的奖励 */
    rewards: VipBetSettleRewardItem[];
}

/** 领取 VIP 奖励结果 */
export interface VipRewardClaimRes {
    /** 奖励记录ID */
    rewardId: number;
    /** 奖励金额 */
    rewardAmount: number;
    /** 领取时间 */
    claimedAt: string;
}

/** VIP 奖励记录 */
export interface VipRewardItem {
    /** 奖励记录ID */
    rewardId: number;
    /** 奖励类型 */
    rewardType: number;
    /** 奖励金额 */
    rewardAmount: number;
    /** VIP等级 */
    vipLevelNo: number;
    /** 状态：0=待领取 1=已领取 */
    status: VipRewardRecordStatusEnum;
    /** 领取时间 */
    claimedAt?: string;
    /** 创建时间 */
    createdAt: string;
}

/** 查询上周 VIP 奖励结果 */
export interface VipRewardsRes {
    /** 奖励列表 */
    list: VipRewardItem[];
}
