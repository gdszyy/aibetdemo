import type { PeriodMappingItem } from '@/api/handlers/app';
import type { PeriodScore } from '@/api/models/match';

type PeriodMappingValue = Pick<PeriodScore, 'period_id' | 'description' | 'short_name'>;

export const PERIOD_MAPPING_QUERY_KEY = ['period-mapping'] as const;

const periodMappingBySport = new Map<string, Map<number, PeriodMappingValue>>();

export const setPeriodMappings = (items: PeriodMappingItem[] | undefined) => {
    if (!items) return;

    periodMappingBySport.clear();

    for (const item of items) {
        const { sport_id: sportId, periods } = item;
        const currentSportMapping = periodMappingBySport.get(sportId) ?? new Map<number, PeriodMappingValue>();

        currentSportMapping.set(periods.period_id, {
            period_id: periods.period_id,
            description: periods.description,
            short_name: periods.short_name,
        });
        periodMappingBySport.set(sportId, currentSportMapping);
    }
};

export const applyPeriodMappings = (
    periodScores: PeriodScore[] | undefined,
    sportId: string | undefined,
): PeriodScore[] | undefined => {
    if (!periodScores || !sportId) return periodScores;

    const sportMapping = periodMappingBySport.get(sportId);
    if (!sportMapping) return periodScores;

    return periodScores.map((period) => {
        const mapping = sportMapping.get(period.period_id);
        if (!mapping) return period;

        return {
            ...period,
            description: mapping.description,
            short_name: mapping.short_name,
        };
    });
};
