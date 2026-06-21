import { useQuery } from '@tanstack/react-query';
import { GetVipActivityStatusInterface } from '@/api/handlers/vip';
import { type GetActivityStatusRes, VipActivityStatusEnum } from '@/api/models/vip';
import { generateQueryKey, ModuleKeys, VipActions } from '@/constants/query-keys';

interface UseVipActivityStatusReturn {
    /** 接口返回的 VIP 活动状态 */
    status: VipActivityStatusEnum | undefined;
    /** VIP 活动是否已结束 */
    isEnded: boolean;
}

/** 查询 VIP 活动状态，并转换为页面展示所需布尔值。 */
export const useVipActivityStatus = (activityId: number): UseVipActivityStatusReturn => {
    const { data } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.VIP, VipActions.ACTIVITY_STATUS, { activityId }),
        queryFn: (): Promise<GetActivityStatusRes> => GetVipActivityStatusInterface({ activityId }),
        enabled: Number.isFinite(activityId),
    });

    return {
        status: data?.status,
        isEnded: data?.status === VipActivityStatusEnum.Ended || data?.status === VipActivityStatusEnum.Paused,
    };
};
