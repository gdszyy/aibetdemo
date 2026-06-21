export const BaseEvent = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',

    getEventName(...args: string[]): string {
        if (args.some((arg) => !arg)) {
            console.error('Invalid arguments for getEventName:', args);
            return '';
        }
        return args.join('=>');
    },

    getUpdateEventName(target: string, key: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, target, key);
    },

    getUpdateEvent(target: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, target);
    },
} as const;

export const OddsChangeEvent = {
    NAME: 'ODDS_CHANGE',
    getUpdateEventName(matchId: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, OddsChangeEvent.NAME, matchId);
    },
} as const;

export const LiveScoreEvent = {
    NAME: 'LIVE_SCORE',
    getUpdateEventName(matchId: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, LiveScoreEvent.NAME, matchId);
    },
} as const;

export const FixtureEvent = {
    NAME: 'FIXTURE',
    getUpdateEvent(): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, FixtureEvent.NAME);
    },
    getUpdateEventName(matchId: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, FixtureEvent.NAME, matchId);
    },
} as const;

export const BetCancelEvent = {
    NAME: 'BET_CANCEL',
    getUpdateEventName(matchId: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, BetCancelEvent.NAME, matchId);
    },
} as const;

export const MatchStatusEvent = {
    NAME: 'MATCH_STATUS',
    getUpdateEventName(matchId: string): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, MatchStatusEvent.NAME, matchId);
    },
} as const;

export const OrderPlacedStatusEvent = {
    NAME: 'ORDER_PLACED_STATUS',
    getUpdateEventName(): string {
        return BaseEvent.getEventName(BaseEvent.UPDATE, OrderPlacedStatusEvent.NAME);
    },
} as const;

// ping
export const CMD_PING = 100;
// 登录
export const CMD_AUTH = 110;
// change language
export const CMD_LANG = 120;
// 订阅match/event_id
export const CMD_SUBSCRIBE_GAME = 10080;
// 取消订阅match/event_id
export const CMD_UNSUBSCRIBE_GAME = 10090;
// 心跳
// 比赛状态的变化
export const CMD_FIXTURE_CHANGE = 10010;
// 赔率变化 authChange
export const CMD_ODDS_CHANGE = 10020;
// 注单被取消 // TODO 没有使用
export const CMD_BET_CANCEL = 10050;
// 比赛状态的变化 // TODO 没有使用，之前在sr中使用，现在多数据平台不使用了
export const CMD_MATCH_STATUS = 10060;
// 注单状态结果通知
export const CMD_ORDER_PLACED_STATUS = 10070;
// 比赛比分的变化
export const CMD_LIVE_SCORE = 10100;
