import {
    type FixtureChangePayload,
    FixtureChangeType,
    type MatchStatusPayload,
    normalizeFixtureChangePayload,
    normalizeLiveScorePayload,
    normalizeOddsChangePayload,
    type OddsChangePayload,
    type OrderPlacedStatusPayload,
    type RawFixtureChangePayload,
    type RawLiveScorePayload,
    type RawOddsChangePayload,
} from '@/api/models/ws';
import { useEventEmitter, useSocketListener } from '@/hooks/use-socket-listener';
import {
    BetCancelEvent,
    CMD_BET_CANCEL,
    CMD_FIXTURE_CHANGE,
    CMD_LIVE_SCORE,
    CMD_MATCH_STATUS,
    CMD_ODDS_CHANGE,
    CMD_ORDER_PLACED_STATUS,
    FixtureEvent,
    LiveScoreEvent,
    MatchStatusEvent,
    OddsChangeEvent,
    OrderPlacedStatusEvent,
} from '@/libs/event-constants';
import { wsLogger } from '@/utils/websocket/ws-logger';

export const useBetObserver = () => {
    const { emit } = useEventEmitter();

    useSocketListener(CMD_ODDS_CHANGE, (data: RawOddsChangePayload) => {
        wsLogger.debug('odds-change-raw', data);
        const payload: OddsChangePayload = normalizeOddsChangePayload(data);
        emit(OddsChangeEvent.getUpdateEventName(payload.event_id), payload);
    });

    useSocketListener(CMD_LIVE_SCORE, (data: RawLiveScorePayload) => {
        wsLogger.debug('live-score-raw', data);
        const payload = normalizeLiveScorePayload(data);
        emit(LiveScoreEvent.getUpdateEventName(payload.event_id), payload);
    });

    useSocketListener(CMD_FIXTURE_CHANGE, (data: RawFixtureChangePayload) => {
        wsLogger.debug('fixture-raw', data);
        const payload = normalizeFixtureChangePayload(data);
        if (
            payload.change_type === FixtureChangeType.StartTimeUpdated ||
            payload.change_type === FixtureChangeType.Cancelled
        ) {
            emit(FixtureEvent.getUpdateEventName(payload.event_id), payload);
        } else {
            emit(FixtureEvent.getUpdateEvent(), payload);
        }
    });

    useSocketListener(CMD_BET_CANCEL, (data: FixtureChangePayload) => {
        wsLogger.debug('bet-cancel-raw', data);
        emit(BetCancelEvent.getUpdateEventName(data.event_id), data);
    });

    useSocketListener(CMD_MATCH_STATUS, (data: MatchStatusPayload) => {
        wsLogger.debug('match-status-raw', data);
        emit(MatchStatusEvent.getUpdateEventName(data.sport_event_id), data);
    });

    useSocketListener(CMD_ORDER_PLACED_STATUS, (data: OrderPlacedStatusPayload) => {
        wsLogger.debug('order-placed-status-raw', data);
        emit(OrderPlacedStatusEvent.getUpdateEventName(), data);
    });
};
