import Decimal from 'decimal.js-light';
import { flatten, min } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { GetRechargeCodesInterface, isRechargeCodeActive } from '@/api/handlers/recharge-code';
import type { InterfaceResponse } from '@/api/lib/types';
import { RechargeCodeType } from '@/api/models/recharge-code';

type DataItem = InterfaceResponse<typeof GetRechargeCodesInterface>[0];

/** 充值码 */
export const useRechargeCodeStore = create<{
    loading: boolean;
    codes: DataItem[];
    dispatchCodes: typeof GetRechargeCodesInterface;
}>((set) => {
    return {
        loading: true,
        codes: [],
        dispatchCodes: async () => {
            return GetRechargeCodesInterface()
                .finally(() => {
                    set({ loading: false });
                })
                .then((res) => {
                    set({ codes: res });
                    return res;
                });
        },
    };
});

/** 所有充值码活动 */
export const useAllRechargeCodes = () => {
    const codes = useRechargeCodeStore((s) => s.codes) || [];
    return codes;
};

/** 充值活动 当前可用的档位，主播活动优先 */
export const useRechargeActiveConfig = () => {
    const codes = useAllRechargeCodes();

    if (!codes?.length) {
        return null;
    }

    const sortCodes = codes
        .filter((v) => {
            if (!isRechargeCodeActive([v])) {
                return false;
            }
            if (v.user_stage_index && v.user_stage_index >= (v.configs?.length || 0)) {
                return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (a.type === RechargeCodeType.AnchorIntro) {
                return -1;
            }
            return 0;
        });

    const data = sortCodes[0] || null;

    if (!data) {
        return null;
    }

    const userStage = data.user_stage_index || 0;
    const config = data.configs?.find((v) => v.stage_index > userStage) || null;
    return config;
};

/** 获取充值活动，code和金额配对的奖励金额和百分比 */
export const useRechargeReward = () => {
    const codes = useAllRechargeCodes();

    const configs = useMemo(() => {
        return flatten(codes.map((v) => v.configs || []));
    }, [codes]);

    const getReward: (
        code: string,
        originAmount: number,
    ) => {
        /** 奖励金额 */
        reward: number;
        /** 奖励倍率 */
        rate: number;
        /** 奖励倍率百分比 */
        percentage: string;
    } | null = useCallback(
        (code, originAmount) => {
            const config = configs?.find((v) => v.promo_code === code);

            if (!config) {
                return null;
            }

            const minDeposit = Number(config.min_deposit) || 0;

            if (originAmount < minDeposit) {
                return null;
            }

            const rate = Number(config?.bonus_rate) || 0;

            if (rate) {
                const reward = min([new Decimal(originAmount).mul(rate).toNumber(), Number(config?.max_withdraw || 0)]);
                return {
                    reward,
                    rate,
                    percentage: `${new Decimal(rate).mul(100).toNumber()}%`,
                };
            }

            return null;
        },
        [configs?.find, configs],
    );

    return getReward;
};

/** 首充活动 */
export const useFirstRechargeCode = () => {
    const codes = useAllRechargeCodes();
    const res = codes.find((v) => v.type === RechargeCodeType.FirstRecharge) || null;
    return res;
};

/** 主播活动 */
export const useAnchorRechargeCode = () => {
    const codes = useAllRechargeCodes();
    const res = codes.find((v) => v.type === RechargeCodeType.AnchorIntro) || null;
    return res;
};
