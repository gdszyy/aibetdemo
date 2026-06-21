import type { PeriodMappingItem } from '@/api/handlers/app';
import type { PeriodScore } from '@/api/models/match';

type PeriodMappingValue = Pick<PeriodScore, 'period_id' | 'description' | 'short_name'>;

/** Period label lookup grouped by sport id, then backend period id. */
export type PeriodMappingBySport = Record<string, Record<number, PeriodMappingValue>>;

export const PERIOD_MAPPING_QUERY_KEY = ['period-mapping'] as const;

/**
 * Build a sport-scoped lookup map from backend period mapping rows.
 */
export const buildPeriodMappingMap = (items: PeriodMappingItem[] | undefined): PeriodMappingBySport => {
    const periodMappingBySport: PeriodMappingBySport = {};
    if (!items) return periodMappingBySport;

    for (const item of items) {
        const { sport_id: sportId, periods } = item;
        const currentSportMapping = periodMappingBySport[sportId] ?? {};

        periodMappingBySport[sportId] = {
            ...currentSportMapping,
            [periods.period_id]: {
                period_id: periods.period_id,
                description: periods.description,
                short_name: periods.short_name,
            },
        };
    }

    return periodMappingBySport;
};

/**
 * Apply canonical period descriptions and short names to live-score period scores.
 */
export const applyPeriodMappings = (
    periodScores: PeriodScore[] | undefined,
    sportId: string | undefined,
    periodMappings: PeriodMappingBySport | undefined,
): PeriodScore[] | undefined => {
    if (!periodScores || !sportId || !periodMappings) return periodScores;

    const sportMapping = periodMappings[sportId];
    if (!sportMapping) return periodScores;

    return periodScores.map((period) => {
        const mapping = sportMapping[period.period_id];
        if (!mapping) return period;

        return {
            ...period,
            description: mapping.description,
            short_name: mapping.short_name,
        };
    });
};
