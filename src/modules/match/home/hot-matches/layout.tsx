'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { GetHotMatchesInterface } from '@/api/handlers/matches';
import { HotOutlined } from '@/components/icons2/HotOutlined';
import { MatchListBase } from '../_components/match-list-base';
import { Filters } from './filters';

/**
 * HotMatches - Main dashboard for popular matches
 * Uses MatchListBase for common logic
 */
export const HotMatches: FC = () => {
    const t = useTranslations('matches');

    return (
        <MatchListBase
            title={t('title')}
            icon={HotOutlined}
            queryKeyPrefix="hot-matches"
            fetchFn={({ sportId }) =>
                sportId
                    ? GetHotMatchesInterface({ sport_id: sportId }).then((list) => ({ list, next_cursor: '' }))
                    : Promise.resolve({ list: [], next_cursor: '' })
            }
            filters={<Filters />}
        />
    );
};
