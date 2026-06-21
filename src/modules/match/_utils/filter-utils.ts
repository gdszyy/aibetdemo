// Re-export shared utility for backwards compatibility
export { updateQueryParams } from '@/utils/url-params';

export const ALL_SPORT_FILTER_ID = 'all';
export const DEFAULT_HOME_SPORT_ID = '6046';

/**
 * Parse sport_id from search params
 */
export const getSportIdFromParams = (searchParams: URLSearchParams, defaultId?: string) => {
    return searchParams.get('sport_id') || defaultId || '';
};

/**
 * Display selection defaults to All, while All currently queries Football.
 */
export const getSelectedSportIdFromParams = (searchParams: URLSearchParams) => {
    return getSportIdFromParams(searchParams) || ALL_SPORT_FILTER_ID;
};

export const getSportIdForMatchQuery = (sportId: string) => {
    return sportId === ALL_SPORT_FILTER_ID ? DEFAULT_HOME_SPORT_ID : sportId;
};
