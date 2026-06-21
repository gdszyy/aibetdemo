import { userFetcher } from '@/api/client';
import { getClientLocale } from '@/i18n';

export const CreateKycInterface = (params: { id_number: string }) => {
    return userFetcher.post<{ uid: string }>(`/v1/idnumber`, params);
};

type GetWebKycUrlResponse = {
    kyc_url: string;
};

export const GetWebKycUrl = () => {
    return userFetcher.get<GetWebKycUrlResponse>(`/v1/kyc`, {
        return_url: `${window.location.origin}/${getClientLocale()}`,
    });
};

type GetKycEnabledResponse = {
    kyc_enabled: boolean;
};
export const GetKycEnabledInterface = () => {
    return userFetcher.get<GetKycEnabledResponse>(`/v1/check/kyc/enabled`, {
        return_url: `${window.location.origin}/${getClientLocale()}`,
    });
};

export enum KycTipKey {
    Pending = 'kyc_pending',
    Fail = 'kyc_fail',
    Success = 'kyc_success',
}

type GetKycTipsResponse = {
    tip_key: KycTipKey | '';
    should_show: boolean;
};
export const GetKycTipsInterface = () => {
    return userFetcher.get<GetKycTipsResponse>(`/v1/user/kyc/tips`, {
        return_url: `${window.location.origin}/${getClientLocale()}`,
    });
};
