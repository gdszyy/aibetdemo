'use client';

import type { CSSProperties } from 'react';
import { PromotionBackButton } from '../_components/promotion-back-button';
import { useChampionHandicapInfo } from './_hooks/use-info';

export {
    type ChampionHandicapPromotionListMeta,
    getChampionHandicapEventWindow,
    getChampionHandicapPromotionListMeta,
    isChampionHandicapEventActive,
} from './_utils/time';

import { ChampionHandicapCalculationSection } from './calculation-section';
import { ChampionHandicapHeroSection } from './hero-section';
import { ChampionHandicapStepsSection } from './steps-section';
import { ChampionHandicapTermsSection } from './terms-section';

type ChampionHandicapCSSVars = CSSProperties & Record<`--ch-${string}`, string>;

const championHandicapVars: ChampionHandicapCSSVars = {
    '--ch-green': '#006847',
    '--ch-green-bg': '#F0FDF4',
};

export const ChampionHandicapView = () => {
    const { isJoin, isJoining, isEventActive, joinChampionHandicap } = useChampionHandicapInfo();

    return (
        <div
            className="relative flex w-full max-w-[1000px] flex-col items-center gap-10 overflow-x-hidden bg-surface-1 md:my-6 md:mx-auto md:rounded-md"
            style={championHandicapVars}
        >
            <PromotionBackButton />
            <ChampionHandicapHeroSection
                isJoin={isJoin}
                isJoining={isJoining}
                isEventActive={isEventActive}
                onJoin={joinChampionHandicap}
            />
            <div className="mx-auto flex w-full flex-col items-center gap-10 bg-surface-1">
                <ChampionHandicapStepsSection />
                <ChampionHandicapCalculationSection />
                <ChampionHandicapTermsSection />
            </div>
        </div>
    );
};
