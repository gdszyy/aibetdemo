import { uofFetcher } from '@/api/client';
import type { VipSupportModel } from '@/api/models/support';

/** Get VIP support list response */
export type GetVipSupportListResponse = VipSupportModel[];

/** Get VIP support list */
export const GetVipSupportListInterface = () => {
    return uofFetcher.get<GetVipSupportListResponse>('/v1/customer/support/vip');
};

/** Get support phone response */
export interface GetSupportPhoneResponse {
    /** Support phone number */
    ref_number: string;
    /** Welcome message */
    welcome: string;
    /** Support avatar */
    avatar: string;
}

/** Get support phone */
export const GetSupportPhoneInterface = () => {
    return uofFetcher.get<GetSupportPhoneResponse>('/v1/customer/support/tel');
};
