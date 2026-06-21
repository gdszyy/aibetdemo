/** 推荐卡片列表可视区基准条数（等高测量用）；超出后在 flex 剩余高度内滚动。H5 超过此数量另展示 Show More。 */
export const CARD_SELECTION_LIMIT = 4;

/** 有效推荐卡片状态。 */
export const ACTIVE_STATUS = 1;

/** 首页推荐串关加赔卡片缓存键。 */
export const QUERY_KEY = ['recommend-cards'] as const;
