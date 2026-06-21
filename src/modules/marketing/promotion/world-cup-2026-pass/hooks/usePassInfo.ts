import { useQuery } from '@tanstack/react-query';
import { GetWorldCupPassInfoInterface } from '@/api/handlers/world-cup-pass';
import type { WorldCupPassInfo } from '@/api/models/world-cup-pass';
import { generateQueryKey, ModuleKeys, WorldCupPassActions } from '@/constants/query-keys';
import { useRegionCode } from '@/stores/region-store';
import { getWordCupPassActivityId } from '../constants';

export type PassInfoQueryKey = [ModuleKeys.WORLD_CUP_PASS, WorldCupPassActions.INFO, string | undefined];

interface UsePassInfoReturn {
    /** 活动 ID */
    activityId: number;
    /** 首页信息查询缓存 key */
    passInfoQueryKey: PassInfoQueryKey;
    /** 首页接口返回数据 */
    data: WorldCupPassInfo | undefined;
    /** 活动是否尚未开始 */
    isPassNotStarted: boolean;
    /** 活动是否已结束 */
    isPassEnded: boolean;
    /** 活动是否不在可参与时间内 */
    isPassUnavailable: boolean;
}

/** 根据活动时间判断世界杯通行证是否尚未开始。 */
const checkIsPassNotStarted = (data: WorldCupPassInfo | undefined, nowSeconds: number): boolean =>
    typeof data?.startTime === 'number' && nowSeconds < data.startTime;

/** 根据活动时间或查询后空数据判断世界杯通行证是否已结束。 */
const checkIsPassEnded = (data: WorldCupPassInfo | undefined, nowSeconds: number, isFetched: boolean): boolean =>
    (isFetched && !data) || (typeof data?.endTime === 'number' && nowSeconds > data.endTime);

/** 获取世界杯通行证首页信息，并根据返回时间识别活动状态。 */
export const usePassInfo = (): UsePassInfoReturn => {
    const regionCode = useRegionCode();
    const activityId = getWordCupPassActivityId(regionCode);
    const passInfoQueryKey: PassInfoQueryKey = generateQueryKey(ModuleKeys.WORLD_CUP_PASS, WorldCupPassActions.INFO, {
        activityId,
    });

    const { data, isFetched } = useQuery({
        queryKey: passInfoQueryKey,
        queryFn: (): Promise<WorldCupPassInfo> =>
            GetWorldCupPassInfoInterface({
                activityId,
            }),
    });
    const nowSeconds = Math.floor(Date.now() / 1000);
    const isPassNotStarted = checkIsPassNotStarted(data, nowSeconds);
    const isPassEnded = checkIsPassEnded(data, nowSeconds, isFetched);

    return {
        activityId,
        passInfoQueryKey,
        data,
        isPassNotStarted,
        isPassEnded,
        isPassUnavailable: isPassNotStarted || isPassEnded,
    };
};
