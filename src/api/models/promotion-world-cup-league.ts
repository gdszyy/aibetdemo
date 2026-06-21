import type { MarketGroup } from './market';

/** 世界杯冠军盘接口响应。 */
export interface WorldCupChampionship {
    /** 冠军盘所属赛季 ID。 */
    event_id: string;
    /** 冠军盘事件类型，当前为 season。 */
    event_id_type: string;
    /** 世界杯冠军市场列表。 */
    markets: MarketGroup[];
}
