import { getOutcomeNameKey, loadOutcomeNames } from '@/api/loaders/outcome-name';
import {
    getMarketGroupId,
    isRowBasedMarketCardType,
    type MarketGroup,
    type MarketLine,
    type OutcomeNameBatchItem,
    type OutcomeNameBatchResolvedItem,
} from '@/api/models/market';
import type {
    OddsChangeLinePayload,
    OddsChangeMarketPayload,
    OddsChangeOutcomePayload,
    OddsChangePayload,
} from '@/api/models/ws';

/** 可提供 WS 新增投注项名称补全上下文的赛事缓存。 */
export type EventMarketContext = {
    event_id: string;
    markets?: MarketGroup[];
};

/** WS 新增投注项名称补全加载函数。 */
export type LoadOutcomeNamesFn = (items: OutcomeNameBatchItem[]) => Promise<OutcomeNameBatchResolvedItem[]>;

const isLineMatch = (market: MarketGroup, existingLine: MarketLine, incomingLine: OddsChangeLinePayload): boolean => {
    return (
        existingLine.product === incomingLine.product &&
        (existingLine.specifiers === incomingLine.specifiers ||
            (isRowBasedMarketCardType(market.card_type) &&
                existingLine.row !== undefined &&
                existingLine.row === incomingLine.specifiers))
    );
};

const getTargetMarket = (markets: MarketGroup[], incomingMarket: OddsChangeMarketPayload): MarketGroup | undefined => {
    if (incomingMarket.name) {
        const groupKey = getMarketGroupId({ id: incomingMarket.id, name: incomingMarket.name });
        const market = markets.find((item) => getMarketGroupId(item) === groupKey);

        if (market) {
            return market;
        }
    }

    const candidates = markets.filter((market) => market.id === incomingMarket.id);
    if (candidates.length === 1) {
        return candidates[0];
    }

    return candidates.find((market) => {
        return incomingMarket.lines.some((incomingLine) =>
            market.lines.some((line) => isLineMatch(market, line, incomingLine)),
        );
    });
};

const createOutcomeNameItem = (
    event: EventMarketContext,
    market: OddsChangeMarketPayload,
    outcome: OddsChangeOutcomePayload,
): OutcomeNameBatchItem => ({
    event_id: event.event_id,
    market_id: market.id,
    outcome_id: String(outcome.id),
    outcome_name: outcome.name ?? '',
    outcome_line: outcome.line ?? '',
});

const dedupeOutcomeNameItems = (items: OutcomeNameBatchItem[]): OutcomeNameBatchItem[] => {
    const itemMap = new Map<string, OutcomeNameBatchItem>();

    for (const item of items) {
        itemMap.set(getOutcomeNameKey(item), item);
    }

    return Array.from(itemMap.values());
};

const collectLineOutcomeNameItems = (
    event: EventMarketContext,
    incomingMarket: OddsChangeMarketPayload,
    existingLine: MarketLine | undefined,
    incomingLine: OddsChangeLinePayload,
): OutcomeNameBatchItem[] => {
    const existingOutcomeIds = new Set(existingLine?.outcomes.map((outcome) => String(outcome.id)) ?? []);

    if (!existingLine) {
        return incomingLine.outcomes.map((outcome) => createOutcomeNameItem(event, incomingMarket, outcome));
    }

    return incomingLine.outcomes
        .filter((outcome) => !existingOutcomeIds.has(String(outcome.id)))
        .map((outcome) => createOutcomeNameItem(event, incomingMarket, outcome));
};

export const collectOutcomeNameItems = (
    event: EventMarketContext,
    payload: OddsChangePayload,
): OutcomeNameBatchItem[] => {
    const markets = event.markets ?? [];

    return dedupeOutcomeNameItems(
        payload.markets.flatMap((incomingMarket) => {
            const targetMarket = getTargetMarket(markets, incomingMarket);
            if (!targetMarket && !incomingMarket.name) {
                return [];
            }

            return incomingMarket.lines.flatMap((incomingLine) => {
                const existingLine = targetMarket?.lines.find((line) => isLineMatch(targetMarket, line, incomingLine));
                return collectLineOutcomeNameItems(event, incomingMarket, existingLine, incomingLine);
            });
        }),
    );
};

const mergeOutcomeName = (
    event: EventMarketContext,
    outcome: OddsChangeOutcomePayload,
    marketId: number,
    responseMap: Map<string, OutcomeNameBatchResolvedItem>,
): OddsChangeOutcomePayload => {
    const key = getOutcomeNameKey({
        event_id: event.event_id,
        market_id: marketId,
        outcome_id: String(outcome.id),
        outcome_name: outcome.name ?? '',
        outcome_line: outcome.line ?? '',
    });
    const response = responseMap.get(key);

    if (!response) {
        return outcome;
    }

    return {
        ...outcome,
        name: response.name ?? outcome.name,
        name_alias: response.name_alias ?? outcome.name_alias,
        quick_name: response.quick_name ?? outcome.quick_name,
    };
};

const applyOutcomeNames = (
    event: EventMarketContext,
    payload: OddsChangePayload,
    responses: OutcomeNameBatchResolvedItem[],
): OddsChangePayload => {
    const responseMap = new Map(responses.map((item) => [getOutcomeNameKey(item), item]));

    return {
        ...payload,
        markets: payload.markets.map((market) => ({
            ...market,
            lines: market.lines.map((line) => ({
                ...line,
                outcomes: line.outcomes.map((outcome) => mergeOutcomeName(event, outcome, market.id, responseMap)),
            })),
        })),
    };
};

const assertOutcomeNameResponsesComplete = (
    items: OutcomeNameBatchItem[],
    responses: OutcomeNameBatchResolvedItem[],
): void => {
    const responseKeys = new Set(responses.map((item) => getOutcomeNameKey(item)));

    for (const item of items) {
        const key = getOutcomeNameKey(item);
        if (!responseKeys.has(key)) {
            throw new Error(`Missing outcome name response for ${key}`);
        }
    }
};

/**
 * WS 新增 line/outcome 补名链路：
 * 1. 先用当前缓存 markets 对比 WS payload，只收集新增 line / outcome。
 * 2. 通过 batch 接口补齐 name、name_alias、quick_name，并合并回 payload。
 * 3. 任一补名请求失败时直接抛错，外层不会 setQueryData，页面不展示这批新增项。
 */
export const resolveOddsChangeOutcomeNames = async (
    event: EventMarketContext,
    payload: OddsChangePayload,
    loader: LoadOutcomeNamesFn = loadOutcomeNames,
): Promise<OddsChangePayload> => {
    const items = collectOutcomeNameItems(event, payload);
    if (items.length === 0) {
        return payload;
    }

    const responses = await loader(items);
    assertOutcomeNameResponsesComplete(items, responses);
    return applyOutcomeNames(event, payload, responses);
};
