'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { SearchMatchesInterface } from '@/api/handlers/matches';
import { MatchStatus } from '@/api/models/match';
import { LiveOutlined } from '@/components/icons2/LiveOutlined';
import { useLiveMatchTotalData, useLiveMatchTotalRefresh } from '@/hooks/use-live-match-total';
import { ALL_SPORT_FILTER_ID, getSelectedSportIdFromParams } from '@/modules/match/_utils/filter-utils';
import { MatchListBase } from '../_components/match-list-base';
import { Filters } from '../hot-matches/filters';

const LIVE_MATCHES_PAGE_SIZE = 20;

const getLiveQuerySportId = (selectedSportId: string) =>
    selectedSportId === ALL_SPORT_FILTER_ID ? undefined : selectedSportId;

const LiveMatchesTitleRight: FC<{ count: number }> = ({ count }) => {
    const t = useTranslations('matches');

    return (
        <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-func-win px-2 py-px text-body-lg text-neutral-white-h">{t('live')}</span>
            <span className="text-body-lg text-brand-primary-0 tabular-nums">{t('liveMatchCount', { count })}</span>
        </div>
    );
};

/**
 * LiveMatches - Main dashboard for live matches
 * Uses MatchListBase for common logic
 */
export const LiveMatches: FC = () => {
    const t = useTranslations('matches');
    const searchParams = useSearchParams();
    const selectedSportId = getSelectedSportIdFromParams(searchParams);
    const querySportId = getLiveQuerySportId(selectedSportId);
    const { data: liveMatchCount = 0 } = useLiveMatchTotalData(querySportId);
    const refreshLiveMatchTotal = useLiveMatchTotalRefresh();

    return (
        <MatchListBase
            title={t('liveTitle')}
            icon={LiveOutlined}
            queryKeyPrefix="live-matches"
            fetchFn={({ sportId, cursor }) => {
                return SearchMatchesInterface({
                    sport_id: sportId,
                    status: MatchStatus.Live,
                    cursor,
                    limit: LIVE_MATCHES_PAGE_SIZE,
                });
            }}
            getQuerySportId={getLiveQuerySportId}
            filters={
                <Filters
                    onSportChange={(sportId) => {
                        if (!sportId) return;

                        refreshLiveMatchTotal(sportId);
                    }}
                />
            }
            titleRight={<LiveMatchesTitleRight count={liveMatchCount} />}
            hideZeroMarketCount
        />
    );
};
