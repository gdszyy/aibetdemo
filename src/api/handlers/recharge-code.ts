import dayjs from 'dayjs';
import {
    type RechargeCode,
    type RechargeCodeConfig,
    RechargeCodeErrorCode,
    RechargeCodeStatus,
    type RechargeCodeValidationResult,
} from '@/api/models/recharge-code';
import { paymentFetcher } from '../client';

// 充值码相关

/** 所有充值码 */
export const GetRechargeCodesInterface = async () => {
    return paymentFetcher.get<RechargeCode[]>('/v2/first-recharge/status');
};

/** 活动是否可用 */
const isActive = (payload: RechargeCode): boolean => {
    if (payload?.status !== RechargeCodeStatus.Enabled) return false;
    const now = dayjs();
    const startTime = dayjs(payload.start_time);
    const endTime = dayjs(payload.end_time);
    if (!startTime.isValid() || !endTime.isValid()) return false;
    return !now.isBefore(startTime) && !now.isAfter(endTime);
};

/** 活动进行中 */
export const isRechargeCodeActive = (payload?: RechargeCode[] | null): boolean => {
    if (!payload?.length) return false;
    return payload.some(isActive);
};

/** 券码对应的配置 */
const findConfigInCodes = (
    payload: RechargeCode[],
    promoCode: string,
): { campaign: RechargeCode; config: RechargeCodeConfig } | undefined => {
    const normalizedCode = promoCode;
    if (!normalizedCode) return undefined;
    for (const campaign of payload) {
        if (!isActive(campaign)) continue;
        const config = campaign.configs.find((c) => c.promo_code === normalizedCode);
        if (config) return { campaign, config };
    }
    return undefined;
};

/** 券配置 */
const getPromoValidationMeta = (config: RechargeCodeConfig, amount: number): Partial<RechargeCodeValidationResult> => {
    const depositCap = Number(config.max_depositCap);
    const bonusRate = Number(config.bonus_rate);
    const bonusAmount =
        Number.isFinite(amount) && Number.isFinite(depositCap) && Number.isFinite(bonusRate)
            ? Math.min(Math.max(amount, 0), depositCap) * bonusRate
            : undefined;
    const turnoverRequirement =
        bonusAmount != null && Number.isFinite(config.wager_multiplier)
            ? bonusAmount * config.wager_multiplier
            : undefined;

    return {
        promo_code: config.promo_code,
        bonus_type: config.bonus_type,
        bonus_rate: config.bonus_rate,
        min_deposit: Number(config.min_deposit),
        max_deposit: depositCap,
        bonus_amount: bonusAmount,
        turnover_requirement: turnoverRequirement,
    };
};

// TODO 这个怎么写在前端？
/** 校验充值码 */
export const ValidateRechargeCodeInterface = (
    payload: RechargeCode[] | null | undefined,
    params: {
        /** Promo code entered by user */
        promo_code: string;
        /** Current deposit amount */
        amount: number;
    },
): RechargeCodeValidationResult => {
    const normalizedCode = params.promo_code;

    if (!normalizedCode) {
        return {
            valid: false,
            code: RechargeCodeErrorCode.INVALID_CODE,
        };
    }

    const match = findConfigInCodes(payload ?? [], normalizedCode);
    if (!match) {
        return {
            valid: false,
            error_type: 'invalid_code',
            code: RechargeCodeErrorCode.INVALID_CODE,
            promo_code: normalizedCode,
        };
    }

    const { campaign, config: matchedConfig } = match;
    const validationMeta = getPromoValidationMeta(matchedConfig, params.amount);
    const usedPromoCodes = new Set(campaign.used_promo_codes ?? []);
    const currentStageIndex = (campaign.user_stage_index ?? 0) + 1;

    if (usedPromoCodes.has(normalizedCode) || matchedConfig.stage_index < currentStageIndex) {
        return {
            ...validationMeta,
            valid: false,
            error_type: 'already_used',
            code: RechargeCodeErrorCode.ALREADY_USED,
        };
    }

    if (matchedConfig.stage_index > currentStageIndex) {
        return {
            ...validationMeta,
            valid: false,
            error_type: 'order_conflict',
            code: RechargeCodeErrorCode.ORDER_CONFLICT,
        };
    }

    const minDeposit = Number(matchedConfig.min_deposit);
    const maxDeposit = Number(matchedConfig.max_depositCap);

    if (!Number.isFinite(params.amount) || params.amount < minDeposit) {
        return {
            ...getPromoValidationMeta(matchedConfig, minDeposit),
            valid: true,
            error_type: 'amount_low',
            code: RechargeCodeErrorCode.AMOUNT_LOW,
            min_deposit: minDeposit,
            max_deposit: maxDeposit,
        };
    }

    if (Number.isFinite(maxDeposit) && params.amount > maxDeposit) {
        return {
            ...getPromoValidationMeta(matchedConfig, maxDeposit),
            valid: true,
            code: RechargeCodeErrorCode.SUCCESS,
            min_deposit: minDeposit,
            max_deposit: maxDeposit,
        };
    }

    return {
        ...validationMeta,
        valid: true,
        code: RechargeCodeErrorCode.SUCCESS,
    };
};
