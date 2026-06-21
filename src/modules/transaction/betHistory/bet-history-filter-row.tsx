'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { GetCasinoGameMerchantsInterface, GetCasinoGameTypesInterface } from '@/api/handlers/casino';
import type { Option } from '@/components/select/constants';
import { Select } from '@/components/select/select';
import { useAllSports } from '@/hooks/use-sports';
import type { TranslationKey } from '@/i18nV2/types';
import { cn } from '@/utils/common';
import type { BetFilterType } from './types';

export type BetHistorySecondaryFilterKey = 'provider' | 'gameType' | 'sportType';

export type BetHistorySecondaryFilters = Record<BetHistorySecondaryFilterKey, string>;

export const DEFAULT_BET_HISTORY_SECONDARY_FILTERS: BetHistorySecondaryFilters = {
    provider: 'all',
    gameType: 'all',
    sportType: 'all',
};

const VISIBLE_FILTERS_BY_TYPE: Record<BetFilterType, BetHistorySecondaryFilterKey[]> = {
    all: ['provider', 'gameType', 'sportType'],
    sport: ['sportType'],
    casino: ['provider', 'gameType'],
};

const FILTER_PLACEHOLDER_KEYS: Record<BetHistorySecondaryFilterKey, TranslationKey<'transaction'>> = {
    provider: 'betHistoryV2.provider',
    gameType: 'betHistoryV2.gameType',
    sportType: 'betHistoryV2.sportType',
};

const SELECT_CLASS_NAME = 'h-10 w-[240px] md:w-[280px] shrink-0';

interface BetHistoryFilterRowProps {
    betType: BetFilterType;
    filters: BetHistorySecondaryFilters;
    onChange: (key: BetHistorySecondaryFilterKey, value: string) => void;
}

/**
 * Secondary filters below the bet type tabs.
 */
export const BetHistoryFilterRow = ({ betType, filters, onChange }: BetHistoryFilterRowProps) => {
    const t = useTranslations('transaction');
    const visibleFilters = VISIBLE_FILTERS_BY_TYPE[betType];
    const { data: merchants = [] } = useQuery({
        queryKey: ['casino', 'game-merchants'],
        queryFn: GetCasinoGameMerchantsInterface,
        enabled: visibleFilters.includes('provider'),
        placeholderData: [],
    });
    const { data: gameTypes = [] } = useQuery({
        queryKey: ['casino', 'game-types'],
        queryFn: GetCasinoGameTypesInterface,
        enabled: visibleFilters.includes('gameType'),
        placeholderData: [],
    });
    const sportTypes = useAllSports();

    const filterOptions = useMemo<Record<BetHistorySecondaryFilterKey, Option[]>>(
        () => ({
            provider: [
                { label: t('filtersAll'), value: 'all' },
                ...merchants.map((item) => ({
                    label: item.name,
                    value: item.oc_platform,
                })),
            ],
            gameType: [
                { label: t('filtersAll'), value: 'all' },
                ...gameTypes.map((item) => ({
                    label: item.game_type,
                    value: item.game_type,
                })),
            ],
            sportType: [
                { label: t('filtersAll'), value: 'all' },
                ...sportTypes.map((item) => ({
                    label: item.name,
                    value: item.sport_id,
                })),
            ],
        }),
        [gameTypes, merchants, sportTypes, t],
    );

    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-0.5 md:gap-4">
            {visibleFilters.map((key) => (
                <div className="flex flex-col gap-1" key={key}>
                    <span className="text-body-md text-filltext-ft-g font-poppins">
                        {t(FILTER_PLACEHOLDER_KEYS[key])}
                    </span>
                    <Select
                        key={key}
                        className={cn(
                            SELECT_CLASS_NAME,
                            filters[key] === 'all' ? 'text-filltext-ft-e' : 'text-filltext-ft-h',
                        )}
                        options={filterOptions[key]}
                        placeholder={t(FILTER_PLACEHOLDER_KEYS[key])}
                        value={filters[key]}
                        onValueChange={(value) => onChange(key, value)}
                    />
                </div>
            ))}
        </div>
    );
};
