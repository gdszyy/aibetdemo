import { uofFetcher, userFetcher } from '@/api/client';

/** 访问者的国别码 */
export const getUserRegion = () => {
    return userFetcher.get<{
        country_code: 'BR' | 'MX';
    }>('/v1/country/code');
};

export interface PeriodMappingItem {
    sport_id: string;
    periods: {
        period_id: number;
        description: string;
        short_name: string;
    };
}

/** 比赛小状态 */
export const GetMatchStatusInterface = () => {
    return uofFetcher.get<
        {
            /** 比赛小状态 */
            id: number;
            /** 文案 */
            description: string;
            /** 关联的体育类型id */
            sport_ids: string[];
        }[]
    >(`/v1/static/match-status`);
};

/** 比赛阶段映射 */
export const GetPeriodMappingInterface = () => {
    return uofFetcher.get<PeriodMappingItem[]>(`/v1/static/period-mapping`);
};
