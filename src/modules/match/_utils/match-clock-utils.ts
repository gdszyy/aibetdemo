import { type MatchClock, MatchClockStatus } from '@/api/models/match';

/** 比赛计时数据，包含后端秒数和偏移量。 */
type MatchClockInput = {
    match_clock: MatchClock | null;
    match_clock_offset: number | null;
};

/**
 * 获取比赛显示秒数：后端 seconds + match_clock_offset。
 *
 * @param matchData 包含 match_clock 和 match_clock_offset 的比赛数据
 */
export const getMatchClockSeconds = (matchData: MatchClockInput): number => {
    const baseSeconds = matchData.match_clock?.seconds ?? 0;
    const clockOffset = matchData.match_clock_offset ?? 0;
    return baseSeconds + clockOffset;
};

/**
 * 判断比赛计时是否停止；status=0 时停止。
 *
 * @param matchClock 比赛计时数据
 */
export const isMatchClockStopped = (matchClock?: MatchClock | null): boolean => {
    return matchClock?.status === MatchClockStatus.Stopped;
};

/**
 * 获取比赛计时组件的稳定 key，用于后端推送新基准时间时重置本地 tick。
 *
 * @param matchData 包含 match_clock 和 match_clock_offset 的比赛数据
 */
export const getMatchClockRenderKey = (matchData: MatchClockInput): string => {
    const matchClock = matchData.match_clock;
    const clockOffset = matchData.match_clock_offset ?? 0;
    return `${matchClock?.status ?? ''}:${matchClock?.seconds ?? ''}:${matchClock?.timestamp ?? ''}:${clockOffset}`;
};
