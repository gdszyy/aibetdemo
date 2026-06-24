import type { QueryClient } from '@tanstack/react-query';
import { config } from '@/constants/config';
import { isGeneratedQueryKey } from '@/constants/query-keys';

type QueryClientMethodName =
    | 'getQueryData'
    | 'getQueriesData'
    | 'setQueryData'
    | 'setQueriesData'
    | 'invalidateQueries'
    | 'refetchQueries'
    | 'cancelQueries'
    | 'removeQueries'
    | 'resetQueries'
    | 'fetchQuery'
    | 'fetchInfiniteQuery'
    | 'prefetchQuery'
    | 'prefetchInfiniteQuery'
    | 'ensureQueryData'
    | 'ensureInfiniteQueryData';

type QueryClientMethod = (...args: readonly unknown[]) => unknown;

/** 避免同一个 QueryClient 被重复 patch。 */
const PATCHED_CLIENTS = new WeakSet<QueryClient>();
const MAX_DEV_QUERY_KEY_WARNINGS = 10;
const SUPPRESSED_WARNINGS_KEY = '__query-key-warnings-suppressed__';

/**
 * queryClient 分为 3 类
 * 1. 直接传 key
 * setQueryData(queryKey, ...)
 * 2. filters 对象里传 key
 * invalidateQueries({ queryKey })
 * 3. options 对象里传 key
 * fetchQuery({ queryKey, queryFn })
 */

/** 直接把 queryKey 作为首参传入的方法。 */
const DIRECT_QUERY_KEY_METHODS = new Set<QueryClientMethodName>(['getQueryData', 'setQueryData']);
/** 把 queryKey 放在 filters 对象里的方法。 */
const FILTER_QUERY_KEY_METHODS = new Set<QueryClientMethodName>([
    'getQueriesData',
    'setQueriesData',
    'invalidateQueries',
    'refetchQueries',
    'cancelQueries',
    'removeQueries',
    'resetQueries',
]);
/** 把 queryKey 放在 query options 里的方法。 */
const OPTIONS_QUERY_KEY_METHODS = new Set<QueryClientMethodName>([
    'fetchQuery',
    'fetchInfiniteQuery',
    'prefetchQuery',
    'prefetchInfiniteQuery',
    'ensureQueryData',
    'ensureInfiniteQueryData',
]);

/** 当前阶段需要接入 queryKey 治理的 QueryClient 方法白名单。 */
const GOVERNED_METHOD_NAMES: readonly QueryClientMethodName[] = [
    'getQueryData',
    'getQueriesData',
    'setQueryData',
    'setQueriesData',
    'invalidateQueries',
    'refetchQueries',
    'cancelQueries',
    'removeQueries',
    'resetQueries',
    'fetchQuery',
    'fetchInfiniteQuery',
    'prefetchQuery',
    'prefetchInfiniteQuery',
    'ensureQueryData',
    'ensureInfiniteQueryData',
] as const;

/** 判断首参是否为包含 queryKey 字段的 filters / options 对象。 */
const isQueryKeyCarrier = (value: unknown): value is { queryKey?: unknown } => {
    return typeof value === 'object' && value !== null && 'queryKey' in value;
};

/** 统一序列化 queryKey，供告警去重和日志展示使用。 */
const serializeQueryKey = (queryKey: unknown): string => {
    try {
        const serialized = JSON.stringify(queryKey);
        return serialized ?? String(queryKey);
    } catch {
        return String(queryKey);
    }
};

/** 开发环境对非法 key 做一次性告警，避免同一 key 在同一个 client 内重复刷屏。 */
const emitWarningIfNeeded = ({
    source,
    queryKey,
    warnedQueryKeys,
}: {
    source: string;
    queryKey: unknown;
    warnedQueryKeys: Set<string>;
}): void => {
    if (!config.isDev) {
        return;
    }

    if (queryKey === undefined || isGeneratedQueryKey(queryKey)) {
        return;
    }

    const warningKey = serializeQueryKey(queryKey);

    if (warnedQueryKeys.has(warningKey)) {
        return;
    }

    if (warnedQueryKeys.size >= MAX_DEV_QUERY_KEY_WARNINGS) {
        if (!warnedQueryKeys.has(SUPPRESSED_WARNINGS_KEY)) {
            warnedQueryKeys.add(SUPPRESSED_WARNINGS_KEY);
            console.warn('[QueryKey] Further invalid queryKey warnings suppressed in this session.');
        }
        return;
    }

    warnedQueryKeys.add(warningKey);

    /** 构造统一的非法 queryKey 提示文案。 */
    const isHavaSource = source ? ` detected in ${source}` : '';
    const warnText = `[QueryKey] Invalid queryKey${isHavaSource}. Please use generateQueryKey(module, action, params?) instead.`;
    console.warn(warnText, queryKey);
};
// 统一从不同 QueryClient 方法签名里提取 queryKey，便于复用一套校验函数。
const extractQueryKeyFromArgs = (methodName: QueryClientMethodName, args: readonly unknown[]): unknown => {
    const firstArg = args[0];

    if (DIRECT_QUERY_KEY_METHODS.has(methodName)) {
        return firstArg;
    }

    if (FILTER_QUERY_KEY_METHODS.has(methodName) || OPTIONS_QUERY_KEY_METHODS.has(methodName)) {
        return isQueryKeyCarrier(firstArg) ? firstArg.queryKey : undefined;
    }

    return undefined;
};

const patchQueryClientMethod = (
    queryClient: QueryClient,
    methodName: QueryClientMethodName,
    warnedQueryKeys: Set<string>,
): void => {
    const originalMethod = (queryClient[methodName] as QueryClientMethod).bind(queryClient);
    /** 这里用可变视图做运行时 patch，避免和 QueryClient 各重载签名逐一对齐。 */
    const mutableQueryClient = queryClient as unknown as Record<QueryClientMethodName, QueryClientMethod>;

    /**
     * 在保留 QueryClient 原始行为的前提下，给目标方法包一层前置校验：
     * 1. 先从当前方法实参中提取 queryKey
     * 2. 如果不是 generateQueryKey 生成的 key，则在开发环境输出 warning
     * 3. 最后继续调用 TanStack 原始方法，不改变原有业务执行链路
     */
    mutableQueryClient[methodName] = (...args: readonly unknown[]) => {
        emitWarningIfNeeded({
            source: methodName,
            queryKey: extractQueryKeyFromArgs(methodName, args),
            warnedQueryKeys,
        });

        return originalMethod(...args);
    };
};

/** 对全局 QueryClient 增加 queryKey 治理逻辑 */
export const applyQueryKeyGovernance = (queryClient: QueryClient): void => {
    if (PATCHED_CLIENTS.has(queryClient)) {
        return;
    }

    PATCHED_CLIENTS.add(queryClient);

    /** 同一个 QueryClient 内，对同一个非法 key 只提示一次。 */
    const warnedQueryKeys = new Set<string>();

    /** 主力治理层：在常用 QueryClient 方法入口就先做一次合法性检查。 */
    for (const methodName of GOVERNED_METHOD_NAMES) {
        patchQueryClientMethod(queryClient, methodName, warnedQueryKeys);
    }

    /** 兜底观察所有真正进入 cache 的 query，覆盖未走白名单方法但仍创建 query 的场景。 */
    queryClient.getQueryCache().subscribe((event) => {
        emitWarningIfNeeded({
            //
            /**
             * 兜底，并没有实际的 source，可能是从 hooks 进入 subscribe
             * 可能是从 useQuery/useInfiniteQuery/useSuspenseQuery/useSuspenseInfiniteQuery
             */
            source: '',
            queryKey: event.query.queryKey,
            warnedQueryKeys,
        });
    });
};
