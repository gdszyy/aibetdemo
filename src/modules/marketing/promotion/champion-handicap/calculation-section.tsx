'use client';

import { useTranslations } from 'next-intl';
import { ChampionHandicapCalculationTable } from './_components/calculation-table';
import { ChampionHandicapSectionTitle } from './_components/section-title';
import { CHAMPION_HANDICAP_CALCULATION_TABLES, type ChampionHandicapTable } from './_constants/data';
import { useChampionHandicapTranslationValues } from './_constants/region';

interface ChampionHandicapCalculationSectionProps {
    tables?: ChampionHandicapTable[];
}

export const ChampionHandicapCalculationSection = ({
    tables = CHAMPION_HANDICAP_CALCULATION_TABLES,
}: ChampionHandicapCalculationSectionProps) => {
    const t = useTranslations('promotion');
    const translationValues = useChampionHandicapTranslationValues();

    if (tables.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="mx-auto w-full max-w-[1000px] px-4 md:px-8">
                <ChampionHandicapSectionTitle title={t('championHandicap.calculation.title', translationValues)} />
                <div className="space-y-6">
                    {tables.map((table) => (
                        <ChampionHandicapCalculationTable key={table.id} table={table} />
                    ))}
                </div>
            </div>
        </section>
    );
};
