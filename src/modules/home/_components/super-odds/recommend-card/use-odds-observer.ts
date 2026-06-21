import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect, useMemo } from 'react';
import type { RecommendCard, RecommendCardSelection } from '@/api/models/recommend-card';
import type { LiveScorePayload, OddsChangeLinePayload, OddsChangePayload } from '@/api/models/ws';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { globalEventObserver } from '@/hooks/use-socket-listener';
import { LiveScoreEvent, OddsChangeEvent } from '@/libs/event-constants';
import { QUERY_KEY } from './constants';

const EVENT_ID_SEPARATOR = '\n';

/** 获取推荐卡片中需要订阅的赛事 ID。 */
const getEventIds = (cards: RecommendCard[]): string[] => {
    return Array.from(
        new Set(
            cards.flatMap((card) => [
                ...card.legs.map((leg) => leg.event_id),
                ...card.json_list.map((selection) => selection.event_id),
            ]),
        ),
    ).filter(Boolean);
};

/** 推荐投注项是否匹配 WS 盘口线。 */
const isSameLine = (selection: RecommendCardSelection, line: OddsChangeLinePayload): boolean => {
    return line.product === selection.product && line.specifiers === selection.specifiers;
};

/** 查找推荐投注项对应的 WS 盘口线。 */
const getIncomingLine = (
    selection: RecommendCardSelection,
    payload: OddsChangePayload,
): OddsChangeLinePayload | undefined => {
    const market = payload.markets.find((item) => Number(item.id) === Number(selection.market_id));
    return market?.lines.find((line) => isSameLine(selection, line));
};

/** 用 WS 赔率变更更新单个推荐投注项。 */
const patchSelectionByOdds = (selection: RecommendCardSelection, payload: OddsChangePayload): boolean => {
    if (String(selection.event_id) !== String(payload.event_id)) return false;

    const line = getIncomingLine(selection, payload);
    if (!line) return false;

    const outcome = line.outcomes.find((item) => String(item.id) === selection.outcome_id);
    if (!outcome) {
        if (line.line_status === undefined && line.product_raw === selection.product_raw) return false;

        selection.product_raw = line.product_raw;
        selection.specifiers_status = line.line_status ?? selection.specifiers_status;
        return true;
    }

    if (outcome.last_update !== undefined && outcome.last_update < selection.timestamp) {
        return false;
    }

    selection.product_raw = line.product_raw;
    selection.specifiers_status = line.line_status ?? selection.specifiers_status;
    selection.timestamp = outcome.last_update ?? selection.timestamp;
    selection.outcome_odds = outcome.odds === undefined ? selection.outcome_odds : String(outcome.odds);
    selection.outcome_active = outcome.active ?? selection.outcome_active;
    selection.outcome_line = outcome.line ?? selection.outcome_line;
    selection.outcome_name = outcome.name ?? selection.outcome_name;
    selection.outcome_name_alias = outcome.name_alias ?? selection.outcome_name_alias;

    return true;
};

/** 用 WS 赔率变更更新推荐卡片缓存。 */
const updateCardsByOdds = (cards: RecommendCard[], payload: OddsChangePayload): RecommendCard[] => {
    let hasChanged = false;

    const nextCards = produce(cards, (draftCards) => {
        for (const card of draftCards) {
            for (const selection of card.json_list) {
                if (patchSelectionByOdds(selection, payload)) {
                    hasChanged = true;
                }
            }
        }
    });

    return hasChanged ? nextCards : cards;
};

/** LiveScore 的 match_status 为非 0 时才用于刷新推荐投注项赛事阶段。 */
const getLiveScoreMatchStatus = (payload: LiveScorePayload): number | null => {
    if (payload.match_status === null || payload.match_status === 0) {
        return null;
    }

    return payload.match_status;
};

/** 用 LiveScore 更新单个推荐投注项赛事阶段。 */
const patchSelectionByLiveScore = (selection: RecommendCardSelection, payload: LiveScorePayload): boolean => {
    if (String(selection.event_id) !== String(payload.event_id)) return false;

    const nextMatchStatus = getLiveScoreMatchStatus(payload);
    if (nextMatchStatus === null || selection.match_status === nextMatchStatus) return false;

    selection.match_status = nextMatchStatus;
    return true;
};

/** 用 LiveScore 更新推荐卡片缓存。 */
const updateCardsByLiveScore = (cards: RecommendCard[], payload: LiveScorePayload): RecommendCard[] => {
    let hasChanged = false;

    const nextCards = produce(cards, (draftCards) => {
        for (const card of draftCards) {
            for (const selection of card.json_list) {
                if (patchSelectionByLiveScore(selection, payload)) {
                    hasChanged = true;
                }
            }
        }
    });

    return hasChanged ? nextCards : cards;
};

/** 订阅推荐卡片中的赛事赔率变化，并同步更新推荐卡片缓存。 */
export const useOddsObserver = (cards: RecommendCard[]): void => {
    const queryClient = useQueryClient();
    const eventIdsKey = useMemo(() => getEventIds(cards).join(EVENT_ID_SEPARATOR), [cards]);
    const eventIds = useMemo(() => (eventIdsKey ? eventIdsKey.split(EVENT_ID_SEPARATOR) : []), [eventIdsKey]);

    useGameSubscription(eventIds);

    useEffect(() => {
        if (!eventIdsKey) return;

        const unsubscribes = eventIds.flatMap((eventId) => [
            globalEventObserver.subscribe(OddsChangeEvent.getUpdateEventName(eventId), (payload) => {
                queryClient.setQueryData<RecommendCard[]>(QUERY_KEY, (currentCards) => {
                    if (!currentCards) return currentCards;

                    return updateCardsByOdds(currentCards, payload as OddsChangePayload);
                });
            }),
            globalEventObserver.subscribe(LiveScoreEvent.getUpdateEventName(eventId), (payload) => {
                queryClient.setQueryData<RecommendCard[]>(QUERY_KEY, (currentCards) => {
                    if (!currentCards) return currentCards;

                    return updateCardsByLiveScore(currentCards, payload as LiveScorePayload);
                });
            }),
        ]);

        return () => {
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
        };
    }, [eventIds, eventIdsKey, queryClient]);
};
