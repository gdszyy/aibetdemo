/** 冠军盘活动信息请求体 */
export interface GetChampionHandicapInfoReq {
    /** 用户id */
    uid: string;
}

/** 冠军盘活动信息响应体 */
export interface GetChampionHandicapInfoResp {
    /** 是否参加过活动 */
    isJoin: boolean;
    /** 用户id */
    uid: string;
}
