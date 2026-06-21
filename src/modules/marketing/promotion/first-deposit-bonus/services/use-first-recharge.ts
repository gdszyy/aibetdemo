/** 首充活动 */

import { sum } from 'lodash-es';
import { useFirstRechargeCode } from '@/hooks/use-recharge-code';

/** 获取首充活动所有档位 */
export const useFirstRechargeConfigs = () => {
    const data = useFirstRechargeCode();
    return data?.configs || [];
};

/** 获取首充活动总奖励金额 */
export const useFirstRechargeTotalReward = () => {
    const configs = useFirstRechargeConfigs();
    const total = sum(configs.map((v) => Number(v.max_withdraw) || 0));
    return total;
};
