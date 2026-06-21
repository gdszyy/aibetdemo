/** 任务周期类型 */
export enum WorldCupPassMissionPeriodType {
    /** 每日任务 */
    Daily = 1,
    /** 每周任务 */
    Weekly = 2,
}

/** 任务领取状态 */
export enum WorldCupPassMissionStatus {
    /** 任务未完成 */
    Unfinished = 0,
    /** 任务已完成但未领取 */
    Claimable = 1,
    /** 任务已完成且已领取 */
    Claimed = 2,
}

/** 奖励领取状态 */
export enum WorldCupPassRewardStatus {
    /** 奖励未解锁 */
    Locked = 0,
    /** 奖励可领取 */
    Claimable = 1,
    /** 奖励已领取 */
    Claimed = 2,
}

/** 通行证类型 */
export enum WorldCupPassType {
    /** 普通通行证 */
    Normal = 1,
    /** 高级通行证 */
    Premium = 2,
}

/** 通行证活动业务分类 */
export enum WorldCupPassCategory {
    /** 体育 */
    Sport = 1,
    /** 娱乐场 */
    Casino = 2,
}

/** 优惠券类型 */
export enum WorldCupPassCouponType {
    /** 现金 */
    Cash = 0,
    /** 体育奖金 */
    SportBonus = 1,
    /** 体育免费投注 */
    FreeSport = 2,
    /** 娱乐场奖金 */
    CasinoBonus = 3,
    /** 免费旋转 */
    FreeSpin = 4,
}

/** World Cup Pass 接口共用请求参数 */
export interface WorldCupPassBaseRequest {
    /** 活动 ID */
    activityId: number;
}

/** 获取首页信息请求参数 */
export interface WorldCupPassInfoRequest extends WorldCupPassBaseRequest {}

/** 领取通行证奖励请求参数 */
export interface WorldCupPassClaimRequest extends WorldCupPassBaseRequest {
    /** 要领取的奖励等级，一键领取时可不传 */
    level?: number;
    /** 要领取的通行证类型，一键领取时可不传 */
    type?: WorldCupPassType;
}

/** 解锁高级通行证请求参数 */
export interface WorldCupPassUnlockPremiumRequest extends WorldCupPassBaseRequest {
    /** 用户确认购买时看到的实际支付价格，供后端做价格一致性校验 */
    price: string;
}

/** 奖励关联的优惠券模板信息 */
export interface WorldCupPassCouponTemplateItem {
    /** 优惠券模板 ID */
    id: number;
    /** 优惠券名称 */
    name: string;
    /** 优惠券类型 */
    type: WorldCupPassCouponType;
    wagering_multiplier?: number;
    min_odds?: number;
    max_odds?: number;
    max_cashback_amount?: number;
    allowed_sport_types?: string;
    allowed_leagues?: string;
    allowed_bet_types?: string;
    allowed_game_provider?: number;
    allowed_game_categories?: string;
    allowed_game_ids?: string;
    validity_mode?: number;
    valid_from_to?: string[];
    valid_days?: number;
    remark?: string;
    createdAt: string;
    updatedAt: string;
    operator?: string;
}

/** 通行证奖励项 */
export interface WorldCupPassRewardInfo {
    /** 奖励等级 */
    level: number;
    /** 奖励关联的优惠券定义，无奖励等级时后端返回 null */
    coupon: WorldCupPassCouponTemplateItem | null;
    /** 奖励金额 */
    amount: string;
    /** 奖励数量 */
    count: number;
    /** 登录后奖励状态 */
    status?: WorldCupPassRewardStatus;
}

/** 每日/每周任务项 */
export interface WorldCupPassMissionInfo {
    /** 任务周期类型 */
    periodType: WorldCupPassMissionPeriodType;
    /** 后端定义的任务类型 */
    missionType: number;
    /** 任务完成条件 */
    condition: number[];
    /** 完成任务可获得的经验值 */
    exp: number;
    /** 登录后当前任务进度文本 */
    progress: string;
    /** 登录后任务状态 */
    status: WorldCupPassMissionStatus;
}

/** World Cup Pass 首页信息数据 */
export interface WorldCupPassInfo {
    /** 活动名称 */
    activityName: string;
    /** 活动业务分类列表，1=体育，2=娱乐场 */
    categories: WorldCupPassCategory[];
    /** 活动开始时间，UTC 秒级时间戳 */
    startTime: number;
    /** 活动结束时间，UTC 秒级时间戳 */
    endTime: number;
    /** 登录后当前等级 */
    level?: number;
    /** 登录后当前经验 */
    exp?: number;
    /** 当前等级升级所需经验 */
    expUp?: number;
    /** 本周已获得经验 */
    expWeek?: number;
    /** 每周经验获取上限 */
    expWeekLimit: number;
    /** 每周经验上限解除时间，UTC 秒级时间戳 */
    expWeekUnlockTime: number;
    /** 高级通行证价格 */
    premiumPrice: string;
    /** 是否存在优惠 */
    isDiscount: boolean;
    /** 优惠价格 */
    discountPrice?: string;
    /** 优惠开始时间，UTC 秒级时间戳 */
    discountStartTime: number;
    /** 优惠结束时间，UTC 秒级时间戳 */
    discountEndTime: number;
    /** 登录后是否已解锁高级通行证 */
    isUnlockPremium?: boolean;
    /** 普通通行证奖励列表 */
    normalRewards: WorldCupPassRewardInfo[];
    /** 高级通行证奖励列表 */
    premiumRewards: WorldCupPassRewardInfo[];
    /** 每日任务列表 */
    dailyMissions: WorldCupPassMissionInfo[];
    /** 每周任务列表 */
    weeklyMissions: WorldCupPassMissionInfo[];
}

/** 获取首页信息响应模型 */
export interface WorldCupPassInfoResponse {
    /** 业务状态码 */
    code: number;
    /** 响应消息 */
    msg: string;
    /** 首页信息数据 */
    data: WorldCupPassInfo;
}

/** 领取通行证奖励响应模型 */
export interface WorldCupPassClaimResponse {
    /** 业务状态码 */
    code: number;
    /** 响应消息 */
    msg: string;
}

/** 解锁高级通行证响应模型 */
export interface WorldCupPassUnlockPremiumResponse {
    /** 业务状态码 */
    code: number;
    /** 响应消息 */
    msg: string;
}
