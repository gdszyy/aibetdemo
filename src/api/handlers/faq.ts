import { userFetcher } from '@/api/client';
import type { FaqDisplayPlace, FaqFrontItem, FaqLanguage } from '@/api/models/faq';

export interface GetFrontFaqListParams {
    /** Display place code */
    display_place: FaqDisplayPlace;
    /** Language code */
    language?: FaqLanguage;
    /** Search keyword */
    keyword?: string;
}

export interface GetFrontFaqListResponse {
    list: FaqFrontItem[];
}

/** Get FAQ list for frontend display */
export const GetFrontFaqListInterface = (params: GetFrontFaqListParams) => {
    return userFetcher.get<GetFrontFaqListResponse>(
        '/v1/faq',
        {
            display_place: params.display_place,
            language: params.language ?? 'en',
            keyword: params.keyword ?? '',
        },
        {
            withAuth: false,
        },
    );
};
