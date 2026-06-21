import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { GetChampionHandicapInfoInterface, JoinChampionHandicapInterface } from '@/api/handlers/champion-handicap';
import { Toast } from '@/components/toast';
import { useIsLogin } from '@/stores/session-store';
import { ForbiddenError } from '@/utils/error';

import { isChampionHandicapEventActive } from '../_utils/time';

/** 冠军盘活动页面所需的参与状态与操作。 */
interface UseChampionHandicapInfoResult {
    /** 当前用户是否已参加活动。 */
    isJoin: boolean;
    /** 活动信息是否加载中。 */
    isLoading: boolean;
    /** 参加活动请求是否提交中。 */
    isJoining: boolean;
    /** 当前时间是否处于冠军盘活动期。 */
    isEventActive: boolean;
    /** 提交参加冠军盘活动。 */
    joinChampionHandicap: () => void;
}

/** 获取冠军盘活动信息并封装参加活动操作。 */
export const useChampionHandicapInfo = (): UseChampionHandicapInfoResult => {
    const isLogin = useIsLogin();
    const queryClient = useQueryClient();
    const t = useTranslations('promotion');

    const { data, isLoading } = useQuery({
        queryKey: ['champion-handicap-info'],
        queryFn: () => GetChampionHandicapInfoInterface(),
        enabled: isLogin,
        staleTime: 1000 * 60 * 5,
    });

    const { mutate: mutateChampionHandicap, isPending: isJoining } = useMutation({
        mutationFn: () => JoinChampionHandicapInterface(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['champion-handicap-info'] });
            Toast.success(t('championHandicap.cta.joined'), { id: 'join-champion-handicap-success' });
        },
        onError: (error) => {
            // code 1019: 已参加活动时静默同步最新状态
            if (error instanceof ForbiddenError && error.context.code === 1019) {
                queryClient.invalidateQueries({ queryKey: ['champion-handicap-info'] });
                return;
            }
            Toast.error(error.message, { id: 'join-champion-handicap' });
        },
    });
    const joinChampionHandicap = (): void => mutateChampionHandicap();

    return {
        isJoin: data?.isJoin ?? false,
        isLoading,
        isJoining,
        isEventActive: isChampionHandicapEventActive(),
        joinChampionHandicap,
    };
};
