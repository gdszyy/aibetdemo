export type PlayerPropCategory = 'goals' | 'shots' | 'assists' | 'cards';

export interface PlayerPropThreshold {
    /** 唯一 outcome 标识，进 bet-slip 时拼成选注 id。 */
    id: string;
    /** 阈值展示文案，如 `1+` / `2+` / `Over 1.5`。 */
    label: string;
    /** 赔率字符串。 */
    value: string;
}

export interface PlayerPropMarket {
    id: string;
    category: PlayerPropCategory;
    /** 完整盘口名，如 `Shots on Target`。 */
    label: string;
    /** 短名，用于矩阵列头 / 紧凑列表，如 `SOT`。 */
    shortLabel: string;
    thresholds: PlayerPropThreshold[];
    /** 状态助推文案（Betano/Superbet 展示），如 `Scored in 4 of last 5`。 */
    nudge?: string;
    /** 社交证明（Betano 展示），如 `🔥 6k+ backing`。 */
    popularity?: string;
}

export interface PlayerPropEntry {
    id: string;
    name: string;
    team: string;
    teamAbbr: string;
    teamColor: string;
    /** 位置缩写，如 `FWD` / `MID`。 */
    position: string;
    /** 所属赛事标题，用于 bet-slip 标题与去重。 */
    matchTitle: string;
    /** 假赛事 id。 */
    eventId: string;
    markets: PlayerPropMarket[];
    /** 是否精选（Superbet 横滑卡突出）。 */
    featured?: boolean;
    /** 加成标签（Superbet/Betano），如 `BOOST 30%`。 */
    boostLabel?: string;
}

export interface PlayerPropGoldenSubstitution {
    title: string;
    description: string;
    cta: string;
}

export interface PlayerPropCategoryMeta {
    id: PlayerPropCategory;
    label: string;
}
