import DataLoader from 'dataloader';
import { PostOutcomeNameBatchInterface } from '@/api/handlers/match';
import type {
    OutcomeNameBatchItem,
    OutcomeNameBatchResolvedItem,
    OutcomeNameBatchResponseItem,
} from '@/api/models/market';

const OUTCOME_NAME_BATCH_DELAY = 50;
const OUTCOME_NAME_CACHE_LIMIT = 5000;
const OUTCOME_NAME_KEY_SEPARATOR = '\u001f';
const outcomeNameCache = new Map<string, OutcomeNameBatchResolvedItem>();
const pendingOutcomeNameLoads = new Map<string, Promise<OutcomeNameBatchResolvedItem>>();

export const getOutcomeNameKey = (item: OutcomeNameBatchItem): string =>
    [item.event_id, item.market_id, item.outcome_id].join(OUTCOME_NAME_KEY_SEPARATOR);

const setOutcomeNameCache = (key: string, value: OutcomeNameBatchResolvedItem): void => {
    if (outcomeNameCache.has(key)) {
        outcomeNameCache.delete(key);
    }

    outcomeNameCache.set(key, value);

    if (outcomeNameCache.size <= OUTCOME_NAME_CACHE_LIMIT) {
        return;
    }

    const firstKey = outcomeNameCache.keys().next().value;
    if (firstKey) {
        outcomeNameCache.delete(firstKey);
    }
};

const getOutcomeNameResponseKey = (
    item: Pick<OutcomeNameBatchResolvedItem, 'event_id' | 'market_id' | 'outcome_id'>,
): string => [item.event_id, item.market_id, item.outcome_id].join(OUTCOME_NAME_KEY_SEPARATOR);

const toResolvedOutcomeName = (
    request: OutcomeNameBatchItem,
    response: OutcomeNameBatchResponseItem,
): OutcomeNameBatchResolvedItem => ({
    ...request,
    name: response.outcome_name,
    name_alias: response.outcome_name_alias || undefined,
    quick_name: response.outcome_quick_name || undefined,
});

/**
 * 批量补全 WS 新增投注项名称，DataLoader 负责短窗口合并请求。
 */
export const outcomeNameLoader = new DataLoader<OutcomeNameBatchItem, OutcomeNameBatchResolvedItem, string>(
    async (items) => {
        const uniqueItems = Array.from(new Map(items.map((item) => [getOutcomeNameKey(item), item])).values());
        const responses = await PostOutcomeNameBatchInterface(uniqueItems);
        const responseMap = new Map(responses.map((item) => [getOutcomeNameResponseKey(item), item]));

        return items.map((item) => {
            const response = responseMap.get(getOutcomeNameResponseKey(item));
            return response
                ? toResolvedOutcomeName(item, response)
                : new Error(`Missing outcome name response for ${getOutcomeNameKey(item)}`);
        });
    },
    {
        cache: false,
        cacheKeyFn: getOutcomeNameKey,
        batchScheduleFn: (callback) => setTimeout(callback, OUTCOME_NAME_BATCH_DELAY),
    },
);

export const loadOutcomeNames = async (items: OutcomeNameBatchItem[]): Promise<OutcomeNameBatchResolvedItem[]> => {
    return Promise.all(
        items.map((item) => {
            const key = getOutcomeNameKey(item);
            const cached = outcomeNameCache.get(key);
            if (cached) {
                return cached;
            }

            const pending = pendingOutcomeNameLoads.get(key);
            if (pending) {
                return pending;
            }

            const request = outcomeNameLoader
                .load(item)
                .then((response) => {
                    setOutcomeNameCache(key, response);
                    return response;
                })
                .finally(() => {
                    pendingOutcomeNameLoads.delete(key);
                });

            pendingOutcomeNameLoads.set(key, request);
            return request;
        }),
    );
};
