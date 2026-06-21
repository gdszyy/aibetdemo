import { createContext, useContext } from 'react';

interface BetSlipDrawerContextType {
    isHovered: boolean;
}

export const BetSlipDrawerContext = createContext<BetSlipDrawerContextType>({
    isHovered: false,
});

export const useBetSlipDrawerContext = () => useContext(BetSlipDrawerContext);
