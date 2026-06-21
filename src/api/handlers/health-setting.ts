import { userFetcher } from '@/api/client';
import type { RGConfig } from '@/api/models/health-setting';

/** Get RG config */
export const GetRGConfigInterface = () => {
    return userFetcher.get<RGConfig>('/v1/rg/config');
};

/** Set deposit limit */
export const SetDepositLimitInterface = (params: { limit: number; user_password?: string }) => {
    return userFetcher.post<{ success: boolean }>('/v1/rg/deposit/limit', params);
};

/** Set loss limit */
export const SetLossLimitInterface = (params: { limit: number; user_password?: string }) => {
    return userFetcher.post<{ success: boolean }>('/v1/rg/loss/limit', params);
};

/** Set rest time */
export const SetRestTimeInterface = (params: {
    start: string; // "HH:mm:ss"
    end: string; // "HH:mm:ss"
    user_password?: string;
}) => {
    return userFetcher.post<{ success: boolean }>('/v1/rg/rest/time', params);
};
