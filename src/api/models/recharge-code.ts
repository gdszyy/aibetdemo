// 充值码

/** 错误码 */
const CodeError = {
    SUCCESS: 0,
    /** 无效 */
    INVALID_CODE: 70000001,
    /** 金额过低 */
    AMOUNT_LOW: 70000002,
    /** 已使用 */
    ALREADY_USED: 70000003,
    /** 订单冲突 */
    ORDER_CONFLICT: 70000004,
    /** 超时 */
    TIMEOUT: 70000005,
    /** 系统错误 */
    SYSTEM_ERROR: 70000006,
    /** 无效参数 */
    INVALID_PARAMS: 600000200,
} as const;

/** 校验结果 */
interface ValidationResult {
    /** Whether the promo code is valid for current user + amount */
    valid: boolean;
    /** Error type when invalid */
    error_type?: 'amount_low' | 'order_conflict' | 'already_used' | 'invalid_code';
    /** Bonus description (e.g. "+20% Casino Bonus") */
    bonus_label?: string;
    /** Raw bonus type from backend/config, e.g. SportBonus */
    bonus_type?: string;
    /** Raw bonus rate from backend/config, e.g. 0.2 */
    bonus_rate?: string;
    /** Calculated bonus amount */
    bonus_amount?: number;
    /** Minimum deposit amount required */
    min_deposit?: number;
    /** Maximum deposit cap for bonus calculation */
    max_deposit?: number;
    /** Required turnover to unlock bonus withdrawal = bonus_amount × wager_multiplier */
    turnover_requirement?: number;
    /** Echo back promo code */
    promo_code?: string;
    code?: number;
    message?: string;
}

/** 券配置 */
interface Config {
    id: number;
    first_recharge_id: number;
    /** 阶段 */
    stage_index: number;
    /** 券码 */
    promo_code: string;
    title: string;
    bonus_type_id: number;
    bonus_type: string;
    /** 最小充值金额 */
    min_deposit: string;
    /** 最大充值金额 */
    max_depositCap: string;
    /** 奖励率 */
    bonus_rate: string;
    /** 奖励倍数 */
    wager_multiplier: number;
    /** 最大提现金额 */
    max_withdraw: string;
}

/** 活动类型 */
enum Type {
    /** 首充 */
    FirstRecharge = 'first_rechage',
    /** 主播 */
    AnchorIntro = 'streamer',
}

enum Status {
    /** 启用 */
    Enabled = 1,
    /** 禁用 */
    Disabled = 0,
}

interface Model {
    id: number;
    type: Type;
    title: string;
    info: string;
    status: Status;
    start_time: string;
    end_time: string;
    /** 券配置 */
    configs: Config[];
    /** Current deposit stage for this user  */
    user_stage_index?: number;
    /** Legacy/current alias for the user's available deposit stage, kept for compatibility */
    current_stage_index?: number;
    /** Promo codes already consumed by this user, if backend provides them */
    used_promo_codes?: string[];
}

export type { Model as RechargeCode, Config as RechargeCodeConfig };
export { Type as RechargeCodeType, Status as RechargeCodeStatus };
export { CodeError as RechargeCodeErrorCode, type ValidationResult as RechargeCodeValidationResult };
