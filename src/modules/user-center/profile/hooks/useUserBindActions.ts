import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { GetUserBindingsInterface } from '@/api/handlers/user';
import type { UserBindings } from '@/api/models/user';

/** 用户绑定列表查询键。 */
export const userBindQueryKey = (): readonly ['user-center', 'bindings'] => ['user-center', 'bindings'];

/** 获取当前登录用户的绑定状态。 */
export const useUserBindActions = (): UseQueryResult<UserBindings> => {
    return useQuery({
        queryKey: userBindQueryKey(),
        queryFn: GetUserBindingsInterface,
    });
};
